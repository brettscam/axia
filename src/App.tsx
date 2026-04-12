export default function App() {
  return (
    <div className="min-h-screen bg-axia-snow flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-axia-navy tracking-tight">
          Axia
        </h1>
        <p className="mt-3 text-lg text-axia-slate">
          AI-powered appraisal document editor
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <span className="inline-block px-4 py-2 rounded-lg bg-axia-blue text-white text-sm font-medium">
            Phase 1
          </span>
          <span className="inline-block px-4 py-2 rounded-lg bg-axia-emerald text-white text-sm font-medium">
            Scaffold Ready
          </span>
        </div>
      </div>
    </div>
  )
}
