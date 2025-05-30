import { Sidebar } from '../shared/sidebar';
import { SalesFilters } from '../misc/sales_filters';
import { ProductsFilters } from '../misc/products_filters';
import { CustomersFilters } from '../misc/customers_filters';

document.addEventListener('DOMContentLoaded', () => {
  new Sidebar();
  if (window.canteen && window.canteen.controller_name === 'sales') new SalesFilters();
  if (window.canteen && window.canteen.controller_name === 'products') new ProductsFilters();
  if (window.canteen && window.canteen.controller_name === 'customers') new CustomersFilters();
});
