
import { ProductsViewManager } from './products-view-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'products') return;

  new ProductsViewManager();
});
