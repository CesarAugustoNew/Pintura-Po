import { useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import { Tabs } from "./components/layout/Tabs";
import { LancamentosTab } from "./components/lancamentos/LancamentosTab";
import { SobrasTab } from "./components/sobras/SobrasTab";
import { CatalogoTab } from "./components/catalogo/CatalogoTab";
import { useLancamentos } from "./hooks/useLancamentos";
import { useSobras } from "./hooks/useSobras";
import { useCatalogoPecas } from "./hooks/useCatalogoPecas";
import "./styles/theme.css";
import "./styles/catalogo.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("lancamentos");
  const today = useMemo(() => new Date(), []);

  // Os hooks de estado ficam aqui, no componente raiz, que nunca é
  // desmontado. Assim os dados de cada aba sobrevivem quando o usuário
  // navega para outra aba e volta depois.
  const lancamentos = useLancamentos();
  const sobras = useSobras();
  const catalogo = useCatalogoPecas();

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <Header today={today} />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ display: activeTab === "lancamentos" ? "contents" : "none" }}>
          <LancamentosTab {...lancamentos} />
        </div>
        <div style={{ display: activeTab === "sobras" ? "contents" : "none" }}>
          <SobrasTab {...sobras} />
        </div>
        <div style={{ display: activeTab === "catalogo" ? "contents" : "none" }}>
          <CatalogoTab {...catalogo} />
        </div>
      </div>
    </div>
  );
}
