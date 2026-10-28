// =====================================================
//  Tela inicial - Trilo (Em Atendimento)
// =====================================================

// Mude para true para simular pedidos chegando de tempos em tempos
const SIMULAR_CHEGADA = false;

const listaPedidos = document.getElementById("listaPedidos");
const logo = document.getElementById("logo");

let contadorPedidos = 100;

// Pedidos iniciais (exemplo). Troque pelos dados reais do seu sistema.
const pedidosIniciais = [
  "2x Hambúrguer artesanal, 1x Refrigerante",
  "1x Pizza grande de calabresa",
  "3x Pastel de queijo, 2x Suco de laranja",
  "1x Porção de batata frita, 1x Milkshake",
  "2x Açaí 500ml com granola",
];

// (O botão dos 3 pontinhos agora é controlado pelo modal.js)

// ---------- Logo: se a imagem não carregar, mostra o texto "Trilo" ----------
logo.addEventListener("error", () => {
  const texto = document.createElement("span");
  texto.className = "logo-texto";
  texto.textContent = "Trilo";
  logo.replaceWith(texto);
});

// ---------- Criação de um pedido ----------
function criarPedido(descricao) {
  contadorPedidos += 1;

  const item = document.createElement("li");
  item.className = "pedido novo";
  item.dataset.numero = contadorPedidos;
  item.dataset.descricao = descricao;

  const cabecalho = document.createElement("button");
  cabecalho.type = "button";
  cabecalho.className = "pedido-cabecalho";
  cabecalho.setAttribute("aria-expanded", "false");

  const info = document.createElement("div");
  info.className = "pedido-info";

  const numero = document.createElement("span");
  numero.className = "pedido-numero";
  numero.textContent = "Pedido #" + contadorPedidos;

  const texto = document.createElement("span");
  texto.className = "pedido-descricao";
  texto.textContent = descricao;

  info.append(numero, texto);

  cabecalho.append(info);

  const detalhes = document.createElement("div");
  detalhes.className = "pedido-detalhes";

  const botaoEntregue = document.createElement("button");
  botaoEntregue.type = "button";
  botaoEntregue.className = "botao-entregue";
  botaoEntregue.textContent = "Entregue";

  detalhes.appendChild(botaoEntregue);
  item.append(cabecalho, detalhes);

  // Expande / recolhe a caixa (só uma aberta por vez)
  cabecalho.addEventListener("click", () => alternarPedido(item));

  // Marca como entregue e remove da lista
  botaoEntregue.addEventListener("click", () => marcarEntregue(item));

  item.addEventListener("animationend", () => item.classList.remove("novo"));

  return item;
}

function alternarPedido(item) {
  const vaiAbrir = !item.classList.contains("aberto");

  listaPedidos.querySelectorAll(".pedido.aberto").forEach((outro) => {
    outro.classList.remove("aberto");
    outro.querySelector(".pedido-cabecalho").setAttribute("aria-expanded", "false");
  });

  if (vaiAbrir) {
    item.classList.add("aberto");
    item.querySelector(".pedido-cabecalho").setAttribute("aria-expanded", "true");
  }
}

function marcarEntregue(item) {
  // Registra no modal "Pedidos Entregues" (função do modal.js)
  if (window.trilo && window.trilo.registrarEntregue) {
    window.trilo.registrarEntregue({
      numero: Number(item.dataset.numero),
      itens: item.dataset.descricao.split(", "),
      entregueEm: new Date().toISOString(),
    });
  }

  item.classList.add("saindo");
  setTimeout(() => {
    item.remove();
    verificarListaVazia();
  }, 400);
}

// ---------- Lista ----------
function adicionarPedido(descricao) {
  const vazia = listaPedidos.querySelector(".lista-vazia");
  if (vazia) vazia.remove();

  listaPedidos.appendChild(criarPedido(descricao));
}

function verificarListaVazia() {
  if (!listaPedidos.querySelector(".pedido") && !listaPedidos.querySelector(".lista-vazia")) {
    const vazia = document.createElement("li");
    vazia.className = "lista-vazia";
    vazia.textContent = "Nenhum pedido em atendimento";
    listaPedidos.appendChild(vazia);
  }
}

// Deixa disponível para ser chamada de outros arquivos / integração com o back-end:
// adicionarPedido("1x Café com leite, 1x Pão de queijo");
window.adicionarPedido = adicionarPedido;

// ---------- Inicialização ----------
pedidosIniciais.forEach(adicionarPedido);

if (SIMULAR_CHEGADA) {
  const exemplos = [
    "1x Coxinha, 1x Guaraná",
    "2x Sanduíche natural",
    "1x Marmita fitness",
    "4x Brigadeiro gourmet",
  ];
  setInterval(() => {
    adicionarPedido(exemplos[Math.floor(Math.random() * exemplos.length)]);
  }, 8000);
}