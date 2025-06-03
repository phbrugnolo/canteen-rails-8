import { ProductManager } from './product-manager.js';
import { CartManager } from './cart-manager.js';
import { ToastManager } from './toast-manager.js';

export class SalesManager {
  constructor() {
    this.productManager = new ProductManager();
    this.cartManager = new CartManager();
    this.toastManager = new ToastManager();
    this.apiEndpoint = null;
  }

  async initialize(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;

    // Show loading state
    this.showLoadingState();

    try {
      const products = await this.fetchProducts();
      this.setupManagers(products);
      this.hideLoadingState();
      this.toastManager.success('Sistema de vendas carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar vendas:', error);
      this.hideLoadingState();
      this.toastManager.error('Erro ao carregar produtos. Tente recarregar a página.');
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
      this.toastManager.success(`${product.name} adicionado ao carrinho!`);
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
      this.toastManager.error(errors.join(' '), 5000);

      // Highlight form fields with errors
      if (this.cartManager.isEmpty()) {
        const cartCard = document.querySelector('#cart').closest('.card');
        if (cartCard) {
          cartCard.style.border = '2px solid #dc3545';
          setTimeout(() => {
            cartCard.style.border = '';
          }, 3000);
        }
      }

      if (!customerSelect || !customerSelect.value) {
        customerSelect.style.border = '2px solid #dc3545';
        setTimeout(() => {
          customerSelect.style.border = '';
        }, 3000);
      }

      return false;
    }

    this.toastManager.success('Validação concluída! Finalizando venda...');
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
