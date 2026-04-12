import './motion.css';

interface MotionProps {
  size?: number;
}

/** LOADING — generic page load, API fetch, anything under 3s */
export function AxiaLoading({ size = 64 }: MotionProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Loading">
      <path className="axia-anim-trace"
            d="M 28 36 L 65 12 L 102 36 L 102 114 L 28 114 Z"
            fill="none" stroke="#0B1E3F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="45" y1="72" x2="85" y2="72" stroke="#4A6B5C" strokeWidth="7" strokeLinecap="round" opacity="0.3"/>
      <line x1="45" y1="90" x2="72" y2="90" stroke="#C9A961" strokeWidth="7" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

/** AI THINKING — Claude is reasoning (adjustments, comps, narrative) */
export function AxiaThinking({ size = 64 }: MotionProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Analyzing">
      <path d="M 28 36 L 65 12 L 102 36 L 102 114 L 28 114 Z"
            fill="none" stroke="#0B1E3F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <line className="axia-anim-scan-1" x1="45" y1="72" x2="85" y2="72" stroke="#4A6B5C" strokeWidth="7" strokeLinecap="round"/>
      <line className="axia-anim-scan-2" x1="45" y1="90" x2="72" y2="90" stroke="#C9A961" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  );
}

/** SUCCESS — report complete, saved, signed */
export function AxiaSuccess({ size = 64 }: MotionProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Success">
      <g className="axia-anim-success">
        <path d="M 28 36 L 65 12 L 102 36 L 102 114 L 28 114 Z"
              fill="none" stroke="#4A6B5C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="axia-anim-check"
              d="M 48 75 L 62 89 L 88 63"
              fill="none" stroke="#4A6B5C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

/** DATA SYNC — pulling from MLS, Zillow, Redfin */
export function AxiaDataSync({ size = 64 }: MotionProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Syncing data">
      <path d="M 28 36 L 65 12 L 102 36 L 102 114 L 28 114 Z"
            fill="none" stroke="#0B1E3F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <line className="axia-anim-shuttle-1" x1="45" y1="72" x2="85" y2="72" stroke="#4A6B5C" strokeWidth="7" strokeLinecap="round"/>
      <line className="axia-anim-shuttle-2" x1="45" y1="90" x2="72" y2="90" stroke="#C9A961" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  );
}

/** STEPPED PROGRESS — multi-step transitions (fetch -> calc -> build) */
export function AxiaStepped({ size = 20 }: MotionProps) {
  return (
    <svg width={size * 3.5} height={size} viewBox="0 0 70 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="In progress">
      <circle className="axia-dot-1" cx="12" cy="10" r="4" fill="#0B1E3F"/>
      <circle className="axia-dot-2" cx="35" cy="10" r="4" fill="#4A6B5C"/>
      <circle className="axia-dot-3" cx="58" cy="10" r="4" fill="#C9A961"/>
    </svg>
  );
}
