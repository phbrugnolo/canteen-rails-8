import TomSelect from 'tom-select';
import { FilterManager } from '../../shared/filter-manager.js';

export class SalesFilters {
  constructor() {
    this.init();
  }

  init() {
    const salesContainer = document.querySelector('#sales-grid');
    if (!salesContainer) return;

    this.initCustomerSelect();

    this.filterManager = new FilterManager({
      container: '#sales-grid',
      items: '.sales-index-card',
      noResultsMessage: this.getNoResultsMessage(),
      noResultsIcon: 'bi-receipt',
      cssPrefix: 'sales-index-',
      filters: [
        {
          input: '#search_customers',
          type: 'tomselect-multiple',
          getText: (item) => {
            const customerName = item.querySelector('.sales-index-customer-name');
            return customerName ? customerName.textContent.trim() : '';
          },
          matchType: 'includes'
        },
        {
          input: '#search_date',
          attribute: 'data-sale-date',
          matchType: 'equals'
        }
      ],
      onFilter: (visibleCount) => this.updateSalesCount(visibleCount)
    });
  }

  initCustomerSelect() {
    const selectElement = document.querySelector('#search_customers');
    if (!selectElement) return;

    const customerNames = this.getUniqueCustomerNames();

    customerNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      selectElement.appendChild(option);
    });

    const tomSelectInstance = new TomSelect(selectElement, {
      plugins: ['remove_button'],
      placeholder: selectElement.getAttribute('data-placeholder') || 'Selecione clientes...',
      allowEmptyOption: true,
      maxItems: null,
      create: false,
      searchField: ['text'],
      sortField: {
        field: 'text',
        direction: 'asc'
      },
      render: {
        no_results: () => {
          return '<div class="no-results">Nenhum cliente encontrado</div>';
        }
      }
    });

    selectElement.tomselect = tomSelectInstance;
  }

  getUniqueCustomerNames() {
    const customerNames = new Set();
    const salesCards = document.querySelectorAll('.sales-index-card');

    salesCards.forEach(card => {
      const customerNameElement = card.querySelector('.sales-index-customer-name');
      if (customerNameElement) {
        const customerName = customerNameElement.textContent.trim();
        if (customerName) {
          customerNames.add(customerName);
        }
      }
    });

    return Array.from(customerNames).sort();
  }

  getNoResultsMessage() {
    const messageElement = document.querySelector('[data-i18n="no_purchases_found"]');
    return messageElement ? messageElement.textContent : 'Nenhuma venda encontrada';
  }

  refresh() {
    if (this.filterManager) {
      this.filterManager.refresh();
    }
  }

  reset() {
    if (this.filterManager) {
      this.filterManager.reset();
    }
  }

  addFilter(filterConfig) {
    if (this.filterManager) {
      this.filterManager.addFilter(filterConfig);
    }
  }

  removeFilter(inputSelector) {
    if (this.filterManager) {
      this.filterManager.removeFilter(inputSelector);
    }
  }

  updateSalesCount(visibleCount) {
    const salesCountElement = document.querySelector('#sales-count');
    if (salesCountElement) {
      salesCountElement.classList.add('updating');
      salesCountElement.textContent = visibleCount;

      setTimeout(() => {
        salesCountElement.classList.remove('updating');
      }, 200);
    }
  }
}
