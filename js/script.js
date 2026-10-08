// ===== Cabeçalho que reage ao scroll =====
const cabecalho = document.getElementById("cabecalho");

function atualizarCabecalho() {
  if (window.scrollY > 30) {
    cabecalho.classList.add("encolhido");
  } else {
    cabecalho.classList.remove("encolhido");
  }
}

window.addEventListener("scroll", atualizarCabecalho);
atualizarCabecalho();

// ===== Menu mobile =====
const menuAlternador = document.getElementById("menu-alternador");
const menu = document.getElementById("menu");

if (menuAlternador && menu) {
  menuAlternador.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    menuAlternador.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      menuAlternador.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== FAQ em acordeão =====
document.querySelectorAll(".faq-item").forEach((item) => {
  const pergunta = item.querySelector(".faq-pergunta");
  const resposta = item.querySelector(".faq-resposta");

  pergunta.addEventListener("click", () => {
    const jaAberto = item.classList.contains("aberto");

    document.querySelectorAll(".faq-item.aberto").forEach((outro) => {
      if (outro !== item) {
        outro.classList.remove("aberto");
        outro.querySelector(".faq-resposta").style.maxHeight = null;
      }
    });

    if (jaAberto) {
      item.classList.remove("aberto");
      resposta.style.maxHeight = null;
    } else {
      item.classList.add("aberto");
      resposta.style.maxHeight = resposta.scrollHeight + "px";
    }
  });
});

// ===== Animações de entrada ao rolar a página =====
const elementosParaRevelar = document.querySelectorAll(".revelar, .servico-card");

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 }
);

elementosParaRevelar.forEach((elemento) => observador.observe(elemento));

// ===== Ano atual no rodapé =====
const anoAtual = document.getElementById("ano-atual");
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}

// ===== Formulário de contato (envia pelo Formspree para o e-mail da empresa) =====
const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
  const statusEnvio = document.getElementById("form-status");
  const botaoEnviar = formularioContato.querySelector('button[type="submit"]');
  const textoBotao = botaoEnviar.textContent;

  formularioContato.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const dados = new FormData(formularioContato);
    // Assunto do e-mail recebido; o campo "email" vira o "Responder para"
    dados.append("_subject", `Contato pelo site — ${nome}`);

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";
    statusEnvio.className = "form-status";
    statusEnvio.textContent = "";

    try {
      const resposta = await fetch(formularioContato.action, {
        method: "POST",
        body: dados,
        headers: { Accept: "application/json" },
      });

      if (!resposta.ok) throw new Error("Resposta HTTP " + resposta.status);

      formularioContato.reset();
      statusEnvio.classList.add("sucesso");
      statusEnvio.textContent = "Mensagem enviada! Em breve entraremos em contato.";
    } catch (erro) {
      console.error("Falha ao enviar o formulário:", erro);
      statusEnvio.classList.add("erro");
      statusEnvio.innerHTML =
        'Não foi possível enviar agora. Tente novamente ou fale pelo ' +
        '<a href="https://wa.me/5519997485355" target="_blank" rel="noopener">WhatsApp</a>.';
    } finally {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoBotao;
    }
  });
}
