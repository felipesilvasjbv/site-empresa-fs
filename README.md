# FS Consultoria Empresarial — Site institucional

Site estático (HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build) da
FS Consultoria Empresarial.

## Estrutura

```
index.html        Página principal
css/style.css      Estilos do site
css/chat.css        Estilos do widget do assistente de vendas
js/script.js       Interações (menu, FAQ, animações, formulário)
js/chat.js          Widget do assistente de vendas (chat)
img/                Imagens usadas no site
favicon.svg          Ícone do site (aba do navegador)
apple-touch-icon.png Ícone usado pelo iOS ao adicionar o site à tela de início
```

## Como visualizar localmente

Basta abrir o arquivo `index.html` diretamente no navegador, ou servir a pasta com
qualquer servidor estático (ex.: extensão "Live Server" do VS Code).

## Publicação no GitHub Pages

Todos os caminhos usados no site são relativos (ex.: `css/style.css`, `img/logo.svg`),
então o site funciona tanto na raiz de um domínio quanto em um subcaminho de repositório
do GitHub Pages, sem ajustes adicionais.

## Assistente de vendas (chat.js)

O widget de chat já está no site (botão flutuante acima do botão do WhatsApp)
e está ligado ao back-end definido na constante `ASSISTENTE_URL_BACKEND`, no
início do arquivo `js/chat.js`
(`https://site-empresa-fs.felipesilvasjbv.workers.dev`).

O widget envia um POST em JSON no formato `{ messages: [{ role, content }] }`
(histórico completo da conversa, com `role` `"user"` ou `"assistant"`) e
espera uma resposta em JSON com um campo `resposta` contendo o texto a
exibir. Se o back-end responder em outro formato, ajuste a leitura da
resposta em `js/chat.js`.

Se `ASSISTENTE_URL_BACKEND` ficar vazio, ou se o back-end estiver fora do ar,
o widget mostra uma mensagem padrão direcionando o visitante para o
WhatsApp.

## Dados a preencher

Os textos usam `[PREENCHER]` nos pontos em que faltam informações reais (números,
depoimentos etc.) — não há dados inventados no conteúdo do site.
