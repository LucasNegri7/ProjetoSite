document.addEventListener("DOMContentLoaded", () => {
  iniciarMenuMobile();
  iniciarValidacaoFormulario();
});

function iniciarMenuMobile() {
  const botao = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (!botao || !menu) return;

  const abrir = () => {
    menu.classList.add("aberto");
    botao.setAttribute("aria-expanded", "true");
    botao.setAttribute("aria-label", "Fechar menu");
    botao.textContent = "✕";
  };

  const fechar = () => {
    menu.classList.remove("aberto");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    botao.textContent = "☰";
  };

  botao.addEventListener("click", () => {
    menu.classList.contains("aberto") ? fechar() : abrir();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fechar);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("aberto")) {
      fechar();
      botao.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) fechar();
  });
}

function iniciarValidacaoFormulario() {
  const form = document.getElementById("form-contato");
  if (!form) return; // outras páginas não têm formulário

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    comentarios: document.getElementById("comentarios"),
  };

  const statusForm = document.getElementById("status-form");
  const contador = document.getElementById("contador");

  const regras = {
    nome(valor) {
      if (!valor) return "Informe seu nome.";
      if (valor.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
      if (!/^[A-Za-zÀ-ÿ\s'.-]+$/.test(valor))
        return "O nome não pode conter números ou símbolos.";
      return "";
    },
    email(valor) {
      if (!valor) return "Informe seu e-mail.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor))
        return "Digite um e-mail válido, como nome@exemplo.com.";
      return "";
    },
    comentarios(valor) {
      if (!valor) return "Escreva seu comentário.";
      if (valor.length < 10)
        return "O comentário deve ter pelo menos 10 caracteres.";
      if (valor.length > 500)
        return "O comentário deve ter no máximo 500 caracteres.";
      return "";
    },
  };

  function mostrarErro(nomeCampo, mensagem) {
    const campo = campos[nomeCampo];
    const spanErro = document.getElementById(`erro-${nomeCampo}`);

    campo.classList.toggle("invalido", mensagem !== "");
    campo.classList.toggle("valido", mensagem === "");
    campo.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");

    if (spanErro) spanErro.textContent = mensagem;
  }

  function validarCampo(nomeCampo) {
    const valor = campos[nomeCampo].value.trim();
    const mensagem = regras[nomeCampo](valor);
    mostrarErro(nomeCampo, mensagem);
    return mensagem === "";
  }

  Object.keys(campos).forEach((nomeCampo) => {
    const campo = campos[nomeCampo];
    campo.addEventListener("blur", () => validarCampo(nomeCampo));
    campo.addEventListener("input", () => {
      if (campo.classList.contains("invalido")) validarCampo(nomeCampo);
    });
  });

  campos.comentarios.addEventListener("input", () => {
    if (contador) contador.textContent = `${campos.comentarios.value.length}/500`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tudoValido = Object.keys(campos).map(validarCampo).every(Boolean);

    if (!tudoValido) {
      if (statusForm) {
        statusForm.textContent = "Corrija os campos destacados e tente novamente.";
        statusForm.className = "status erro-status";
      }
      const primeiroInvalido = form.querySelector(".invalido");
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    if (statusForm) {
      statusForm.textContent = "Feedback enviado com sucesso! Obrigado.";
      statusForm.className = "status sucesso-status";
    }

    form.reset();
    Object.values(campos).forEach((campo) => {
      campo.classList.remove("valido", "invalido");
      campo.removeAttribute("aria-invalid");
    });
    if (contador) contador.textContent = "0/500";
  });
}
