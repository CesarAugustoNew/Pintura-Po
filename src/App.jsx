import { useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import { Tabs } from "./components/layout/Tabs";
import { TurnoSwitcher } from "./components/common/TurnoSwitcher";
import { LancamentosTab } from "./components/lancamentos/LancamentosTab";
import { OrdensTab } from "./components/ordens/OrdensTab";
import { SobrasTab } from "./components/sobras/SobrasTab";
import { CatalogoTab } from "./components/catalogo/CatalogoTab";
import { ParadasTab } from "./components/paradas/ParadasTab";
import { ConfirmDialogProvider } from "./components/common/ConfirmDialogProvider";
import { useLancamentos } from "./hooks/useLancamentos";
import { useOrdensProducao } from "./hooks/useOrdensProducao";
import { useSobras } from "./hooks/useSobras";
import { useCatalogoPecas } from "./hooks/useCatalogoPecas";
import { useParadas } from "./hooks/useParadas";
import { getTurnoAtual } from "./utils/turnos";
import { TURNO_TODOS } from "./constants";
import "./styles/theme.css";
import "./styles/catalogo.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("lancamentos");
  const today = useMemo(() => new Date(), []);

  // O turno selecionado controla duas coisas: filtra o que aparece em
  // Lançamentos/Ordem de Produção, e é usado como padrão para novos
  // registros que não têm horário informado. Começa no turno real de
  // agora (pelo relógio do sistema), mas o usuário pode trocar pra
  // conferir outro turno a qualquer momento.
  const [turnoSelecionado, setTurnoSelecionado] = useState(() => getTurnoAtual());
  const turnoParaNovosRegistros = turnoSelecionado === TURNO_TODOS ? getTurnoAtual() : turnoSelecionado;

  // Os hooks de estado ficam aqui, no componente raiz, que nunca é
  // desmontado. Assim os dados de cada aba sobrevivem quando o usuário
  // navega para outra aba e volta depois.
  const lancamentos = useLancamentos(turnoParaNovosRegistros);
  const ordens = useOrdensProducao(lancamentos.entries, turnoParaNovosRegistros);
  const sobras = useSobras();
  const catalogo = useCatalogoPecas();
  const paradas = useParadas(turnoParaNovosRegistros);

  const mostraTurnoSwitcher = activeTab === "lancamentos" || activeTab === "ordens" || activeTab === "paradas";

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <ConfirmDialogProvider>
          <Header today={today} />
          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {mostraTurnoSwitcher && (
            <TurnoSwitcher turnoSelecionado={turnoSelecionado} onChange={setTurnoSelecionado} />
          )}

          <div style={{ display: activeTab === "lancamentos" ? "contents" : "none" }}>
            <LancamentosTab {...lancamentos} catalogoPecas={catalogo.pecas} turnoFiltro={turnoSelecionado} />
          </div>
          <div style={{ display: activeTab === "ordens" ? "contents" : "none" }}>
            <OrdensTab {...ordens} turnoFiltro={turnoSelecionado} catalogoPecas={catalogo.pecas} />
          </div>
          <div style={{ display: activeTab === "sobras" ? "contents" : "none" }}>
            <SobrasTab {...sobras} catalogoPecas={catalogo.pecas} />
          </div>
          <div style={{ display: activeTab === "catalogo" ? "contents" : "none" }}>
            <CatalogoTab {...catalogo} />
          </div>
          <div style={{ display: activeTab === "paradas" ? "contents" : "none" }}>
            <ParadasTab {...paradas} turnoFiltro={turnoSelecionado} />
          </div>
        </ConfirmDialogProvider>
      </div>
    </div>
  );
}
