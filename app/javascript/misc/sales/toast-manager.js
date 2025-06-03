import { Toast } from 'bootstrap' ;

export class ToastManager {
  constructor() {
    this.toastContainer = null;
    this.createToastContainer();
  }

  createToastContainer() {
    const existing = document.getElementById('toast-container');
    if (existing) {
      existing.remove();
    }

    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'toast-container';
    this.toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    this.toastContainer.style.zIndex = '9999';
    document.body.appendChild(this.toastContainer);
  }

  show(message, type = 'success', duration = 3000) {
    const toastId = 'toast-' + Date.now();
    const iconClass = this.getIconClass(type);
    const bgClass = this.getBgClass(type);

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i class="${iconClass} me-2"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    this.toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new Toast(toastElement, {
      autohide: true,
      delay: duration
    });

    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });

    return toast;
  }

  getIconClass(type) {
    const icons = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-triangle-fill',
      warning: 'bi bi-exclamation-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return icons[type] || icons.info;
  }

  getBgClass(type) {
    const classes = {
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    return classes[type] || classes.info;
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}
