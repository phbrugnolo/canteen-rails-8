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
      this.setupGlobalMethods();
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

  setupGlobalMethods() {
    window.removeProduct = (productId) => this.cartManager.removeProduct(productId);
    window.addItem = (productId) => this.cartManager.addItem(productId);
    window.removeItem = (productId) => this.cartManager.removeItem(productId);
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
    if (this.cartManager.isEmpty()) {
      this.showError('Adicione pelo menos um produto ao carrinho.');
      return false;
    }

    const customerSelect = document.getElementById('customer-id');
    if (!customerSelect || !customerSelect.value) {
      this.showError('Selecione um cliente.');
      return false;
    }

    return true;
  }

  reset() {
    this.cartManager.clear();

    // Limpar seleção de cliente
    const customerSelect = document.getElementById('customer-id');
    if (customerSelect) {
      customerSelect.value = '';
      // Se está usando TomSelect, atualizar também
      if (customerSelect.tomselect) {
        customerSelect.tomselect.clear();
      }
    }
  }

  // Método para limpar tudo quando sair da página
  destroy() {
    if (this.cartManager && typeof this.cartManager.destroy === 'function') {
      this.cartManager.destroy();
    }

    if (this.productManager && typeof this.productManager.destroy === 'function') {
      this.productManager.destroy();
    }

    // Limpar métodos globais
    if (window.removeProduct) delete window.removeProduct;
    if (window.addItem) delete window.addItem;
    if (window.removeItem) delete window.removeItem;
  }
}

window.SalesManager = SalesManager;
