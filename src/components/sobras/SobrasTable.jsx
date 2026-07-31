import { useState } from "react";
import { Check, Layers3, Pencil, Trash2, X } from "lucide-react";
import { formatDatePtBr } from "../../utils/date";

function toEditForm(sobra) {
  return {
    peca: sobra.peca,
    lote: sobra.lote,
    quantidade: String(sobra.quantidade),
    observacao: sobra.observacao,
  };
}

export function SobrasTable({ sobras, onUpdate, onRemove }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");

  function startEdit(sobra) {
    setEditingId(sobra.id);
    setEditForm(toEditForm(sobra));
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

  function saveEdit(id) {
    const result = onUpdate(id, editForm);
    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    cancelEdit();
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <Layers3 size={16} color="var(--accent-2)" /> Sobras registradas
      </h2>

      {sobras.length === 0 ? (
        <div className="ptk-empty">Nenhuma sobra registrada ainda. Adicione a primeira acima.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Lote</th>
                <th>Quantidade</th>
                <th>Observação</th>
                <th>Registrada em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sobras.map((s) => {
                const isEditing = editingId === s.id;

                if (isEditing) {
                  return (
                    <tr key={s.id}>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.peca}
                          onChange={(ev) => updateEditField("peca", ev.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.lote}
                          onChange={(ev) => updateEditField("lote", ev.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="number"
                          min="1"
                          style={{ width: "72px" }}
                          value={editForm.quantidade}
                          onChange={(ev) => updateEditField("quantidade", ev.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.observacao}
                          onChange={(ev) => updateEditField("observacao", ev.target.value)}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {formatDatePtBr(s.data)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="ptk-remove" onClick={() => saveEdit(s.id)} aria-label="Salvar edição">
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

                return (
                  <tr key={s.id}>
                    <td className="ptk-mono">{s.peca}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{s.lote || "—"}</td>
                    <td className="ptk-mono" style={{ color: "var(--accent)" }}>{s.quantidade}</td>
                    <td>{s.observacao || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{formatDatePtBr(s.data)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="ptk-remove" onClick={() => startEdit(s)} aria-label="Editar sobra">
                          <Pencil size={15} />
                        </button>
                        <button className="ptk-remove" onClick={() => onRemove(s.id)} aria-label="Remover sobra">
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
