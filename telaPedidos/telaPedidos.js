// ===== Configurações =====
const CHAVE_STORAGE = "pedidosEntregues"; // nome em que os pedidos entregues ficam salvos
const USAR_DADOS_DE_EXEMPLO = true;       // true = mostra pedidos de exemplo enquanto não há pedidos reais

// ===== Elementos =====
const listaPedidos = document.getElementById("listaPedidos");
const botaoVoltar = document.getElementById("botaoVoltar");

// ===== Pedidos de exemplo (só para testar o visual) =====
const pedidosExemplo = [
  { numero: 1, itens: ["2x Coxinha", "1x Suco de laranja"], entregueEm: "2026-10-16T12:05:00" },
  { numero: 2, itens: ["1x Prato do dia"], entregueEm: "2026-10-16T12:12:00" },
  { numero: 3, itens: ["1x Pão de queijo", "1x Café"], entregueEm: "2026-10-16T12:20:00" },
  { numero: 4, itens: ["3x Brigadeiro"], entregueEm: "2026-10-16T12:31:00" },
  { numero: 5, itens: ["1x Lanche natural", "1x Água"], entregueEm: "2026-10-16T12:40:00" },
];

/*
  Formato de cada pedido entregue:
  {
    numero: 123,
    itens: ["2x Coxinha", "1x Suco"],
    entregueEm: "2026-10-16T12:41:00"   // data e hora da entrega
  }
*/

// ===== Ler e salvar =====
function lerPedidosSalvos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function obterPedidos() {
  const salvos = lerPedidosSalvos();
  if (salvos.length === 0 && USAR_DADOS_DE_EXEMPLO) return pedidosExemplo; //se nao tiver pedidos reais vai aparecer exemplo
  return salvos;
}

// Função utilitária para calcular o próximo número da fila (1 a 100)
function obterProximoNumeroPedido() {
  const pedidos = lerPedidosSalvos();
  if (pedidos.length === 0) return 1;

  const ultimoPedido = pedidos[pedidos.length - 1];
  const ultimoNumero = ultimoPedido.numero || 0;

  return (ultimoNumero % 100) + 1;
}

// Chame esta função quando um pedido for entregue
function adicionarPedidoEntregue(pedido) {
  const pedidos = lerPedidosSalvos();
  if (!pedido.numero) {
    pedido.numero = obterProximoNumeroPedido();
  }
  delete pedido.eExemplo;
  pedidos.push(pedido);
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedidos));
  
  // Atualiza a tela (os exemplos sumirão automaticamente)
  mostrarPedidos();
}

// ===== Montar a tela =====
function formatarHora(dataTexto) {
  const data = new Date(dataTexto);
  if (isNaN(data)) return "";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function criarCaixaPedido(pedido) {
  const caixa = document.createElement("article");
  caixa.className = "pedido";

  const info = document.createElement("div");
  info.className = "pedido-info";

  const numero = document.createElement("span");
  numero.className = "pedido-numero";
  numero.textContent = "Pedido #" + pedido.numero;

  const itens = document.createElement("span");
  itens.className = "pedido-itens";
  itens.textContent = (pedido.itens || []).join(", ");

  info.append(numero, itens);

  const hora = document.createElement("span");
  hora.className = "pedido-hora";
  hora.textContent = formatarHora(pedido.entregueEm);

  caixa.append(info, hora);
  return caixa;
}

function mostrarPedidos() {
  listaPedidos.innerHTML = "";

  // Pega os pedidos mais recentes (os últimos salvos) e mostra o mais novo primeiro
  const pedidos = obterPedidos().reverse();

  if (pedidos.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum pedido entregue ainda.";
    listaPedidos.appendChild(vazio);
    return;
  }

  pedidos.forEach((pedido) => listaPedidos.appendChild(criarCaixaPedido(pedido)));
}

// ===== Voltar =====
botaoVoltar.addEventListener("click", () => {
  window.history.back();
});

// ===== Iniciar =====
mostrarPedidos();

// Atualiza sozinho quando outra tela/aba salvar um novo pedido entregue
window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_STORAGE) mostrarPedidos();
});