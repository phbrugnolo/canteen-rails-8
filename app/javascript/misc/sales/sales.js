import { CustomerTomSelect } from '../../shared/customer-tom-select.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'sales') return;

  const customerCartSelect = document.getElementById('customer-id');
  if (customerCartSelect) {
    CustomerTomSelect.createSingleSelect(customerCartSelect);
  }

  const saleCards = document.querySelectorAll('.sales-index-card');
  if (saleCards.length > 0) {
    saleCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
});
