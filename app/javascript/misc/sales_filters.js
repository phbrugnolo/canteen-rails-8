import { FilterManager } from '../shared/filter_manager.js';

/**
 * Filtros específicos para a página de vendas
 */
export class SalesFilters {
  constructor() {
    this.init();
  }

  init() {
    // Verifica se estamos na página correta
    const salesContainer = document.querySelector('#sales');
    if (!salesContainer) return;

    this.filterManager = new FilterManager({
      container: '#sales .container',
      items: '.card.border-info',
      noResultsMessage: this.getNoResultsMessage(),
      filters: [
        {
          input: '#search_name',
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

            // Converte DD/MM/YYYY para YYYY-MM-DD
            const [day, month, year] = dateText.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          },
          matchType: 'equals'
        }
      ]
    });

    // Override do wrapper para vendas (.col-6)
    this.customizeForSales();
  }

  getNoResultsMessage() {
    const messageElement = document.querySelector('[data-i18n="no_purchases_found"]');
    return messageElement ? messageElement.textContent : 'Nenhuma venda encontrada';
  }

  customizeForSales() {
    // Override do método filter para usar .col-6 como wrapper
    this.filterManager.filter = () => {
      const items = this.filterManager.container.querySelectorAll(this.filterManager.itemSelector);
      let visibleCount = 0;

      items.forEach(item => {
        let shouldShow = true;

        this.filterManager.filters.forEach(filterConfig => {
          const input = document.querySelector(filterConfig.input);
          if (!input) return;

          const filterValue = input.value.trim().toLowerCase();
          if (!filterValue) return;

          let itemValue = '';
          if (filterConfig.getText) {
            itemValue = filterConfig.getText(item);
          }

          itemValue = itemValue.trim().toLowerCase();

          const matchType = filterConfig.matchType || 'includes';
          let matches = false;

          switch (matchType) {
            case 'includes':
              matches = itemValue.includes(filterValue);
              break;
            case 'equals':
              matches = itemValue === filterValue;
              break;
            default:
              matches = itemValue.includes(filterValue);
          }

          if (!matches) {
            shouldShow = false;
          }
        });

        // Para vendas, o wrapper é .col-6
        const wrapper = item.closest('.col-6');
        if (wrapper) {
          wrapper.style.display = shouldShow ? '' : 'none';
          if (shouldShow) visibleCount++;
        }
      });

      this.filterManager.noResultsElement.style.display = visibleCount === 0 ? '' : 'none';

      // Callback se definido
      if (this.filterManager.onFilter) {
        this.filterManager.onFilter(visibleCount);
      }
    };
  }
}
