import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ATTOM_BASE_URL = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PropertyRequest {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface NormalizedProperty {
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

function normalizePropertyType(attomType: string | undefined): string {
  if (!attomType) return "single_family";
  const lower = attomType.toLowerCase();
  if (lower.includes("condo")) return "condo";
  if (lower.includes("townhouse") || lower.includes("town")) return "townhouse";
  if (lower.includes("multi") || lower.includes("duplex") || lower.includes("triplex")) return "multi_family";
  if (lower.includes("vacant") || lower.includes("land")) return "vacant_land";
  return "single_family";
}

function normalizeProperty(data: Record<string, unknown>): NormalizedProperty {
  const property = data as Record<string, Record<string, unknown>>;
  const address = property.address as Record<string, unknown> | undefined;
  const building = property.building as Record<string, unknown> | undefined;
  const lot = property.lot as Record<string, unknown> | undefined;
  const summary = property.summary as Record<string, unknown> | undefined;
  const rooms = building?.rooms as Record<string, unknown> | undefined;
  const size = building?.size as Record<string, unknown> | undefined;

  const lotSizeAcres = lot?.lotsize2 as number | undefined;
  const lotSizeSqft = lot?.lotsize1 as number | undefined;
  const computedLotAcres = lotSizeAcres ?? (lotSizeSqft ? Math.round(lotSizeSqft / 43560 * 100) / 100 : null);

  return {
    property_address: (address?.line1 as string) ?? null,
    property_city: (address?.locality as string) ?? null,
    property_state: (address?.countrySubd as string) ?? null,
    property_zip: (address?.postal1 as string) ?? null,
    property_type: normalizePropertyType(summary?.proptype as string),
    bedrooms: (rooms?.beds as number) ?? null,
    bathrooms: (rooms?.bathsfull as number) ?? null,
    gla: (size?.livingsize as number) ?? (size?.universalsize as number) ?? null,
    lot_size: computedLotAcres,
    year_built: (summary?.yearbuilt as number) ?? null,
    condition: null, // ATTOM doesn't provide condition; appraiser fills this in
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const attomApiKey = Deno.env.get("ATTOM_API_KEY");
    if (!attomApiKey) {
      throw new Error("ATTOM_API_KEY not configured");
    }

    // Auth check
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const body: PropertyRequest = await req.json();

    // Build ATTOM API URL
    const params = new URLSearchParams();
    params.set("address1", body.address);
    if (body.city) params.set("address2", `${body.city}, ${body.state ?? ""} ${body.zip ?? ""}`.trim());
    else if (body.zip) params.set("address2", body.zip);

    const attomUrl = `${ATTOM_BASE_URL}/property/detail?${params.toString()}`;

    const attomResponse = await fetch(attomUrl, {
      headers: {
        "Accept": "application/json",
        "apikey": attomApiKey,
      },
    });

    if (!attomResponse.ok) {
      const errText = await attomResponse.text();

      // If ATTOM fails, return empty data instead of crashing
      // This lets the appraiser fill in manually
      if (attomResponse.status === 404 || attomResponse.status === 400) {
        return new Response(
          JSON.stringify({
            found: false,
            message: "Property not found in ATTOM database. Enter details manually.",
            data: null,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`ATTOM API error: ${attomResponse.status} ${errText}`);
    }

    const attomData = await attomResponse.json();
    const properties = attomData?.property;

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({
          found: false,
          message: "No property data found for this address.",
          data: null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalized = normalizeProperty(properties[0]);

    return new Response(
      JSON.stringify({
        found: true,
        data: normalized,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
