import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppraisalData {
  appraisal_id: string;
  property_address: string | null;
  property_city: string | null;
  property_state: string | null;
  property_zip: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  gla: number | null;
  lot_size: number | null;
  year_built: number | null;
  condition: string | null;
  comparables: Array<{
    address: string;
    sale_price: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    gla: number | null;
    lot_size: number | null;
    year_built: number | null;
    distance_miles: number | null;
    sale_date: string | null;
  }>;
}

function buildPrompt(data: AppraisalData): string {
  const address = [data.property_address, data.property_city, data.property_state, data.property_zip]
    .filter(Boolean).join(", ");

  const compsText = data.comparables.length > 0
    ? data.comparables.map((c, i) => `Comp ${i + 1}: ${c.address} — $${c.sale_price?.toLocaleString() ?? "N/A"}, ${c.bedrooms ?? "?"}bd/${c.bathrooms ?? "?"}ba, ${c.gla?.toLocaleString() ?? "?"} sqft, ${c.lot_size ?? "?"} acres, built ${c.year_built ?? "?"}, ${c.distance_miles ?? "?"} mi away, sold ${c.sale_date ?? "N/A"}`).join("\n")
    : "No comparable sales provided yet.";

  return `You are a professional residential real estate appraiser writing a complete appraisal report. Write in professional appraisal language — factual, precise, objective.

SUBJECT PROPERTY:
Address: ${address || "Not provided"}
Type: ${data.property_type?.replace(/_/g, " ") || "Not specified"}
Bedrooms: ${data.bedrooms ?? "N/A"} | Bathrooms: ${data.bathrooms ?? "N/A"}
GLA: ${data.gla ? data.gla.toLocaleString() + " sq ft" : "N/A"}
Lot: ${data.lot_size ? data.lot_size + " acres" : "N/A"}
Year Built: ${data.year_built ?? "N/A"} | Condition: ${data.condition ?? "N/A"}

COMPARABLE SALES:
${compsText}

Generate a complete appraisal report with exactly these sections. Return ONLY valid JSON — no markdown, no code fences. Use this exact structure:

{
  "subject_description": "2-3 paragraphs describing the subject property",
  "neighborhood_analysis": "2-3 paragraphs analyzing the neighborhood, market conditions, land use, and trends",
  "site_analysis": "1-2 paragraphs about the site, lot characteristics, utilities, and zoning",
  "comparable_analysis": "2-3 paragraphs analyzing the comparable sales, explaining why they were selected, and how they compare to the subject",
  "adjustments_reasoning": "2-3 paragraphs explaining the adjustment methodology and key adjustments made between subject and comparables",
  "reconciliation": "1-2 paragraphs reconciling the adjusted sale prices into a final value opinion",
  "estimated_value": "a single dollar amount as a string, e.g. '$825,000'",
  "confidence_level": "high, medium, or low",
  "recommended_actions": ["array of 3-5 specific actions the appraiser should verify or investigate"]
}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: AppraisalData = await req.json();
    const prompt = buildPrompt(body);

    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} ${errText}`);
    }

    const claudeData = await claudeResponse.json();
    const rawText = claudeData.content[0]?.text ?? "";

    let report;
    try {
      report = JSON.parse(rawText);
    } catch {
      report = {
        subject_description: rawText,
        neighborhood_analysis: "",
        site_analysis: "",
        comparable_analysis: "",
        adjustments_reasoning: "",
        reconciliation: "",
        estimated_value: "Pending",
        confidence_level: "low",
        recommended_actions: ["Review generated text — JSON parsing failed, raw text returned in subject_description"],
      };
    }

    // Log to ai_generations
    await supabase.from("ai_generations").insert({
      appraisal_id: body.appraisal_id,
      feature: "full_appraisal_report",
      prompt: prompt,
      output: JSON.stringify(report),
    });

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
