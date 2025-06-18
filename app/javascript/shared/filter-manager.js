export class FilterManager {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.itemSelector = options.items;
    this.filters = options.filters || [];
    this.noResultsMessage = options.noResultsMessage || 'Nenhum resultado encontrado';
    this.noResultsIcon = options.noResultsIcon || 'bi-search';
    this.debounceDelay = options.debounceDelay || 300;
    this.cssPrefix = options.cssPrefix || '';

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

  bindEvents() {
    this.filters.forEach(filterConfig => {
      this.bindFilterEvents(filterConfig);
    });
  }

  createNoResultsMessage() {
    this.noResultsElement = document.createElement('div');
    this.noResultsElement.className = 'text-center py-5';
    this.noResultsElement.innerHTML = `
      <div class="card border-0 bg-transparent">
        <div class="card-body">
          <i class="bi ${this.noResultsIcon} display-4 text-muted mb-3"></i>
          <h5 class="text-muted mb-2">${this.noResultsMessage}</h5>
          <p class="text-muted small mb-0">Tente ajustar os filtros de busca</p>
        </div>
      </div>
    `;
    this.noResultsElement.style.display = 'none';

    const isTable = this.container.tagName === 'TABLE' ||
                   this.container.tagName === 'TBODY' ||
                   this.container.tagName === 'THEAD' ||
                   this.container.querySelector('table');

    if (isTable) {
      let targetElement = this.container;

      if (this.container.tagName === 'TABLE' ||
          this.container.tagName === 'TBODY' ||
          this.container.tagName === 'THEAD') {
        targetElement = this.container.parentElement || this.container;
      }

      if (targetElement.parentElement) {
        targetElement.parentElement.insertBefore(this.noResultsElement, targetElement.nextSibling);
      } else {
        document.body.appendChild(this.noResultsElement);
      }
    } else {
      this.container.appendChild(this.noResultsElement);
    }
  }

  filter() {
    const items = this.container.querySelectorAll(this.itemSelector);
    let visibleCount = 0;

    items.forEach(item => {
      let shouldShow = true;

      this.filters.forEach(filterConfig => {
        const input = document.querySelector(filterConfig.input);
        if (!input) return;

        let filterValues = [];

        if (filterConfig.type === 'tomselect-multiple') {
          const tomSelectInstance = input.tomselect;
          if (tomSelectInstance) {
            filterValues = tomSelectInstance.getValue();
          }
          if (!filterValues || filterValues.length === 0) return;
        } else {
          const filterValue = input.value.trim();
          if (!filterValue) return;
          filterValues = [filterValue];
        }

        let itemValue = '';
        if (filterConfig.attribute) {
          itemValue = item.getAttribute(filterConfig.attribute) || '';
        } else if (filterConfig.selector) {
          const element = item.querySelector(filterConfig.selector);
          itemValue = element ? element.textContent : '';
        } else if (filterConfig.getText) {
          itemValue = filterConfig.getText(item);
        }

        itemValue = this.normalizeText(itemValue);

        const matchType = filterConfig.matchType || 'includes';
        let matches = false;

        if (filterConfig.type === 'tomselect-multiple') {
          matches = filterValues.some(filterValue => {
            const normalizedFilterValue = this.normalizeText(filterValue);
            switch (matchType) {
              case 'includes':
                return itemValue.includes(normalizedFilterValue);
              case 'equals':
                return itemValue === normalizedFilterValue;
              case 'starts':
                return itemValue.startsWith(normalizedFilterValue);
              default:
                return itemValue.includes(normalizedFilterValue);
            }
          });
        } else {
          const normalizedFilterValue = this.normalizeText(filterValues[0]);
          switch (matchType) {
            case 'includes':
              matches = itemValue.includes(normalizedFilterValue);
              break;
            case 'equals':
              matches = itemValue === normalizedFilterValue;
              break;
            case 'starts':
              matches = itemValue.startsWith(normalizedFilterValue);
              break;
            case 'date':
              matches = this.matchDate(itemValue, normalizedFilterValue);
              break;
            default:
              matches = itemValue.includes(normalizedFilterValue);
          }
        }

        if (!matches) {
          shouldShow = false;
        }
      });

      if (shouldShow) {
        item.classList.remove(`${this.cssPrefix}filter-item-hidden`);
        item.classList.add(`${this.cssPrefix}filter-item-visible`);
        visibleCount++;
      } else {
        item.classList.remove(`${this.cssPrefix}filter-item-visible`);
        item.classList.add(`${this.cssPrefix}filter-item-hidden`);
      }
    });

    if (visibleCount === 0) {
      this.noResultsElement.classList.remove(`${this.cssPrefix}filter-no-results-hidden`);
      this.noResultsElement.classList.add(`${this.cssPrefix}filter-no-results-visible`);
    } else {
      this.noResultsElement.classList.remove(`${this.cssPrefix}filter-no-results-visible`);
      this.noResultsElement.classList.add(`${this.cssPrefix}filter-no-results-hidden`);
    }

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

  normalizeText(txt) {
    return txt.toString()
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
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
        if (filterConfig.type === 'tomselect-multiple' && input.tomselect) {
          input.tomselect.clear();
        } else {
          input.value = '';
        }
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

    if (filterConfig.type === 'tomselect-multiple') {
      if (input.tomselect) {
        input.tomselect.on('change', () => this.filter());
      } else {
        console.warn(`FilterManager: TomSelect instance not found for ${filterConfig.input}`);
      }
    } else if (input.type === 'text' || input.type === 'search') {
      input.addEventListener('input', this.debounce(() => this.filter(), this.debounceDelay));
    } else {
      input.addEventListener('change', () => this.filter());
    }
  }
}
