import { FilterManager } from '../shared/filter_manager.js';

/**
 * Filtros específicos para a página de clientes
 */
export class CustomersFilters {
  constructor() {
    this.init();
  }

  init() {
    // Verifica se estamos na página correta
    const customersTable = document.querySelector('#customers');
    if (!customersTable) return;

    this.filterManager = new FilterManager({
      container: '#customers',
      items: 'tr',
      noResultsMessage: 'Nenhum cliente encontrado',
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
            // Converte texto do status para valor
            return statusText === 'ativo' ? 'active' : 'inactive';
          },
          matchType: 'equals'
        }
      ]
    });
  }
}
