"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./HeroPathway.module.css";

type Branch = {
  id: string;
  label: string;
  path: string;
  len: number;
  node: { x: number; y: number };
  textY: number;
};

const branches: Branch[] = [
  { id: "work", label: "Work in Canada", path: "M 40 60 C 150 60, 210 150, 300 210", len: 300, node: { x: 40, y: 60 }, textY: -16 },
  { id: "study", label: "Study with a plan", path: "M 40 135 C 150 135, 210 185, 300 210", len: 280, node: { x: 40, y: 135 }, textY: -16 },
  { id: "family", label: "Bring family closer", path: "M 40 210 C 150 210, 210 210, 300 210", len: 260, node: { x: 40, y: 210 }, textY: -16 },
  { id: "business", label: "Explore business options", path: "M 40 285 C 150 285, 210 235, 300 210", len: 280, node: { x: 40, y: 285 }, textY: 26 },
  { id: "citizenship", label: "Maintain status or citizenship", path: "M 40 360 C 150 360, 210 270, 300 210", len: 320, node: { x: 40, y: 360 }, textY: 26 },
];

const labels: Record<string, string> = { work: "Work", study: "Study", family: "Family", business: "Business", citizenship: "Citizenship" };

export function HeroPathway() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 520 420"
        role="group"
        aria-labelledby="hero-viz-title hero-viz-desc"
      >
        <title id="hero-viz-title">Immigration routes converging into one pathway</title>
        <desc id="hero-viz-desc">
          An abstract diagram of five routes — work, study, family, business, and citizenship — flowing
          into one structured pathway. Decorative and educational only; it does not represent
          eligibility or outcomes. Each route can be focused to highlight it.
        </desc>

        <path
          className={clsx(styles.route, styles.spine, styles.routeDraw, styles.spineDraw)}
          style={{ ["--len" as string]: 180 }}
          d="M 300 210 C 360 210, 400 210, 470 210"
        />

        {branches.map((branch) => {
          const isActive = active === branch.id;
          return (
            <g
              key={branch.id}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={branch.label}
              className={clsx(styles.branch, isActive && styles.branchActive)}
              onMouseEnter={() => setActive(branch.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(branch.id)}
              onBlur={() => setActive(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(branch.id);
                }
              }}
            >
              <path
                className={clsx(styles.route, styles.routeDraw)}
                style={{ ["--len" as string]: branch.len }}
                d={branch.path}
              />
              <g className={styles.node} transform={`translate(${branch.node.x},${branch.node.y})`}>
                <circle className={styles.halo} r={14} />
                <circle r={6} />
                <text x={0} y={branch.textY} textAnchor="middle">
                  {labels[branch.id]}
                </text>
              </g>
            </g>
          );
        })}

        <g className={clsx(styles.node, styles.converge)} transform="translate(470,210)">
          <circle r={9} />
          <text x={0} y={-18} textAnchor="middle">
            Your path
          </text>
        </g>
      </svg>
      <p className={styles.caption}>Illustrative only — not an eligibility result. Hover or tab through a route to explore.</p>
      <p className={styles.live} aria-live="polite">
        {active ? `${branches.find((b) => b.id === active)?.label} route highlighted.` : ""}
      </p>
    </div>
  );
}
