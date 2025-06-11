export class CartManager {
  constructor() {
    this.selectedProducts = [];
    this.container = document.getElementById("cart");
    this.totalPriceInput = null;
    this.cartInput = null;
    this.boundEventHandler = null;
    this.isInitialized = false;

    this.DEBOUNCE_DELAY = 300;
    this.MAX_QUANTITY = 999;
    this.MIN_QUANTITY = 1;
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

    if (this.boundInputHandler && this.container) {
      this.container.removeEventListener('input', this.boundInputHandler);
    }

    if (this.boundBlurHandler && this.container) {
      this.container.removeEventListener('blur', this.boundBlurHandler, true);
    }

    if (this.boundKeyHandler && this.container) {
      this.container.removeEventListener('keydown', this.boundKeyHandler);
    }

    if (this.boundFocusHandler && this.container) {
      this.container.removeEventListener('focus', this.boundFocusHandler, true);
    }

    this.boundEventHandler = this.handleCartAction.bind(this);
    this.boundInputHandler = this.handleQuantityInput.bind(this);
    this.boundBlurHandler = this.handleQuantityBlur.bind(this);
    this.boundKeyHandler = this.handleQuantityKeydown.bind(this);
    this.boundFocusHandler = this.handleQuantityFocus.bind(this);

    if (this.container) {
      this.container.addEventListener('click', this.boundEventHandler);
      this.container.addEventListener('input', this.boundInputHandler);
      this.container.addEventListener('blur', this.boundBlurHandler, true);
      this.container.addEventListener('keydown', this.boundKeyHandler);
      this.container.addEventListener('focus', this.boundFocusHandler, true);
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

  setQuantity(productId, newQuantity) {
    const product = this.selectedProducts.find(p => p.id === productId);
    if (!product) {
      console.warn('Product not found in cart:', productId);
      return;
    }

    let quantity = parseInt(newQuantity);

    if (isNaN(quantity)) {
      console.warn('Invalid quantity provided:', newQuantity);
      return;
    }

    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    if (quantity > this.MAX_QUANTITY) {
      quantity = this.MAX_QUANTITY;
    }

    const oldQuantity = product.quantity;
    product.quantity = quantity;

    if (Math.abs(quantity - oldQuantity) > 1) {
      this.showQuantityUpdateFeedback(productId);
    }

    this.update();
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
    this.updateCartSummaryDisplay();
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
          <div class="sales-cart-item border-bottom py-3 px-3" data-product-id="${product.id}">
            <div class="row align-items-center">
              <div class="col-7">
                <h6 class="mb-1 fw-semibold text-truncate">${this.escapeHtml(product.name || 'Produto sem nome')}</h6>
                <small class="text-muted">R$ ${formattedPrice} cada</small>
              </div>
              <div class="col-5 text-end">
                <div class="d-flex align-items-center justify-content-end gap-2 mb-2">
                  <button type="button" class="btn btn-outline-secondary btn-sm sales-cart-action-btn"
                          data-action="remove" data-product-id="${product.id}"
                          title="Remover um">
                    <i class="bi bi-dash small"></i>
                  </button>

                  <input type="number"
                         class="form-control form-control-sm text-center fw-bold sales-quantity-input sales-quantity-input-container"
                         value="${quantity}"
                         min="${this.MIN_QUANTITY}"
                         max="${this.MAX_QUANTITY}"
                         data-product-id="${product.id}"
                         title="Digite a quantidade desejada (Enter para confirmar, Esc para cancelar)"
                         aria-label="Quantidade do produto ${this.escapeHtml(product.name)}"
                         autocomplete="off"
                         inputmode="numeric">

                  <button type="button" class="btn btn-outline-secondary btn-sm sales-cart-action-btn"
                          data-action="add" data-product-id="${product.id}"
                          title="Adicionar mais um">
                    <i class="bi bi-plus small"></i>
                  </button>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <strong class="text-success">R$ ${subTotal}</strong>
                  <button type="button" class="btn btn-outline-danger btn-sm sales-cart-action-btn"
                          data-action="delete" data-product-id="${product.id}"
                          title="Remover do carrinho">
                    <i class="bi bi-trash3 small"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      this.container.innerHTML = `
        <div class="sales-cart-content">
          <div class="sales-cart-items">
            ${cartRows}
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error rendering cart:', error);
      this.renderErrorState();
    }
  }

  renderEmptyCart() {
    this.container.innerHTML = `
      <div class="text-center p-5">
        <div class="mb-3">
          <i class="bi bi-cart-x sales-empty-cart-icon"></i>
        </div>
        <h6 class="text-muted mb-2">Carrinho vazio</h6>
        <small class="text-muted">Adicione produtos para começar sua venda</small>
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

  handleQuantityInput(event) {
    if (!event.target.classList.contains('sales-quantity-input')) return;

    const input = event.target;
    const productId = parseInt(input.dataset.productId);

    if (!productId || isNaN(productId)) return;

    // Add visual feedback that changes are being processed
    input.classList.add('is-updating');

    // Clear any previous timeout
    if (this.quantityUpdateTimeout) {
      clearTimeout(this.quantityUpdateTimeout);
    }

    // Use faster debounce for better UX
    this.quantityUpdateTimeout = setTimeout(() => {
      const newQuantity = parseInt(input.value);

      if (!isNaN(newQuantity)) {
        this.setQuantity(productId, newQuantity);
      }

      input.classList.remove('is-updating');
    }, this.DEBOUNCE_DELAY);
  }

  handleQuantityBlur(event) {
    if (!event.target.classList.contains('sales-quantity-input')) return;

    const input = event.target;
    const productId = parseInt(input.dataset.productId);

    if (!productId || isNaN(productId)) return;

    // Clear timeout since user left the field
    if (this.quantityUpdateTimeout) {
      clearTimeout(this.quantityUpdateTimeout);
    }

    // Remove visual feedback
    input.classList.remove('is-updating');

    const newQuantity = parseInt(input.value);
    const product = this.selectedProducts.find(p => p.id === productId);

    if (!product) return;

    if (isNaN(newQuantity) || newQuantity <= 0) {
      // Show confirmation before removing
      if (confirm('Remover este item do carrinho?')) {
        this.removeProduct(productId);
      } else {
        // Restore previous quantity
        input.value = product.quantity;
      }
    } else if (newQuantity > this.MAX_QUANTITY) {
      // Auto-correct to maximum and update
      this.setQuantity(productId, this.MAX_QUANTITY);
    } else {
      // Update with the new quantity
      this.setQuantity(productId, newQuantity);
    }
  }

  handleQuantityKeydown(event) {
    if (!event.target.classList.contains('sales-quantity-input')) return;

    const input = event.target;
    const productId = parseInt(input.dataset.productId);

    if (!productId || isNaN(productId)) return;

    const key = event.key;

    switch (key) {
      case 'Enter':
        event.preventDefault();
        input.blur();
        break;

      case 'Escape':
        event.preventDefault();
        {
          const product = this.selectedProducts.find(p => p.id === productId);
          if (product) {
            input.value = product.quantity;
            input.blur();
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.incrementQuantity(productId, 1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.incrementQuantity(productId, -1);
        break;

      default:
        if (!/^[0-9]$/.test(key) &&
          !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
          event.preventDefault();
        }
        break;
    }
  }

  handleQuantityFocus(event) {
    if (!event.target.classList.contains('sales-quantity-input')) return;

    const input = event.target;
    setTimeout(() => input.select(), 0);
  }

  incrementQuantity(productId, delta) {
    const product = this.selectedProducts.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Math.max(this.MIN_QUANTITY,
      Math.min(this.MAX_QUANTITY, product.quantity + delta));

    if (newQuantity !== product.quantity) {
      this.setQuantity(productId, newQuantity);
    }
  }

  showQuantityUpdateFeedback(productId) {
    const cartItem = this.container.querySelector(`[data-product-id="${productId}"]`);
    if (cartItem) {
      cartItem.classList.add('quantity-updated');
      setTimeout(() => {
        cartItem.classList.remove('quantity-updated');
      }, 500);
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

  updateCartSummaryDisplay() {
    const summary = this.getCartSummary();

    const itemCountElement = document.getElementById('cart-item-count');
    if (itemCountElement) {
      itemCountElement.textContent = summary.totalQuantity;
    }

    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
      totalElement.textContent = summary.totalValue.toFixed(2).replace('.', ',');
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

    if (this.boundInputHandler && this.container) {
      this.container.removeEventListener('input', this.boundInputHandler);
      this.boundInputHandler = null;
    }

    if (this.boundBlurHandler && this.container) {
      this.container.removeEventListener('blur', this.boundBlurHandler, true);
      this.boundBlurHandler = null;
    }

    if (this.boundKeyHandler && this.container) {
      this.container.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }

    if (this.boundFocusHandler && this.container) {
      this.container.removeEventListener('focus', this.boundFocusHandler, true);
      this.boundFocusHandler = null;
    }

    if (this.quantityUpdateTimeout) {
      clearTimeout(this.quantityUpdateTimeout);
      this.quantityUpdateTimeout = null;
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
