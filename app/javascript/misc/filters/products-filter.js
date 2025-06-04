import { FilterManager } from '../../shared/filter-manager.js';

export class ProductsFilters {
  constructor() {
    this.init();
  }

  init() {
    const productsContainer = document.querySelector('#products');
    if (!productsContainer) return;

    this.filterManager = new FilterManager({
      container: '#products',
      items: '.card.border-info',
      noResultsMessage: 'Nenhum produto encontrado',
      noResultsIcon: 'bi-box-seam',
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
