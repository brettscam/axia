interface Props {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  'Property details',
  'Comp selection',
  'Adjustments',
  'Final report',
] as const;

export function AppraisalProgress({ currentStep }: Props) {
  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className="mb-8">
      <p className="text-sm text-fog mb-3">
        Step {currentStep} of 4
      </p>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-ink/10 mb-4">
        <div
          className="h-1.5 rounded-full bg-ink transition-all"
          style={{ width: `${String(progressPercent)}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <div key={label} className="flex items-center gap-1.5">
              {/* Dot */}
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isCurrent
                    ? 'bg-ink'
                    : isPast
                      ? 'bg-ink/40'
                      : 'bg-fog/30'
                }`}
              />
              {/* Label */}
              <span
                className={`text-sm ${
                  isCurrent
                    ? 'text-ink font-medium'
                    : isPast
                      ? 'text-ink'
                      : isFuture
                        ? 'text-fog'
                        : ''
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
