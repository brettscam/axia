import { useState, useMemo, useCallback } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Comp {
  id: string;
  address: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  distance: number;
  matchScore: number;
  status: 'Sold' | 'Active' | 'Pending';
}

type SortField = 'distance' | 'price' | 'matchScore';
type SortDir = 'asc' | 'desc';

/* -------------------------------------------------------------------------- */
/*  Sample data                                                                */
/* -------------------------------------------------------------------------- */

const SAMPLE_COMPS: Comp[] = [
  { id: '1', address: '123 Maple St', city: 'San Francisco', price: 825_000, beds: 3, baths: 2, sqft: 1_850, distance: 0.3, matchScore: 92, status: 'Sold' },
  { id: '2', address: '456 Oak Ave', city: 'San Francisco', price: 790_000, beds: 3, baths: 2, sqft: 1_750, distance: 0.5, matchScore: 88, status: 'Sold' },
  { id: '3', address: '789 Pine Ct', city: 'San Francisco', price: 845_000, beds: 4, baths: 2.5, sqft: 2_100, distance: 0.7, matchScore: 84, status: 'Sold' },
  { id: '4', address: '234 Cedar Ln', city: 'San Francisco', price: 779_000, beds: 3, baths: 2, sqft: 1_680, distance: 0.9, matchScore: 76, status: 'Sold' },
  { id: '5', address: '567 Redwood Rd', city: 'San Francisco', price: 810_000, beds: 3, baths: 2.5, sqft: 1_920, distance: 1.2, matchScore: 72, status: 'Active' },
  { id: '6', address: '890 Spruce Way', city: 'San Francisco', price: 795_000, beds: 3, baths: 2, sqft: 1_800, distance: 1.4, matchScore: 68, status: 'Pending' },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatPrice(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

function formatPricePerSqft(price: number, sqft: number): string {
  return `$${Math.round(price / sqft).toLocaleString('en-US')}/sqft`;
}

function matchColor(score: number): { text: string; bg: string } {
  if (score >= 85) return { text: 'text-sage', bg: 'bg-sage' };
  if (score >= 70) return { text: 'text-gold', bg: 'bg-gold' };
  return { text: 'text-flag', bg: 'bg-flag' };
}

function statusBadgeClass(status: Comp['status']): string {
  switch (status) {
    case 'Sold':
      return 'bg-sage text-white';
    case 'Active':
      return 'bg-ink/10 text-ink';
    case 'Pending':
      return 'bg-gold-tint text-ink';
  }
}

/* -------------------------------------------------------------------------- */
/*  SortHeader                                                                 */
/* -------------------------------------------------------------------------- */

interface SortHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField | null;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
}

function SortHeader({ label, field, currentField, currentDir, onSort }: SortHeaderProps) {
  const isActive = currentField === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 cursor-pointer select-none"
    >
      {label}
      <span className="inline-flex flex-col">
        {isActive ? (
          currentDir === 'asc' ? (
            <ArrowUp size={12} className="text-ink" />
          ) : (
            <ArrowDown size={12} className="text-ink" />
          )
        ) : (
          <ArrowUp size={12} className="text-fog/40" />
        )}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  CompsTable                                                                 */
/* -------------------------------------------------------------------------- */

export function CompsTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir('asc');
      }
    },
    [sortField],
  );

  const sortedComps = useMemo(() => {
    if (!sortField) return SAMPLE_COMPS;
    const sorted = [...SAMPLE_COMPS].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [sortField, sortDir]);

  function toggleComp(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === SAMPLE_COMPS.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(SAMPLE_COMPS.map((c) => c.id)));
    }
  }

  const allSelected = selected.size === SAMPLE_COMPS.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div>
      {/* Selection count */}
      {selected.size > 0 && (
        <div className="mb-3">
          <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-medium text-parchment">
            {selected.size} selected
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-fog/20 rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-parchment">
              <th className="w-12 py-3 pl-4 pr-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-fog/30 accent-ink"
                />
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                Property
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                <SortHeader
                  label="Distance"
                  field="distance"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                <SortHeader
                  label="Price"
                  field="price"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                Details
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                <SortHeader
                  label="Match"
                  field="matchScore"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 px-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedComps.map((comp) => {
              const colors = matchColor(comp.matchScore);
              return (
                <tr
                  key={comp.id}
                  className="border-b border-fog/10 last:border-b-0 hover:bg-parchment/50 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.has(comp.id)}
                      onChange={() => toggleComp(comp.id)}
                      className="h-4 w-4 rounded border-fog/30 accent-ink"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-ink text-sm">{comp.address}</p>
                    <p className="text-xs text-fog mt-0.5">{comp.city}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-sm text-slate">{comp.distance}mi</span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-mono text-sm text-ink">{formatPrice(comp.price)}</p>
                    <p className="font-mono text-xs text-fog mt-0.5">
                      {formatPricePerSqft(comp.price, comp.sqft)}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-slate">
                      {comp.beds}bd / {comp.baths}ba / {comp.sqft.toLocaleString('en-US')} sqft
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-fog/10 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${colors.bg}`}
                          style={{ width: `${String(comp.matchScore)}%` }}
                        />
                      </div>
                      <span className={`font-mono text-xs font-medium ${colors.text}`}>
                        {comp.matchScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(comp.status)}`}
                    >
                      {comp.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
