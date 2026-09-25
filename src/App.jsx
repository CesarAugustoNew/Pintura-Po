import { useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import { Tabs } from "./components/layout/Tabs";
import { TurnoSwitcher } from "./components/common/TurnoSwitcher";
import { LancamentosTab } from "./components/lancamentos/LancamentosTab";
import { OrdensTab } from "./components/ordens/OrdensTab";
import { SobrasTab } from "./components/sobras/SobrasTab";
import { ParadasTab } from "./components/paradas/ParadasTab";
import { ConfirmDialogProvider } from "./components/common/ConfirmDialogProvider";
import { LoginScreen } from "./components/auth/LoginScreen";
import { ModuleHub } from "./components/hub/ModuleHub";
import { CadastroPecasScreen } from "./components/catalogo/CadastroPecasScreen";
import { EmBreveScreen } from "./components/placeholder/EmBreveScreen";
import { useAuth } from "./context/AuthContext";
import { useLancamentos } from "./hooks/useLancamentos";
import { useOrdensProducao } from "./hooks/useOrdensProducao";
import { useSobras } from "./hooks/useSobras";
import { useCatalogoPecas } from "./hooks/useCatalogoPecas";
import { useParadas } from "./hooks/useParadas";
import { getTurnoAtual } from "./utils/turnos";
import { TURNO_TODOS } from "./constants";
import "./styles/theme.css";
import "./styles/catalogo.css";

// Módulos disponíveis a partir da tela pós-login. "pintura-po" é o
// painel de produção que já existia; "catalogo" era uma aba de dentro
// dele e virou módulo próprio; "ktl" e "gestao" ainda não têm
// funcionalidade definida.
function PinturaPoApp({ onTrocarModulo }) {
  const [activeTab, setActiveTab] = useState("lancamentos");
  const today = useMemo(() => new Date(), []);

  // O turno selecionado controla duas coisas: filtra o que aparece em
  // Lançamentos/Ordem de Produção, e é usado como padrão para novos
  // registros que não têm horário informado. Começa no turno real de
  // agora (pelo relógio do sistema), mas o usuário pode trocar pra
  // conferir outro turno a qualquer momento.
  const [turnoSelecionado, setTurnoSelecionado] = useState(() => getTurnoAtual());
  const turnoParaNovosRegistros = turnoSelecionado === TURNO_TODOS ? getTurnoAtual() : turnoSelecionado;

  // Os hooks de estado ficam aqui, no componente raiz deste módulo,
  // que não é desmontado ao trocar de aba. Assim os dados de cada aba
  // sobrevivem quando o usuário navega para outra aba e volta depois.
  const lancamentos = useLancamentos(turnoParaNovosRegistros);
  const ordens = useOrdensProducao(lancamentos.entries, turnoParaNovosRegistros);
  const sobras = useSobras();
  // O catálogo agora é seu próprio módulo, mas os outros três ainda
  // precisam da lista de peças (pra mostrar cliente/composição etc.),
  // então o hook continua sendo usado aqui também, só sem aba própria.
  const catalogo = useCatalogoPecas();
  const paradas = useParadas(turnoParaNovosRegistros);

  const mostraTurnoSwitcher = activeTab === "lancamentos" || activeTab === "ordens" || activeTab === "paradas";

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <ConfirmDialogProvider>
          <Header today={today} onTrocarModulo={onTrocarModulo} />
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
          <div style={{ display: activeTab === "paradas" ? "contents" : "none" }}>
            <ParadasTab {...paradas} turnoFiltro={turnoSelecionado} />
          </div>
        </ConfirmDialogProvider>
      </div>
    </div>
  );
}

function CadastroPecasModule({ onTrocarModulo }) {
  const catalogo = useCatalogoPecas();
  return <CadastroPecasScreen catalogo={catalogo} onTrocarModulo={onTrocarModulo} />;
}

export default function App() {
  const { isAuthenticated, initializing } = useAuth();
  const [modulo, setModulo] = useState(null);

  if (initializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (modulo === null) {
    return <ModuleHub onSelect={setModulo} />;
  }

  const voltarParaHub = () => setModulo(null);

  if (modulo === "pintura-po") {
    return <PinturaPoApp onTrocarModulo={voltarParaHub} />;
  }

  if (modulo === "catalogo") {
    return <CadastroPecasModule onTrocarModulo={voltarParaHub} />;
  }

  if (modulo === "ktl") {
    return <EmBreveScreen titulo="KTL" onTrocarModulo={voltarParaHub} />;
  }

  if (modulo === "gestao") {
    return <EmBreveScreen titulo="Gestão" onTrocarModulo={voltarParaHub} />;
  }

  return <ModuleHub onSelect={setModulo} />;
}
