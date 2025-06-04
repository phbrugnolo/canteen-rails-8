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

    this.showLoadingState();

    try {
      const products = await this.fetchProducts();
      this.setupManagers(products);
      this.hideLoadingState();
    } catch (error) {
      console.error('Erro ao inicializar vendas:', error);
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    const productsContainer = document.getElementById('products');
    const cartContainer = document.getElementById('cart');

    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="text-center p-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="text-muted">Carregando produtos...</p>
        </div>
      `;
    }

    if (cartContainer) {
      cartContainer.innerHTML = `
        <div class="text-center p-4">
          <div class="spinner-border spinner-border-sm text-muted" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>
      `;
    }
  }

  hideLoadingState() {
    // Loading states will be replaced by the actual content
    // when managers are initialized
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
