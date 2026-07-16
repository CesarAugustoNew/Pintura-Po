import { useState } from "react";
import { ImagePlus, Plus } from "lucide-react";

const EMPTY_FORM = { codigo: "", descricao: "", imagem: null };

export function CadastrarPecaForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField("imagem", reader.result);
    reader.readAsDataURL(file);
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
        Adicione foto e descrição para ajudar novos funcionários a identificar a peça.
      </p>

      <div className="ptk-cadastro-grid">
        <div className="ptk-upload">
          <div className="ptk-upload-box">
            {form.imagem ? (
              <img src={form.imagem} alt="Pré-visualização da peça" />
            ) : (
              <ImagePlus size={22} color="var(--line)" />
            )}
          </div>
          <label className="ptk-upload-label">
            <ImagePlus size={15} />
            {form.imagem ? "Trocar foto" : "Adicionar foto"}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="ptk-cadastro-fields">
          <div>
            <label className="ptk-label">Número / código da peça</label>
            <input
              className="ptk-input"
              value={form.codigo}
              onChange={(e) => updateField("codigo", e.target.value)}
              placeholder="Ex: PC-204"
            />
          </div>
          <div>
            <label className="ptk-label">Descrição</label>
            <textarea
              className="ptk-textarea"
              value={form.descricao}
              onChange={(e) => updateField("descricao", e.target.value)}
              placeholder="Como identificar a peça, onde é usada, detalhes que ajudam quem nunca viu..."
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
