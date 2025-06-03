class ConfirmationConfig {
  static configs = {
    activate: {
      title: 'Confirmar Ativação',
      text: 'Tem certeza que deseja ativar este {{entityName}}?',
      icon: 'question',
      buttonText: 'Sim, ativar',
      method: 'PATCH',
      customButtonClass: 'btn-activate-confirm'
    },
    deactivate: {
      title: 'Confirmar Desativação',
      text: 'Tem certeza que deseja desativar este {{entityName}}?',
      icon: 'warning',
      buttonText: 'Sim, desativar',
      method: 'PATCH',
      customButtonClass: 'btn-deactivate-confirm'
    },
    delete: {
      title: 'Confirmar Exclusão',
      text: 'Tem certeza que deseja excluir este {{entityName}}? Esta ação não pode ser desfeita.',
      icon: 'error',
      buttonText: 'Sim, excluir',
      method: 'DELETE',
      customButtonClass: 'btn-delete-confirm'
    }
  };

  static get(action) {
    return this.configs[action] || this.configs.activate;
  }

  static register(action, config) {
    this.configs[action] = { ...this.configs.activate, ...config };
  }

  static loadFromElement(element) {
    const serverConfig = element.dataset.confirmationConfig;
    if (serverConfig) {
      try {
        const parsed = JSON.parse(serverConfig);
        Object.entries(parsed).forEach(([action, config]) => {
          this.register(action, config);
        });
      } catch (error) {
        console.warn('Failed to parse confirmation config:', error);
      }
    }
  }
}

class ConfirmationBuilder {
  constructor() {
    this.config = {};
  }

  title(title) {
    this.config.title = title;
    return this;
  }

  text(text) {
    this.config.text = text;
    return this;
  }

  icon(icon) {
    this.config.icon = icon;
    return this;
  }

  buttonText(buttonText) {
    this.config.buttonText = buttonText;
    return this;
  }

  method(method) {
    this.config.method = method;
    return this;
  }

  customButtonClass(className) {
    this.config.customButtonClass = className;
    return this;
  }

  onSuccess(callback) {
    this.config.onSuccess = callback;
    return this;
  }

  redirectUrl(url) {
    this.config.redirectUrl = url;
    return this;
  }

  build() {
    return { ...this.config };
  }

  static create() {
    return new ConfirmationBuilder();
  }
}

class TextInterpolator {
  static interpolate(text, variables) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}

class ConfirmationManager {
  constructor(element) {
    this.element = element;
    this.options = this.extractOptions();
    this.bindEvents();

    ConfirmationConfig.loadFromElement(element);
  }

  extractOptions() {
    const dataset = this.element.dataset;
    return {
      url: dataset.url,
      method: dataset.method,
      entityName: dataset.entityName || 'item',
      entityType: dataset.entityType || 'item',
      action: dataset.action,
      confirmText: dataset.confirmText,
      title: dataset.title,
      icon: dataset.icon,
      buttonText: dataset.buttonText,
      onSuccess: dataset.onSuccess,
      redirectUrl: dataset.redirectUrl
    };
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleConfirmation();
    });
  }

  handleConfirmation() {
    const config = this.buildConfiguration();
    return this.executeConfirmation(config);
  }

  buildConfiguration() {
    const defaultConfig = ConfirmationConfig.get(this.options.action);
    const builder = ConfirmationBuilder.create();

    const variables = {
      entityName: this.options.entityName,
      entityType: this.options.entityType
    };

    builder
      .title(this.options.title || defaultConfig.title)
      .text(TextInterpolator.interpolate(
        this.options.confirmText || defaultConfig.text,
        variables
      ))
      .icon(this.options.icon || defaultConfig.icon)
      .buttonText(this.options.buttonText || defaultConfig.buttonText)
      .method(this.options.method || defaultConfig.method)
      .customButtonClass(defaultConfig.customButtonClass);

    if (this.options.onSuccess) {
      builder.onSuccess(() => {
        if (typeof this.options.onSuccess === 'function') {
          this.options.onSuccess();
        } else if (typeof window[this.options.onSuccess] === 'function') {
          window[this.options.onSuccess]();
        }
      });
    }

    if (this.options.redirectUrl) {
      builder.redirectUrl(this.options.redirectUrl);
    }

    return builder.build();
  }

  executeConfirmation(config) {
    return window.showRailsConfirmDialog({
      url: this.options.url,
      method: config.method,
      action: this.options.action,
      title: config.title,
      text: config.text,
      icon: config.icon,
      confirmButtonText: config.buttonText,
      customButtonClass: config.customButtonClass,
      onSuccess: () => {
        if (config.onSuccess) {
          config.onSuccess();
        }
        if (config.redirectUrl) {
          setTimeout(() => {
            window.location.href = config.redirectUrl;
          }, 1500);
        }

        this.element.dispatchEvent(new CustomEvent('confirmation:success', {
          detail: { action: this.options.action, config }
        }));
      },
      onCancel: () => {
        this.element.dispatchEvent(new CustomEvent('confirmation:cancel', {
          detail: { action: this.options.action, config }
        }));
      }
    });
  }
}

class ConfirmationFactory {
  static create(element) {
    if (!element.dataset.action) {
      throw new Error('Element must have data-action attribute');
    }
    return new ConfirmationManager(element);
  }

  static createFromSelector(selector) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map(element => this.create(element));
  }
}

function initializeConfirmationSystem() {
  const elements = document.querySelectorAll('[data-confirmation]');
  elements.forEach(element => {
    try {
      ConfirmationFactory.create(element);
    } catch (error) {
      console.warn('Failed to create confirmation manager:', error.message, element);
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeConfirmationSystem);

function reinitializeConfirmations(container = document) {
  const elements = container.querySelectorAll('[data-confirmation]:not([data-confirmation-initialized])');
  elements.forEach(element => {
    try {
      ConfirmationFactory.create(element);
      element.setAttribute('data-confirmation-initialized', 'true');
    } catch (error) {
      console.warn('Failed to initialize confirmation:', error.message, element);
    }
  });
}

window.ConfirmationSystem = {
  initialize: initializeConfirmationSystem,
  reinitialize: reinitializeConfirmations,
  registerConfig: ConfirmationConfig.register.bind(ConfirmationConfig),
  createManager: ConfirmationFactory.create.bind(ConfirmationFactory)
};

export {
  ConfirmationConfig,
  ConfirmationBuilder,
  TextInterpolator,
  ConfirmationManager,
  ConfirmationFactory,
  initializeConfirmationSystem,
  reinitializeConfirmations
};
