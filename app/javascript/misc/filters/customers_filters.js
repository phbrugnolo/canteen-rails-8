import { FilterManager } from '../../shared/filter_manager.js';

export class CustomersFilters {
  constructor() {
    this.init();
  }

  init() {
    const customersTable = document.querySelector('#customers');
    if (!customersTable) return;

    this.filterManager = new FilterManager({
      container: '#customers',
      items: 'tr',
      noResultsMessage: 'Nenhum cliente encontrado',
      noResultsIcon: 'bi-person-x',
      filters: [
        {
          input: '#search_name',
          selector: 'td:nth-child(2)',
          matchType: 'includes'
        },
        {
          input: '#search_id',
          selector: 'td:nth-child(1)',
          matchType: 'includes'
        },
        {
          input: '#search_status',
          getText: (row) => {
            const statusSpan = row.querySelector('td:nth-child(3) span');
            if (!statusSpan) return '';

            const statusText = statusSpan.textContent.trim().toLowerCase();
            return statusText === 'ativo' ? 'active' : 'inactive';
          },
          matchType: 'equals'
        }
      ]
    });
  }
}
