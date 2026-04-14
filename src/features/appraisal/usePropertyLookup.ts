import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LookupResult {
  found: boolean;
  message?: string;
  data: {
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
  } | null;
}

export function usePropertyLookup() {
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(address: string, city?: string, state?: string, zip?: string) {
    setLooking(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke<LookupResult>(
        'get-property-details',
        { body: { address, city, state, zip } }
      );

      if (response.error) throw response.error;

      const result = response.data;
      if (!result) throw new Error('No response from property lookup');

      if (!result.found) {
        setError(result.message ?? 'Property not found. Enter details manually.');
        return null;
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Property lookup failed';
      setError(message);
      return null;
    } finally {
      setLooking(false);
    }
  }

  return { lookup, looking, error };
}
