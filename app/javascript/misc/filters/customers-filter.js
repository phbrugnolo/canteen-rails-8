import { FilterManager } from '../../shared/filter-manager.js';

export class CustomersFilters {
  constructor() {
    this.init();
  }

  init() {
    const customersTable = document.querySelector('#customers');
    if (!customersTable) return;

    this.filterManager = new FilterManager({
      container: '#customers',
      items: 'tr.customer-row',
      noResultsMessage: 'Nenhum cliente encontrado',
      noResultsIcon: 'bi-person-x',
      cssPrefix: 'customers-index-',
      filters: [
        {
          input: '#search_name',
          selector: '.customers-index-customer-name',
          matchType: 'includes'
        },
        {
          input: '#search_matriculation',
          selector: '.customers-index-customer-matriculation',
          matchType: 'includes'
        },
        {
          input: '#search_status',
          getText: (row) => {
            const statusSpan = row.querySelector('.customers-index-status-badge');
            if (!statusSpan) return '';

            if (statusSpan.classList.contains('customers-index-status-active')) {
              return 'active';
            } else if (statusSpan.classList.contains('customers-index-status-inactive')) {
              return 'inactive';
            }
            return '';
          },
          matchType: 'equals'
        }
      ]
    });
  }
}
