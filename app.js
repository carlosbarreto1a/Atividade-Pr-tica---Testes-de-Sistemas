let clientes = [];
let pets = [];
let produtos = [];
let carrinho = [];
let slideIndex = 0;

// Função para limpar o estado global entre cada teste
function resetState() {
  clientes.length = 0;
  pets.length = 0;
  produtos.length = 0;
  carrinho.length = 0;
  slideIndex = 0;
}

// CLIENTE
function criarCliente() {
  let nomeEl = document.getElementById("clienteNome");
  let emailEl = document.getElementById("clienteEmail");
  let vipEl = document.getElementById("clienteVip");

  let nome = nomeEl ? nomeEl.value.trim() : "";
  let email = emailEl ? emailEl.value.trim() : "";
  let vip = vipEl ? vipEl.checked : false;

  if (nome === "") {
    alert("Nome inválido");
    return;
  }

  if (!email.includes("@")) {
    alert("Email inválido");
    return;
  }

  clientes.push({ nome, email, vip });
  renderClientes();
}

function renderClientes() {
  let listaClientes = document.getElementById("listaClientes");
  if (!listaClientes) return;

  listaClientes.innerHTML = "";

  clientes.forEach(c => {
    let li = document.createElement("li");
    li.innerText = c.nome + " - " + c.email;
    listaClientes.appendChild(li);
  });
}

// PET
function cadastrarPet() {
  let nomeEl = document.getElementById("petNome");
  let tipoEl = document.getElementById("petTipo");
  let idadeEl = document.getElementById("petIdade");

  let nome = nomeEl ? nomeEl.value.trim() : "";
  let tipo = tipoEl ? tipoEl.value.trim() : "";
  let idadeVal = idadeEl ? idadeEl.value.trim() : "";
  let idade = parseInt(idadeVal);

  if (nome === "") {
    alert("Pet precisa de nome");
    return;
  }

  if (isNaN(idade) || idadeVal === "") {
    alert("Idade inválida");
    return;
  }

  pets.push({ nome, tipo, idade });
  renderPets();
}

function renderPets() {
  let listaPets = document.getElementById("listaPets");
  if (!listaPets) return;

  listaPets.innerHTML = "";

  pets.forEach(p => {
    let li = document.createElement("li");
    li.innerText = p.nome + " (" + p.tipo + ")";
    listaPets.appendChild(li);
  });
}

// PRODUTOS
function criarProduto() {
  let nomeEl = document.getElementById("produtoNome");
  let precoEl = document.getElementById("produtoPreco");

  let nome = nomeEl ? nomeEl.value.trim() : "";
  let precoVal = precoEl ? precoEl.value : "";
  let preco = parseFloat(precoVal);

  if (!nome) {
    alert("Produto precisa de nome");
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Preço inválido");
    return;
  }

  produtos.push({ nome, preco });
  renderProdutos();
}

function renderProdutos() {
  let listaProdutos = document.getElementById("listaProdutos");
  let produtoSelect = document.getElementById("produtoSelect");

  if (listaProdutos) listaProdutos.innerHTML = "";
  if (produtoSelect) produtoSelect.innerHTML = "";

  produtos.forEach((p, i) => {
    if (listaProdutos) {
      let li = document.createElement("li");
      li.innerText = p.nome + " - R$ " + p.preco;
      listaProdutos.appendChild(li);
    }

    if (produtoSelect) {
      let op = document.createElement("option");
      op.value = i;
      op.innerText = p.nome;
      produtoSelect.appendChild(op);
    }
  });
}

// CARRINHO
function adicionarCarrinho() {
  let produtoSelect = document.getElementById("produtoSelect");
  if (!produtoSelect) return;

  let index = produtoSelect.value;
  let p = produtos[index];

  if (!p || p.preco <= 0) {
    alert("Produto inválido ou preço zero");
    return;
  }

  carrinho.push(p);
  renderCarrinho();
}

function removerCarrinho() {
  if (carrinho.length > 0) {
    carrinho.shift();
    renderCarrinho();
  }
}

function renderCarrinho() {
  let listaCarrinho = document.getElementById("listaCarrinho");
  if (listaCarrinho) {
    listaCarrinho.innerHTML = "";

    carrinho.forEach(p => {
      let li = document.createElement("li");
      li.innerText = p.nome + " - " + p.preco;
      listaCarrinho.appendChild(li);
    });
  }

  calcularTotal();
}

// TOTAL
function calcularTotal(isVip = false) {
  let total = 0;

  carrinho.forEach(p => {
    total += p.preco;
  });

  if (total === 0) {
    let totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerText = "0";
    return 0;
  }

  let possuiVip = isVip || clientes.some(c => c.vip);

  if (possuiVip) {
    total *= 0.85; // Desconto de 15% para VIP
  } else if (total > 100) {
    total *= 0.90; // Desconto de 10% para total > 100
  }

  let totalFormatted = total.toFixed(2);
  let totalEl = document.getElementById("total");
  if (totalEl) totalEl.innerText = totalFormatted;

  return parseFloat(totalFormatted);
}

// FINALIZAR
function finalizarCompra() {
  let total = calcularTotal();
  alert("Compra finalizada: " + total);

  carrinho.length = 0;
  renderCarrinho();
}

// CARROSSEL
function nextSlide() {
  slideIndex++;
  updateSlide();
}

function prevSlide() {
  slideIndex--;
  updateSlide();
}

function updateSlide() {
  const slides = document.querySelector(".slides");
  const total = document.querySelectorAll(".slide").length;

  if (!slides || total === 0) return;

  if (slideIndex >= total) slideIndex = 0;
  if (slideIndex < 0) slideIndex = total - 1;

  slides.style.transform = "translateX(-" + slideIndex * 100 + "%)";
}

function getSlideIndex() {
  return slideIndex;
}

// Registra funções no escopo global da janela para manipular eventos inline (onclick)
if (typeof window !== "undefined") {
  window.criarCliente = criarCliente;
  window.cadastrarPet = cadastrarPet;
  window.criarProduto = criarProduto;
  window.adicionarCarrinho = adicionarCarrinho;
  window.removerCarrinho = removerCarrinho;
  window.finalizarCompra = finalizarCompra;

  setInterval(nextSlide, 4000);
}

// Exportação dos módulos para o Jest
if (typeof module !== "undefined") {
  module.exports = {
    clientes,
    pets,
    produtos,
    carrinho,
    resetState,
    criarCliente,
    renderClientes,
    cadastrarPet,
    renderPets,
    criarProduto,
    renderProdutos,
    adicionarCarrinho,
    removerCarrinho,
    renderCarrinho,
    calcularTotal,
    finalizarCompra,
    nextSlide,
    prevSlide,
    updateSlide,
    getSlideIndex
  };
}