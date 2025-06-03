export class CartManager {
  constructor() {
    this.selectedProducts = [];
    this.container = document.getElementById("cart");
    this.totalPriceInput = null;
    this.cartInput = null;
  }

  initialize() {
    this.totalPriceInput = document.getElementById("sale_total_price");
    this.cartInput = document.getElementById("sale_cart");
    this.render();
  }

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

  removeProduct(index) {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
      this.update();
    }
  }

  addItem(index) {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts[index].quantity++;
      this.update();
    }
  }

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

  calculateTotal() {
    return this.selectedProducts.reduce((total, product) => {
      if (typeof product.quantity === "number" && typeof product.price === "number") {
        return total + (product.quantity * product.price);
      }
      return total;
    }, 0);
  }

  update() {
    this.render();
    this.updateTotalPrice();
    this.updateCartData();
  }

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
}
