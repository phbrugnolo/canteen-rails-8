/**
 * CartManager - Gerencia o carrinho de compras
 */
export class CartManager {
  constructor() {
    this.selectedProducts = [];
    this.container = document.getElementById("cart");
    this.totalPriceInput = null;
    this.cartInput = null;
  }

  /**
   * Inicializa o gerenciador do carrinho
   */
  initialize() {
    this.totalPriceInput = document.getElementById("sale_total_price");
    this.cartInput = document.getElementById("sale_cart");
    this.render();
  }

  /**
   * Adiciona um produto ao carrinho
   * @param {Object} product - Produto a ser adicionado
   */
  addProduct(product) {
    const existingProduct = this.selectedProducts.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      product.quantity = 1;
      this.selectedProducts.push(product);
    }

    this.update();
  }

  /**
   * Remove um produto do carrinho
   * @param {number} index - Índice do produto no array
   */
  removeProduct(index) {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
      this.update();
    }
  }

  /**
   * Adiciona uma unidade de um produto
   * @param {number} index - Índice do produto no array
   */
  addItem(index) {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts[index].quantity++;
      this.update();
    }
  }

  /**
   * Remove uma unidade de um produto
   * @param {number} index - Índice do produto no array
   */
  removeItem(index) {
    if (index >= 0 && index < this.selectedProducts.length) {
      const product = this.selectedProducts[index];
      if (product.quantity <= 1) {
        this.removeProduct(index);
      } else {
        product.quantity--;
        this.update();
      }
    }
  }

  /**
   * Calcula o valor total do carrinho
   * @returns {number} Valor total
   */
  calculateTotal() {
    return this.selectedProducts.reduce((total, product) => {
      if (typeof product.quantity === "number" && typeof product.price === "number") {
        return total + (product.quantity * product.price);
      }
      return total;
    }, 0);
  }

  /**
   * Atualiza a exibição do carrinho
   */
  update() {
    this.render();
    this.updateTotalPrice();
    this.updateCartData();
  }

  /**
   * Renderiza o carrinho
   */
  render() {
    if (!this.container) return;

    const cartRows = this.selectedProducts.map((product, index) => {
      if (!product) return '';

      const formattedPrice = parseFloat(product.price).toFixed(2);
      const subTotal = (parseFloat(product.price) * product.quantity).toFixed(2);

      return `
        <tr class="row">
          <td class="col-4">${product.name}</td>
          <td class="col-2">${product.quantity}</td>
          <td class="col-2"> R$ ${formattedPrice}</td>
          <td class="col-2"> R$ ${subTotal}</td>
          <td class="col-2 m-auto text-center">
            <button type="button" class="btn btn-primary" data-action="add" data-index="${index}">
              <i class="bi bi-plus-circle"></i>
            </button>
            <button type="button" class="btn btn-primary" data-action="remove" data-index="${index}">
              <i class="bi bi-dash-circle"></i>
            </button>
            <button type="button" class="btn btn-danger" data-action="delete" data-index="${index}">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.container.innerHTML = `
      <table class="table table-bordered table-hover table-sm my-4 m-auto">
        <thead>
          <tr class="row">
            <th class="col-4 text-center">Produto</th>
            <th class="col-2 text-center">Quantidade</th>
            <th class="col-2 text-center">Preço unitário</th>
            <th class="col-2 text-center">Subtotal</th>
            <th class="col-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          ${cartRows}
        </tbody>
      </table>
    `;

    this.bindEvents();
  }

  /**
   * Vincula eventos aos botões do carrinho
   */
  bindEvents() {
    this.container.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const index = parseInt(button.dataset.index);

      switch (action) {
        case 'add':
          this.addItem(index);
          break;
        case 'remove':
          this.removeItem(index);
          break;
        case 'delete':
          this.removeProduct(index);
          break;
      }
    });
  }

  /**
   * Atualiza o campo de preço total
   */
  updateTotalPrice() {
    if (this.totalPriceInput) {
      this.totalPriceInput.value = this.calculateTotal().toFixed(2);
    }
  }

  /**
   * Atualiza o campo de dados do carrinho
   */
  updateCartData() {
    if (this.cartInput) {
      const cartData = this.selectedProducts.map(product => ({
        name: product.name,
        price: product.price,
        id: product.id,
        quantity: product.quantity
      }));
      this.cartInput.value = JSON.stringify(cartData);
    }
  }

  /**
   * Limpa o carrinho
   */
  clear() {
    this.selectedProducts = [];
    this.update();
  }

  /**
   * Verifica se o carrinho está vazio
   * @returns {boolean}
   */
  isEmpty() {
    return this.selectedProducts.length === 0;
  }
}
