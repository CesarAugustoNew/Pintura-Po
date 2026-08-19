import { useState } from "react";
import { Check, PaintBucket, Pencil, Trash2, Wrench, X } from "lucide-react";
import { buildBarraSequence } from "../../utils/barras";
import { TOTAL_BARRAS } from "../../constants";
import { useConfirm } from "../common/ConfirmDialogProvider";
import { TurnoBadge } from "../common/TurnoBadge";

function toEditForm(entry) {
  return {
    peca: entry.peca,
    lote: entry.lote,
    qtdPorBarra: String(entry.qtdPorBarra),
    barraInicial: String(entry.barraInicial),
    barraFinal: String(entry.barraFinal),
    qtdUltimaBarra: entry.qtdUltimaBarra === null ? "" : String(entry.qtdUltimaBarra),
    horaInicio: entry.horaInicio || "",
    isSetup: !!entry.isSetup,
  };
}

export function LancamentosTable({ entries, onUpdate, onRemove, titulo = "Lançamentos de hoje" }) {
  const confirm = useConfirm();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditForm(toEditForm(entry));
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setEditError("");
  }

  function updateEditField(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }));
    if (editError) setEditError("");
  }

  function toggleEditSetup() {
    setEditForm((f) => ({
      ...f,
      isSetup: !f.isSetup,
      peca: f.isSetup ? "" : "",
      lote: "",
      qtdPorBarra: "",
      qtdUltimaBarra: "",
    }));
    if (editError) setEditError("");
  }

  function saveEdit(id) {
    const result = onUpdate(id, editForm);
    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    cancelEdit();
  }

  async function handleRemove(entry) {
    const ok = await confirm({
      title: entry.isSetup ? "Remover setup?" : "Remover lançamento?",
      message: entry.isSetup
        ? `O setup nas barras ${entry.barraInicial}–${entry.barraFinal} será removido. Essa ação não pode ser desfeita.`
        : `O lançamento de ${entry.peca} (lote ${entry.lote}) será removido. Essa ação não pode ser desfeita.`,
    });
    if (ok) onRemove(entry.id);
  }

  // Prévia do total enquanto edita, pra dar feedback imediato antes de salvar.
  function previewTotal(form) {
    const bi = parseInt(form.barraInicial, 10);
    const bf = parseInt(form.barraFinal, 10);
    const barras = buildBarraSequence(bi, bf).length;
    if (barras === 0) return null;
    if (form.isSetup) return 0;
    const qtd = parseInt(form.qtdPorBarra, 10);
    if (isNaN(qtd)) return null;
    const temUltima = form.qtdUltimaBarra !== "";
    const qtdUltima = temUltima ? parseInt(form.qtdUltimaBarra, 10) : null;
    if (temUltima && !isNaN(qtdUltima)) return qtd * (barras - 1) + qtdUltima;
    return qtd * barras;
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <PaintBucket size={16} color="var(--accent-2)" /> {titulo}
      </h2>

      {entries.length === 0 ? (
        <div className="ptk-empty">Nenhum lançamento ainda. Adicione o primeiro lote acima.</div>
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th></th>
                <th>Peça</th>
                <th>Lote</th>
                <th>Início</th>
                <th>Qtd/barra</th>
                <th>Barras</th>
                <th>Última barra</th>
                <th>Total peças</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const isEditing = editingId === e.id;

                if (isEditing) {
                  const total = previewTotal(editForm);
                  return (
                    <tr key={e.id}>
                      <td>
                        <TurnoBadge turno={e.turno} />
                      </td>
                      <td>
                        <label className="ptk-setup-toggle" style={{ fontSize: "10px", marginBottom: "4px" }}>
                          <input type="checkbox" checked={editForm.isSetup} onChange={toggleEditSetup} />
                          <Wrench size={12} /> Setup
                        </label>
                        {!editForm.isSetup && (
                          <input
                            className="ptk-input ptk-input-cell"
                            value={editForm.peca}
                            onChange={(ev) => updateEditField("peca", ev.target.value.toUpperCase())}
                          />
                        )}
                      </td>
                      <td>
                        {editForm.isSetup ? (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        ) : (
                          <input
                            className="ptk-input ptk-input-cell"
                            value={editForm.lote}
                            onChange={(ev) => updateEditField("lote", ev.target.value.toUpperCase())}
                          />
                        )}
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="time"
                          style={{ width: "88px" }}
                          value={editForm.horaInicio}
                          onChange={(ev) => updateEditField("horaInicio", ev.target.value)}
                        />
                      </td>
                      <td>
                        {editForm.isSetup ? (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        ) : (
                          <input
                            className="ptk-input ptk-input-cell"
                            type="number"
                            min="1"
                            style={{ width: "64px" }}
                            value={editForm.qtdPorBarra}
                            onChange={(ev) => updateEditField("qtdPorBarra", ev.target.value)}
                          />
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="number"
                          min="1"
                          max={TOTAL_BARRAS}
                          style={{ width: "56px" }}
                          value={editForm.barraInicial}
                          onChange={(ev) => updateEditField("barraInicial", ev.target.value)}
                        />
                        {" – "}
                        <input
                          className="ptk-input ptk-input-cell"
                          type="number"
                          min="1"
                          max={TOTAL_BARRAS}
                          style={{ width: "56px" }}
                          value={editForm.barraFinal}
                          onChange={(ev) => updateEditField("barraFinal", ev.target.value)}
                        />
                      </td>
                      <td>
                        {editForm.isSetup ? (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        ) : (
                          <input
                            className="ptk-input ptk-input-cell"
                            type="number"
                            min="0"
                            style={{ width: "64px" }}
                            placeholder="cheia"
                            value={editForm.qtdUltimaBarra}
                            onChange={(ev) => updateEditField("qtdUltimaBarra", ev.target.value)}
                          />
                        )}
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--accent)" }}>
                        {total !== null ? total : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="ptk-remove" onClick={() => saveEdit(e.id)} aria-label="Salvar edição">
                            <Check size={15} color="var(--accent-2)" />
                          </button>
                          <button className="ptk-remove" onClick={cancelEdit} aria-label="Cancelar edição">
                            <X size={15} />
                          </button>
                        </div>
                        {editError && <div className="ptk-error" style={{ marginTop: "4px" }}>{editError}</div>}
                      </td>
                    </tr>
                  );
                }

                if (e.isSetup) {
                  return (
                    <tr key={e.id}>
                      <td>
                        <TurnoBadge turno={e.turno} />
                      </td>
                      <td>
                        <span className="ptk-setup-badge">
                          <Wrench size={11} /> Setup
                        </span>
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>—</td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>{e.horaInicio || "—"}</td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>—</td>
                      <td className="ptk-mono">
                        {e.barraInicial}–{e.barraFinal} <span style={{ color: "var(--muted)" }}>({e.barrasUsadas})</span>
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>—</td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>0</td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="ptk-remove" onClick={() => startEdit(e)} aria-label="Editar setup">
                            <Pencil size={15} />
                          </button>
                          <button className="ptk-remove" onClick={() => handleRemove(e)} aria-label="Remover setup">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={e.id}>
                    <td>
                      <TurnoBadge turno={e.turno} />
                    </td>
                    <td className="ptk-mono">{e.peca}</td>
                    <td className="ptk-mono">{e.lote}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{e.horaInicio || "—"}</td>
                    <td className="ptk-mono">{e.qtdPorBarra}</td>
                    <td className="ptk-mono">
                      {e.barraInicial}–{e.barraFinal} <span style={{ color: "var(--muted)" }}>({e.barrasUsadas})</span>
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                      {e.qtdUltimaBarra !== null ? e.qtdUltimaBarra : "cheia"}
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--accent)" }}>{e.totalPecas}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="ptk-remove" onClick={() => startEdit(e)} aria-label="Editar lançamento">
                          <Pencil size={15} />
                        </button>
                        <button className="ptk-remove" onClick={() => handleRemove(e)} aria-label="Remover lançamento">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
