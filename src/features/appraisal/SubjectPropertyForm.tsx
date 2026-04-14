import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useUpdateAppraisal } from './useUpdateAppraisal';
import { usePropertyLookup } from './usePropertyLookup';

const DEBOUNCE_MS = 1_000;

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi_family', label: 'Multi-family' },
  { value: 'vacant_land', label: 'Vacant land' },
] as const;

const CONDITIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
] as const;

const inputClass =
  'border border-fog/30 rounded-[8px] px-3 py-2 text-slate bg-white focus:border-ink focus:outline-none w-full';
const numberInputClass = `${inputClass} font-mono`;
const labelClass = 'text-sm font-medium text-slate mb-1.5 block';

interface Props {
  appraisalId: string;
  initialData: {
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
  };
}

type FormData = Props['initialData'];

function toFormData(initial: Props['initialData']): FormData {
  return { ...initial };
}

export function SubjectPropertyForm({ appraisalId, initialData }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState<FormData>(() => toFormData(initialData));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { mutateAsync } = useUpdateAppraisal();
  const { lookup, looking, error: lookupError } = usePropertyLookup();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestFormDataRef = useRef<FormData>(formData);
  const appraisalIdRef = useRef(appraisalId);

  latestFormDataRef.current = formData;
  appraisalIdRef.current = appraisalId;

  // Sync initialData when it changes externally (e.g. query refetch)
  const initialDataStr = JSON.stringify(initialData);
  useEffect(() => {
    setFormData(toFormData(initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDataStr]);

  const flushSave = useCallback(async () => {
    const data = latestFormDataRef.current;
    const id = appraisalIdRef.current;
    setSaveStatus('saving');
    try {
      await mutateAsync({ id, data: data as unknown as Record<string, unknown> });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('idle');
    }
  }, [mutateAsync]);

  const scheduleAutoSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      void flushSave();
    }, DEBOUNCE_MS);
  }, [flushSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function handleTextChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
    setSaveStatus('idle');
    scheduleAutoSave();
  }

  function handleNumberChange(field: keyof FormData, value: string) {
    const parsed = value === '' ? null : Number(value);
    setFormData((prev) => ({ ...prev, [field]: parsed }));
    setSaveStatus('idle');
    scheduleAutoSave();
  }

  function handleSelectChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
    setSaveStatus('idle');
    scheduleAutoSave();
  }

  async function handlePropertyLookup() {
    const address = formData.property_address;
    if (!address) return;
    const result = await lookup(
      address,
      formData.property_city ?? undefined,
      formData.property_state ?? undefined,
      formData.property_zip ?? undefined,
    );
    if (result) {
      // Merge: only overwrite fields that ATTOM returned non-null
      const merged: FormData = { ...formData };
      for (const key of Object.keys(result) as (keyof typeof result)[]) {
        if (result[key] !== null && result[key] !== undefined) {
          (merged as Record<string, unknown>)[key] = result[key];
        }
      }
      setFormData(merged);
      setSaveStatus('idle');
      scheduleAutoSave();
    }
  }

  return (
    <div className="bg-white border border-fog/20 rounded-[12px] mb-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-6 py-4 cursor-pointer"
      >
        <h2 className="font-display text-lg font-medium text-ink">Subject property</h2>
        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && <span className="text-sm text-fog">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-sm text-sage">Saved</span>}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Property address — full width with lookup button */}
            <div className="md:col-span-2">
              <label className={labelClass}>Property address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className={inputClass}
                  value={formData.property_address ?? ''}
                  onChange={(e) => handleTextChange('property_address', e.target.value)}
                  placeholder="Enter address to auto-populate property data"
                />
                <button
                  type="button"
                  onClick={() => void handlePropertyLookup()}
                  disabled={looking || !formData.property_address}
                  className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate disabled:opacity-40"
                >
                  <Search size={14} />
                  <span>{looking ? 'Looking up...' : 'Lookup'}</span>
                </button>
              </div>
              {lookupError && (
                <p className="mt-1.5 text-sm text-flag">{lookupError}</p>
              )}
            </div>

            {/* City, State, Zip — 3-column row */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.property_city ?? ''}
                  onChange={(e) => handleTextChange('property_city', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.property_state ?? ''}
                  onChange={(e) => handleTextChange('property_state', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Zip</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.property_zip ?? ''}
                  onChange={(e) => handleTextChange('property_zip', e.target.value)}
                />
              </div>
            </div>

            {/* Property type — full width */}
            <div className="md:col-span-2">
              <label className={labelClass}>Property type</label>
              <select
                className={inputClass}
                value={formData.property_type ?? ''}
                onChange={(e) => handleSelectChange('property_type', e.target.value)}
              >
                <option value="">Select type</option>
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms + Bathrooms */}
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input
                type="number"
                className={numberInputClass}
                value={formData.bedrooms ?? ''}
                onChange={(e) => handleNumberChange('bedrooms', e.target.value)}
                min={0}
              />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input
                type="number"
                className={numberInputClass}
                value={formData.bathrooms ?? ''}
                onChange={(e) => handleNumberChange('bathrooms', e.target.value)}
                min={0}
                step={0.5}
              />
            </div>

            {/* GLA + Lot size */}
            <div>
              <label className={labelClass}>GLA / sq ft</label>
              <input
                type="number"
                className={numberInputClass}
                value={formData.gla ?? ''}
                onChange={(e) => handleNumberChange('gla', e.target.value)}
                min={0}
              />
            </div>
            <div>
              <label className={labelClass}>Lot size / acres</label>
              <input
                type="number"
                className={numberInputClass}
                value={formData.lot_size ?? ''}
                onChange={(e) => handleNumberChange('lot_size', e.target.value)}
                min={0}
                step={0.01}
              />
            </div>

            {/* Year built + Condition */}
            <div>
              <label className={labelClass}>Year built</label>
              <input
                type="number"
                className={numberInputClass}
                value={formData.year_built ?? ''}
                onChange={(e) => handleNumberChange('year_built', e.target.value)}
                min={1600}
                max={2100}
              />
            </div>
            <div>
              <label className={labelClass}>Condition</label>
              <select
                className={inputClass}
                value={formData.condition ?? ''}
                onChange={(e) => handleSelectChange('condition', e.target.value)}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
