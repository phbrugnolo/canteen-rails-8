import Cookie from './cookie';

export class Sidebar {
  static COOKIE_NAME = 'sidebarCollapsed';

  static CSS_CLASSES = {
    collapsed: 'collapsed',
    expanded: 'expanded',
    active: 'active'
  };

  static ICONS = {
    collapsed: 'bi-arrow-right-circle',
    expanded: 'bi-list'
  };

  constructor() {
    try {
      this.elements = this.cacheElements();
      this.validateRequiredElements();

      this.boundToggle = this.toggle.bind(this);

      this.init();
    } catch (error) {
      console.error('Failed to initialize Sidebar:', error);
    }
  }

  /**
   * Cache DOM elements for performance
   * @returns {Object} Object containing cached DOM elements
   */
  cacheElements() {
    return {
      sidebar: document.getElementById('sidebar'),
      toggle: document.getElementById('sidebarToggle'),
      dropdown: document.getElementById('dropdownUser'),
      mainContent: document.querySelector('.main-content')
    };
  }

  /**
   * Validate that required elements exist
   * @throws {Error} If required elements are missing
   */
  validateRequiredElements() {
    if (!this.elements.sidebar) {
      throw new Error('Required sidebar element with id "sidebar" not found');
    }
  }

  /**
   * Get current collapsed state
   * @returns {boolean} True if sidebar is collapsed
   */
  get isCollapsed() {
    return this.elements.sidebar?.classList.contains(Sidebar.CSS_CLASSES.collapsed) || false;
  }

  /**
   * Initialize the sidebar
   */
  init() {
    this.loadSavedState();
    this.bindEvents();
    this.setActiveNavItem();
  }

  /**
   * Load saved state from cookies
   */
  loadSavedState() {
    try {
      const isCollapsed = Cookie.get(Sidebar.COOKIE_NAME) === 'true';
      if (isCollapsed) {
        this.collapse();
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from cookie:', error);
    }
  }

  /**
   * Save sidebar state to cookies
   * @param {boolean} collapsed - Whether sidebar is collapsed
   */
  saveSidebarState(collapsed) {
    try {
      Cookie.set(Sidebar.COOKIE_NAME, collapsed.toString());
    } catch (error) {
      console.warn('Failed to save sidebar state:', error);
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.elements.toggle?.addEventListener('click', this.boundToggle);
  }

  /**
   * Toggle sidebar state
   */
  toggle() {
    try {
      this.isCollapsed ? this.expand() : this.collapse();
    } catch (error) {
      console.error('Error toggling sidebar:', error);
    }
  }

  /**
   * Collapse sidebar
   */
  collapse() {
    if (!this.elements.sidebar) return;

    this.elements.sidebar.classList.add(Sidebar.CSS_CLASSES.collapsed);
    this.elements.mainContent?.classList.add(Sidebar.CSS_CLASSES.expanded);
    this.updateToggleIcon(true);
    this.updateAriaState(false);
    this.saveSidebarState(true);
  }

  /**
   * Expand sidebar
   */
  expand() {
    if (!this.elements.sidebar) return;

    this.elements.sidebar.classList.remove(Sidebar.CSS_CLASSES.collapsed);
    this.elements.mainContent?.classList.remove(Sidebar.CSS_CLASSES.expanded);
    this.updateToggleIcon(false);
    this.updateAriaState(true);
    this.saveSidebarState(false);
  }

  /**
   * Update toggle button icon
   * @param {boolean} collapsed - Whether sidebar is collapsed
   */
  updateToggleIcon(collapsed) {
    const icon = this.elements.toggle?.querySelector('i');
    if (!icon) return;

    Object.values(Sidebar.ICONS).forEach(cls => icon.classList.remove(cls));
    const iconClass = collapsed ? Sidebar.ICONS.collapsed : Sidebar.ICONS.expanded;
    icon.classList.add(iconClass);
  }

  /**
   * Update ARIA state for accessibility
   * @param {boolean} expanded - Whether sidebar is expanded
   */
  updateAriaState(expanded) {
    if (this.elements.toggle) {
      this.elements.toggle.setAttribute('aria-expanded', expanded.toString());
    }

    if (this.elements.sidebar) {
      this.elements.sidebar.setAttribute('aria-hidden', (!expanded).toString());
    }
  }

  /**
   * Set active navigation item based on current path
   */
  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isActive = href === currentPath || (href !== '/' && currentPath.startsWith(href));

      link.classList.toggle(Sidebar.CSS_CLASSES.active, isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  /**
   * Refresh active navigation state (useful for SPA route changes)
   */
  refreshActiveNavItem() {
    this.setActiveNavItem();
  }

  /**
   * Check if sidebar is currently animating
   * @returns {boolean} True if animating
   */
  isAnimating() {
    return this.elements.sidebar?.classList.contains('animating') || false;
  }

  /**
   * Get current sidebar state
   * @returns {Object} Current state object
   */
  getState() {
    return {
      isCollapsed: this.isCollapsed,
      isAnimating: this.isAnimating()
    };
  }

  /**
   * Clean up resources and remove event listeners
   */
  destroy() {
    try {
      this.elements.toggle?.removeEventListener('click', this.boundToggle);
      this.elements = null;
      this.boundToggle = null;
    } catch (error) {
      console.error('Error during sidebar cleanup:', error);
    }
  }

  /**
   * Reinitialize sidebar (useful for dynamic content changes)
   */
  reinitialize() {
    this.destroy();
    this.elements = this.cacheElements();
    this.validateRequiredElements();
    this.init();
  }
}

export default Sidebar;
