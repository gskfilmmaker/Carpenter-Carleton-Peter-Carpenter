/**
 * A small, stylized single-color maple-leaf silhouette used as a decorative accent — never paired
 * with red/white flag styling or any crest/coat-of-arms treatment, so it reads as a design motif
 * rather than an official government mark. Purely decorative: always aria-hidden.
 */
export function MapleLeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 90"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M50,2 L60.58,27.44 L88.04,29.64 L67.12,47.56 L73.51,74.36 L50,60 L26.49,74.36 L32.88,47.56 L11.96,29.64 L39.42,27.44 Z" />
      <rect x="47" y="60" width="6" height="22" rx="3" />
    </svg>
  );
}
