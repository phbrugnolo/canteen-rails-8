

// Custom configuration for the application
const AppSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-2',
    cancelButton: 'btn btn-secondary'
  },
  buttonsStyling: false,
  reverseButtons: true
});

// Custom function for confirmation dialogs
window.showConfirmDialog = function(options) {
  const defaultOptions = {
    title: 'Tem certeza?',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, continuar',
    cancelButtonText: 'Cancelar'
  };

  const finalOptions = { ...defaultOptions, ...options };

  return AppSwal.fire(finalOptions);
};

// Function for activation confirmation
window.showActivationDialog = function(entityName = 'item') {
  return showConfirmDialog({
    title: 'Confirmar Ativação',
    text: `Tem certeza que deseja ativar este ${entityName}?`,
    icon: 'question',
    confirmButtonText: 'Sim, ativar',
    confirmButtonClass: 'btn btn-success me-2'
  });
};

// Function for deactivation confirmation
window.showDeactivationDialog = function(entityName = 'item') {
  return showConfirmDialog({
    title: 'Confirmar Desativação',
    text: `Tem certeza que deseja desativar este ${entityName}?`,
    icon: 'warning',
    confirmButtonText: 'Sim, desativar',
    confirmButtonClass: 'btn btn-danger me-2'
  });
};

// Function for success messages
window.showSuccessAlert = function(title = 'Sucesso!', text = '') {
  return AppSwal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK'
  });
};

// Function for error messages
window.showErrorAlert = function(title = 'Erro!', text = '') {
  return AppSwal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK'
  });
};

// Function for info messages
window.showInfoAlert = function(title = 'Informação', text = '') {
  return AppSwal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText: 'OK'
  });
};

export { AppSwal, Swal };
export default AppSwal;
