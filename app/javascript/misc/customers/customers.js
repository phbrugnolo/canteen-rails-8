import { CPFSynchronizer } from '../../shared/cpf-synchronizer';
import { CartDisplay } from './cart-display';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'customers') return;

  new CartDisplay();

  const cpfField = document.querySelector('#customer_cpf');
  if (cpfField) new CPFSynchronizer(cpfField);
});
