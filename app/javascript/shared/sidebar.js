import { Dropdown } from 'bootstrap';

export class Sidebar {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.content = document.getElementById('content');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.dropdownToggle = document.getElementById('dropdownUser');
    this.mainContent = document.querySelector('.main-content');
    this.isMobile = window.innerWidth <= 768;

    this.init();
  }

  init() {
    this.loadSavedState();
    this.bindEvents();
    this.handleResize();
    this.setActiveNavItem();
  }

  loadSavedState() {
    if (!this.isMobile) {
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      if (isCollapsed) {
        this.collapse();
      }
    }
  }

  bindEvents() {
    this.sidebarToggle?.addEventListener('click', () => this.toggle());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobile && this.sidebar?.classList.contains('show')) {
        this.hide();
      }
    });

    window.addEventListener('resize', () => this.handleResize());

    this.sidebar?.addEventListener('transitionend', () => {
      if (this.sidebar.classList.contains('collapsed') && this.dropdownToggle?.classList.contains('show')) {
        const dropdown = Dropdown.getInstance(this.dropdownToggle);
        dropdown?.hide();
      }
    });

    if (this.isMobile) {
      this.createBackdrop();
    }
  }

  toggle() {
    if (this.isMobile) {
      this.sidebar?.classList.contains('show') ? this.hide() : this.show();
    } else {
      this.sidebar?.classList.contains('collapsed') ? this.expand() : this.collapse();
    }
  }

  collapse() {
    this.sidebar?.classList.add('collapsed');
    this.mainContent?.classList.add('expanded');
    this.updateToggleIcon(true);
    this.updateAriaState(false);
    localStorage.setItem('sidebarCollapsed', 'true');
  }

  expand() {
    this.sidebar?.classList.remove('collapsed');
    this.mainContent?.classList.remove('expanded');
    this.updateToggleIcon(false);
    this.updateAriaState(true);
    localStorage.setItem('sidebarCollapsed', 'false');
  }

  show() {
    this.sidebar?.classList.add('show');
    this.showBackdrop();
    this.updateAriaState(true);
  }

  hide() {
    this.sidebar?.classList.remove('show');
    this.hideBackdrop();
    this.updateAriaState(false);
  }

  updateToggleIcon(collapsed) {
    const icon = this.sidebarToggle?.querySelector('i');
    if (!icon) return;

    if (collapsed) {
      icon.classList.remove('bi-list');
      icon.classList.add('bi-arrow-right-circle');
    } else {
      icon.classList.remove('bi-arrow-right-circle');
      icon.classList.add('bi-list');
    }
  }

  updateAriaState(expanded) {
    this.sidebarToggle?.setAttribute('aria-expanded', expanded.toString());
  }

  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'sidebar-backdrop';
    this.backdrop.addEventListener('click', () => this.hide());
    document.body.appendChild(this.backdrop);
  }

  showBackdrop() {
    this.backdrop?.classList.add('show');
  }

  hideBackdrop() {
    this.backdrop?.classList.remove('show');
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        this.sidebar?.classList.remove('collapsed');
        this.sidebar?.classList.remove('show');
        this.mainContent?.classList.remove('expanded');
        this.hideBackdrop();
        if (!this.backdrop) this.createBackdrop();
      } else {
        this.sidebar?.classList.remove('show');
        this.hideBackdrop();
        this.loadSavedState();
      }
    }
  }

  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
}
