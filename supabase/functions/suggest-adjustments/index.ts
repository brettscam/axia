import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdjustmentRequest {
  appraisal_id: string;
  subject: {
    address: string;
    bedrooms: number | null;
    bathrooms: number | null;
    gla: number | null;
    lot_size: number | null;
    year_built: number | null;
    condition: string | null;
    property_type: string | null;
  };
  comparables: Array<{
    id: string;
    address: string;
    sale_price: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    gla: number | null;
    lot_size: number | null;
    year_built: number | null;
    distance_miles: number | null;
  }>;
}

function buildPrompt(data: AdjustmentRequest): string {
  const compsJson = data.comparables.map((c, i) => `Comp ${i + 1} (${c.address}): price=$${c.sale_price?.toLocaleString() ?? "N/A"}, beds=${c.bedrooms ?? "?"}, baths=${c.bathrooms ?? "?"}, gla=${c.gla ?? "?"}, lot=${c.lot_size ?? "?"}, year=${c.year_built ?? "?"}, distance=${c.distance_miles ?? "?"}mi`).join("\n");

  return `You are a professional appraiser calculating market-based adjustments.

SUBJECT: ${data.subject.address}
beds=${data.subject.bedrooms ?? "?"}, baths=${data.subject.bathrooms ?? "?"}, gla=${data.subject.gla ?? "?"}, lot=${data.subject.lot_size ?? "?"}, year=${data.subject.year_built ?? "?"}, condition=${data.subject.condition ?? "?"}, type=${data.subject.property_type ?? "?"}

COMPARABLES:
${compsJson}

For each comparable, calculate dollar adjustments to make them equivalent to the subject. Use typical residential market adjustment rates. Return ONLY valid JSON — no markdown:

{
  "adjustments": [
    {
      "comp_id": "comp id from input",
      "comp_address": "address",
      "sale_price": 825000,
      "adjustments": {
        "gla": { "amount": -5000, "reason": "Comp is 150 sqft smaller at ~$33/sqft" },
        "bedrooms": { "amount": 0, "reason": "Same bedroom count" },
        "bathrooms": { "amount": 3000, "reason": "Comp has 0.5 fewer bathrooms" },
        "lot_size": { "amount": 0, "reason": "Similar lot sizes" },
        "age": { "amount": -2000, "reason": "Comp is 3 years newer" },
        "location": { "amount": 0, "reason": "Similar neighborhood" },
        "condition": { "amount": 0, "reason": "Similar condition assumed" }
      },
      "net_adjustment": -4000,
      "adjusted_price": 821000
    }
  ],
  "value_range": { "low": 800000, "high": 850000 },
  "indicated_value": 825000,
  "methodology_note": "Brief note on adjustment methodology used"
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

    const body: AdjustmentRequest = await req.json();
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

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      throw new Error("Failed to parse Claude adjustment response");
    }

    await supabase.from("ai_generations").insert({
      appraisal_id: body.appraisal_id,
      feature: "adjustment_suggestions",
      prompt: prompt,
      output: JSON.stringify(result),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
