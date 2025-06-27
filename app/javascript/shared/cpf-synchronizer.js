import { isValidCpf } from './cpf.js'

export class CPFSynchronizer {
  constructor(inputSelector) {
    this.input = typeof inputSelector === 'string'
      ? document.querySelector(inputSelector)
      : inputSelector;

    if (!this.input) return;

    this.formGroup = this.input.closest('.form-group');
    this.init();
  }

  init() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));

    if (this.input.value) {
      this.input.value = this.formatCPF(this.input.value);
      this.validate();
    }
  }

  handleInput(event) {
    let digits = event.target.value.replace(/\D/g, '');

    if (digits.length > 11) digits = digits.slice(0, 11);

    event.target.value = this.formatCPF(digits);
    this.removeErrorMarkup();
  }

  handleBlur() {
    this.validate();
  }

  formatCPF(value) {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
  }

  validate() {
    if (!this.input.value) {
      this.removeErrorMarkup();
      return;
    }

    isValidCpf(this.input.value) ? this.removeErrorMarkup() : this.addErrorMarkup();
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  addErrorMarkup() {
    if (!this.input) return;
    this.input.classList.add('is-invalid');
  }

  removeErrorMarkup() {
    if (!this.input) return;
    this.input.classList.remove('is-invalid');
  }
}
