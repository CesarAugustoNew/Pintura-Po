import { useMemo } from "react";
import { Header } from "../layout/Header";
import { CatalogoTab } from "./CatalogoTab";

export function CadastroPecasScreen({ catalogo, onTrocarModulo }) {
  const today = useMemo(() => new Date(), []);

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <Header
          today={today}
          subtitulo="Catálogo de peças: cadastro, embalagem, cliente e composição."
          onTrocarModulo={onTrocarModulo}
        />
        <CatalogoTab {...catalogo} />
      </div>
    </div>
  );
}
