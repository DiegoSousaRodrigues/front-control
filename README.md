# Front Control

[![Build Status](https://img.shields.io/travis/com/your-username/front-control.svg?style=flat-square)](https://travis-ci.com/your-username/front-control)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Uma aplicação front-end moderna e robusta desenvolvida com Next.js para fornecer uma interface de controle rica para gerenciamento de clientes, produtos e pedidos.

## Tabela de Conteúdos

- [Sobre o Projeto](#sobre-o-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Tech Stack](#tech-stack)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas da API](#rotas-da-api)
- [Componentes Principais](#componentes-principais)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Sobre o Projeto

**Front Control** é uma aplicação front-end projetada para oferecer uma experiência de usuário intuitiva e eficiente para gerenciar clientes, produtos e pedidos. Construída com Next.js e uma stack de tecnologias modernas, enfatiza a qualidade do código, escalabilidade e performance. Provavelmente funciona como um painel de administração ou interface de configurações para um sistema maior.

## Principais Funcionalidades

- **Framework Moderno:** Construído com **Next.js**, permitindo Server-Side Rendering (SSR) e Static Site Generation (SSG).
- **Gerenciamento de Estado:** Utiliza **React Query** (`@tanstack/react-query`) para gerenciamento eficiente de estado do servidor, caching, e sincronização de dados.
- **Formulários Robustos:** Emprega **React Hook Form** para gerenciamento e validação de formulários.
- **Estilização:** Utiliza **Tailwind CSS** para estilização utilitária e **Windstitch** para criação de componentes estilizados, além de **Radix UI Themes** e componentes primitivos (`@radix-ui/themes`, `@radix-ui/react-*`) para UI acessível e personalizável.
- **Qualidade de Código:** Reforçada com **ESLint** e **Prettier** para linting e formatação de código consistentes.
- **Requisições HTTP:** Utiliza **Axios** para realizar requisições HTTP, com logging através de `axios-logger`.
- **Sistema de Eventos:** Implementa um sistema de eventos customizado (`EventEmitter`) para comunicação entre componentes, como exibição de Toasts.
- **Componentização:** Arquitetura baseada em componentes reutilizáveis (ex: `Input`, `Select`, `FormClient`, `FormProduct`, `ListScreen`, `Toast`).
- **Tipagem:** Desenvolvido com **TypeScript** para maior segurança e manutenibilidade do código.

## Tech Stack

Esta é a stack principal utilizada no projeto:

- **Framework:** [Next.js](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:**
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Windstitch](https://windstitch.dev/)
  - [Radix UI (Themes & Primitives)](https://www.radix-ui.com/)
  - [PostCSS](https://postcss.org/)
- **Gerenciamento de Estado (Server):** [React Query](https://tanstack.com/query/latest)
- **Formulários:** [React Hook Form](https://react-hook-form.com/)
- **Requisições HTTP:** [Axios](https://axios-http.com/)
- **Linting/Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Ícones:** [React Icons](https://react-icons.github.io/react-icons/)
- **Utilitários:** [lodash](https://lodash.com/)

## Começando

Siga estas instruções para obter uma cópia do projeto e executá-lo em sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em seu sistema.

- **Node.js** (versão LTS recomendada)
- **npm** ou **Yarn**
  ```sh
  npm install npm@latest -g
  # ou se preferir Yarn
  npm install --global yarn
  ```

### Instalação

1.  Clone o repositório:
    ```sh
    git clone [https://github.com/your-username/front-control.git](https://github.com/your-username/front-control.git)
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd front-control
    ```
3.  Instale as dependências:
    ```sh
    npm install
    # ou
    yarn install
    ```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

- `npm run dev` ou `yarn dev`
  Executa o aplicativo em modo de desenvolvimento. Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador. A página será recarregada se você fizer edições.

- `npm run build` ou `yarn build`
  Compila o aplicativo para produção na pasta `.next`. Ele agrupa corretamente o aplicativo em modo de produção e otimiza a compilação para o melhor desempenho.

- `npm start` ou `yarn start`
  Inicia o aplicativo em modo de produção (requer `build` prévio).

- `npm run lint` ou `yarn lint`
  Executa o ESLint para encontrar e corrigir problemas no seu código TypeScript/JavaScript.

- `npm run format` ou `yarn format`
  Executa o Prettier para formatar o código em todo o projeto.

## Rotas da API

O projeto utiliza as API Routes do Next.js para criar endpoints backend simples dentro do próprio front-end. As rotas estão localizadas em `pages/api/`:

- **Clientes (`/api/client`)**
  - `POST /`: Criar novo cliente.
  - `PUT /`: Atualizar cliente existente (ID fixo como '1' no código atual).
  - `GET /list`: Obter lista de todos os clientes.
  - `POST /status?id={id}&status={status}`: Ativar/desativar um cliente.
- **Produtos (`/api/product`)**
  - `POST /`: Criar novo produto.
  - `PUT /`: Atualizar produto existente (ID fixo como '1' no código atual).
  - `GET /list`: Obter lista de todos os produtos.
  - `POST /status?id={id}&status={status}`: Ativar/desativar um produto.
- **Pedidos (`/api/order`)**
  - `GET /list`: Obter lista de todos os pedidos.
  - _(Rotas POST/PUT para pedidos parecem estar definidas nos services mas não nas API routes)_

Estas rotas internas geralmente fazem proxy para uma API externa configurada em `src/utils/api.ts` (`apiControl`), que aponta para `http://localhost:3001/`.

## Componentes Principais

- **`MainLayout`**: Define a estrutura visual principal da aplicação, incluindo a barra lateral de navegação com um acordeão.
- **`Container`**: Um wrapper para o conteúdo principal da página.
- **`FormClient`, `FormProduct`, `FormOrder`**: Componentes de formulário para adicionar/editar clientes, produtos e pedidos, utilizando `react-hook-form` e componentes `Input` e `Select` customizados.
- **`Input`**: Componente de input reutilizável com suporte a máscaras (CEP, CPF, moeda, data, etc.).
- **`Select`**: Componente de seleção customizado, baseado no Radix UI Select.
- **`ListScreen`**: Componente genérico para exibir listas de dados, incluindo cabeçalho com título e opções de layout (lista/card). Utiliza tabelas baseadas em `@radix-ui/themes`.
  - **`TableClient`, `TableProduct`, `TableOrder`**: Componentes específicos para renderizar as tabelas de clientes, produtos e pedidos dentro do `ListScreen`.
- **`Toast`**: Sistema de notificações (toasts) usando `@radix-ui/react-toast` e o `EventsContext` para disparo.
- **`Message`**: Componente simples para exibir mensagens de erro ou informativas.

## Contribuição

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do Projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit suas Mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request
