import { Layers3, OctagonPause, PaintBucket, Truck } from "lucide-react";

const TABS = [
  { id: "lancamentos", label: "Lançamentos", icon: PaintBucket },
  { id: "ordens", label: "Ordem de Produção", icon: Truck },
  { id: "sobras", label: "Sobras", icon: Layers3 },
  { id: "paradas", label: "Paradas", icon: OctagonPause },
];

export function Tabs({ activeTab, onChange }) {
  return (
    <div className="ptk-tabs">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`ptk-tab ${activeTab === id ? "active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon size={15} /> {label}
        </button>
      ))}
    </div>
  );
}
