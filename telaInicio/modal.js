// =====================================================
//  Modal lateral - Trilo (Pedidos Entregues)
//  Guarda e lê os pedidos entregues no localStorage, no mesmo formato
//  da tela "Ver todos pedidos", então as duas telas mostram os mesmos dados.
// =====================================================
(() => {
  // Mesma chave usada pela tela "Ver todos pedidos"
  const CHAVE_STORAGE = "pedidosEntregues";

  // Guarda o momento em que você clicou em "Limpar lista" (só esconde do modal)
  const CHAVE_LIMPEZA = "modalLimpezaEm";

  // Para onde cada link leva (confira se os caminhos estão certos)
  const TELA_CADASTRO = "../telaCadastro/telaCadastro.html";
  const TELA_TODOS_PEDIDOS = "../telaPedidos/telaPedidos.html";

  // Quantos pedidos entregues aparecem aqui (o resto fica em "Ver todos pedidos")
  const QTD_RECENTES = 10;

  const botaoAbrir = document.getElementById("botaoMenu");
  const botaoFechar = document.getElementById("botaoFecharModal");
  const modal = document.getElementById("modalEntregues");
  const cortina = document.getElementById("cortina");
  const listaEntregues = document.getElementById("listaEntregues");
  const botaoLimpar = document.getElementById("botaoLimpar");

  document.querySelector(".botao-cadastrar").href = TELA_CADASTRO;
  document.querySelector(".link-historico").href = TELA_TODOS_PEDIDOS;

  // ---------- Dados: ler e salvar ----------
  // Formato: { numero: 101, itens: ["2x Coxinha", "1x Suco"], entregueEm: "2026-10-28T12:41:00.000Z" }
  function lerEntregues() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      return [];
    }
  }

  function registrarEntregue(pedido) {
    const pedidos = lerEntregues();
    pedidos.push(pedido);
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedidos));
    desenharLista();
  }

  // ---------- Abrir / fechar ----------
  function abrirModal() {
    cortina.hidden = false;
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    botaoAbrir.setAttribute("aria-expanded", "true");
    botaoFechar.focus();

    desenharLista();
  }

  function fecharModal() {
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
    botaoAbrir.setAttribute("aria-expanded", "false");
    cortina.hidden = true;
    botaoAbrir.focus();
  }

  botaoAbrir.addEventListener("click", abrirModal);
  botaoFechar.addEventListener("click", fecharModal);
  cortina.addEventListener("click", fecharModal);
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modal.classList.contains("aberto")) fecharModal();
  });

  // ---------- Lista de pedidos entregues ----------
  function formatarHora(dataTexto) {
    const data = new Date(dataTexto);
    if (isNaN(data)) return "";
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function criarCartao(pedido) {
    const item = document.createElement("li");
    item.className = "entregue-card";

    const numero = document.createElement("span");
    numero.className = "entregue-numero";
    numero.textContent = "Pedido #" + pedido.numero;

    const descricao = document.createElement("span");
    descricao.className = "entregue-descricao";
    descricao.textContent = (pedido.itens || []).join(", ");

    const hora = document.createElement("span");
    hora.className = "entregue-hora";
    const horaTexto = formatarHora(pedido.entregueEm);
    hora.textContent = horaTexto ? "Entregue às " + horaTexto : "";

    item.append(numero, descricao, hora);
    return item;
  }

  // O modal mostra só os pedidos entregues HOJE e depois do último "Limpar lista".
  // Nada é apagado: a tela "Ver todos pedidos" continua com o histórico completo.
  function entreguesVisiveis() {
    const inicioDoDia = new Date();
    inicioDoDia.setHours(0, 0, 0, 0);

    const limpezaEm = new Date(localStorage.getItem(CHAVE_LIMPEZA) || 0).getTime() || 0;
    const corte = Math.max(inicioDoDia.getTime(), limpezaEm);

    return lerEntregues().filter((pedido) => new Date(pedido.entregueEm).getTime() > corte);
  }

  function limparLista() {
    localStorage.setItem(CHAVE_LIMPEZA, new Date().toISOString());
    desenharLista();
  }

  botaoLimpar.addEventListener("click", limparLista);

  function desenharLista() {
    // Mais recentes primeiro
    const entregues = entreguesVisiveis()
      .sort((a, b) => new Date(b.entregueEm) - new Date(a.entregueEm))
      .slice(0, QTD_RECENTES);

    listaEntregues.innerHTML = "";
    botaoLimpar.hidden = entregues.length === 0;

    if (entregues.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "entregues-vazio";
      vazio.textContent = "Nenhum pedido entregue ainda";
      listaEntregues.appendChild(vazio);
      return;
    }

    entregues.forEach((pedido) => listaEntregues.appendChild(criarCartao(pedido)));
  }

  // ---------- Inicialização ----------
  desenharLista();

  // Se um pedido for entregue em outra aba, a lista se atualiza
  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE_STORAGE) desenharLista();
  });

  // Disponível para o telaInicial.js
  window.trilo = Object.assign(window.trilo || {}, {
    abrirModal,
    fecharModal,
    registrarEntregue,
  });
})();