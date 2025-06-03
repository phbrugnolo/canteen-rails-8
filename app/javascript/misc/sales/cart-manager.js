export class CartManager {
  constructor() {
    this.selectedProducts = [];
    this.container = document.getElementById("cart");
    this.totalPriceInput = null;
    this.cartInput = null;
    this.boundEventHandler = null;
  }

  initialize() {
    this.totalPriceInput = document.getElementById("sale_total_price");
    this.cartInput = document.getElementById("sale_cart");
    this.setupEventHandler();
    this.render();
  }

  setupEventHandler() {
    // Remove listener anterior se existir
    if (this.boundEventHandler && this.container) {
      this.container.removeEventListener('click', this.boundEventHandler);
    }

    // Criar novo handler bound
    this.boundEventHandler = this.handleCartAction.bind(this);

    if (this.container) {
      this.container.addEventListener('click', this.boundEventHandler);
    }
  }

  addProduct(product) {
    const existingProduct = this.selectedProducts.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      // Garantir que price seja número
      const productCopy = {
        ...product,
        quantity: 1,
        price: parseFloat(product.price)
      };
      this.selectedProducts.push(productCopy);
    }

    this.update();
  }

  removeProduct(productId) {
    const index = this.selectedProducts.findIndex(p => p.id === productId);
    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
      this.update();
    }
  }

  addItem(productId) {
    const product = this.selectedProducts.find(p => p.id === productId);
    if (product) {
      product.quantity++;
      this.update();
    }
  }

  removeItem(productId) {
    const product = this.selectedProducts.find(p => p.id === productId);
    if (product) {
      if (product.quantity <= 1) {
        this.removeProduct(productId);
      } else {
        product.quantity--;
        this.update();
      }
    }
  }

  calculateTotal() {
    return this.selectedProducts.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      return total + (quantity * price);
    }, 0);
  }

  update() {
    this.render();
    this.updateTotalPrice();
    this.updateCartData();
  }

  render() {
    if (!this.container) return;

    const cartRows = this.selectedProducts.map((product) => {
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
            <button type="button" class="btn btn-primary btn-sm" data-action="add" data-product-id="${product.id}">
              <i class="bi bi-plus-circle"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-action="remove" data-product-id="${product.id}">
              <i class="bi bi-dash-circle"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-product-id="${product.id}">
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
  }

  handleCartAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const action = button.dataset.action;
    const productId = parseInt(button.dataset.productId);

    if (!productId) return;

    switch (action) {
      case 'add':
        this.addItem(productId);
        break;
      case 'remove':
        this.removeItem(productId);
        break;
      case 'delete':
        this.removeProduct(productId);
        break;
    }
  }

  updateTotalPrice() {
    if (this.totalPriceInput) {
      this.totalPriceInput.value = this.calculateTotal().toFixed(2);
    }
  }

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

  clear() {
    this.selectedProducts = [];
    this.update();
  }

  isEmpty() {
    return this.selectedProducts.length === 0;
  }

  // Método para limpar event listeners quando necessário
  destroy() {
    if (this.boundEventHandler && this.container) {
      this.container.removeEventListener('click', this.boundEventHandler);
      this.boundEventHandler = null;
    }
  }
}
