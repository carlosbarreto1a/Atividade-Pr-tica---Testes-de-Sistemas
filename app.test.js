/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Suíte de Testes - Doguito PetShop', () => {
  let app;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    jest.resetModules();
    jest.useFakeTimers();
    window.alert = jest.fn();

    app = require('./app.js');
    app.resetState();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // Testes de Cliente
  describe('Testes de Cliente', () => {
    test('1. Deve permitir criar cliente com nome válido', () => {
      document.getElementById('clienteNome').value = 'João Silva';
      document.getElementById('clienteEmail').value = 'joao@email.com';
      app.criarCliente();

      expect(app.clientes.length).toBe(1);
      expect(app.clientes[0].nome).toBe('João Silva');
    });

    test('2. Não deve permitir cliente com nome vazio', () => {
      document.getElementById('clienteNome').value = '';
      document.getElementById('clienteEmail').value = 'joao@email.com';
      app.criarCliente();

      expect(app.clientes.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Nome inválido');
    });

    test('3. Deve permitir cadastrar cliente com email válido', () => {
      document.getElementById('clienteNome').value = 'Maria';
      document.getElementById('clienteEmail').value = 'maria@email.com';
      app.criarCliente();

      expect(app.clientes[0].email).toBe('maria@email.com');
    });

    test('4. Não deve permitir email inválido', () => {
      document.getElementById('clienteNome').value = 'Maria';
      document.getElementById('clienteEmail').value = 'emailinvalido.com';
      app.criarCliente();

      expect(app.clientes.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Email inválido');
    });

    test('5. Deve permitir marcar cliente como VIP', () => {
      document.getElementById('clienteNome').value = 'Carlos';
      document.getElementById('clienteEmail').value = 'carlos@vip.com';
      document.getElementById('clienteVip').checked = true;
      app.criarCliente();

      expect(app.clientes[0].vip).toBe(true);
    });
  });

  // Testes de Pet
  describe('Testes de Pet', () => {
    test('6. Deve permitir cadastrar um pet', () => {
      document.getElementById('petNome').value = 'Rex';
      document.getElementById('petTipo').value = 'Cachorro';
      document.getElementById('petIdade').value = '3';
      app.cadastrarPet();

      expect(app.pets.length).toBe(1);
    });

    test('7. Pet deve possuir nome obrigatório', () => {
      document.getElementById('petNome').value = '';
      document.getElementById('petTipo').value = 'Cachorro';
      document.getElementById('petIdade').value = '3';
      app.cadastrarPet();

      expect(app.pets.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Pet precisa de nome');
    });

    test('8. Pet deve possuir tipo (cachorro, gato, etc)', () => {
      document.getElementById('petNome').value = 'Miau';
      document.getElementById('petTipo').value = 'Gato';
      document.getElementById('petIdade').value = '2';
      app.cadastrarPet();

      expect(app.pets[0].tipo).toBe('Gato');
    });

    test('9. Pet deve possuir idade válida (número)', () => {
      document.getElementById('petNome').value = 'Thor';
      document.getElementById('petTipo').value = 'Cachorro';
      document.getElementById('petIdade').value = 'abc';
      app.cadastrarPet();

      expect(app.pets.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Idade inválida');
    });
  });

  // Testes de Produto
  describe('Testes de Produto', () => {
    test('10. Deve permitir criar produto com nome', () => {
      document.getElementById('produtoNome').value = 'Ração';
      document.getElementById('produtoPreco').value = '100';
      app.criarProduto();

      expect(app.produtos[0].nome).toBe('Ração');
    });

    test('11. Produto deve possuir preço maior que zero', () => {
      document.getElementById('produtoNome').value = 'Coleira';
      document.getElementById('produtoPreco').value = '25.00';
      app.criarProduto();

      expect(app.produtos[0].preco).toBeGreaterThan(0);
    });

    test('12. Produto não pode possuir preço negativo', () => {
      document.getElementById('produtoNome').value = 'Osso';
      document.getElementById('produtoPreco').value = '-10';
      app.criarProduto();

      expect(app.produtos.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Preço inválido');
    });

    test('13. Produto deve aparecer na lista de produtos cadastrados', () => {
      document.getElementById('produtoNome').value = 'Shampoo';
      document.getElementById('produtoPreco').value = '30';
      app.criarProduto();

      const lista = document.getElementById('listaProdutos');
      expect(lista.children.length).toBe(1);
    });
  });

  // Testes de Carrinho
  describe('Testes de Carrinho', () => {
    beforeEach(() => {
      app.produtos.push({ nome: 'Ração', preco: 120.00 });
      app.renderProdutos();
    });

    test('14. Deve permitir adicionar produto ao carrinho', () => {
      document.getElementById('produtoSelect').value = '0';
      app.adicionarCarrinho();

      expect(app.carrinho.length).toBe(1);
    });

    test('15. Deve permitir remover produto do carrinho', () => {
      document.getElementById('produtoSelect').value = '0';
      app.adicionarCarrinho();
      app.removerCarrinho();

      expect(app.carrinho.length).toBe(0);
    });

    test('16. Carrinho deve listar todos os produtos adicionados', () => {
      app.produtos.push({ nome: 'Biscoito', preco: 10.00 });
      app.renderProdutos();

      document.getElementById('produtoSelect').value = '0';
      app.adicionarCarrinho();
      document.getElementById('produtoSelect').value = '1';
      app.adicionarCarrinho();

      expect(document.getElementById('listaCarrinho').children.length).toBe(2);
    });

    test('17. Carrinho deve calcular o valor total da compra', () => {
      document.getElementById('produtoSelect').value = '0';
      app.adicionarCarrinho();

      const total = app.calcularTotal();
      expect(total).toBe(108);
    });
  });

  // Regras de Negócio
  describe('Testes de Regras de Negócio', () => {
    test('18. Compra acima de R$100 deve aplicar desconto de 10%', () => {
      app.carrinho.push({ nome: 'Arranhador', preco: 150.00 });
      const total = app.calcularTotal();

      expect(total).toBe(135);
    });

    test('19. Cliente VIP deve receber desconto de 15%', () => {
      app.carrinho.push({ nome: 'Caminha', preco: 100.00 });
      const totalVIP = app.calcularTotal(true);

      expect(totalVIP).toBe(85);
    });

    test('20. Carrinho não deve aceitar produto com preço igual a zero', () => {
      app.produtos.push({ nome: 'Amostra', preco: 0 });
      app.renderProdutos();

      document.getElementById('produtoSelect').value = '0';
      app.adicionarCarrinho();

      expect(app.carrinho.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Produto inválido ou preço zero');
    });
  });

  // Outros Testes
  describe('Outros Testes', () => {
    test('21. Carrinho vazio deve retornar total igual a 0', () => {
      const total = app.calcularTotal();
      expect(total).toBe(0);
    });

    test('22. Ao finalizar compra o carrinho deve ser limpo', () => {
      app.carrinho.push({ nome: 'Shampoo', preco: 30.00 });
      app.finalizarCompra();

      expect(app.carrinho.length).toBe(0);
    });

    test('23. O carrossel deve trocar automaticamente as imagens', () => {
      expect(app.getSlideIndex()).toBe(0);
      jest.advanceTimersByTime(4000);
      expect(app.getSlideIndex()).toBe(1);
    });

    test('24. Os botões Adicionar / Remover / Finalizar devem funcionar corretamente', () => {
      app.produtos.push({ nome: 'Coleira', preco: 40.00 });
      app.renderProdutos();

      const btnAdicionar = document.querySelector('button[onclick="adicionarCarrinho()"]');
      const btnRemover = document.querySelector('button[onclick="removerCarrinho()"]');
      const btnFinalizar = document.querySelector('button[onclick="finalizarCompra()"]');

      btnAdicionar.click();
      expect(app.carrinho.length).toBe(1);

      btnRemover.click();
      expect(app.carrinho.length).toBe(0);

      btnAdicionar.click();
      btnFinalizar.click();
      expect(app.carrinho.length).toBe(0);
    });
  });
});