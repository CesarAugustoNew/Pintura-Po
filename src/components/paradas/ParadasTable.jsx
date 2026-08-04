import { useState } from "react";
import { Check, ListChecks, Pencil, Trash2, X } from "lucide-react";
import { formatDatePtBr } from "../../utils/date";
import { calcularDuracaoMinutos, formatDuracao } from "../../utils/paradas";

function toEditForm(parada) {
  return { motivo: parada.motivo, horaInicio: parada.horaInicio, horaFim: parada.horaFim };
}

export function ParadasTable({ paradas, onUpdate, onRemove }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");

  function startEdit(parada) {
    setEditingId(parada.id);
    setEditForm(toEditForm(parada));
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

  function previewDuracao(form) {
    if (!form.horaInicio || !form.horaFim) return null;
    return calcularDuracaoMinutos(form.horaInicio, form.horaFim);
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <ListChecks size={16} color="var(--accent-2)" /> Paradas registradas
      </h2>

      {paradas.length === 0 ? (
        <div className="ptk-empty">Nenhuma parada registrada ainda. Adicione a primeira acima.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Duração</th>
                <th>Registrada em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paradas.map((p) => {
                const isEditing = editingId === p.id;

                if (isEditing) {
                  const duracao = previewDuracao(editForm);
                  return (
                    <tr key={p.id}>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.motivo}
                          onChange={(ev) => updateEditField("motivo", ev.target.value)}
                        />
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
                        <input
                          className="ptk-input ptk-input-cell"
                          type="time"
                          style={{ width: "88px" }}
                          value={editForm.horaFim}
                          onChange={(ev) => updateEditField("horaFim", ev.target.value)}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--accent)" }}>
                        {duracao !== null && duracao > 0 ? formatDuracao(duracao) : "—"}
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {formatDatePtBr(p.data)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="ptk-remove" onClick={() => saveEdit(p.id)} aria-label="Salvar edição">
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
                  <tr key={p.id}>
                    <td className="ptk-mono">{p.motivo}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{p.horaInicio}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{p.horaFim}</td>
                    <td className="ptk-mono" style={{ color: "var(--accent)" }}>{formatDuracao(p.duracaoMinutos)}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{formatDatePtBr(p.data)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="ptk-remove" onClick={() => startEdit(p)} aria-label="Editar parada">
                          <Pencil size={15} />
                        </button>
                        <button className="ptk-remove" onClick={() => onRemove(p.id)} aria-label="Remover parada">
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
