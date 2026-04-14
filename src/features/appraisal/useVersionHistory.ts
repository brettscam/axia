import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useVersionHistory(appraisalId: string) {
  return useQuery({
    queryKey: ['versions', appraisalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_versions')
        .select('id, created_at, created_by')
        .eq('appraisal_id', appraisalId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!appraisalId,
  });
}
