import { useState } from "react";
import { Check, ClipboardList, Pencil, Star, Trash2, X } from "lucide-react";
import { formatDateNumeric } from "../../utils/date";
import { getStatusOrdem, STATUS_LABELS } from "../../utils/ordens";
import { useConfirm } from "../common/ConfirmDialogProvider";
import { TurnoBadge } from "../common/TurnoBadge";

function toEditForm(ordem) {
  return {
    peca: ordem.peca,
    lote: ordem.lote,
    quantidade: ordem.quantidade,
    prioridade: ordem.prioridade,
    horarioSaida: ordem.horarioSaida,
    quantidadeEmProcesso: ordem.quantidadeEmProcesso === null ? "" : String(ordem.quantidadeEmProcesso),
  };
}

function buscarNoCatalogo(codigo, catalogoPecas) {
  return catalogoPecas.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase());
}

function EmbalagemInfo({ pecaCatalogo }) {
  if (!pecaCatalogo || (!pecaCatalogo.caixa && !pecaCatalogo.qtdPorCaixa)) {
    return <span style={{ color: "var(--muted)" }}>—</span>;
  }
  return (
    <span className="ptk-mono" style={{ color: "var(--muted)" }}>
      {pecaCatalogo.caixa || "Caixa —"}
      {pecaCatalogo.qtdPorCaixa ? ` · ${pecaCatalogo.qtdPorCaixa}/cx` : ""}
    </span>
  );
}

function StatusBadge({ ordem }) {
  const status = getStatusOrdem(ordem);
  return (
    <span className={`ptk-status-badge is-${status}`}>{STATUS_LABELS[status]}</span>
  );
}

export function OrdensTable({ ordens, onUpdate, onRemove, catalogoPecas = [] }) {
  const confirm = useConfirm();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");

  function startEdit(ordem) {
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

  async function handleRemove(ordem) {
    const ok = await confirm({
      title: "Remover ordem de produção?",
      message: `A ordem de ${ordem.peca} (lote ${ordem.lote}) será removida. Essa ação não pode ser desfeita.`,
    });
    if (ok) onRemove(ordem.id);
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <ClipboardList size={16} color="var(--accent-2)" /> Ordem de produção de hoje
      </h2>
      <p className="ptk-sub" style={{ marginTop: "-6px", marginBottom: "16px" }}>
        A coluna "Produzido" é abatida automaticamente pelos lançamentos da mesma peça (o lote pode ser diferente).
      </p>

      {ordens.length === 0 ? (
        <div className="ptk-empty">Nenhuma ordem registrada ainda. Adicione a primeira acima.</div>
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th></th>
                <th>Turno</th>
                <th>Peça</th>
                <th>Cliente</th>
                <th>Composição</th>
                <th>Embalagem</th>
                <th>Lote</th>
                <th>Meta</th>
                <th>Produzido</th>
                <th>Saída</th>
                <th>Qtde em processo</th>
                <th>Registrada em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((o) => {
                const isEditing = editingId === o.id;

                if (isEditing) {
                  const pecaCatalogo = buscarNoCatalogo(editForm.peca, catalogoPecas);
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
                        <TurnoBadge turno={o.turno} />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.peca}
                          onChange={(ev) => updateEditField("peca", ev.target.value.toUpperCase())}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {pecaCatalogo?.cliente || "—"}
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {pecaCatalogo?.composicao || "—"}
                      </td>
                      <td>
                        <EmbalagemInfo pecaCatalogo={pecaCatalogo} />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          value={editForm.lote}
                          onChange={(ev) => updateEditField("lote", ev.target.value.toUpperCase())}
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
                        {o.quantidadeProduzida}
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="time"
                          value={editForm.horarioSaida}
                          onChange={(ev) => updateEditField("horarioSaida", ev.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="ptk-input ptk-input-cell"
                          type="number"
                          min="0"
                          style={{ width: "80px" }}
                          value={editForm.quantidadeEmProcesso}
                          onChange={(ev) => updateEditField("quantidadeEmProcesso", ev.target.value)}
                        />
                      </td>
                      <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                        {formatDateNumeric(o.data)}
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

                const status = getStatusOrdem(o);
                const pecaCatalogo = buscarNoCatalogo(o.peca, catalogoPecas);

                return (
                  <tr key={o.id}>
                    <td>
                      {o.prioridade && (
                        <span className="ptk-priority-icon" title="Prioridade">
                          <Star size={15} fill="currentColor" />
                        </span>
                      )}
                    </td>
                    <td>
                      <TurnoBadge turno={o.turno} />
                    </td>
                    <td className="ptk-mono">{o.peca}</td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                      {pecaCatalogo?.cliente || "—"}
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                      {pecaCatalogo?.composicao || "—"}
                    </td>
                    <td>
                      <EmbalagemInfo pecaCatalogo={pecaCatalogo} />
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{o.lote}</td>
                    <td className="ptk-mono">{o.quantidade}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className="ptk-mono" style={{ color: status === "pendente" ? "var(--muted)" : "var(--text)" }}>
                          {o.quantidadeProduzida}/{o.quantidade}
                        </span>
                        <StatusBadge ordem={o} />
                      </div>
                    </td>
                    <td className="ptk-mono" style={{ color: o.horarioSaida ? "var(--text)" : "var(--muted)" }}>
                      {o.horarioSaida || "—"}
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                      {o.quantidadeEmProcesso !== null ? o.quantidadeEmProcesso : "—"}
                    </td>
                    <td className="ptk-mono" style={{ color: "var(--muted)" }}>{formatDateNumeric(o.data)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="ptk-remove" onClick={() => startEdit(o)} aria-label="Editar ordem">
                          <Pencil size={15} />
                        </button>
                        <button className="ptk-remove" onClick={() => handleRemove(o)} aria-label="Remover ordem">
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
