# Controle de Barras — Pintura

App para registrar os lançamentos diários de peças enviadas para pintura
(peça, lote, quantidade por barra, barra inicial/final) e manter um catálogo
de peças com foto e descrição para consulta de novos funcionários.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
src/
├── main.jsx                     # ponto de entrada do React
├── App.jsx                      # componente raiz, controla a aba ativa
├── constants.js                 # constantes compartilhadas (furos por barra)
├── utils/
│   └── date.js                  # formatação de data em pt-BR
├── hooks/
│   ├── useLancamentos.js        # lógica de negócio dos lançamentos (validação, totais)
│   └── useCatalogoPecas.js      # lógica de negócio do catálogo de peças (cadastro, busca)
├── components/
│   ├── layout/
│   │   ├── Header.jsx           # título + data do dia
│   │   └── Tabs.jsx             # navegação entre as duas abas
│   ├── common/
│   │   ├── BarPegs.jsx          # bolinhas que representam os furos ocupados
│   │   └── HeroBar.jsx          # ilustração da barra com furos e arames
│   ├── lancamentos/
│   │   ├── LancamentosTab.jsx       # orquestra a aba (usa useLancamentos)
│   │   ├── NovoLancamentoForm.jsx   # formulário de novo lançamento
│   │   ├── LancamentosTable.jsx     # tabela dos lançamentos do dia
│   │   └── ResumoDia.jsx            # totais e soma por modelo
│   └── catalogo/
│       ├── CatalogoTab.jsx          # orquestra a aba (usa useCatalogoPecas)
│       ├── CadastrarPecaForm.jsx    # formulário com upload de imagem
│       ├── PecasGrid.jsx            # busca + grade de cards
│       └── PecaCard.jsx             # card individual de uma peça
└── styles/
    ├── theme.css                # variáveis de cor/tipografia + componentes de UI
    └── catalogo.css             # estilos específicos da aba de catálogo
```

**Regra geral:** cada componente só cuida de UI; a lógica (validação, cálculo,
estado) fica nos hooks em `src/hooks`. Isso facilita testar e reaproveitar
sem precisar mexer no visual.

## Sobre os dados

Os dados (lançamentos e peças cadastradas) ficam apenas na memória do
navegador — ao recarregar a página, tudo é perdido. Para persistir entre
sessões, o próximo passo é conectar os hooks (`useLancamentos` e
`useCatalogoPecas`) a uma API/banco de dados, sem precisar alterar os
componentes visuais.
