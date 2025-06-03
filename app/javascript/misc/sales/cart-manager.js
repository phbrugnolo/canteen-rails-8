export class CartManager {
  constructor() {
    this.selectedProducts = [];
    this.container = document.getElementById("cart");
    this.totalPriceInput = null;
    this.cartInput = null;
    this.boundEventHandler = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    this.totalPriceInput = document.getElementById("sale_total_price");
    this.cartInput = document.getElementById("sale_cart");

    if (!this.container) {
      console.warn('Cart container not found');
      return;
    }

    this.setupEventHandler();
    this.render();
    this.isInitialized = true;
  }

  setupEventHandler() {
    if (this.boundEventHandler && this.container) {
      this.container.removeEventListener('click', this.boundEventHandler);
    }

    this.boundEventHandler = this.handleCartAction.bind(this);

    if (this.container) {
      this.container.addEventListener('click', this.boundEventHandler);
    }
  }

  addProduct(product) {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    try {
      const existingProduct = this.selectedProducts.find(p => p.id === product.id);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        const price = parseFloat(product.price);
        if (isNaN(price) || price < 0) {
          console.error('Invalid price for product:', product);
          return;
        }

        const productCopy = {
          ...product,
          quantity: 1,
          price: price
        };
        this.selectedProducts.push(productCopy);
      }

      this.update();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
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
    if (!this.container) {
      console.warn('Cart container not available for rendering');
      return;
    }

    try {
      if (this.selectedProducts.length === 0) {
        this.renderEmptyCart();
        return;
      }

      const cartRows = this.selectedProducts.map((product) => {
        if (!product || !product.id) return '';

        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 0;
        const formattedPrice = price.toFixed(2);
        const subTotal = (price * quantity).toFixed(2);

        return `
          <tr class="row" data-product-id="${product.id}">
            <td class="col-4">${this.escapeHtml(product.name || 'Produto sem nome')}</td>
            <td class="col-2">${quantity}</td>
            <td class="col-2"> R$ ${formattedPrice}</td>
            <td class="col-2"> R$ ${subTotal}</td>
            <td class="col-2 m-auto text-center">
              <button type="button" class="btn btn-primary btn-sm" data-action="add" data-product-id="${product.id}" title="Adicionar mais um">
                <i class="bi bi-plus-circle"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-action="remove" data-product-id="${product.id}" title="Remover um">
                <i class="bi bi-dash-circle"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-product-id="${product.id}" title="Remover do carrinho">
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
              <th class="col-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${cartRows}
          </tbody>
        </table>
      `;
    } catch (error) {
      console.error('Error rendering cart:', error);
      this.renderErrorState();
    }
  }

  renderEmptyCart() {
    this.container.innerHTML = `
      <div class="text-center p-4">
        <i class="bi bi-cart-x display-1 text-muted"></i>
        <p class="text-muted mt-2">Carrinho vazio</p>
        <p class="text-muted small">Adicione produtos para começar</p>
      </div>
    `;
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="alert alert-warning text-center">
        <i class="bi bi-exclamation-triangle"></i>
        Erro ao carregar carrinho. Tente recarregar a página.
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  handleCartAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const action = button.dataset.action;
    const productId = parseInt(button.dataset.productId);

    if (!productId || isNaN(productId)) {
      console.error('Invalid product ID:', button.dataset.productId);
      return;
    }

    try {
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
        default:
          console.warn('Unknown cart action:', action);
      }
    } catch (error) {
      console.error('Error handling cart action:', error);
    }
  }

  updateTotalPrice() {
    try {
      const total = this.calculateTotal();
      if (this.totalPriceInput) {
        this.totalPriceInput.value = total.toFixed(2);
        this.totalPriceInput.classList.remove('is-invalid');
      }
    } catch (error) {
      console.error('Error updating total price:', error);
      if (this.totalPriceInput) {
        this.totalPriceInput.classList.add('is-invalid');
      }
    }
  }

  updateCartData() {
    try {
      if (this.cartInput) {
        const cartData = this.selectedProducts.map(product => ({
          name: product.name || '',
          price: parseFloat(product.price) || 0,
          id: parseInt(product.id) || 0,
          quantity: parseInt(product.quantity) || 0
        }));
        this.cartInput.value = JSON.stringify(cartData);
      }
    } catch (error) {
      console.error('Error updating cart data:', error);
    }
  }

  clear() {
    this.selectedProducts = [];
    this.update();
  }

  isEmpty() {
    return this.selectedProducts.length === 0;
  }

  destroy() {
    if (this.boundEventHandler && this.container) {
      this.container.removeEventListener('click', this.boundEventHandler);
      this.boundEventHandler = null;
    }
    this.isInitialized = false;
  }

  getCartSummary() {
    return {
      itemCount: this.selectedProducts.length,
      totalQuantity: this.selectedProducts.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0),
      totalValue: this.calculateTotal(),
      items: this.selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price
      }))
    };
  }
}
