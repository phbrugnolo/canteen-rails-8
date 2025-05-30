import Cookie from './cookie';

export class Sidebar {
  static BREAKPOINT = 768;
  static COOKIE_NAME = 'sidebarCollapsed';
  static RESIZE_DEBOUNCE_DELAY = 150;

  static CSS_CLASSES = {
    collapsed: 'collapsed',
    expanded: 'expanded',
    show: 'show',
    backdrop: 'sidebar-backdrop',
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

      this.isMobile = this.checkIsMobile();
      this.resizeTimer = null;
      this.backdrop = null;

      // Bind methods to preserve context
      this.boundToggle = this.toggle.bind(this);
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      this.boundHandleResize = this.debounceResize.bind(this);
      this.boundHideOnBackdrop = this.hide.bind(this);

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
   * Check if current viewport is mobile
   * @returns {boolean} True if mobile viewport
   */
  checkIsMobile() {
    return window.innerWidth <= Sidebar.BREAKPOINT ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Get current collapsed state
   * @returns {boolean} True if sidebar is collapsed
   */
  get isCollapsed() {
    return this.elements.sidebar?.classList.contains(Sidebar.CSS_CLASSES.collapsed) || false;
  }

  /**
   * Get current visibility state
   * @returns {boolean} True if sidebar is visible (mobile)
   */
  get isVisible() {
    return this.elements.sidebar?.classList.contains(Sidebar.CSS_CLASSES.show) || false;
  }

  /**
   * Initialize the sidebar
   */
  init() {
    this.loadSavedState();
    this.bindEvents();
    this.handleResize();
    this.setActiveNavItem();
  }

  /**
   * Load saved state from cookies
   */
  loadSavedState() {
    if (!this.isMobile) {
      try {
        const isCollapsed = Cookie.get(Sidebar.COOKIE_NAME) === 'true';
        if (isCollapsed) {
          this.collapse();
        }
      } catch (error) {
        console.warn('Failed to load sidebar state from cookie:', error);
      }
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
    // Toggle button click
    this.elements.toggle?.addEventListener('click', this.boundToggle);

    // Keyboard events
    document.addEventListener('keydown', this.boundHandleKeydown);

    // Resize events (debounced)
    window.addEventListener('resize', this.boundHandleResize);

    // Create backdrop for mobile if needed
    if (this.isMobile) {
      this.createBackdrop();
    }
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeydown(e) {
    if (e.key === 'Escape' && this.isMobile && this.isVisible) {
      this.hide();
    }
  }

  /**
   * Debounced resize handler
   */
  debounceResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.handleResize(), Sidebar.RESIZE_DEBOUNCE_DELAY);
  }

  /**
   * Toggle sidebar state
   */
  toggle() {
    try {
      if (this.isMobile) {
        this.isVisible ? this.hide() : this.show();
      } else {
        this.isCollapsed ? this.expand() : this.collapse();
      }
    } catch (error) {
      console.error('Error toggling sidebar:', error);
    }
  }

  /**
   * Collapse sidebar (desktop)
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
   * Expand sidebar (desktop)
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
   * Show sidebar (mobile)
   */
  show() {
    if (!this.elements.sidebar) return;

    this.elements.sidebar.classList.add(Sidebar.CSS_CLASSES.show);
    this.showBackdrop();
    this.updateAriaState(true);

    // Prevent body scroll when sidebar is open on mobile
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide sidebar (mobile)
   */
  hide() {
    if (!this.elements.sidebar) return;

    this.elements.sidebar.classList.remove(Sidebar.CSS_CLASSES.show);
    this.hideBackdrop();
    this.updateAriaState(false);

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Update toggle button icon
   * @param {boolean} collapsed - Whether sidebar is collapsed
   */
  updateToggleIcon(collapsed) {
    const icon = this.elements.toggle?.querySelector('i');
    if (!icon) return;

    // Remove all possible icon classes
    Object.values(Sidebar.ICONS).forEach(cls => icon.classList.remove(cls));

    // Add appropriate class
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
   * Create backdrop element for mobile
   */
  createBackdrop() {
    if (this.backdrop) return; // Prevent duplicate creation

    this.backdrop = document.createElement('div');
    this.backdrop.className = Sidebar.CSS_CLASSES.backdrop;
    this.backdrop.setAttribute('aria-hidden', 'true');
    this.backdrop.addEventListener('click', this.boundHideOnBackdrop);
    document.body.appendChild(this.backdrop);
  }

  /**
   * Show backdrop
   */
  showBackdrop() {
    if (this.backdrop) {
      this.backdrop.classList.add(Sidebar.CSS_CLASSES.show);
    }
  }

  /**
   * Hide backdrop
   */
  hideBackdrop() {
    if (this.backdrop) {
      this.backdrop.classList.remove(Sidebar.CSS_CLASSES.show);
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = this.checkIsMobile();

    // Only act if mobile state changed
    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        // Switched to mobile
        this.elements.sidebar?.classList.remove(Sidebar.CSS_CLASSES.collapsed);
        this.elements.sidebar?.classList.remove(Sidebar.CSS_CLASSES.show);
        this.elements.mainContent?.classList.remove(Sidebar.CSS_CLASSES.expanded);
        this.hideBackdrop();
        document.body.style.overflow = '';

        if (!this.backdrop) {
          this.createBackdrop();
        }
      } else {
        // Switched to desktop
        this.elements.sidebar?.classList.remove(Sidebar.CSS_CLASSES.show);
        this.hideBackdrop();
        document.body.style.overflow = '';
        this.loadSavedState();
      }
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

      // Check for exact match or if current path starts with link href (for nested routes)
      const isActive = href === currentPath ||
                      (href !== '/' && currentPath.startsWith(href));

      // Update classes and ARIA attributes
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
      isVisible: this.isVisible,
      isMobile: this.isMobile,
      isAnimating: this.isAnimating()
    };
  }

  /**
   * Clean up resources and remove event listeners
   */
  destroy() {
    try {
      // Clear timers
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

      // Remove event listeners
      this.elements.toggle?.removeEventListener('click', this.boundToggle);
      document.removeEventListener('keydown', this.boundHandleKeydown);
      window.removeEventListener('resize', this.boundHandleResize);

      // Remove backdrop
      if (this.backdrop) {
        this.backdrop.removeEventListener('click', this.boundHideOnBackdrop);
        this.backdrop.remove();
        this.backdrop = null;
      }

      // Restore body styles
      document.body.style.overflow = '';

      // Clear references
      this.elements = null;
      this.boundToggle = null;
      this.boundHandleKeydown = null;
      this.boundHandleResize = null;
      this.boundHideOnBackdrop = null;

    } catch (error) {
      console.error('Error during sidebar cleanup:', error);
    }
  }

  /**
   * Reinitialize sidebar (useful for dynamic content changes)
   */
  reinitialize() {
    this.destroy();

    // Re-cache elements and reinitialize
    this.elements = this.cacheElements();
    this.validateRequiredElements();
    this.isMobile = this.checkIsMobile();

    this.init();
  }
}

export default Sidebar;
