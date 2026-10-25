/**
 * Clean outline text. -webkit-text-stroke traces every contour of a variable
 * font, so overlapping glyph parts show as stray lines inside letters. These
 * filters grow the filled glyphs by a hair and keep only the ring outside
 * them, which outlines the union shape with no inner seams.
 */
export function OutlineFilters() {
  const ring = (id: string, color: string, opacity: number, r = 1.2) => (
    <filter id={id} x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius={r} result="grown" />
      <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
      <feFlood floodColor={color} floodOpacity={opacity} />
      <feComposite in2="ring" operator="in" />
    </filter>
  );
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {ring("outline-ink", "#f3ede6", 1, 1.3)}
        {ring("outline-faint", "#f3ede6", 0.18, 1)}
        {ring("outline-ember", "#ff5a1f", 0.7, 1)}
      </defs>
    </svg>
  );
}
