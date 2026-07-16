import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import { BarPegs } from "../common/BarPegs";
import { FUROS_POR_BARRA, TOTAL_BARRAS } from "../../constants";
import { buildBarraSequence } from "../../utils/barras";

const EMPTY_FORM = { peca: "", lote: "", qtdPorBarra: "", barraInicial: "", barraFinal: "" };

export function NovoLancamentoForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  const qtd = parseInt(form.qtdPorBarra, 10);
  const bi = parseInt(form.barraInicial, 10);
  const bf = parseInt(form.barraFinal, 10);
  const previewBarras = buildBarraSequence(bi, bf).length;
  const previewTotal = !isNaN(qtd) && previewBarras > 0 ? qtd * previewBarras : 0;

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
        <Layers size={16} color="var(--accent-2)" /> Novo lançamento
      </h2>

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
          <label className="ptk-label">Lote</label>
          <input
            className="ptk-input"
            value={form.lote}
            onChange={(e) => updateField("lote", e.target.value)}
            placeholder="Ex: L-0731"
          />
        </div>
        <div>
          <label className="ptk-label">Qtd por barra</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            max={FUROS_POR_BARRA}
            value={form.qtdPorBarra}
            onChange={(e) => updateField("qtdPorBarra", e.target.value)}
            placeholder="1–10"
          />
        </div>
        <div>
          <label className="ptk-label">Barra inicial</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            max={TOTAL_BARRAS}
            value={form.barraInicial}
            onChange={(e) => updateField("barraInicial", e.target.value)}
            placeholder="1–50"
          />
        </div>
        <div>
          <label className="ptk-label">Barra final</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            max={TOTAL_BARRAS}
            value={form.barraFinal}
            onChange={(e) => updateField("barraFinal", e.target.value)}
            placeholder="1–50"
          />
        </div>
      </div>

      <div className="ptk-form-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <BarPegs filled={!isNaN(qtd) ? qtd : 0} />
          <span className="ptk-mono" style={{ fontSize: "13px", color: "var(--muted)" }}>
            {previewBarras > 0 ? `${previewBarras} barra(s) · ${previewTotal} peças` : "preencha os campos"}
          </span>
        </div>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> Adicionar lançamento
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
