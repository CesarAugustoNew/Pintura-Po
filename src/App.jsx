import { useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import { Tabs } from "./components/layout/Tabs";
import { LancamentosTab } from "./components/lancamentos/LancamentosTab";
import { SobrasTab } from "./components/sobras/SobrasTab";
import { CatalogoTab } from "./components/catalogo/CatalogoTab";
import "./styles/theme.css";
import "./styles/catalogo.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("lancamentos");
  const today = useMemo(() => new Date(), []);

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <Header today={today} />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "lancamentos" && <LancamentosTab />}
        {activeTab === "sobras" && <SobrasTab />}
        {activeTab === "catalogo" && <CatalogoTab />}
      </div>
    </div>
  );
}
