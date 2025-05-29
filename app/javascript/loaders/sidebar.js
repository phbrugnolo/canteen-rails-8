import { Dropdown } from 'bootstrap';

class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.content = document.getElementById('content');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.dropdownToggle = document.getElementById('dropdownUser');
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
    // Toggle sidebar
    this.sidebarToggle?.addEventListener('click', () => this.toggle());

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobile && this.sidebar?.classList.contains('show')) {
        this.hide();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Close dropdown when sidebar collapses
    this.sidebar?.addEventListener('transitionend', () => {
      if (this.sidebar.classList.contains('collapsed') && this.dropdownToggle?.classList.contains('show')) {
        const dropdown = Dropdown.getInstance(this.dropdownToggle);
        dropdown?.hide();
      }
    });

    // Add backdrop for mobile
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
    this.updateToggleIcon(true);
    this.updateAriaState(false);
    localStorage.setItem('sidebarCollapsed', 'true');
  }

  expand() {
    this.sidebar?.classList.remove('collapsed');
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
      icon.classList.add('bi-arrow-right-circle'); // Better icon for collapsed state
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
        // Switched to mobile
        this.sidebar?.classList.remove('collapsed');
        this.sidebar?.classList.remove('show');
        this.hideBackdrop();
        if (!this.backdrop) this.createBackdrop();
      } else {
        // Switched to desktop
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SidebarManager();
});
