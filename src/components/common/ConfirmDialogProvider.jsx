import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmContext = createContext(null);

/**
 * Provedor global de confirmação. Envolve o app inteiro e expõe o hook
 * `useConfirm()`, que abre uma caixinha de "tem certeza?" e devolve uma
 * Promise<boolean> — assim qualquer botão de excluir (peça, lançamento,
 * sobra, parada, ordem...) pode confirmar antes de agir, sem precisar
 * duplicar um modal em cada tela.
 */
export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { title, message, confirmLabel }
  const resolveRef = useRef(null);

  const confirm = useCallback((options) => {
    const { title = "Tem certeza?", message = "Essa ação não pode ser desfeita.", confirmLabel = "Excluir" } =
      typeof options === "string" ? { message: options } : options || {};

    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ title, message, confirmLabel });
    });
  }, []);

  function handleChoice(value) {
    setDialog(null);
    if (resolveRef.current) {
      resolveRef.current(value);
      resolveRef.current = null;
    }
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {dialog && (
        <div className="ptk-modal-overlay" onClick={() => handleChoice(false)}>
          <div className="ptk-modal" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="ptk-modal-icon">
              <AlertTriangle size={20} color="var(--danger)" />
            </div>
            <h3 className="ptk-modal-title">{dialog.title}</h3>
            <p className="ptk-modal-message">{dialog.message}</p>
            <div className="ptk-modal-actions">
              <button className="ptk-btn-secondary" onClick={() => handleChoice(false)}>
                Cancelar
              </button>
              <button className="ptk-btn-danger" onClick={() => handleChoice(true)}>
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

/** Retorna a função `confirm(options) => Promise<boolean>`. */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm precisa estar dentro de um <ConfirmDialogProvider>.");
  return ctx;
}
