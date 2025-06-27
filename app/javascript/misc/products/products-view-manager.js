export class ProductsViewManager {
  constructor() {
    this.viewToggle = null;
    this.currentView = 'table';

    if (window.canteen) {
      window.canteen.productsViewManager = this;
    } else {
      window.canteen = { productsViewManager: this };
    }

    this.init();
  }

  init() {
    setTimeout(() => {
      this.initViewToggle();
      this.initTableAnimations();
    }, 100);
  }

  initViewToggle() {
    this.viewToggle = document.getElementById('viewToggle');
    const tableView = document.getElementById('tableView');
    const gridView = document.getElementById('gridView');

    if (!this.viewToggle || !tableView || !gridView) return;

    this.viewToggle.addEventListener('click', () => {
      const isTableVisible = this.currentView === 'table';

      if (isTableVisible) {
        this.switchToGridView(tableView, gridView);
      } else {
        this.switchToTableView(tableView, gridView);
      }
    });
  }

  switchToGridView(tableView, gridView) {
    tableView.style.display = 'none';
    gridView.style.display = 'grid';
    this.viewToggle.innerHTML = '<i class="bi bi-table"></i><span>Tabela</span>';
    this.viewToggle.title = 'Alternar para visualização em tabela';
    this.currentView = 'grid';
    this.notifyViewChange('grid');
  }

  switchToTableView(tableView, gridView) {
    tableView.style.display = 'block';
    gridView.style.display = 'none';
    this.viewToggle.innerHTML = '<i class="bi bi-grid-3x3-gap"></i><span>Grade</span>';
    this.viewToggle.title = 'Alternar para visualização em grade';
    this.currentView = 'table';
    this.notifyViewChange('table');
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

  getCurrentView() {
    return this.currentView;
  }

  notifyViewChange(newView) {
    const event = new CustomEvent('viewChanged', {
      detail: { view: newView }
    });
    document.dispatchEvent(event);
  }
}
