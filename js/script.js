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

// ===== Formulário de contato (abre o e-mail do visitante) =====
const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
  formularioContato.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    const assunto = encodeURIComponent(`Contato pelo site — ${nome}`);
    const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`);

    window.location.href = `mailto:felipesilvasjbv@gmail.com?subject=${assunto}&body=${corpo}`;
  });
}
