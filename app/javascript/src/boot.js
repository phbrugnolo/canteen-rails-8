import { Sidebar } from '../shared/sidebar';
import { SalesFilters } from '../misc/filters/sales-filter';
import { ProductsFilters } from '../misc/filters/products-filter';
import { CustomersFilters } from '../misc/filters/customers-filter';
import { Tooltip } from 'bootstrap';

import { initializeConfirmationSystem, reinitializeConfirmations } from './confirmation-decorator';

class App {
  constructor() {
    this.initializeComponents();
    this.setupGlobalHelpers();
  }

  initializeComponents() {
    new Sidebar();
    this.initializeFilters();
    initializeConfirmationSystem();
    this.initializeTooltips();
    this.setupMutationObserver();
  }

  initializeFilters() {
    const controllerName = window.canteen?.controller_name;

    const filterMap = {
      'sales': SalesFilters,
      'products': ProductsFilters,
      'customers': CustomersFilters
    };

    const FilterClass = filterMap[controllerName];
    if (FilterClass) {
      new FilterClass();
    }
  }

  initializeTooltips(container = document) {
    const existingTooltips = container.querySelectorAll('[data-bs-toggle="tooltip"]');
    existingTooltips.forEach(element => {
      const tooltipInstance = Tooltip.getInstance(element);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    });

    const tooltipTriggerList = container.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  reinitializeTooltips(container = document) {
    this.initializeTooltips(container);
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              reinitializeConfirmations(node);
              this.reinitializeTooltips(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.appMutationObserver = observer;
  }

  setupGlobalHelpers() {
    window.App = {
      reinitializeConfirmations: reinitializeConfirmations,
      reinitializeTooltips: (container = document) => this.reinitializeTooltips(container),
      showNotification: (message, type = 'info') => {
        if (window.showConfirmDialog) {
          window.showConfirmDialog({
            title: type === 'error' ? 'Erro' : 'Informação',
            text: message,
            icon: type,
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        } else {
          alert(message);
        }
      },

      setLoading: (element, loading = true) => {
        if (loading) {
          element.classList.add('loading');
          element.disabled = true;
        } else {
          element.classList.remove('loading');
          element.disabled = false;
        }
      }
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  window.canteenApp = app;
});

document.addEventListener('turbo:load', () => {
  reinitializeConfirmations();
  if (window.canteenApp) {
    window.canteenApp.reinitializeTooltips();
  }
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    reinitializeConfirmations();
    if (window.canteenApp) {
      window.canteenApp.reinitializeTooltips();
    }
  }
});

export { App };
