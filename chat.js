(function () {
  // ============ PARTE PARA EDITAR ============
  const API = "site-empresa-fs.felipesilvasjbv.workers.dev"; // <-- troque pela URL real do seu Worker
  const TITULO = "Tire suas dúvidas";
  const SAUDACAO = "Olá! Como posso te ajudar com nossos serviços?";

  // Cada texto precisa contrastar bem com o fundo atrás dele
  const CORES = {
    principal: "#1e3a8a",           // botão redondo, botão Enviar e suas mensagens
    textoSobrePrincipal: "#ffffff", // texto em cima da cor principal
    fundo: "#ffffff",               // janela do chat e campo de digitação
    texto: "#1a1a1a",               // respostas e o que o visitante digita
    balaoResposta: "#eef1f6",       // fundo das respostas da IA
    textoApagado: "#5b6475",        // texto de exemplo no campo
    borda: "#d6dbe4",
  };
  // ============ FIM DA PARTE PARA EDITAR ============

  // Evita carregar o widget duas vezes na mesma página
  if (window.__cvWidgetCarregado) return;
  window.__cvWidgetCarregado = true;

  function iniciar() {
    const historico = [];
    const C = CORES;

    const css = document.createElement("style");
    css.textContent = `
      #cv-btn{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;
        border:2px solid ${C.textoSobrePrincipal};background:${C.principal};color:${C.textoSobrePrincipal};
        font-size:26px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);z-index:9999}
      #cv-btn:focus-visible{outline:3px solid ${C.texto};outline-offset:2px}
      #cv-box{position:fixed;bottom:90px;right:20px;width:340px;max-width:calc(100vw - 40px);
        height:460px;max-height:calc(100vh - 110px);background:${C.fundo};color:${C.texto};
        border:1px solid ${C.borda};border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);
        display:none;flex-direction:column;overflow:hidden;z-index:9999;
        font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
      #cv-box.aberto{display:flex}
      #cv-topo{background:${C.principal};color:${C.textoSobrePrincipal};padding:12px 16px;font-weight:600}
      #cv-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
      .cv-m{padding:8px 12px;border-radius:10px;max-width:85%;line-height:1.45;font-size:14px;
        white-space:pre-wrap;overflow-wrap:anywhere}
      .cv-user{background:${C.principal};color:${C.textoSobrePrincipal};align-self:flex-end}
      .cv-bot{background:${C.balaoResposta};color:${C.texto};align-self:flex-start}
      #cv-form{display:flex;border-top:1px solid ${C.borda}}
      #cv-input{flex:1;min-width:0;border:none;padding:12px;font:inherit;font-size:16px;outline:none;
        background:${C.fundo};color:${C.texto}}
      #cv-input::placeholder{color:${C.textoApagado};opacity:1}
      #cv-input:focus{box-shadow:inset 0 0 0 2px ${C.principal}}
      #cv-enviar{border:none;background:${C.principal};color:${C.textoSobrePrincipal};font:inherit;
        font-size:14px;font-weight:600;padding:0 16px;cursor:pointer}
      #cv-enviar:disabled{opacity:.6;cursor:wait}
    `;
    document.head.appendChild(css);

    document.body.insertAdjacentHTML("beforeend", `
      <button id="cv-btn" type="button" aria-label="Abrir chat" aria-expanded="false" aria-controls="cv-box">💬</button>
      <div id="cv-box" role="dialog" aria-label="Chat de atendimento">
        <div id="cv-topo"></div>
        <div id="cv-msgs" role="log" aria-live="polite"></div>
        <form id="cv-form">
          <input id="cv-input" placeholder="Digite sua pergunta..." aria-label="Digite sua pergunta" maxlength="800" autocomplete="off">
          <button id="cv-enviar" type="submit">Enviar</button>
        </form>
      </div>`);

    const btn = document.getElementById("cv-btn");
    const box = document.getElementById("cv-box");
    const msgs = document.getElementById("cv-msgs");
    const input = document.getElementById("cv-input");
    const btnEnviar = document.getElementById("cv-enviar");
    document.getElementById("cv-topo").textContent = TITULO;

    function adicionar(texto, classe) {
      const div = document.createElement("div");
      div.className = "cv-m " + classe;
      div.textContent = texto; // textContent impede que alguém injete HTML
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function alternar(abrir) {
      const aberto = typeof abrir === "boolean" ? abrir : !box.classList.contains("aberto");
      box.classList.toggle("aberto", aberto);
      btn.setAttribute("aria-expanded", String(aberto));
      btn.setAttribute("aria-label", aberto ? "Fechar chat" : "Abrir chat");
      if (aberto) {
        if (!msgs.children.length) adicionar(SAUDACAO, "cv-bot");
        input.focus();
      } else {
        btn.focus();
      }
    }

    btn.onclick = () => alternar();
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("aberto")) alternar(false);
    });

    // Últimas 20 mensagens, garantindo que a lista comece por uma mensagem do usuário
    function recorte() {
      const r = historico.slice(-20);
      while (r.length && r[0].role !== "user") r.shift();
      return r;
    }

    document.getElementById("cv-form").onsubmit = async (e) => {
      e.preventDefault();
      const texto = input.value.trim();
      if (!texto || btnEnviar.disabled) return;

      input.value = "";
      btnEnviar.disabled = true;
      adicionar(texto, "cv-user");
      historico.push({ role: "user", content: texto });
      const aguardando = adicionar("Digitando...", "cv-bot");

      const controle = new AbortController();
      const limite = setTimeout(() => controle.abort(), 30000);

      try {
        const r = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: recorte() }),
          signal: controle.signal,
        });
        const dados = await r.json();
        if (dados.resposta) {
          aguardando.textContent = dados.resposta;
          historico.push({ role: "assistant", content: dados.resposta });
        } else {
          aguardando.textContent = dados.erro || "Não consegui responder agora.";
          historico.pop();
        }
      } catch {
        aguardando.textContent = "Erro de conexão. Tente novamente.";
        historico.pop();
      } finally {
        clearTimeout(limite);
        btnEnviar.disabled = false;
        input.focus();
        msgs.scrollTop = msgs.scrollHeight;
      }
    };
  }

  // Garante que o <body> exista antes de montar o widget
  if (document.body) iniciar();
  else document.addEventListener("DOMContentLoaded", iniciar);
})();
