# Barras & Lotes — Setor de Pintura · Controle de Barras e Embalagem

App para o setor de pintura registrar os lançamentos diários de peças
(peça, lote, horário de início, quantidade por barra, barra inicial/final),
controlar sobras, cadastrar o catálogo de peças com a embalagem de cada uma
(caixa e quantidade) e acompanhar paradas de produção — tudo em uma página só,
sem precisar de backend.


**Lançamentos** — topo da aba, com a foto da unidade Grupo Delga e o formulário de novo lançamento:

<p align="center">
  <img src="docs/screenshots/lancamentos-topo.png" alt="Aba Lançamentos — cabeçalho, abas e novo lançamento" width="850" />
</p>

Tabela de lançamentos do dia:

<p align="center">
  <img src="docs/screenshots/lancamentos-tabela.png" alt="Tabela de lançamentos de hoje" width="850" />
</p>

Resumo do dia (com exportação para Excel) e embalagem sugerida por peça:

<p align="center">
  <img src="docs/screenshots/resumo-embalagem.png" alt="Resumo do dia e painel de embalagem" width="850" />
</p>

Quando uma peça lançada ainda não tem embalagem cadastrada no catálogo, o painel avisa:

<p align="center">
  <img src="docs/screenshots/embalagem-nao-cadastrada.png" alt="Aviso de peça sem embalagem cadastrada" width="850" />
</p>

**Cadastro de peças** — formulário com foto, descrição e embalagem (caixa + quantidade):

<p align="center">
  <img src="docs/screenshots/cadastro-peca.png" alt="Formulário de cadastro de peça com embalagem" width="850" />
</p>

Grade de peças já cadastradas, com a embalagem visível em cada card:

<p align="center">
  <img src="docs/screenshots/pecas-cadastradas.png" alt="Grade de peças cadastradas" width="850" />
</p>

**Paradas** — registro de motivo, início e fim, com duração calculada automaticamente:

<p align="center">
  <img src="docs/screenshots/paradas.png" alt="Aba Paradas — registro e resumo de paradas de produção" width="850" />
</p>

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

## Funcionalidades

- **Lançamentos**: registra peça, lote, horário de início, quantidade por
  barra e o intervalo de barras usado (1 até 49 — o ciclo reinicia sozinho
  assim que a embalagem retira as peças da barra). Calcula automaticamente
  quantas barras foram usadas e o total de peças, inclusive quando a última
  barra não fecha (quantidade parcial).
- **Sobras**: controle separado para peças que sobraram sem virar lançamento.
- **Cadastro de peças**: catálogo com foto, descrição e a embalagem de cada
  peça (em qual caixa e quantos por caixa ela deve ser embalada), com busca
  por código ou descrição.
- **Embalagem**: nas abas de Lançamentos e Sobras, um painel busca
  automaticamente no catálogo a caixa e a quantidade cadastradas para cada
  peça do dia — e avisa quando uma peça lançada ainda não tem embalagem
  cadastrada.
- **Paradas**: registra motivo, horário de início e fim de cada parada de
  produção; a duração é calculada automaticamente, com um resumo do tempo
  total parado no dia.
- **Exportar Excel**: no resumo do dia, um botão gera um `.xlsx` com duas
  abas — "Lançamentos de hoje" (linha a linha) e "Resumo do dia" (totais e
  soma por modelo) — pronto para baixar direto do navegador.

## Estrutura do projeto

```
public/
└── delga-fabrica.png             # imagem da unidade, usada no topo de Lançamentos

src/
├── main.jsx                      # ponto de entrada do React
├── App.jsx                       # componente raiz, controla a aba ativa
├── constants.js                  # constantes compartilhadas (furos e total de barras)
├── utils/
│   ├── date.js                   # formatação de data em pt-BR
│   ├── barras.js                 # sequência de barras usadas (ciclo 1–49)
│   ├── validarLancamento.js      # validação e cálculo de um lançamento
│   ├── paradas.js                # cálculo e formatação de duração das paradas
│   └── exportExcel.js            # geração do .xlsx (lançamentos + resumo do dia)
├── hooks/
│   ├── useLancamentos.js         # lógica de negócio dos lançamentos (validação, totais)
│   ├── useSobras.js              # lógica de negócio das sobras
│   ├── useCatalogoPecas.js       # cadastro/busca de peças + embalagem
│   └── useParadas.js             # cadastro e cálculo de duração das paradas
├── components/
│   ├── layout/
│   │   ├── Header.jsx            # título, "setor de pintura" e data do dia
│   │   └── Tabs.jsx              # navegação entre Lançamentos, Sobras, Cadastro e Paradas
│   ├── common/
│   │   ├── BarPegs.jsx           # bolinhas que representam os furos ocupados
│   │   ├── HeroBar.jsx           # imagem da unidade Grupo Delga no topo de Lançamentos
│   │   └── EmbalagemPanel.jsx    # painel de embalagem (consulta o catálogo por código)
│   ├── lancamentos/
│   │   ├── LancamentosTab.jsx        # orquestra a aba (usa useLancamentos)
│   │   ├── NovoLancamentoForm.jsx    # formulário de novo lançamento (com horário de início)
│   │   ├── LancamentosTable.jsx      # tabela dos lançamentos do dia
│   │   └── ResumoDia.jsx             # totais, soma por modelo e botão "Exportar Excel"
│   ├── sobras/
│   │   ├── SobrasTab.jsx             # orquestra a aba (usa useSobras)
│   │   ├── NovoSobraForm.jsx         # formulário de nova sobra
│   │   ├── SobrasTable.jsx           # tabela de sobras registradas
│   │   └── ResumoSobras.jsx          # totais de sobras
│   ├── catalogo/
│   │   ├── CatalogoTab.jsx           # orquestra a aba (usa useCatalogoPecas)
│   │   ├── CadastrarPecaForm.jsx     # formulário com upload de imagem + embalagem
│   │   ├── PecasGrid.jsx             # busca + grade de cards
│   │   └── PecaCard.jsx              # card individual de uma peça (com embalagem)
│   └── paradas/
│       ├── ParadasTab.jsx            # orquestra a aba (usa useParadas)
│       ├── NovoParadaForm.jsx        # formulário de nova parada
│       ├── ParadasTable.jsx          # tabela de paradas registradas
│       └── ResumoParadas.jsx         # tempo total parado e quantidade de registros
└── styles/
    ├── theme.css                 # variáveis de cor/tipografia + componentes de UI
    └── catalogo.css              # estilos específicos da aba de catálogo/embalagem
```

**Regra geral:** cada componente só cuida de UI; a lógica (validação, cálculo,
estado) fica nos hooks em `src/hooks`. Isso facilita testar e reaproveitar
sem precisar mexer no visual.

## Sobre os dados

Os dados (lançamentos, sobras, peças cadastradas e paradas) ficam apenas na
memória do navegador — ao recarregar a página, tudo é perdido. Para persistir
entre sessões, o próximo passo é conectar os hooks (`useLancamentos`,
`useSobras`, `useCatalogoPecas` e `useParadas`) a uma API/banco de dados, sem
precisar alterar os componentes visuais.

## Tecnologias

- React 18 + Vite
- lucide-react (ícones)
- xlsx / SheetJS (exportação do resumo do dia para Excel)
