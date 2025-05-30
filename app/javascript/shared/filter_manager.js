/**
 * FilterManager - Uma classe reutilizável para gerenciar filtros em tabelas e cards
 *
 * Uso:
 * const filter = new FilterManager({
 *   container: '#products',
 *   items: '.card',
 *   filters: [
 *     { input: '#search_name', attribute: 'data-name' },
 *     { input: '#search_status', attribute: 'data-status' }
 *   ]
 * });
 */
export class FilterManager {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.itemSelector = options.items;
    this.filters = options.filters || [];
    this.noResultsMessage = options.noResultsMessage || 'Nenhum resultado encontrado';
    this.debounceDelay = options.debounceDelay || 300;

    if (!this.container) {
      console.warn(`FilterManager: Container ${options.container} não encontrado`);
      return;
    }

    this.init();
  }

  init() {
    this.createNoResultsMessage();
    this.bindEvents();
    this.filter(); // Filtro inicial
  }

  createNoResultsMessage() {
    this.noResultsElement = document.createElement('div');
    this.noResultsElement.className = 'text-center text-muted py-4';
    this.noResultsElement.innerHTML = `<p class="mb-0">${this.noResultsMessage}</p>`;
    this.noResultsElement.style.display = 'none';
    this.container.appendChild(this.noResultsElement);
  }

  bindEvents() {
    this.filters.forEach(filterConfig => {
      this.bindFilterEvents(filterConfig);
    });
  }

  filter() {
    const items = this.container.querySelectorAll(this.itemSelector);
    let visibleCount = 0;

    items.forEach(item => {
      let shouldShow = true;

      // Verifica cada filtro
      this.filters.forEach(filterConfig => {
        const input = document.querySelector(filterConfig.input);
        if (!input) return;

        const filterValue = input.value.trim().toLowerCase();
        if (!filterValue) return; // Se filtro vazio, não afeta

        let itemValue = '';

        // Obtém o valor do item baseado na configuração
        if (filterConfig.attribute) {
          itemValue = item.getAttribute(filterConfig.attribute) || '';
        } else if (filterConfig.selector) {
          const element = item.querySelector(filterConfig.selector);
          itemValue = element ? element.textContent : '';
        } else if (filterConfig.getText) {
          itemValue = filterConfig.getText(item);
        }

        itemValue = itemValue.trim().toLowerCase();

        // Aplica a lógica de comparação
        const matchType = filterConfig.matchType || 'includes';
        let matches = false;

        switch (matchType) {
          case 'includes':
            matches = itemValue.includes(filterValue);
            break;
          case 'equals':
            matches = itemValue === filterValue;
            break;
          case 'starts':
            matches = itemValue.startsWith(filterValue);
            break;
          case 'date':
            matches = this.matchDate(itemValue, filterValue);
            break;
          default:
            matches = itemValue.includes(filterValue);
        }

        if (!matches) {
          shouldShow = false;
        }
      });

      // Mostra/oculta o item
      const wrapper = item.closest('.col-6') || item; // Default wrapper para vendas
      if (wrapper) {
        wrapper.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
      }
    });

    // Mostra/oculta mensagem de "nenhum resultado"
    this.noResultsElement.style.display = visibleCount === 0 ? '' : 'none';

    // Callback personalizado após filtrar
    if (this.onFilter) {
      this.onFilter(visibleCount);
    }
  }

  matchDate(itemDate, filterDate) {
    // Para datas no formato DD/MM/YYYY
    if (itemDate.includes('/') && filterDate.includes('-')) {
      const [day, month, year] = itemDate.split('/');
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return isoDate === filterDate;
    }
    return itemDate === filterDate;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Métodos públicos para controle externo
  refresh() {
    this.filter();
  }

  reset() {
    this.filters.forEach(filterConfig => {
      const input = document.querySelector(filterConfig.input);
      if (input) {
        input.value = '';
      }
    });
    this.filter();
  }

  // Método para adicionar filtros dinamicamente
  addFilter(filterConfig) {
    this.filters.push(filterConfig);
    this.bindFilterEvents(filterConfig);
  }

  // Método para remover filtros
  removeFilter(inputSelector) {
    this.filters = this.filters.filter(filter => filter.input !== inputSelector);
    const input = document.querySelector(inputSelector);
    if (input) {
      input.removeEventListener('input', this.filter);
      input.removeEventListener('change', this.filter);
    }
  }

  // Bind de eventos para um filtro específico
  bindFilterEvents(filterConfig) {
    const input = document.querySelector(filterConfig.input);
    if (!input) {
      console.warn(`FilterManager: Input ${filterConfig.input} não encontrado`);
      return;
    }

    if (input.type === 'text' || input.type === 'search') {
      input.addEventListener('input', this.debounce(() => this.filter(), this.debounceDelay));
    } else {
      input.addEventListener('change', () => this.filter());
    }
  }
}
