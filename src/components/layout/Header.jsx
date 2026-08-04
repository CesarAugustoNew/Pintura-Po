import { FUROS_POR_BARRA } from "../../constants";
import { formatDatePtBr } from "../../utils/date";

export function Header({ today }) {
  return (
    <div className="ptk-header">
      <div>
        <div className="ptk-eyebrow">Setor de Pintura · Controle de Barras e Embalagem</div>
        <h1 className="ptk-title">Barras & Lotes</h1>
        <p className="ptk-sub">
          Cada barra tem {FUROS_POR_BARRA} furos. Registre o lote, quantas peças foram por barra e o
          intervalo de barras usado.
        </p>
      </div>
      <div className="ptk-daycard">
        <div className="ptk-daycard-label">Hoje</div>
        <div className="ptk-daycard-date">{formatDatePtBr(today)}</div>
      </div>
    </div>
  );
}
