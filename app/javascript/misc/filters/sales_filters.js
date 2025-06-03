import { FilterManager } from '../../shared/filter_manager.js';

export class SalesFilters {
  constructor() {
    this.init();
  }

  init() {
    const salesContainer = document.querySelector('#sales');
    if (!salesContainer) return;

    this.initCustomerSelect();

    this.filterManager = new FilterManager({
      container: '#sales .container',
      items: '.card.border-info',
      noResultsMessage: this.getNoResultsMessage(),
      noResultsIcon: 'bi-cart-x',
      filters: [
        {
          input: '#search_customers',
          type: 'tomselect-multiple',
          getText: (item) => {
            const customerCell = item.querySelector('td:nth-child(2)');
            return customerCell ? customerCell.textContent.split(': ')[1] || '' : '';
          },
          matchType: 'includes'
        },
        {
          input: '#search_date',
          getText: (item) => {
            const dateCell = item.querySelector('td:nth-child(1)');
            if (!dateCell) return '';

            const dateText = dateCell.textContent.split(': ')[1];
            if (!dateText) return '';

            const [day, month, year] = dateText.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          },
          matchType: 'equals'
        }
      ]
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

    new window.TomSelect(selectElement, {
      plugins: ['remove_button'],
      placeholder: selectElement.getAttribute('data-placeholder') || 'Selecione clientes...',
      allowEmptyOption: true,
      maxItems: null,
      create: false,
      searchField: ['text'],
      sortField: {
        field: 'text',
        direction: 'asc'
      }
    });
  }

  getUniqueCustomerNames() {
    const customerNames = new Set();
    const salesCards = document.querySelectorAll('#sales .card.border-info');

    salesCards.forEach(card => {
      const customerCell = card.querySelector('td:nth-child(2)');
      if (customerCell) {
        const customerName = customerCell.textContent.split(': ')[1];
        if (customerName) {
          customerNames.add(customerName.trim());
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
}
