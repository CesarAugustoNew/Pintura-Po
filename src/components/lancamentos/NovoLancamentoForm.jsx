import { useState } from "react";
import { Layers, Plus, Wrench } from "lucide-react";
import { BarPegs } from "../common/BarPegs";
import { TOTAL_BARRAS } from "../../constants";
import { buildBarraSequence } from "../../utils/barras";

const EMPTY_FORM = {
  peca: "",
  lote: "",
  qtdPorBarra: "",
  barraInicial: "",
  barraFinal: "",
  qtdUltimaBarra: "",
  horaInicio: "",
  isSetup: false,
};

export function NovoLancamentoForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  function toggleSetup() {
    // Trocar pra modo setup limpa peça/lote/qtd, já que não fazem sentido nesse tipo de lançamento.
    setForm((f) => ({
      ...f,
      isSetup: !f.isSetup,
      peca: "",
      lote: "",
      qtdPorBarra: "",
      qtdUltimaBarra: "",
    }));
    if (error) setError("");
  }

  const qtd = parseInt(form.qtdPorBarra, 10);
  const bi = parseInt(form.barraInicial, 10);
  const bf = parseInt(form.barraFinal, 10);
  const previewBarras = buildBarraSequence(bi, bf).length;
  const temUltimaParcial = form.qtdUltimaBarra !== "";
  const qtdUltima = temUltimaParcial ? parseInt(form.qtdUltimaBarra, 10) : null;
  const previewTotal =
    !isNaN(qtd) && previewBarras > 0
      ? temUltimaParcial && !isNaN(qtdUltima)
        ? qtd * (previewBarras - 1) + qtdUltima
        : qtd * previewBarras
      : 0;

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
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <h2 className="ptk-panel-title" style={{ margin: 0 }}>
          <Layers size={16} color="var(--accent-2)" /> Novo lançamento
        </h2>
        <label className="ptk-setup-toggle">
          <input type="checkbox" checked={form.isSetup} onChange={toggleSetup} />
          <Wrench size={14} />
          Setup (troca de tinta)
        </label>
      </div>

      {form.isSetup && (
        <p className="ptk-sub" style={{ marginTop: "8px", marginBottom: 0 }}>
          As barras desse intervalo só passam pela limpeza — sem peça, lote ou quantidade.
        </p>
      )}

      <div className="ptk-form-grid" style={{ marginTop: "16px" }}>
        {!form.isSetup && (
          <>
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
          </>
        )}
        <div>
          <label className="ptk-label">Horário de início</label>
          <input
            className="ptk-input"
            type="time"
            value={form.horaInicio}
            onChange={(e) => updateField("horaInicio", e.target.value)}
          />
        </div>
        {!form.isSetup && (
          <div>
            <label className="ptk-label">Qtd por barra</label>
            <input
              className="ptk-input"
              type="number"
              min="1"
              value={form.qtdPorBarra}
              onChange={(e) => updateField("qtdPorBarra", e.target.value)}
              placeholder="Ex: 8"
            />
          </div>
        )}
        <div>
          <label className="ptk-label">Barra inicial</label>
          <input
            className="ptk-input"
            type="number"
            min="1"
            max={TOTAL_BARRAS}
            value={form.barraInicial}
            onChange={(e) => updateField("barraInicial", e.target.value)}
            placeholder="1–49"
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
            placeholder="1–49"
          />
        </div>
        {!form.isSetup && (
          <div>
            <label className="ptk-label">&nbsp;</label>
            <input
              className="ptk-input"
              type="number"
              min="0"
              max={!isNaN(qtd) ? qtd : undefined}
              value={form.qtdUltimaBarra}
              onChange={(e) => updateField("qtdUltimaBarra", e.target.value)}
              placeholder="Qtd real na última (opcional)"
            />
          </div>
        )}
      </div>

      <div className="ptk-form-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!form.isSetup && <BarPegs filled={!isNaN(qtd) ? qtd : 0} />}
          <span className="ptk-mono" style={{ fontSize: "13px", color: "var(--muted)" }}>
            {previewBarras > 0
              ? form.isSetup
                ? `${previewBarras} barra(s) reservada(s) para o setup`
                : `${previewBarras} barra(s) · ${previewTotal} peças`
              : "preencha os campos"}
          </span>
        </div>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> {form.isSetup ? "Adicionar setup" : "Adicionar lançamento"}
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
