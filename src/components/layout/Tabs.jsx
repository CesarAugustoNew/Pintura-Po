import { BookOpen, Layers3, PaintBucket } from "lucide-react";

const TABS = [
  { id: "lancamentos", label: "Lançamentos", icon: PaintBucket },
  { id: "sobras", label: "Sobras", icon: Layers3 },
  { id: "catalogo", label: "Cadastro de peças", icon: BookOpen },
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
