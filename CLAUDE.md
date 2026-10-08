# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Site institucional estático da FS Consultoria Empresarial: HTML, CSS e JavaScript puros, sem frameworks, sem `package.json`, sem etapa de build, sem lint e sem testes. Publicado no GitHub Pages direto da branch `main`.

Para visualizar: abrir `index.html` no navegador ou servir a pasta com qualquer servidor estático (ex.: `python -m http.server`).

## Arquitetura

- **Página única**: todo o conteúdo está em `index.html`, dividido em `<section>`s com `id` (`inicio`, `sobre`, `servicos`, `faq`, `contato`) que servem de âncoras para o menu.
- **`js/script.js`**: comportamentos da página, acoplados a classes/ids do HTML — cabeçalho ao rolar, menu mobile (`#menu`, `#menu-alternador`), acordeão do FAQ (`.faq-item`/`.faq-pergunta`/`.faq-resposta`), animação de entrada (elementos com `.revelar` ou `.servico-card` recebem `.visivel` via `IntersectionObserver`), ano no rodapé (`#ano-atual`). O formulário `#formulario-contato` envia via `fetch` para o Formspree (endereço no `action` do `<form>`), que encaminha a mensagem ao e-mail da empresa; o resultado aparece em `#form-status`, e o campo escondido `_gotcha` barra robôs.
- **`js/chat.js`**: widget do assistente de vendas, autocontido (IIFE). Cria o botão e a janela via DOM, sem marcação no HTML. Faz POST em JSON para `ASSISTENTE_URL_BACKEND` (um Cloudflare Worker cujo código **não está neste repositório**) com `{ messages: [{ role, content }] }` e lê o texto de `dados.resposta` (com fallback para `reply`/`mensagem`). Em erro ou URL vazia, mostra mensagem direcionando ao WhatsApp. Estilos em `css/chat.css`.
- **`css/style.css`**: identidade visual definida por variáveis em `:root` (azul-marinho + dourado, `--raio`, `--sombra`, `--transicao`); use-as em vez de cores fixas. O nome da marca no texto usa `<span class="marca-nome">` (renderizado em maiúsculas via CSS). Fonte de títulos: Cinzel (Google Fonts).

## Convenções

- Código, nomes de classes/variáveis e comentários em português do Brasil.
- Todos os caminhos devem ser **relativos** (`css/style.css`, `img/logo.svg`) para o site funcionar em subcaminho do GitHub Pages.
- Imagens usadas pelo site ficam em `img/`. Os arquivos `image-*.jpeg`, `.docx` e `.pdf` na raiz são material de origem/referência, não são referenciados pelo HTML.
- Dados de contato (WhatsApp `5519997485355`, e-mail) aparecem repetidos em `index.html`, `js/script.js` e `js/chat.js` — ao alterar, atualize todos.
- Não inventar conteúdo: onde faltam dados reais (números, depoimentos etc.), usar o marcador `[PREENCHER]`.
