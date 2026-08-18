import { useState } from "react";
import { OctagonPause, Plus } from "lucide-react";

const EMPTY_FORM = { motivo: "", horaInicio: "", horaFim: "" };

export function NovoParadaForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  function handleAdd() {
    const result = onAdd(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm(EMPTY_FORM);
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <OctagonPause size={16} color="var(--accent-2)" /> Registrar parada
      </h2>
      <p className="ptk-sub" style={{ marginTop: "-6px", marginBottom: "16px" }}>
        Anote o motivo e o horário de início e fim de cada parada de produção.
      </p>

      <div className="ptk-form-grid">
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="ptk-label">Motivo</label>
          <input
            className="ptk-input"
            value={form.motivo}
            onChange={(e) => updateField("motivo", e.target.value)}
            placeholder="Ex: Falta de material"
          />
        </div>
        <div>
          <label className="ptk-label">Início</label>
          <input
            className="ptk-input"
            type="time"
            value={form.horaInicio}
            onChange={(e) => updateField("horaInicio", e.target.value)}
          />
        </div>
        <div>
          <label className="ptk-label">Fim</label>
          <input
            className="ptk-input"
            type="time"
            value={form.horaFim}
            onChange={(e) => updateField("horaFim", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> Adicionar parada
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
