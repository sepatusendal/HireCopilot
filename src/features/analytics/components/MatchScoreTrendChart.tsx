import type { MatchScorePoint } from "@/features/analytics/agent";

const WIDTH = 480;
const HEIGHT = 140;
const PADDING = 24;

export function MatchScoreTrendChart({ data }: { data: MatchScorePoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Not enough scored applications yet to chart a trend.</p>;
  }

  const usableWidth = WIDTH - PADDING * 2;
  const usableHeight = HEIGHT - PADDING * 2;
  const stepX = data.length > 1 ? usableWidth / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = PADDING + i * stepX;
    const y = PADDING + usableHeight * (1 - d.avgScore / 100);
    return { x, y, d };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Average match score by month"
      className="w-full"
    >
      <line x1={PADDING} y1={PADDING} x2={PADDING} y2={HEIGHT - PADDING} stroke="var(--color-border)" strokeWidth={1} />
      <line
        x1={PADDING}
        y1={HEIGHT - PADDING}
        x2={WIDTH - PADDING}
        y2={HEIGHT - PADDING}
        stroke="var(--color-border)"
        strokeWidth={1}
      />
      <path d={path} fill="none" stroke="var(--color-ai)" strokeWidth={2} strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="var(--color-ai)" />
          <text x={p.x} y={HEIGHT - PADDING + 14} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold">
            {p.d.label}
          </text>
          {(i === 0 || i === points.length - 1) && (
            <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-foreground text-[10px] font-extrabold">
              {p.d.avgScore}%
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
