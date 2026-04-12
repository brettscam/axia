interface Props {
  variant?: 'color' | 'mono' | 'inverted';
  size?: number;
}

/**
 * Axia logo mark — house outline with document lines.
 * TODO: Replace with final SVG assets (axia-mark.svg, axia-mark-mono.svg)
 * when provided. Current implementation derives from the motion system mark.
 */
export function Logo({ variant = 'color', size = 32 }: Props) {
  const ink = variant === 'inverted' ? '#F7F5F0' : variant === 'mono' ? 'currentColor' : '#0B1E3F';
  const sage = variant === 'mono' ? 'currentColor' : '#4A6B5C';
  const gold = variant === 'mono' ? 'currentColor' : '#C9A961';
  const showInnerLines = size >= 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 130"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Axia"
    >
      <path
        d="M 28 36 L 65 12 L 102 36 L 102 114 L 28 114 Z"
        fill="none"
        stroke={ink}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showInnerLines && (
        <>
          <line x1="45" y1="72" x2="85" y2="72" stroke={sage} strokeWidth="7" strokeLinecap="round" />
          <line x1="45" y1="90" x2="72" y2="90" stroke={gold} strokeWidth="7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
