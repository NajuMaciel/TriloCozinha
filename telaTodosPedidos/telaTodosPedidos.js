// =====================================================
//  Todos os pedidos entregues (histórico) - Trilo
//  Depende do arquivo pedidos.js (carregado antes no HTML)
// =====================================================

const TELA_INICIAL = "telaInicial.html";
const TELA_LATERAL = "telaLateral.html";

const listaTodos = document.getElementById("listaTodos");
const contador = document.getElementById("contador");
const botaoMenu = document.getElementById("botaoMenu");
const botaoVoltarLateral = document.getElementById("botaoVoltarLateral");
const logo = document.getElementById("logo");

// 3 pontinhos: tela inicial. Botão Voltar: tela lateral.
botaoMenu.addEventListener("click", () => {
  window.location.href = TELA_INICIAL;
});
botaoVoltarLateral.addEventListener("click", () => {
  window.location.href = TELA_LATERAL;
});

// Logo: se a imagem não carregar, mostra o texto "Trilo"
// ---------- Logo: se a imagem não carregar, mostra o texto "Trilo" ----------
function usarLogoTexto() {
  if (!logo.isConnected) return;
  const texto = document.createElement("span");
  texto.className = "logo-texto";
  texto.textContent = "Trilo";
  logo.replaceWith(texto);
}
logo.addEventListener("error", usarLogoTexto);
// Se o erro já aconteceu antes deste script rodar:
if (logo.complete && logo.naturalWidth === 0) usarLogoTexto();

function criarCartao(pedido) {
  const item = document.createElement("li");
  item.className = "todos-card";

  const numero = document.createElement("span");
  numero.className = "todos-numero";
  numero.textContent = "Pedido #" + pedido.numero;

  const descricao = document.createElement("span");
  descricao.className = "todos-descricao";
  descricao.textContent = pedido.descricao;

  const hora = document.createElement("span");
  hora.className = "todos-hora";
  hora.textContent = "Entregue em " + Pedidos.formatarDataHora(pedido.entregueEm);

  item.append(numero, descricao, hora);
  return item;
}

function desenharLista() {
  // Mais recentes primeiro
  const entregues = Pedidos.listar("entregue").sort((a, b) => b.entregueEm - a.entregueEm);

  listaTodos.innerHTML = "";
  contador.textContent =
    entregues.length === 1 ? "1 pedido entregue" : entregues.length + " pedidos entregues";

  if (entregues.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "lista-vazia";
    vazio.textContent = "Nenhum pedido entregue ainda";
    listaTodos.appendChild(vazio);
    return;
  }

  entregues.forEach((pedido) => listaTodos.appendChild(criarCartao(pedido)));
}

desenharLista();
window.addEventListener("storage", desenharLista);