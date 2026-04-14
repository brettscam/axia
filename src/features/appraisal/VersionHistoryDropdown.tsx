import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useVersionHistory } from './useVersionHistory';

interface Props {
  appraisalId: string;
}

export function VersionHistoryDropdown({ appraisalId }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: versions, isLoading } = useVersionHistory(appraisalId);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm text-fog transition-colors hover:text-ink"
      >
        <Clock size={16} />
        <span>Version history</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-[12px] border border-fog/20 bg-white p-2 shadow-sm">
          {isLoading && (
            <p className="px-3 py-2 text-sm text-fog">Loading versions...</p>
          )}

          {!isLoading && (!versions || versions.length === 0) && (
            <p className="px-3 py-2 text-sm text-fog">No versions yet</p>
          )}

          {!isLoading && versions && versions.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {versions.map((version) => {
                const createdAt = new Date(version.created_at);
                const relative = formatDistanceToNow(createdAt, { addSuffix: true });
                const absolute = format(createdAt, 'MMM d, h:mm a');

                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-[8px] px-3 py-2 text-left text-sm text-slate opacity-70 cursor-not-allowed"
                      title="Restore coming soon"
                    >
                      <span className="block">{relative}</span>
                      <span className="block text-fog">{absolute}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
