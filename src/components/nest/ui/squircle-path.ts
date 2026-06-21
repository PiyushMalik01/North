/**
 * Superellipse ("squircle") SVG path generator — the iOS-widget corner.
 *
 * A rounded rectangle whose corners follow a smooth superellipse instead of a
 * circular arc, so there is no abrupt point where the straight edge meets the
 * curve. Port of the figma-squircle algorithm (MIT) in compact form.
 *
 * `smoothing` is 0..1: 0 = a plain circular-arc rounded rect, ~0.6 = the iOS feel.
 * Coordinates are absolute pixels, so the path must be regenerated when the
 * element is resized (the consumer measures and passes width/height).
 */

const rad = (deg: number) => (deg * Math.PI) / 180;

interface CornerParams {
  a: number;
  b: number;
  c: number;
  d: number;
  p: number;
  arcSectionLength: number;
  cornerRadius: number;
}

function cornerParams(
  cornerRadius: number,
  cornerSmoothing: number,
  budget: number,
): CornerParams {
  // Rounding + smoothing must fit the available budget (half the shorter side).
  let p = (1 + cornerSmoothing) * cornerRadius;
  if (p > budget) {
    p = budget;
    cornerRadius = Math.min(cornerRadius, p / (1 + cornerSmoothing));
  }

  const arcMeasure = 90 * (1 - cornerSmoothing);
  const arcSectionLength = Math.sin(rad(arcMeasure / 2)) * cornerRadius * Math.SQRT2;

  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4 = cornerRadius * Math.tan(rad(angleAlpha / 2));

  const angleBeta = 45 * cornerSmoothing;
  const c = p3ToP4 * Math.cos(rad(angleBeta));
  const d = c * Math.tan(rad(angleBeta));

  const b = (p - arcSectionLength - c - d) / 3;
  const a = 2 * b;

  return { a, b, c, d, p, arcSectionLength, cornerRadius };
}

/** Build a closed superellipse-cornered rectangle path for the given box. */
export function squirclePath(
  width: number,
  height: number,
  radius: number,
  smoothing: number,
): string {
  const budget = Math.min(width, height) / 2;
  const cp = cornerParams(Math.min(radius, budget), smoothing, budget);
  const { a, b, c, d, p, arcSectionLength: arc, cornerRadius: r } = cp;

  return [
    `M ${width - p} 0`,
    // top-right corner
    `c ${a} 0 ${a + b} 0 ${a + b + c} ${d}`,
    `a ${r} ${r} 0 0 1 ${arc} ${arc}`,
    `c ${d} ${c} ${d} ${b + c} ${d} ${a + b + c}`,
    `l 0 ${height - 2 * p}`,
    // bottom-right corner
    `c 0 ${a} 0 ${a + b} ${-d} ${a + b + c}`,
    `a ${r} ${r} 0 0 1 ${-arc} ${arc}`,
    `c ${-c} ${d} ${-(b + c)} ${d} ${-(a + b + c)} ${d}`,
    `l ${-(width - 2 * p)} 0`,
    // bottom-left corner
    `c ${-a} 0 ${-(a + b)} 0 ${-(a + b + c)} ${-d}`,
    `a ${r} ${r} 0 0 1 ${-arc} ${-arc}`,
    `c ${-d} ${-c} ${-d} ${-(b + c)} ${-d} ${-(a + b + c)}`,
    `l 0 ${-(height - 2 * p)}`,
    // top-left corner
    `c 0 ${-a} 0 ${-(a + b)} ${d} ${-(a + b + c)}`,
    `a ${r} ${r} 0 0 1 ${arc} ${-arc}`,
    `c ${c} ${-d} ${b + c} ${-d} ${a + b + c} ${-d}`,
    'z',
  ].join(' ');
}
