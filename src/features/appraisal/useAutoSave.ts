import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import { supabase } from '@/lib/supabase';

const DEBOUNCE_MS = 2_000;
const VERSION_INTERVAL_MS = 30_000;

async function saveContent(appraisalId: string, content: JSONContent) {
  const { error } = await supabase
    .from('appraisals')
    .update({
      document_content: content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appraisalId);
  if (error) throw error;
}

async function saveVersion(appraisalId: string, content: JSONContent) {
  const { error } = await supabase
    .from('document_versions')
    .insert({
      appraisal_id: appraisalId,
      content: content,
    });
  if (error) throw error;
}

export function useAutoSave(appraisalId: string, content: JSONContent | undefined) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVersionContentRef = useRef<string | null>(null);
  const latestContentRef = useRef<JSONContent | undefined>(content);
  const appraisalIdRef = useRef(appraisalId);

  latestContentRef.current = content;
  appraisalIdRef.current = appraisalId;

  const flushSave = useCallback(async () => {
    const currentContent = latestContentRef.current;
    const currentId = appraisalIdRef.current;
    if (!currentContent || !currentId) return;

    setSaving(true);
    try {
      await saveContent(currentId, currentContent);
      setLastSaved(new Date());
    } catch {
      // UI shows "Unsaved changes" when lastSaved isn't updated
    } finally {
      setSaving(false);
    }
  }, []);

  // Debounced auto-save on content change
  useEffect(() => {
    if (!content || !appraisalId) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void flushSave();
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, appraisalId, flushSave]);

  // Version snapshot every 30 seconds (if content changed)
  useEffect(() => {
    if (!appraisalId) return;

    versionTimerRef.current = setInterval(() => {
      const currentContent = latestContentRef.current;
      if (!currentContent) return;

      const serialized = JSON.stringify(currentContent);
      if (serialized !== lastVersionContentRef.current) {
        lastVersionContentRef.current = serialized;
        void saveVersion(appraisalId, currentContent);
      }
    }, VERSION_INTERVAL_MS);

    return () => {
      if (versionTimerRef.current) {
        clearInterval(versionTimerRef.current);
      }
    };
  }, [appraisalId]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (versionTimerRef.current) {
        clearInterval(versionTimerRef.current);
      }

      const currentContent = latestContentRef.current;
      const currentId = appraisalIdRef.current;
      if (currentContent && currentId) {
        void saveContent(currentId, currentContent);
        const serialized = JSON.stringify(currentContent);
        if (serialized !== lastVersionContentRef.current) {
          void saveVersion(currentId, currentContent);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { saving, lastSaved };
}
