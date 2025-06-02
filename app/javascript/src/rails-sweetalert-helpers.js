// Rails SweetAlert2 Helper Functions
// This file provides helper functions to integrate SweetAlert2 with Rails applications

// Helper function to get CSRF token
function getCSRFToken() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  return csrfToken ? csrfToken.getAttribute('content') : null;
}

// Helper function to create and submit Rails forms programmatically
function submitRailsForm(url, method = 'POST', data = {}) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';

  // Add CSRF token
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'authenticity_token';
    tokenInput.value = csrfToken;
    form.appendChild(tokenInput);
  }

  // Add method override if needed
  if (method.toUpperCase() !== 'POST') {
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = '_method';
    methodInput.value = method.toLowerCase();
    form.appendChild(methodInput);
  }

  // Add additional data
  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

// Enhanced confirmation function with Rails integration
window.showRailsConfirmDialog = function(options) {
  const {
    url,
    method = 'POST',
    data = {},
    title = 'Tem certeza?',
    text = '',
    icon = 'warning',
    confirmButtonText = 'Sim, continuar',
    cancelButtonText = 'Cancelar',
    onSuccess = null,
    onCancel = null
  } = options;

  return window.showConfirmDialog({
    title,
    text,
    icon,
    confirmButtonText,
    cancelButtonText
  }).then((result) => {
    if (result.isConfirmed) {
      if (url) {
        submitRailsForm(url, method, data);
      }
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } else if (onCancel && typeof onCancel === 'function') {
      onCancel(result);
    }
    return result;
  });
};

// Specific functions for common Rails actions
window.showRailsActivationDialog = function(entityName, url, data = {}) {
  return window.showRailsConfirmDialog({
    url,
    method: 'PATCH',
    data,
    title: 'Confirmar Ativação',
    text: `Tem certeza que deseja ativar este ${entityName}?`,
    icon: 'question',
    confirmButtonText: 'Sim, ativar'
  });
};

window.showRailsDeactivationDialog = function(entityName, url, data = {}) {
  return window.showRailsConfirmDialog({
    url,
    method: 'PATCH',
    data,
    title: 'Confirmar Desativação',
    text: `Tem certeza que deseja desativar este ${entityName}?`,
    icon: 'warning',
    confirmButtonText: 'Sim, desativar'
  });
};

window.showRailsDeleteDialog = function(entityName, url, data = {}) {
  return window.showRailsConfirmDialog({
    url,
    method: 'DELETE',
    data,
    title: 'Confirmar Exclusão',
    text: `Tem certeza que deseja excluir este ${entityName}? Esta ação não pode ser desfeita.`,
    icon: 'error',
    confirmButtonText: 'Sim, excluir'
  });
};

// Function to show success message after form submission
window.showPostActionSuccess = function(message, redirectUrl = null) {
  window.showSuccessAlert('Sucesso!', message).then(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  });
};

// Function to show error message after form submission
window.showPostActionError = function(message) {
  window.showErrorAlert('Erro!', message);
};

// Export functions for module usage (optional)
export {
  getCSRFToken,
  submitRailsForm
};
