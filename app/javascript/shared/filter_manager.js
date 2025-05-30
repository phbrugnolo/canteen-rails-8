export class FilterManager {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.itemSelector = options.items;
    this.filters = options.filters || [];
    this.noResultsMessage = options.noResultsMessage || 'Nenhum resultado encontrado';
    this.debounceDelay = options.debounceDelay || 300;

    if (!this.container) {
      console.warn(`FilterManager: Container ${options.container} not found`);
      return;
    }

    this.init();
  }

  init() {
    this.createNoResultsMessage();
    this.bindEvents();
    this.filter();
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

      this.filters.forEach(filterConfig => {
        const input = document.querySelector(filterConfig.input);
        if (!input) return;

        const filterValue = input.value.trim().toLowerCase();
        if (!filterValue) return;

        let itemValue = '';

        if (filterConfig.attribute) {
          itemValue = item.getAttribute(filterConfig.attribute) || '';
        } else if (filterConfig.selector) {
          const element = item.querySelector(filterConfig.selector);
          itemValue = element ? element.textContent : '';
        } else if (filterConfig.getText) {
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

      const wrapper = item.closest('.col-6') || item;
      if (wrapper) {
        wrapper.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
      }
    });

    this.noResultsElement.style.display = visibleCount === 0 ? '' : 'none';

    if (this.onFilter) {
      this.onFilter(visibleCount);
    }
  }

  matchDate(itemDate, filterDate) {
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

  addFilter(filterConfig) {
    this.filters.push(filterConfig);
    this.bindFilterEvents(filterConfig);
  }

  removeFilter(inputSelector) {
    this.filters = this.filters.filter(filter => filter.input !== inputSelector);
    const input = document.querySelector(inputSelector);
    if (input) {
      input.removeEventListener('input', this.filter);
      input.removeEventListener('change', this.filter);
    }
  }

  bindFilterEvents(filterConfig) {
    const input = document.querySelector(filterConfig.input);
    if (!input) {
      console.warn(`FilterManager: Input ${filterConfig.input} not found`);
      return;
    }

    if (input.type === 'text' || input.type === 'search') {
      input.addEventListener('input', this.debounce(() => this.filter(), this.debounceDelay));
    } else {
      input.addEventListener('change', () => this.filter());
    }
  }
}
