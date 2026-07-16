import { FUROS_POR_BARRA } from "../../constants";

/**
 * Ilustração de assinatura: representa a barra física com os furos,
 * arames e peças penduradas, prontas para ir pra pintura.
 */
export function HeroBar() {
  const holes = Array.from({ length: FUROS_POR_BARRA });

  return (
    <svg viewBox="0 0 720 150" className="ptk-hero-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="34" x2="680" y2="34" stroke="var(--panel-2)" strokeWidth="14" strokeLinecap="round" />
      {holes.map((_, i) => {
        const x = 74 + i * 64;
        const filled = i % 3 !== 2; // maioria ocupada, alguns vazios — sensação de "em andamento"
        const wireLen = 40 + (i % 4) * 10;
        return (
          <g key={i}>
            <circle cx={x} cy="34" r="7" fill="var(--bg)" stroke="var(--line)" strokeWidth="2" />
            {filled && (
              <>
                <line x1={x} y1="38" x2={x} y2={38 + wireLen} stroke="var(--muted)" strokeWidth="1.5" />
                <rect
                  x={x - 9}
                  y={38 + wireLen}
                  width="18"
                  height="14"
                  rx="2"
                  fill={i % 5 === 0 ? "var(--accent-2)" : "var(--accent)"}
                  opacity="0.9"
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
