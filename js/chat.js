// ===== Assistente de vendas (widget de chat) =====
// Preencha esta constante com o endereço do Worker (back-end do assistente)
// quando ele estiver pronto. Ex.: "https://agente-vendas.seu-subdominio.workers.dev"
const ASSISTENTE_URL_BACKEND = "";

const ASSISTENTE_MENSAGEM_INICIAL =
  "Olá! Sou o assistente virtual da FS Consultoria Empresarial. Como posso ajudar você hoje?";

const ASSISTENTE_MENSAGEM_INDISPONIVEL =
  "No momento não consigo responder por aqui. Fale direto com a gente pelo WhatsApp: (19) 99748-5355.";

(function () {
  const historico = [];
  let janelaAberta = false;
  let primeiraAbertura = true;

  const botao = document.createElement("button");
  botao.className = "assistente-botao";
  botao.type = "button";
  botao.setAttribute("aria-label", "Abrir assistente de vendas");
  botao.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1z"/></svg>';

  const janela = document.createElement("div");
  janela.className = "assistente-janela";
  janela.innerHTML = `
    <div class="assistente-cabecalho">
      <div>
        <strong>Assistente FS Consultoria</strong>
        <span>Normalmente responde em instantes</span>
      </div>
      <button type="button" class="assistente-fechar" aria-label="Fechar assistente">&times;</button>
    </div>
    <div class="assistente-mensagens" role="log" aria-live="polite"></div>
    <form class="assistente-formulario">
      <input type="text" placeholder="Digite sua mensagem..." aria-label="Mensagem para o assistente" autocomplete="off" />
      <button type="submit" class="assistente-enviar" aria-label="Enviar mensagem">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </form>
  `;

  document.body.appendChild(botao);
  document.body.appendChild(janela);

  const areaMensagens = janela.querySelector(".assistente-mensagens");
  const formulario = janela.querySelector(".assistente-formulario");
  const campoTexto = janela.querySelector("input");
  const botaoFechar = janela.querySelector(".assistente-fechar");

  function adicionarMensagem(texto, autor) {
    const bolha = document.createElement("div");
    bolha.className = "assistente-mensagem " + autor;
    bolha.textContent = texto;
    areaMensagens.appendChild(bolha);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
  }

  function mostrarDigitando() {
    const indicador = document.createElement("div");
    indicador.className = "assistente-digitando";
    indicador.innerHTML = "<span></span><span></span><span></span>";
    areaMensagens.appendChild(indicador);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
    return indicador;
  }

  function abrirJanela() {
    janelaAberta = true;
    janela.classList.add("aberta");
    botao.setAttribute("aria-label", "Fechar assistente de vendas");

    if (primeiraAbertura) {
      primeiraAbertura = false;
      adicionarMensagem(ASSISTENTE_MENSAGEM_INICIAL, "assistente");
    }

    campoTexto.focus();
  }

  function fecharJanela() {
    janelaAberta = false;
    janela.classList.remove("aberta");
    botao.setAttribute("aria-label", "Abrir assistente de vendas");
  }

  botao.addEventListener("click", () => {
    if (janelaAberta) {
      fecharJanela();
    } else {
      abrirJanela();
    }
  });

  botaoFechar.addEventListener("click", fecharJanela);

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const texto = campoTexto.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, "usuario");
    historico.push({ autor: "usuario", texto });
    campoTexto.value = "";

    if (!ASSISTENTE_URL_BACKEND) {
      adicionarMensagem(ASSISTENTE_MENSAGEM_INDISPONIVEL, "assistente");
      console.warn(
        "Assistente de vendas: defina ASSISTENTE_URL_BACKEND em js/chat.js com o endereço do Worker."
      );
      return;
    }

    const indicador = mostrarDigitando();

    try {
      const resposta = await fetch(ASSISTENTE_URL_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, historico: historico }),
      });

      if (!resposta.ok) throw new Error("Resposta HTTP " + resposta.status);

      const dados = await resposta.json();
      const respostaTexto = dados.resposta || dados.reply || dados.mensagem;

      indicador.remove();

      if (respostaTexto) {
        adicionarMensagem(respostaTexto, "assistente");
        historico.push({ autor: "assistente", texto: respostaTexto });
      } else {
        adicionarMensagem(ASSISTENTE_MENSAGEM_INDISPONIVEL, "assistente");
      }
    } catch (erro) {
      indicador.remove();
      adicionarMensagem(ASSISTENTE_MENSAGEM_INDISPONIVEL, "assistente");
      console.error("Assistente de vendas: falha ao contatar o back-end.", erro);
    }
  });
})();
