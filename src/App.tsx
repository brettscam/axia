import { Logo, AxiaLoading, AxiaStepped } from '@/brand';

export default function App() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size={64} />
        </div>
        <h1 className="text-[22px] font-medium text-ink font-display tracking-tight">
          Axia
        </h1>
        <p className="mt-2 text-base text-fog">
          AI-powered appraisal document editor
        </p>
        <div className="mt-8 flex items-center gap-4 justify-center">
          <AxiaLoading size={32} />
          <AxiaStepped size={10} />
          <span className="text-[11px] font-medium tracking-[0.12em] text-fog uppercase">
            Phase 1 scaffold ready
          </span>
        </div>
      </div>
    </div>
  );
}
