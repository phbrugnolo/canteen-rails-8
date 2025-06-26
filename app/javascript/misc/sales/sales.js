import TomSelect from 'tom-select';

document.addEventListener('DOMContentLoaded', () => {
  if (window.canteen && window.canteen.controller_name !== 'sales') return;

  const customerCartSelect = document.getElementById('customer-id');
  if (customerCartSelect) {
    new TomSelect(customerCartSelect, {
      create: false,
      sortField: {
        field: 'text',
        direction: 'asc'
      },
      placeholder: 'Selecione um cliente...',
      searchField: ['text'],
      render: {
        option: (data, escape) => {
          return '<div class="py-2 px-1">' +
                   '<i class="bi bi-person-circle me-2 text-primary"></i>' +
                   '<span>' + escape(data.text) + '</span>' +
                 '</div>';
        },
        item: (data, escape) => {
          return '<div>' +
                   '<i class="bi bi-person-check me-2 text-success"></i>' +
                   '<span>' + escape(data.text) + '</span>' +
                 '</div>';
        }
      }
    });
  }

  const saleCards = document.querySelectorAll('.sales-index-card');
  if (!saleCards.length === 0) {
    saleCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.style.transform = 'translateY(-2px)';
      });

      card.addEventListener('mouseleave', () => {
        this.style.transform = 'translateY(0)';
      });
    });
  }
});
