type LetterboxdIconProps = {
  className?: string;
};

export function LetterboxdIcon({ className = "" }: LetterboxdIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <circle cx="8" cy="12" fill="#ff8000" r="4.2" />
      <circle cx="12" cy="12" fill="#00e054" r="4.2" />
      <circle cx="16" cy="12" fill="#40bcf4" r="4.2" />
    </svg>
  );
}
