function getCSRFToken() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  return csrfToken ? csrfToken.getAttribute('content') : null;
}

function submitRailsForm(url, method = 'POST', data = {}) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';

  const csrfToken = getCSRFToken();
  if (csrfToken) {
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'authenticity_token';
    tokenInput.value = csrfToken;
    form.appendChild(tokenInput);
  }

  if (method.toUpperCase() !== 'POST') {
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = '_method';
    methodInput.value = method.toLowerCase();
    form.appendChild(methodInput);
  }

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

export {
  getCSRFToken,
  submitRailsForm
};
