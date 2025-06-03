import { CartDisplay } from './cart_display';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'customers') return;

  new CartDisplay();
});
