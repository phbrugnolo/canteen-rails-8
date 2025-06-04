import { CartDisplay } from './cart-display';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'customers') return;

  new CartDisplay();
});
