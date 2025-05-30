import { FilterManager } from '../shared/filter_manager.js';

/**
 * Filtros específicos para a página de produtos
 */
export class ProductsFilters {
  constructor() {
    this.init();
  }

  init() {
    // Verifica se estamos na página correta
    const productsContainer = document.querySelector('#products');
    if (!productsContainer) return;

    this.filterManager = new FilterManager({
      container: '#products',
      items: '.card.border-info',
      noResultsMessage: 'Nenhum produto encontrado',
      filters: [
        {
          input: '#search_name',
          selector: '.card-title',
          matchType: 'includes'
        },
        {
          input: '#search_status',
          attribute: 'data-status',
          matchType: 'equals'
        }
      ]
    });
  }
}
