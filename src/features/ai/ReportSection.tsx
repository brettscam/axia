import { useState } from 'react';
import { Check } from 'lucide-react';

interface Props {
  title: string;
  content: string;
  sectionKey: string;
  onEdit: (sectionKey: string, newContent: string) => void;
  onAccept: (sectionKey: string) => void;
  onRegenerate: (sectionKey: string) => void;
  accepted: boolean;
}

export function ReportSection({
  title,
  content,
  sectionKey,
  onEdit,
  onAccept,
  onRegenerate,
  accepted,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  function handleEditClick() {
    setDraft(content);
    setEditing(true);
  }

  function handleSave() {
    onEdit(sectionKey, draft);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(content);
    setEditing(false);
  }

  const borderClass = accepted
    ? 'border-sage/30'
    : 'border-gold/30';

  return (
    <div className={`rounded-[12px] border ${borderClass} bg-white p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
        {accepted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
            <Check size={12} />
            Accepted
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gold-tint px-3 py-1 text-xs font-medium text-ink">
            Suggested by Axia
          </span>
        )}
      </div>

      {/* Content or editor */}
      {editing ? (
        <div className="mb-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="w-full rounded-[8px] border border-fog/20 bg-parchment p-4 text-sm text-slate leading-relaxed focus:border-ink focus:outline-none"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap mb-4">
          {content}
        </p>
      )}

      {/* Action buttons */}
      {!editing && (
        <div className="flex gap-2">
          {accepted ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onAccept(sectionKey)}
                className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleEditClick}
                className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onRegenerate(sectionKey)}
                className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
              >
                Regenerate
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
