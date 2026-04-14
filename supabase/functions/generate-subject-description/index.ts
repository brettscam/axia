import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubjectData {
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
}

function buildPrompt(data: SubjectData): string {
  const address = [data.property_address, data.property_city, data.property_state, data.property_zip]
    .filter(Boolean)
    .join(", ");

  return `You are a professional residential real estate appraiser writing a Subject Property Description for an appraisal report.

Write 2-3 paragraphs describing the following subject property. Use professional appraisal language. Be factual, precise, and objective. Do not speculate or add details not provided. Where data is missing, note it needs field verification.

Property details:
- Address: ${address || "Not provided"}
- Property type: ${data.property_type?.replace(/_/g, " ") || "Not specified"}
- Bedrooms: ${data.bedrooms ?? "Not specified"}
- Bathrooms: ${data.bathrooms ?? "Not specified"}
- Gross living area: ${data.gla ? `${data.gla} sq ft` : "Not specified"}
- Lot size: ${data.lot_size ? `${data.lot_size} acres` : "Not specified"}
- Year built: ${data.year_built ?? "Not specified"}
- Condition: ${data.condition ?? "Not specified"}

Write the description now. Do not include a title or heading — just the narrative paragraphs.`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: SubjectData = await req.json();
    const prompt = buildPrompt(body);

    // Call Claude API
    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} ${errText}`);
    }

    const claudeData = await claudeResponse.json();
    const generatedText = claudeData.content[0]?.text ?? "";

    // Log to ai_generations table
    await supabase.from("ai_generations").insert({
      appraisal_id: body.appraisal_id,
      feature: "subject_description",
      prompt: prompt,
      output: generatedText,
    });

    return new Response(
      JSON.stringify({ text: generatedText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
