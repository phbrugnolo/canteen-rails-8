import TomSelect from 'tom-select';

/**
 * CustomerTomSelect - Standardized TomSelect configuration for customer inputs
 *
 * This class provides a consistent configuration for all customer selection inputs
 * across the application, combining the best features from both single and multiple
 * select configurations.
 */
export class CustomerTomSelect {
  /**
   * Default configuration for customer TomSelect inputs
   */
  static DEFAULT_CONFIG = {
    create: false,
    searchField: ['text'],
    sortField: {
      field: 'text',
      direction: 'asc'
    },
    allowEmptyOption: false,
    plugins: [],
    dropdownParent: 'body',
    render: {
      option: (data, escape) => {
        return '<div class="py-2 px-1">' +
                 '<i class="bi bi-person-circle me-2 text-primary"></i>' +
                 '<span>' + escape(data.text) + '</span>' +
               '</div>';
      },
      item: (data, escape) => {
        return '<div>' +
                 '<i class="bi bi-person-check me-2 text-success"></i>' +
                 '<span>' + escape(data.text) + '</span>' +
               '</div>';
      },
      no_results: () => {
        return '<div class="no-results text-muted p-2">' +
                 '<i class="bi bi-person-x me-2"></i>' +
                 'Nenhum cliente encontrado' +
               '</div>';
      }
    }
  };

  /**
   * Configuration for multiple select (filters)
   */
  static MULTIPLE_CONFIG = {
    ...CustomerTomSelect.DEFAULT_CONFIG,
    plugins: ['remove_button'],
    maxItems: null,
    render: {
      ...CustomerTomSelect.DEFAULT_CONFIG.render,
      item: (data, escape) => {
        return '<div class="d-flex align-items-center">' +
                 '<i class="bi bi-person-check me-2 text-success"></i>' +
                 '<span>' + escape(data.text) + '</span>' +
               '</div>';
      }
    }
  };

  /**
   * Create a single customer select
   * @param {string|HTMLElement} element - Element selector or DOM element
   * @param {Object} options - Additional configuration options
   * @returns {TomSelect} TomSelect instance
   */
  static createSingleSelect(element, options = {}) {
    const config = {
      ...CustomerTomSelect.DEFAULT_CONFIG,
      placeholder: options.placeholder || 'Selecione um cliente...',
      items: [],
      ...options
    };

    const selectElement = typeof element === 'string' ? document.querySelector(element) : element;

    if (selectElement) {
      Array.from(selectElement.options).forEach(option => {
        if (!option.value || option.value === '') option.remove();
      });
    }

    return new TomSelect(element, config);
  }

  /**
   * Create a multiple customer select (for filters)
   * @param {string|HTMLElement} element - Element selector or DOM element
   * @param {Object} options - Additional configuration options
   * @returns {TomSelect} TomSelect instance
   */
  static createMultipleSelect(element, options = {}) {
    const config = {
      ...CustomerTomSelect.MULTIPLE_CONFIG,
      placeholder: options.placeholder || 'Selecione clientes...',
      ...options
    };

    return new TomSelect(element, config);
  }

  /**
   * Create a customer select with dynamic options (for filters)
   * @param {string|HTMLElement} element - Element selector or DOM element
   * @param {Array} customerNames - Array of customer names
   * @param {Object} options - Additional configuration options
   * @returns {TomSelect} TomSelect instance
   */
  static createFilterSelect(element, customerNames = [], options = {}) {
    const selectElement = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!selectElement) {
      console.warn('CustomerTomSelect: Element not found');
      return null;
    }

    // Clear existing options
    selectElement.innerHTML = '';

    // Add customer names as options
    customerNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      selectElement.appendChild(option);
    });

    const config = {
      ...CustomerTomSelect.MULTIPLE_CONFIG,
      placeholder: selectElement.getAttribute('data-placeholder') || 'Selecione clientes...',
      ...options
    };

    return new TomSelect(selectElement, config);
  }

  /**
   * Auto-initialize customer selects based on common selectors
   * Call this method to automatically setup all customer selects on the page
   */
  static autoInit() {
    // Single customer select (sales form)
    const customerCartSelect = document.getElementById('customer-id');
    if (customerCartSelect) {
      CustomerTomSelect.createSingleSelect(customerCartSelect);
    }

    // Multiple customer select (sales filter)
    const customerFilterSelect = document.getElementById('search_customers');
    if (customerFilterSelect) {
      const customerNames = CustomerTomSelect.extractCustomerNamesFromPage();
      CustomerTomSelect.createFilterSelect(customerFilterSelect, customerNames);
    }
  }

  /**
   * Extract unique customer names from sales cards on the page
   * @returns {Array} Array of unique customer names
   */
  static extractCustomerNamesFromPage() {
    const customerNames = new Set();
    const salesCards = document.querySelectorAll('.sales-index-card');

    salesCards.forEach(card => {
      const customerNameElement = card.querySelector('.sales-index-customer-name');
      if (customerNameElement) {
        const customerName = customerNameElement.textContent.trim();
        if (customerName) {
          customerNames.add(customerName);
        }
      }
    });

    return Array.from(customerNames).sort();
  }

  /**
   * Update the placeholder for a TomSelect instance
   * @param {TomSelect} instance - TomSelect instance
   * @param {string} placeholder - New placeholder text
   */
  static updatePlaceholder(instance, placeholder) {
    if (instance && instance.settings) {
      instance.settings.placeholder = placeholder;
      instance.updatePlaceholder();
    }
  }

  /**
   * Get customer names from existing options in a select element
   * @param {string|HTMLElement} element - Element selector or DOM element
   * @returns {Array} Array of customer names
   */
  static getExistingOptions(element) {
    const selectElement = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!selectElement) return [];

    return Array.from(selectElement.options)
      .map(option => option.value)
      .filter(value => value.length > 0);
  }

  /**
   * Refresh a customer select with new options
   * @param {TomSelect} instance - TomSelect instance
   * @param {Array} customerNames - New array of customer names
   */
  static refreshOptions(instance, customerNames = []) {
    if (!instance) return;

    instance.clearOptions();

    customerNames.forEach(name => {
      instance.addOption({
        value: name,
        text: name
      });
    });

    instance.refreshOptions();
  }

  /**
   * Destroy a TomSelect instance and clean up
   * @param {TomSelect} instance - TomSelect instance to destroy
   */
  static destroy(instance) {
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }
  }
}

export default CustomerTomSelect;
