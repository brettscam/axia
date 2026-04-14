import { useState, useEffect } from 'react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AdjustmentItem {
  key: string;
  label: string;
  defaultValue: number;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'axia:adjustment-weights';

const ADJUSTMENT_ITEMS: AdjustmentItem[] = [
  { key: 'square_footage', label: 'Square footage', defaultValue: 85 },
  { key: 'location', label: 'Location', defaultValue: 80 },
  { key: 'pool', label: 'Pool', defaultValue: 75 },
  { key: 'waterfront', label: 'Waterfront', defaultValue: 70 },
  { key: 'garage_size', label: 'Garage size', defaultValue: 55 },
  { key: 'updated_kitchen', label: 'Updated kitchen', defaultValue: 50 },
  { key: 'lot_size', label: 'Lot size', defaultValue: 45 },
  { key: 'age_condition', label: 'Age/Condition', defaultValue: 40 },
  { key: 'cosmetic_features', label: 'Cosmetic features', defaultValue: 25 },
  { key: 'minor_upgrades', label: 'Minor upgrades', defaultValue: 20 },
  { key: 'fence_type', label: 'Fence type', defaultValue: 15 },
  { key: 'paint_color', label: 'Paint color', defaultValue: 10 },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getDefaultWeights(): Record<string, number> {
  const defaults: Record<string, number> = {};
  for (const item of ADJUSTMENT_ITEMS) {
    defaults[item.key] = item.defaultValue;
  }
  return defaults;
}

function loadWeights(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Record<string, number>;
    }
  } catch {
    // fall through to defaults
  }
  return getDefaultWeights();
}

function percentColor(value: number): string {
  if (value >= 70) return 'text-flag';
  if (value >= 40) return 'text-ink';
  return 'text-fog';
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function AdjustmentConfig() {
  const [weights, setWeights] = useState<Record<string, number>>(loadWeights);

  /* Sync from localStorage on mount (in case another tab changed it) */
  useEffect(() => {
    setWeights(loadWeights());
  }, []);

  function handleChange(key: string, value: number) {
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
  }

  return (
    <div className="rounded-[12px] border border-fog/20 bg-white p-6">
      {/* Header */}
      <h2 className="font-display text-lg font-medium text-ink">
        Market adjustment configuration
      </h2>
      <p className="mt-1 text-sm text-fog">
        Configure how different property features affect the appraisal in your
        market
      </p>

      {/* Sliders */}
      <div className="mt-6 space-y-5">
        {ADJUSTMENT_ITEMS.map((item) => {
          const value = weights[item.key] ?? item.defaultValue;
          return (
            <div key={item.key}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate">{item.label}</span>
                <span className={`font-mono text-sm ${percentColor(value)}`}>
                  {value}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) =>
                  handleChange(item.key, Number(e.target.value))
                }
                className="mt-1.5 h-2 w-full cursor-pointer accent-ink"
              />
            </div>
          );
        })}
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className="mt-6 w-full rounded-[8px] bg-ink px-4 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink/90"
      >
        Save configuration
      </button>
    </div>
  );
}
