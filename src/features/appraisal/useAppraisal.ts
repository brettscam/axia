import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useAppraisal(id: string) {
  return useQuery({
    queryKey: ['appraisal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
