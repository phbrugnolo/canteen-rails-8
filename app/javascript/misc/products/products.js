
import { ProductsViewManager } from './products-view-manager.js';
import { ProductShowManager } from './product-show-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'products') return;

  new ProductsViewManager();
  new ProductShowManager();
});
