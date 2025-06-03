import { Sidebar } from '../shared/sidebar';
import { SalesFilters } from '../misc/sales_filters';
import { ProductsFilters } from '../misc/products_filters';
import { CustomersFilters } from '../misc/customers_filters';

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

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              reinitializeConfirmations(node);
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
  new App();
});

document.addEventListener('turbo:load', () => {
  reinitializeConfirmations();
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    reinitializeConfirmations();
  }
});

export { App };
