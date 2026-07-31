import { useState } from "react";
import { PackagePlus, Plus } from "lucide-react";

const EMPTY_FORM = { peca: "", lote: "", quantidade: "", observacao: "" };

export function NovoSobraForm({ onAdd }) {
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
        <PackagePlus size={16} color="var(--accent-2)" /> Registrar sobra
      </h2>
      <p className="ptk-sub" style={{ marginTop: "-6px", marginBottom: "16px" }}>
        Anote aqui as peças que sobraram (não fecharam barra, ficaram de lote anterior, etc.).
      </p>

      <div className="ptk-form-grid">
        <div>
          <label className="ptk-label">Peça / Modelo</label>
          <input
            className="ptk-input"
            value={form.peca}
            onChange={(e) => updateField("peca", e.target.value)}
            placeholder="Ex: PC-204"
          />
        </div>
        <div>
          <label className="ptk-label">Lote (opcional)</label>
          <input
            className="ptk-input"
            value={form.lote}
            onChange={(e) => updateField("lote", e.target.value)}
            placeholder="Ex: L-0731"
          />
        </div>
        <div>
          <label className="ptk-label">Quantidade</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            value={form.quantidade}
            onChange={(e) => updateField("quantidade", e.target.value)}
            placeholder="Ex: 3"
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="ptk-label">Observação (opcional)</label>
          <textarea
            className="ptk-textarea"
            value={form.observacao}
            onChange={(e) => updateField("observacao", e.target.value)}
            placeholder="Ex: sobrou da barra 12, guardada na prateleira..."
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> Adicionar sobra
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
