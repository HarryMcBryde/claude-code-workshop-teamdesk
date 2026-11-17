import type React from "react";

const FLAKE_COUNT = 30;

const flakes = Array.from({ length: FLAKE_COUNT }, (_, i) => ({
  id: `flake-${i}`,
  style: {
    "--delay": `${-((i * 7) % 13)}s`,
    "--drift": `${((i * 11) % 9) - 4}rem`,
    "--dur": `${9 + ((i * 5) % 8)}s`,
    "--size": `${4 + ((i * 3) % 5)}px`,
    "--x": `${(i * 37) % 100}%`,
  } as React.CSSProperties,
}));

export default function Snowfall() {
  return (
    <div aria-hidden="true" className="snowfall">
      {flakes.map((flake) => (
        <span className="snowflake" key={flake.id} style={flake.style} />
      ))}
    </div>
  );
}
