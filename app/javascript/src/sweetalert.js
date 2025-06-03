import Swal from 'sweetalert2';

const AppSwal = Swal.mixin({
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

  if (options.customButtonClass) {
    finalOptions.customClass = {
      confirmButton: `swal2-confirm ${options.customButtonClass}`,
      cancelButton: 'swal2-cancel'
    };
  }

  return AppSwal.fire(finalOptions);
};

export { AppSwal };
export default AppSwal;
