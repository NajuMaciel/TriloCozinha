// ===== Elementos =====
const form = document.getElementById("formCadastro");
const categoria = document.getElementById("categoria");
const nomeItem = document.getElementById("nomeItem");
const preco = document.getElementById("preco");

const erroCategoria = document.getElementById("erroCategoria");
const erroNome = document.getElementById("erroNome");
const erroPreco = document.getElementById("erroPreco");

const botaoVoltar = document.getElementById("botaoVoltar");
const botaoCancelar = document.getElementById("botaoCancelar");
const aviso = document.getElementById("aviso");

// ===== Preço: aceita só números e uma vírgula, com 2 casas decimais =====
preco.addEventListener("input", () => {
  let valor = preco.value.replace(/[^\d,]/g, "");

  const partes = valor.split(",");
  if (partes.length > 2) {
    valor = partes[0] + "," + partes.slice(1).join("");
  }

  const [inteiro, decimal] = valor.split(",");
  preco.value = decimal !== undefined ? inteiro + "," + decimal.slice(0, 2) : inteiro;
});

// Ao sair do campo, formata como 0,00
preco.addEventListener("blur", () => {
  if (preco.value === "") return;
  const numero = parseFloat(preco.value.replace(",", "."));
  if (!isNaN(numero)) {
    preco.value = numero.toFixed(2).replace(".", ",");
  }
});

// ===== Validação =====
function marcarErro(input, spanErro, mensagem) {
  input.parentElement.classList.add("invalido");
  spanErro.textContent = mensagem;
}

function limparErro(input, spanErro) {
  input.parentElement.classList.remove("invalido");
  spanErro.textContent = "";
}

function validar() {
  let valido = true;

  limparErro(categoria, erroCategoria);
  limparErro(nomeItem, erroNome);
  limparErro(preco, erroPreco);

  if (categoria.value === "") {
    marcarErro(categoria, erroCategoria, "Selecione uma categoria.");
    valido = false;
  }

  if (nomeItem.value.trim() === "") {
    marcarErro(nomeItem, erroNome, "Digite o nome do item.");
    valido = false;
  }

  const numero = parseFloat(preco.value.replace(",", "."));
  if (preco.value === "" || isNaN(numero) || numero <= 0) {
    marcarErro(preco, erroPreco, "Digite um preço válido.");
    valido = false;
  }

  return valido;
}

// ===== Aviso =====
let temporizadorAviso;

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add("visivel");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("visivel"), 2500);
}

// ===== Limpar formulário =====
function limparFormulario() {
  form.reset();
  limparErro(categoria, erroCategoria);
  limparErro(nomeItem, erroNome);
  limparErro(preco, erroPreco);
}

// ===== Confirmar =====
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validar()) return;

  const item = {
    categoria: categoria.value,
    nome: nomeItem.value.trim(),
    preco: parseFloat(preco.value.replace(",", ".")),
  };

  // Aqui você pode enviar o item para o seu sistema (API, banco de dados, etc.)
  console.log("Item cadastrado:", item);

  mostrarAviso("Item cadastrado com sucesso!");
  limparFormulario();
});

// Remove o erro assim que a pessoa corrige o campo
categoria.addEventListener("change", () => limparErro(categoria, erroCategoria));
nomeItem.addEventListener("input", () => limparErro(nomeItem, erroNome));
preco.addEventListener("input", () => limparErro(preco, erroPreco));

// ===== Cancelar =====
botaoCancelar.addEventListener("click", limparFormulario);

// ===== Voltar =====
botaoVoltar.addEventListener("click", () => {
  window.history.back();
});