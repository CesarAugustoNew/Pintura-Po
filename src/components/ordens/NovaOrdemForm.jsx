import { useState } from "react";
import { Plus, Star, Truck } from "lucide-react";

const EMPTY_FORM = { peca: "", lote: "", quantidade: "", prioridade: false, horarioSaida: "" };

export function NovaOrdemForm({ onAdd }) {
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
        <Truck size={16} color="var(--accent-2)" /> Nova ordem de produção
      </h2>
      <p className="ptk-sub" style={{ marginTop: "-6px", marginBottom: "16px" }}>
        Registre a peça, o lote e a quantidade combinada para enviar hoje, se é prioridade e, se quiser, o horário de saída.
      </p>

      <div className="ptk-form-grid">
        <div>
          <label className="ptk-label">Peça / Modelo</label>
          <input
            className="ptk-input"
            value={form.peca}
            onChange={(e) => updateField("peca", e.target.value.toUpperCase())}
            placeholder="Ex: PC-204"
          />
        </div>
        <div>
          <label className="ptk-label">Lote</label>
          <input
            className="ptk-input"
            value={form.lote}
            onChange={(e) => updateField("lote", e.target.value.toUpperCase())}
            placeholder="Ex: L-0731"
          />
        </div>
        <div>
          <label className="ptk-label">Quantidade a enviar</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            value={form.quantidade}
            onChange={(e) => updateField("quantidade", e.target.value)}
            placeholder="Ex: 400"
          />
        </div>
        <div>
          <label className="ptk-label">Horário de saída</label>
          <input
            className="ptk-input"
            type="time"
            value={form.horarioSaida}
            onChange={(e) => updateField("horarioSaida", e.target.value)}
          />
        </div>
        <div>
          <label className="ptk-label">Prioridade?</label>
          <div className="ptk-priority-toggle">
            <button
              type="button"
              className={`ptk-priority-btn ${!form.prioridade ? "active" : ""}`}
              onClick={() => updateField("prioridade", false)}
            >
              Normal
            </button>
            <button
              type="button"
              className={`ptk-priority-btn is-priority ${form.prioridade ? "active" : ""}`}
              onClick={() => updateField("prioridade", true)}
            >
              <Star size={13} /> Prioridade
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> Adicionar à ordem do dia
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
