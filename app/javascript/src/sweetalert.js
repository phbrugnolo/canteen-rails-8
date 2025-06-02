import Swal from 'sweetalert2';

const AppSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-2',
    cancelButton: 'btn btn-secondary'
  },
  buttonsStyling: false,
  reverseButtons: true
});

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

export { AppSwal };
export default AppSwal;
