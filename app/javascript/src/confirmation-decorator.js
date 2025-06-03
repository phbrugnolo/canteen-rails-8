// Confirmation Decorator Pattern for Rails Applications
// This module implements the Decorator pattern to add confirmation behaviors to HTML elements

/**
 * Base Confirmation Decorator
 */
class ConfirmationDecorator {
  constructor(element) {
    this.element = element;
    this.options = this.extractOptions();
    this.bindEvents();
  }

  /**
   * Extract configuration from data attributes
   */
  extractOptions() {
    const element = this.element;
    return {
      url: element.dataset.url,
      method: element.dataset.method || 'PATCH',
      entityName: element.dataset.entityName || 'item',
      entityType: element.dataset.entityType || 'item',
      action: element.dataset.action,
      confirmText: element.dataset.confirmText,
      title: element.dataset.title,
      icon: element.dataset.icon,
      buttonText: element.dataset.buttonText,
      onSuccess: element.dataset.onSuccess,
      redirectUrl: element.dataset.redirectUrl
    };
  }

  /**
   * Bind click event to the element
   */
  bindEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleClick();
    });
  }

  /**
   * Handle the click event (to be implemented by concrete decorators)
   */
  handleClick() {
    throw new Error('handleClick method must be implemented by concrete decorator');
  }

  /**
   * Execute the confirmation dialog
   */
  executeConfirmation(dialogOptions) {
    return window.showRailsConfirmDialog({
      url: this.options.url,
      method: this.options.method,
      action: this.options.action,
      ...dialogOptions,
      onSuccess: () => {
        if (this.options.onSuccess) {
          // Execute custom success handler if provided
          window[this.options.onSuccess]();
        }
        if (this.options.redirectUrl) {
          setTimeout(() => {
            window.location.href = this.options.redirectUrl;
          }, 1500);
        }
      }
    });
  }
}

/**
 * Activation Confirmation Decorator
 */
class ActivationConfirmationDecorator extends ConfirmationDecorator {
  handleClick() {
    const dialogOptions = {
      title: this.options.title || 'Confirmar Ativação',
      text: this.options.confirmText || `Tem certeza que deseja ativar este ${this.options.entityName}?`,
      icon: this.options.icon || 'question',
      confirmButtonText: this.options.buttonText || 'Sim, ativar'
    };

    this.executeConfirmation(dialogOptions);
  }
}

/**
 * Deactivation Confirmation Decorator
 */
class DeactivationConfirmationDecorator extends ConfirmationDecorator {
  handleClick() {
    const dialogOptions = {
      title: this.options.title || 'Confirmar Desativação',
      text: this.options.confirmText || `Tem certeza que deseja desativar este ${this.options.entityName}?`,
      icon: this.options.icon || 'warning',
      confirmButtonText: this.options.buttonText || 'Sim, desativar'
    };

    this.executeConfirmation(dialogOptions);
  }
}

/**
 * Delete Confirmation Decorator
 */
class DeleteConfirmationDecorator extends ConfirmationDecorator {
  handleClick() {
    const dialogOptions = {
      title: this.options.title || 'Confirmar Exclusão',
      text: this.options.confirmText || `Tem certeza que deseja excluir este ${this.options.entityName}? Esta ação não pode ser desfeita.`,
      icon: this.options.icon || 'error',
      confirmButtonText: this.options.buttonText || 'Sim, excluir',
      method: 'DELETE'
    };

    this.executeConfirmation(dialogOptions);
  }
}

/**
 * Decorator Factory
 */
class ConfirmationDecoratorFactory {
  static create(element) {
    const action = element.dataset.action;

    switch (action) {
      case 'activate':
        return new ActivationConfirmationDecorator(element);
      case 'deactivate':
        return new DeactivationConfirmationDecorator(element);
      case 'delete':
        return new DeleteConfirmationDecorator(element);
      default:
        throw new Error(`Unknown confirmation action: ${action}`);
    }
  }
}

/**
 * Auto-initialize decorators on DOM load
 */
function initializeConfirmationDecorators() {
  const elements = document.querySelectorAll('[data-confirmation]');
  elements.forEach(element => {
    try {
      ConfirmationDecoratorFactory.create(element);
    } catch (error) {
      console.warn('Failed to create confirmation decorator:', error.message, element);
    }
  });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConfirmationDecorators);

// Re-initialize when new content is loaded (for Turbo/AJAX)
document.addEventListener('turbo:load', initializeConfirmationDecorators);

// Export for manual usage
export {
  ConfirmationDecorator,
  ActivationConfirmationDecorator,
  DeactivationConfirmationDecorator,
  DeleteConfirmationDecorator,
  ConfirmationDecoratorFactory,
  initializeConfirmationDecorators
};
