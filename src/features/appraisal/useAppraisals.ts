import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useAppraisals() {
  return useQuery({
    queryKey: ['appraisals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appraisals')
        .select('id, property_address, client_name, status, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAppraisal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { property_address: string; client_name: string }) => {
      const { data, error } = await supabase
        .from('appraisals')
        .insert({ property_address: input.property_address, client_name: input.client_name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appraisals'] });
    },
  });
}
