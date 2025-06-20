import { FilterManager } from '../../shared/filter-manager.js';

export class ProductsFilters {
  constructor() {
    this.init();
    this.initEnhancements();
  }

  init() {
    const productsContainer = document.querySelector('#products');
    if (!productsContainer) return;

    this.filterManager = new FilterManager({
      container: '#products',
      items: '.product-row',
      noResultsMessage: 'Nenhum produto encontrado',
      noResultsIcon: 'bi-box-seam',
      cssPrefix: 'products-index-',
      filters: [
        {
          input: '#search_name',
          selector: '.products-index-product-name',
          matchType: 'includes'
        },
        {
          input: '#search_status',
          attribute: 'data-status',
          matchType: 'equals'
        },
        {
          input: '#search_price_range',
          getText: (row) => {
            const priceStr = row.getAttribute('data-price');
            const price = parseFloat(priceStr);

            if (isNaN(price)) return '';

            if (price <= 10) return '0-10';
            if (price <= 25) return '10-25';
            if (price <= 50) return '25-50';
            return '50+';
          },
          matchType: 'equals'
        }
      ]
    });
  }

  initEnhancements() {
    this.initViewToggle();
    this.initTableAnimations();
    this.initSearchEnhancements();
  }

  initViewToggle() {
    const viewToggle = document.getElementById('viewToggle');
    const tableView = document.getElementById('tableView');
    const gridView = document.getElementById('gridView');

    if (!viewToggle || !tableView || !gridView) return;

    viewToggle.addEventListener('click', () => {
      const isTableVisible = tableView.style.display !== 'none';

      if (isTableVisible) {
        // Switch to grid view
        tableView.style.display = 'none';
        gridView.style.display = 'grid';
        viewToggle.innerHTML = '<i class="bi bi-table"></i><span>Tabela</span>';
        viewToggle.title = 'Alternar para visualização em tabela';

        // Update filter to work with cards
        this.updateFilterForGridView();
      } else {
        // Switch to table view
        tableView.style.display = 'block';
        gridView.style.display = 'none';
        viewToggle.innerHTML = '<i class="bi bi-grid-3x3-gap"></i><span>Grade</span>';
        viewToggle.title = 'Alternar para visualização em grade';

        // Update filter to work with table rows
        this.updateFilterForTableView();
      }
    });
  }

  updateFilterForGridView() {
    if (!this.filterManager) return;

    // Update filter configuration for grid view
    this.filterManager.container = document.querySelector('#gridView');
    this.filterManager.itemSelector = '.products-index-product-card';

    // Update filter configurations for grid elements
    this.filterManager.filters = [
      {
        input: '#search_name',
        selector: '.products-index-product-name',
        matchType: 'includes'
      },
      {
        input: '#search_status',
        attribute: 'data-status',
        matchType: 'equals'
      },
      {
        input: '#search_price_range',
        getText: (card) => {
          const priceStr = card.getAttribute('data-price');
          const price = parseFloat(priceStr);

          if (isNaN(price)) return '';

          if (price <= 10) return '0-10';
          if (price <= 25) return '10-25';
          if (price <= 50) return '25-50';
          return '50+';
        },
        matchType: 'equals'
      }
    ];

    this.filterManager.filter();
  }

  updateFilterForTableView() {
    if (!this.filterManager) return;

    this.filterManager.container = document.querySelector('#products');
    this.filterManager.itemSelector = '.product-row';

    this.filterManager.filters = [
      {
        input: '#search_name',
        selector: '.products-index-product-name',
        matchType: 'includes'
      },
      {
        input: '#search_status',
        attribute: 'data-status',
        matchType: 'equals'
      },
      {
        input: '#search_price_range',
        getText: (row) => {
          const priceStr = row.getAttribute('data-price');
          const price = parseFloat(priceStr);

          if (isNaN(price)) return '';

          if (price <= 10) return '0-10';
          if (price <= 25) return '10-25';
          if (price <= 50) return '25-50';
          return '50+';
        },
        matchType: 'equals'
      }
    ];

    this.filterManager.filter();
  }

  initTableAnimations() {
    const rows = document.querySelectorAll('.product-row');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    rows.forEach((row) => {
      observer.observe(row);
    });
  }

  initSearchEnhancements() {
    const searchInput = document.querySelector('#search_name');
    const statusSelect = document.querySelector('#search_status');
    const priceSelect = document.querySelector('#search_price_range');

    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.updateResultsCount();
      }, 300));
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', () => {
        this.updateResultsCount();
      });
    }

    if (priceSelect) {
      priceSelect.addEventListener('change', () => {
        this.updateResultsCount();
      });
    }

    this.updateResultsCount();
  }

  updateResultsCount() {
    setTimeout(() => {
      const tableView = document.getElementById('tableView');
      const isTableVisible = tableView && tableView.style.display !== 'none';

      let visibleItems;
      if (isTableVisible) {
        visibleItems = document.querySelectorAll('.product-row:not(.products-index-filter-item-hidden)');
      } else {
        visibleItems = document.querySelectorAll('.products-index-product-card:not(.products-index-filter-item-hidden)');
      }

      const countBadge = document.querySelector('.products-index-table-title .badge');

      if (countBadge) {
        countBadge.textContent = visibleItems.length;

        if (visibleItems.length === 0) {
          countBadge.className = 'badge bg-warning text-dark ms-2';
        } else {
          countBadge.className = 'badge bg-light text-dark ms-2';
        }
      }
    }, 100);
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
}
