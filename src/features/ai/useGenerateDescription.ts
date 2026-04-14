import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

interface GenerateResult {
  text: string;
}

export function useGenerateDescription() {
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(data: SubjectData) {
    setGenerating(true);
    setError(null);
    setGeneratedText(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke<GenerateResult>(
        'generate-subject-description',
        {
          body: data,
        }
      );

      if (response.error) throw response.error;

      const result = response.data;
      if (!result?.text) throw new Error('No text returned');

      setGeneratedText(result.text);
      return result.text;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      return null;
    } finally {
      setGenerating(false);
    }
  }

  async function updateUserAction(appraisalId: string, action: 'accepted' | 'rejected' | 'regenerated') {
    // Update the most recent ai_generation for this appraisal
    const { data: generations } = await supabase
      .from('ai_generations')
      .select('id')
      .eq('appraisal_id', appraisalId)
      .eq('feature', 'subject_description')
      .order('created_at', { ascending: false })
      .limit(1);

    if (generations && generations.length > 0) {
      await supabase
        .from('ai_generations')
        .update({ user_action: action })
        .eq('id', generations[0].id);
    }
  }

  function reset() {
    setGeneratedText(null);
    setError(null);
  }

  return { generate, generating, generatedText, error, reset, updateUserAction };
}
