/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ImpactSection {
  title: string;
  range: string;
  badgeClass: string;
  description: string;
  examples: string[];
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SECTIONS: ImpactSection[] = [
  {
    title: 'High impact',
    range: '70-100%',
    badgeClass: 'bg-flag/10 text-flag',
    description:
      'These features significantly influence property values in the current market',
    examples: ['Square footage', 'Location', 'Pool', 'Waterfront'],
  },
  {
    title: 'Medium impact',
    range: '40-69%',
    badgeClass: 'bg-ink/10 text-ink',
    description:
      'These features moderately influence property values',
    examples: ['Garage size', 'Updated kitchen', 'Lot size', 'Age/Condition'],
  },
  {
    title: 'Low impact',
    range: '10-39%',
    badgeClass: 'bg-fog/10 text-fog',
    description:
      'These features have minimal influence on property values',
    examples: [
      'Cosmetic features',
      'Minor upgrades',
      'Fence type',
      'Paint color',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function AdjustmentGuide() {
  return (
    <div className="rounded-[12px] border border-fog/20 bg-white p-6">
      <h2 className="font-display text-lg font-medium text-ink">
        Understanding market impact weights
      </h2>

      <div className="mt-5 space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            {/* Badge + range */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded-[6px] px-2 py-0.5 text-xs font-medium ${section.badgeClass}`}
              >
                {section.title}
              </span>
              <span className="font-mono text-xs text-fog">
                {section.range}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1.5 text-sm text-slate">{section.description}</p>

            {/* Examples */}
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {section.examples.map((ex) => (
                <li
                  key={ex}
                  className="rounded-[6px] border border-fog/20 bg-parchment px-2 py-0.5 text-xs text-fog"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-6 rounded-[8px] border border-fog/20 bg-parchment p-4">
        <p className="text-sm text-slate">
          Focus your adjustment analysis on high and medium impact features to
          maximize accuracy.
        </p>
      </div>
    </div>
  );
}
