import Cookie from '../../shared/cookie';

export class CustomerTabsManager {
  constructor() {
    this.cookieName = 'customerActiveTab';
    this.tabsElement = document.querySelector('#customerShowTabs');

    if (this.tabsElement) {
      this.init();
    }
  }

  init() {
    this.restoreActiveTab();
    this.bindTabEvents();
  }

  restoreActiveTab() {
    const savedTab = Cookie.get(this.cookieName);

    if (savedTab) {
      const tabButton = document.querySelector(`button[data-bs-target="${savedTab}"]`);

      if (tabButton) {
        // Remove active classes from all tabs
        const allTabs = this.tabsElement.querySelectorAll('.nav-link');
        allTabs.forEach(tab => {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        });

        // Remove active classes from all tab panes
        const allTabPanes = document.querySelectorAll('.tab-pane');
        allTabPanes.forEach(pane => {
          pane.classList.remove('show', 'active');
        });

        // Activate the saved tab
        tabButton.classList.add('active');
        tabButton.setAttribute('aria-selected', 'true');

        // Activate the corresponding tab pane
        const targetPane = document.querySelector(savedTab);
        if (targetPane) {
          targetPane.classList.add('show', 'active');
        }
      }
    }
  }

  bindTabEvents() {
    const tabButtons = this.tabsElement.querySelectorAll('button[data-bs-toggle="tab"]');

    tabButtons.forEach(button => {
      button.addEventListener('shown.bs.tab', (event) => {
        const target = event.target.getAttribute('data-bs-target');
        if (target) {
          Cookie.set(this.cookieName, target);
        }
      });
    });
  }
}
