import { useState } from "react";
import { ImagePlus, Package, Plus, X } from "lucide-react";

const EMPTY_FORM = { codigo: "", descricao: "", imagens: [], caixa: "", qtdPorCaixa: "" };

export function CadastrarPecaForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalido = files.find((file) => !file.type.startsWith("image/"));
    if (invalido) {
      setError("Selecione apenas arquivos de imagem.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ ...f, imagens: [...f.imagens, reader.result] }));
      };
      reader.readAsDataURL(file);
    });

    // Permite selecionar o mesmo arquivo de novo depois de removê-lo.
    e.target.value = "";
  }

  function removeImagem(index) {
    setForm((f) => ({ ...f, imagens: f.imagens.filter((_, i) => i !== index) }));
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
        <ImagePlus size={16} color="var(--accent-2)" /> Cadastrar peça
      </h2>
      <p className="ptk-sub" style={{ marginTop: "-6px", marginBottom: "16px" }}>
        Adicione uma ou mais fotos e uma descrição para ajudar novos funcionários a identificar a peça.
      </p>

      <div className="ptk-cadastro-grid">
        <div className="ptk-upload">
          <div className="ptk-upload-thumbs">
            {form.imagens.map((src, i) => (
              <div className="ptk-upload-box" key={i}>
                <img src={src} alt={`Foto ${i + 1} da peça`} />
                <button
                  type="button"
                  className="ptk-upload-thumb-remove"
                  onClick={() => removeImagem(i)}
                  aria-label="Remover foto"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="ptk-upload-box ptk-upload-add">
              <ImagePlus size={20} color="var(--line)" />
              <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
            </label>
          </div>
          <span className="ptk-upload-hint">
            {form.imagens.length > 0
              ? `${form.imagens.length} foto(s) adicionada(s)`
              : "Nenhuma foto adicionada ainda"}
          </span>
        </div>

        <div className="ptk-cadastro-fields">
          <div>
            <label className="ptk-label">Número / código da peça</label>
            <input
              className="ptk-input"
              value={form.codigo}
              onChange={(e) => updateField("codigo", e.target.value.toUpperCase())}
              placeholder="Ex: PC-204"
            />
          </div>
          <div>
            <label className="ptk-label">Descrição (opcional)</label>
            <textarea
              className="ptk-textarea"
              value={form.descricao}
              onChange={(e) => updateField("descricao", e.target.value)}
              placeholder="Como identificar a peça, onde é usada, detalhes que ajudam quem nunca viu..."
            />
          </div>
        </div>
      </div>

      <div className="ptk-embalagem-section">
        <h3 className="ptk-embalagem-title">
          <Package size={14} color="var(--accent-2)" /> Embalagem
        </h3>
        <p className="ptk-sub" style={{ marginTop: "-4px", marginBottom: "12px" }}>
          Defina em qual caixa e quantas peças por caixa essa peça deve ser embalada.
        </p>
        <div className="ptk-form-grid">
          <div>
            <label className="ptk-label">Caixa</label>
            <input
              className="ptk-input"
              value={form.caixa}
              onChange={(e) => updateField("caixa", e.target.value)}
              placeholder="Ex: Caixa M-12"
            />
          </div>
          <div>
            <label className="ptk-label">Qtd por caixa</label>
            <input
              className="ptk-input"
              type="number"
              min="1"
              value={form.qtdPorCaixa}
              onChange={(e) => updateField("qtdPorCaixa", e.target.value)}
              placeholder="Ex: 20"
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button className="ptk-btn" onClick={handleAdd}>
          <Plus size={16} /> Cadastrar peça
        </button>
      </div>
      {error && <div className="ptk-error">{error}</div>}
    </div>
  );
}
