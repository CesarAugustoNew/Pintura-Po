import { useState } from "react";
import { Check, ClipboardList, Pencil, RotateCcw, Send, Star, Trash2, X } from "lucide-react";
import { formatDatePtBr } from "../../utils/date";
import { getStatusOrdem, STATUS_LABELS } from "../../utils/ordens";

function toEditForm(ordem) {
  return {
    peca: ordem.peca,
    lote: ordem.lote,
    quantidade: ordem.quantidade,
    prioridade: ordem.prioridade,
    horarioSaida: ordem.horarioSaida,
  };
}

function StatusBadge({ ordem }) {
  const status = getStatusOrdem(ordem);
  return (
    <span className={`ptk-status-badge is-${status}`}>{STATUS_LABELS[status]}</span>
  );
}

export function OrdensTable({ ordens, onUpdate, onRemove, onRegistrarEnvio, onLimparEnvio }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");

  const [shippingId, setShippingId] = useState(null);
  const [shippingValue, setShippingValue] = useState("");
  const [shippingError, setShippingError] = useState("");

  function startEdit(ordem) {
    cancelShipping();
    setEditingId(ordem.id);
    setEditForm(toEditForm(ordem));
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

  function startShipping(ordem) {
    cancelEdit();
    setShippingId(ordem.id);
    setShippingValue(
      ordem.quantidadeEnviada !== null && ordem.quantidadeEnviada !== undefined
        ? String(ordem.quantidadeEnviada)
        : String(ordem.quantidade)
    );
    setShippingError("");
  }

  function cancelShipping() {
    setShippingId(null);
    setShippingValue("");
    setShippingError("");
  }

  function saveShipping(id) {
    const result = onRegistrarEnvio(id, shippingValue);
    if (!result.ok) {
      setShippingError(result.error);
      return;
    }
    cancelShipping();
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <ClipboardList size={16} color="var(--accent-2)" /> Ordem de produção de hoje
      </h2>

      {ordens.length === 0 ? (
        <div className="ptk-empty">Nenhuma ordem registrada ainda. Adicione a primeira acima.</div>
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th></th>
                <th>Peça</th>
                <th>Lote</th>
                <th>Meta</th>
                <th>Envio</th>
                <th>Saída</th>
                <th>Registrada em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((o) => {
                const isEditing = editingId === o.id;
                const isShipping = shippingId === o.id;
                const status = getStatusOrdem(o);

                if (isEditing) {
                  return (
                    <tr key={o.id}>
                      <td>
                        <button
                          type="button"
                          className="ptk-remove"
                          onClick={() => updateEditField("prioridade", !editForm.prioridade)}
                          aria-label="Alternar prioridade"
                          title="Alternar prioridade"
                        >
                          <Star
                            size={16}
                            color={editForm.prioridade ? "var(--accent)" : "var(--line)"}
                            fill={editForm.prioridade ? "var(--accent)" : "none"}
                          />
                        </button>
                      </td>
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
                          style={{ width: "80px" }}
                          value={editForm.quantidade}
                          onChange={(ev) => updateEditField("quantidade", ev.target.value)}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {o.quantidadeEnviada ?? "—"}
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="time"
                          value={editForm.horarioSaida}
                          onChange={(ev) => updateEditField("horarioSaida", ev.target.value)}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {formatDatePtBr(o.data)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="ptk-remove" onClick={() => saveEdit(o.id)} aria-label="Salvar edição">
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
                  <tr key={o.id}>
                    <td>
                      {o.prioridade && (
                        <span className="ptk-priority-badge" title="Prioridade">
                          <Star size={12} fill="currentColor" /> Prioridade
                        </span>
                      )}
                    </td>
                    <td className="ptk-mono">{o.peca}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{o.lote}</td>
                    <td className="ptk-mono">{o.quantidade}</td>
                    <td>
                      {isShipping ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <input
                              className="ptk-input ptk-input-cell"
                              type="number"
                              min="0"
                              style={{ width: "80px" }}
                              value={shippingValue}
                              onChange={(ev) => {
                                setShippingValue(ev.target.value);
                                if (shippingError) setShippingError("");
                              }}
                              autoFocus
                            />
                            <button className="ptk-remove" onClick={() => saveShipping(o.id)} aria-label="Confirmar envio">
                              <Check size={15} color="var(--accent-2)" />
                            </button>
                            <button className="ptk-remove" onClick={cancelShipping} aria-label="Cancelar registro de envio">
                              <X size={15} />
                            </button>
                          </div>
                          {shippingError && <div className="ptk-error">{shippingError}</div>}
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span className="ptk-mono" style={{ color: status === "pendente" ? "var(--muted)" : "var(--text)" }}>
                            {o.quantidadeEnviada ?? "—"}/{o.quantidade}
                          </span>
                          <StatusBadge ordem={o} />
                          {status === "pendente" ? (
                            <button
                              type="button"
                              className="ptk-remove"
                              onClick={() => startShipping(o)}
                              aria-label="Registrar envio"
                              title="Registrar envio"
                            >
                              <Send size={15} color="var(--accent-2)" />
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="ptk-remove"
                                onClick={() => startShipping(o)}
                                aria-label="Corrigir quantidade enviada"
                                title="Corrigir quantidade enviada"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className="ptk-remove"
                                onClick={() => onLimparEnvio(o.id)}
                                aria-label="Desfazer registro de envio"
                                title="Desfazer registro de envio"
                              >
                                <RotateCcw size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="ptk-mono" style={{ color: o.horarioSaida ? "var(--text)" : "var(--muted)" }}>
                      {o.horarioSaida || "—"}
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{formatDatePtBr(o.data)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="ptk-remove" onClick={() => startEdit(o)} aria-label="Editar ordem">
                          <Pencil size={15} />
                        </button>
                        <button className="ptk-remove" onClick={() => onRemove(o.id)} aria-label="Remover ordem">
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
