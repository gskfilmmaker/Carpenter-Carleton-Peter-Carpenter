/**
 * A faint, stylized landmass silhouette (evoking Canada's coastline and the Hudson Bay indentation)
 * used as a low-opacity background watermark. Deliberately abstract, not a precise geographic
 * outline — decorative only. Purely visual: always aria-hidden and never carries information.
 */
export function CanadaMapWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 480"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M60,120
           L60,150 L110,200 L80,260 L130,320 L100,380
           L150,420 L400,440 L680,430
           L720,380 L650,320 L560,260 L700,180 L760,140
           L650,110 L450,90 L250,60 Z"
      />
    </svg>
  );
}
