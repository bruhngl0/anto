export default function LinkArrow() {
  return (
    <svg
      viewBox="0 0 10 10"
      className="link-arrow"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: "01.82em",
        height: "01.82em",
        marginLeft: "0.22rem",
        position: "relative",
        top: "-0.05em",
        transition: "transform 0.2s var(--ease)",
      }}
    >
      {/* Diagonal tail: bottom-left to top-right */}
      <line x1="2" y1="8" x2="8" y2="2" />
      {/* L-shaped head anchored at the tip (8,2) */}
      <polyline points="3.5 2 8 2 8 6.5" />
    </svg>
  );
}