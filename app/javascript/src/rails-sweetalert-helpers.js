class RailsFormSubmitter {
  static getCSRFToken() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    return csrfToken ? csrfToken.getAttribute('content') : null;
  }

  static async submit(url, method = 'POST', data = {}) {
    if (this.canUseFetch(method)) {
      return this.submitWithFetch(url, method, data);
    }

    return this.submitWithForm(url, method, data);
  }

  static canUseFetch(method) {
    const safeMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];
    return fetch && safeMethods.includes(method.toUpperCase());
  }

  static async submitWithFetch(url, method, data) {
    const csrfToken = this.getCSRFToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const config = {
      method: method.toUpperCase(),
      headers,
      credentials: 'same-origin'
    };

    if (method.toUpperCase() !== 'GET' && Object.keys(data).length > 0) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }

        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        return { success: true };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch submission failed:', error);
      return this.submitWithForm(url, method, data);
    }
  }

  static submitWithForm(url, method, data) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      this.addHiddenInput(form, 'authenticity_token', csrfToken);
    }

    if (method.toUpperCase() !== 'POST') {
      this.addHiddenInput(form, '_method', method.toLowerCase());
    }

    Object.entries(data).forEach(([key, value]) => {
      this.addHiddenInput(form, key, value);
    });

    document.body.appendChild(form);
    form.submit();
  }

  static addHiddenInput(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
}

class RailsConfirmationDialog {
  static defaultOptions = {
    title: 'Tem certeza?',
    text: '',
    icon: 'warning',
    confirmButtonText: 'Sim, continuar',
    cancelButtonText: 'Cancelar'
  };

  static async show(options = {}) {
    const config = this.buildConfiguration(options);

    try {
      const result = await window.showConfirmDialog(config);

      if (result.isConfirmed && options.url) {
        await this.handleConfirmation(options);
      }

      return result;
    } catch (error) {
      console.error('Confirmation dialog error:', error);
      throw error;
    }
  }

  static buildConfiguration(options) {
    const config = { ...this.defaultOptions, ...options };

    if (options.action && !options.customButtonClass) {
      config.customButtonClass = this.getButtonClassForAction(options.action);
    }

    return config;
  }

  static getButtonClassForAction(action) {
    const classMap = {
      activate: 'btn-activate-confirm',
      deactivate: 'btn-deactivate-confirm',
      delete: 'btn-delete-confirm'
    };
    return classMap[action] || '';
  }

  static async handleConfirmation(options) {
    const {
      url,
      method = 'POST',
      data = {},
      onSuccess,
      onError
    } = options;

    try {
      const result = await RailsFormSubmitter.submit(url, method, data);

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error);
      } else {
        console.error('Confirmation action failed:', error);
        window.showConfirmDialog({
          title: 'Erro',
          text: 'Ocorreu um erro ao processar a solicitação.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
      throw error;
    }
  }
}

window.showRailsConfirmDialog = function(options) {
  return RailsConfirmationDialog.show(options);
};

window.showEnhancedRailsConfirmDialog = function(options) {
  return RailsConfirmationDialog.show({
    ...options,
    onSuccess: (result) => {
      if (options.successMessage) {
        window.showConfirmDialog({
          title: 'Sucesso!',
          text: options.successMessage,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }

      if (options.onSuccess) {
        options.onSuccess(result);
      }
    },
    onError: (error) => {
      window.showConfirmDialog({
        title: 'Erro',
        text: options.errorMessage || 'Ocorreu um erro inesperado.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

      if (options.onError) {
        options.onError(error);
      }
    }
  });
};

export {
  RailsFormSubmitter,
  RailsConfirmationDialog
};
