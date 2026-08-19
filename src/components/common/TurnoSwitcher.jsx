import { Clock } from "lucide-react";
import { TURNOS, TURNO_TODOS } from "../../constants";

/**
 * Alterna qual turno está sendo visualizado/registrado. A seleção controla
 * duas coisas ao mesmo tempo: filtra o que aparece nas telas de Lançamentos
 * e Ordem de Produção, e define o turno usado como padrão para novos
 * registros sem horário informado.
 */
export function TurnoSwitcher({ turnoSelecionado, onChange }) {
  return (
    <div className="ptk-turno-switcher">
      <span className="ptk-turno-switcher-label">
        <Clock size={13} /> Turno
      </span>
      <div className="ptk-turno-switcher-options">
        {TURNOS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ptk-turno-btn ptk-turno-btn--${t.id} ${turnoSelecionado === t.id ? "active" : ""}`}
            onClick={() => onChange(t.id)}
            title={t.horario}
          >
            {t.numero}º Turno
            <span className="ptk-turno-btn-horario">{t.horario}</span>
          </button>
        ))}
        <button
          type="button"
          className={`ptk-turno-btn ptk-turno-btn--todos ${turnoSelecionado === TURNO_TODOS ? "active" : ""}`}
          onClick={() => onChange(TURNO_TODOS)}
        >
          Todos
        </button>
      </div>
    </div>
  );
}
