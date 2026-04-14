import { AxiaThinking } from '@/brand';
import { colors } from '@/brand/tokens';
import { Check, X, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  generating: boolean;
  generatedText: string | null;
  error: string | null;
  onGenerate: () => void;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  hasSubjectData: boolean;
}

function AiPill() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{
        background: colors.goldTint,
        color: colors.goldTextOnTint,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: colors.gold }}
      />
      Suggested by Axia
    </span>
  );
}

export function AiDescriptionPanel({
  generating,
  generatedText,
  error,
  onGenerate,
  onAccept,
  onReject,
  onRegenerate,
  hasSubjectData,
}: Props) {
  // Initial state — show generate button
  if (!generating && !generatedText && !error) {
    return (
      <div className="rounded-[12px] border border-fog/20 bg-white p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-medium text-ink">
              Subject description
            </h3>
            <p className="mt-1 text-sm text-fog">
              Generate a professional property description from the subject data
            </p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!hasSubjectData}
            className="flex items-center gap-2 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate disabled:opacity-40"
          >
            <Sparkles size={16} />
            <span>Generate description</span>
          </button>
        </div>
        {!hasSubjectData && (
          <p className="mt-3 text-sm text-fog">
            Fill in the subject property fields above first.
          </p>
        )}
      </div>
    );
  }

  // Generating state — show AxiaThinking animation
  if (generating) {
    return (
      <div className="rounded-[12px] border border-fog/20 bg-white p-8 mb-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <AxiaThinking size={48} />
          <p className="text-sm text-fog">Analyzing property and generating description...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-[12px] border border-flag/30 bg-white p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-medium text-flag">
              Generation failed
            </h3>
            <p className="mt-1 text-sm text-fog">{error}</p>
          </div>
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-2 rounded-[8px] border border-fog/20 px-3 py-2 text-sm text-ink transition-colors hover:bg-parchment"
          >
            <RefreshCw size={14} />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  // Generated text — show preview with accept/reject/regenerate
  return (
    <div className="rounded-[12px] border border-gold/30 bg-white p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <AiPill />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReject}
            className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 px-3 py-1.5 text-sm text-fog transition-colors hover:bg-parchment hover:text-ink"
          >
            <X size={14} />
            <span>Reject</span>
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 px-3 py-1.5 text-sm text-fog transition-colors hover:bg-parchment hover:text-ink"
          >
            <RefreshCw size={14} />
            <span>Regenerate</span>
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex items-center gap-1.5 rounded-[8px] bg-ink px-3 py-1.5 text-sm font-medium text-parchment transition-colors hover:bg-slate"
          >
            <Check size={14} />
            <span>Accept</span>
          </button>
        </div>
      </div>

      <div className="prose-sm text-slate leading-relaxed whitespace-pre-wrap">
        {generatedText}
      </div>
    </div>
  );
}
