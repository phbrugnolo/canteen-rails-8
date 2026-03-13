import Cookie from '../../shared/cookie';

export class ProductShowManager {
  constructor() {
    this.cookieName = 'productShowState';
    this.imageModal = document.querySelector('#imageModal');

    if (this.imageModal) {
      this.init();
    }
  }

  init() {
    this.restoreState();
    this.bindEvents();
  }

  restoreState() {
    const savedState = Cookie.get(this.cookieName);

    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        // Future: restore any saved state like expanded sections, etc.
        console.log('Product show state restored:', state);
      } catch (e) {
        console.error('Failed to parse product show state:', e);
      }
    }
  }

  bindEvents() {
    // Save state when image modal is shown
    if (this.imageModal) {
      this.imageModal.addEventListener('shown.bs.modal', () => {
        this.saveState({ lastModalView: new Date().toISOString() });
      });
    }

    // Save state periodically or on important interactions
    this.setupAutoSave();
  }

  saveState(additionalState = {}) {
    const currentState = this.getState();
    const newState = { ...currentState, ...additionalState };

    Cookie.set(this.cookieName, JSON.stringify(newState), { days: 30 });
  }

  getState() {
    const savedState = Cookie.get(this.cookieName);

    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        return {};
      }
    }

    return {};
  }

  setupAutoSave() {
    // Save state when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.saveState({ lastVisit: new Date().toISOString() });
    });
  }
}
