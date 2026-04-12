import { Logo } from '@/brand';

export default function App() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>
        <h1 className="text-[22px] font-medium text-ink font-display">
          Axia
        </h1>
        <p className="mt-2 text-base text-fog">
          AI-powered appraisal document editor
        </p>
        <div className="mt-10 rounded-lg border border-fog/20 bg-white/50 p-6">
          <p className="text-sm text-slate">
            Sign up and authentication coming next.
          </p>
          <p className="mt-3 text-[11px] font-medium tracking-[0.12em] text-fog uppercase">
            Phase 1 in progress
          </p>
        </div>
      </div>
    </div>
  );
}
