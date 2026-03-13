import { CPFSynchronizer } from '../../shared/cpf-synchronizer';
import { CartDisplay } from './cart-display';
import { CustomerTabsManager } from './customer-tabs-manager';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'customers') return;

  new CartDisplay();
  new CustomerTabsManager();

  const cpfField = document.querySelector('#customer_cpf');
  if (cpfField) new CPFSynchronizer(cpfField);
});
