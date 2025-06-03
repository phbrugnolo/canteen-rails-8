import { ProductManager } from './product-manager.js';
import { CartManager } from './cart-manager.js';

export class SalesManager {
  constructor() {
    this.productManager = new ProductManager();
    this.cartManager = new CartManager();
    this.apiEndpoint = null;
  }

  async initialize(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;

    try {
      const products = await this.fetchProducts();
      this.setupManagers(products);
    } catch (error) {
      console.error('Erro ao inicializar vendas:', error);
      this.showError('Erro ao carregar produtos. Tente recarregar a página.');
    }
  }

  async fetchProducts() {
    const response = await fetch(this.apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products || [];
  }

  setupManagers(products) {
    this.productManager.initialize(products);

    this.cartManager.initialize();

    this.productManager.bindAddEvents((product) => {
      this.cartManager.addProduct(product);
    });
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
    }
  }

  validateForm() {
    const errors = [];

    if (this.cartManager.isEmpty()) {
      errors.push('Adicione pelo menos um produto ao carrinho.');
    }

    const customerSelect = document.getElementById('customer-id');
    if (!customerSelect || !customerSelect.value) {
      errors.push('Selecione um cliente.');
    }

    if (errors.length > 0) {
      this.showError(errors.join('<br>'));
      return false;
    }

    return true;
  }

  reset() {
    this.cartManager.clear();

    const customerSelect = document.getElementById('customer-id');
    if (customerSelect) {
      customerSelect.value = '';
      if (customerSelect.tomselect) {
        customerSelect.tomselect.clear();
      }
    }
  }

  destroy() {
    if (this.cartManager && typeof this.cartManager.destroy === 'function') {
      this.cartManager.destroy();
    }

    if (this.productManager && typeof this.productManager.destroy === 'function') {
      this.productManager.destroy();
    }
  }
}

window.SalesManager = SalesManager;
