// =====================================================
//  Tela lateral - Trilo (Pedidos Entregues)
//  Depende do arquivo pedidos.js (carregado antes no HTML)
// =====================================================

// Para onde cada botão leva
const TELA_INICIAL = "telaInicial.html";
const TELA_CADASTRO = "telaCadastroNovoItem.html";
const TELA_TODOS_PEDIDOS = "telaTodosPedidos.html";

// Quantos pedidos entregues aparecem aqui (o resto fica em "Ver todos pedidos")
const QTD_RECENTES = 10;

const painel = document.getElementById("painel");
const cortina = document.getElementById("cortina");
const botaoMenu = document.getElementById("botaoMenu");
const botaoCadastrar = document.getElementById("botaoCadastrar");
const botaoHistorico = document.getElementById("botaoHistorico");
const listaEntregues = document.getElementById("listaEntregues");
const logo = document.getElementById("logo");

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

// ---------- Voltar para a tela inicial (3 pontinhos, clique fora ou Esc) ----------
function voltar() {
  painel.classList.add("saindo");
  setTimeout(() => {
    window.location.href = TELA_INICIAL;
  }, 280);
}

botaoMenu.addEventListener("click", voltar);
cortina.addEventListener("click", voltar);
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") voltar();
});

// ---------- Cadastrar ----------
botaoCadastrar.addEventListener("click", () => {
  window.location.href = TELA_CADASTRO;
});

// ---------- Ver todos pedidos ----------
botaoHistorico.addEventListener("click", () => {
  window.location.href = TELA_TODOS_PEDIDOS;
});

// ---------- Lista de pedidos entregues ----------
function criarCartao(pedido) {
  const item = document.createElement("li");
  item.className = "entregue-card";

  const numero = document.createElement("span");
  numero.className = "entregue-numero";
  numero.textContent = "Pedido #" + pedido.numero;

  const descricao = document.createElement("span");
  descricao.className = "entregue-descricao";
  descricao.textContent = pedido.descricao;

  const hora = document.createElement("span");
  hora.className = "entregue-hora";
  hora.textContent = "Entregue em " + Pedidos.formatarDataHora(pedido.entregueEm);

  item.append(numero, descricao, hora);
  return item;
}

function desenharLista() {
  // Mais recentes primeiro
  const entregues = Pedidos.listar("entregue").sort((a, b) => b.entregueEm - a.entregueEm);

  listaEntregues.innerHTML = "";

  if (entregues.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "entregues-vazio";
    vazio.textContent = "Nenhum pedido entregue ainda";
    listaEntregues.appendChild(vazio);
    return;
  }

  entregues.slice(0, QTD_RECENTES).forEach((pedido) => {
    listaEntregues.appendChild(criarCartao(pedido));
  });
}

// ---------- Inicialização ----------
desenharLista();

// Se um pedido for entregue em outra aba, a lista se atualiza
window.addEventListener("storage", desenharLista);
