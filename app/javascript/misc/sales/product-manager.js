import { FilterManager } from '../../shared/filter-manager.js';

export class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("products");
    this.filterManager = null;
  }

  initialize(products) {
    this.products = products;
    this.onAddProduct = null;
    this.render();
    this.setupFilter();
    this.setupEvents();
  }

  render() {
    this.container.innerHTML = `
      <input id="search-input" type="text" placeholder="Buscar produto" class="mx-4">
      <div class="text-center table-wrapper-scroll-y">
        <table class="table table-bordered table-hover my-4 mx-6 my-custom-scrollbar">
          <thead class="table-size">
            <tr>
              <th scope="col" class="col-2"></th>
              <th scope="col" class="col-6">Produto</th>
              <th scope="col" class="col-2">Preço (R$)</th>
              <th scope="col" class="col-2"></th>
            </tr>
          </thead>
          <tbody id="products-table" class="table-size">
            ${this.generateProductRows()}
          </tbody>
        </table>
      </div>
    `;

    this.setupEvents();
  }

  generateProductRows() {
    return this.products.map((product, index) => {
      const formattedPrice = parseFloat(product.price).toFixed(2);
      return `
        <tr>
          <td scope="row" class="col-2">
            <img src="${product.image_url}" height="55" alt="Imagem do produto"/>
          </td>
          <td class="col-6">${product.name}</td>
          <td class="col-2">${formattedPrice}</td>
          <td class="col-2 text-center">
            <input type="button" class="btn btn-success add" data-key="${index}" value="Adicionar">
          </td>
        </tr>
      `;
    }).join('');
  }

  setupFilter() {
    this.filterManager = new FilterManager({
      container: '#products-table',
      items: 'tr',
      noResultsMessage: 'Nenhum produto encontrado',
      noResultsIcon: 'bi-box-seam',
      filters: [
        {
          input: '#search-input',
          getText: (row) => {
            const nameCell = row.querySelector('td:nth-child(2)');
            return nameCell ? nameCell.textContent : '';
          },
          matchType: 'includes'
        }
      ]
    });

    this.filterManager.onFilter = () => {
      this.adjustTableSize();
    };
  }

  adjustTableSize() {
    const rows = Array.from(document.querySelectorAll("#products-table tr"));
    const visibleRows = rows.filter(row => row.style.display !== "none");
    const tableWrapper = document.querySelector("#products .table-wrapper-scroll-y");

    if (tableWrapper) {
      tableWrapper.style.maxHeight = visibleRows.length <= 5 ? "none" : "400px";
    }
  }

  bindAddEvents(onAddProduct) {
    this.onAddProduct = onAddProduct;
  }

  setupEvents() {
    if (this.handleAddProduct && this.container) {
      this.container.removeEventListener('click', this.handleAddProduct);
    }

    this.handleAddProduct = (event) => {
      if (event.target.classList.contains('add')) {
        event.preventDefault();
        event.stopPropagation();

        const productIndex = parseInt(event.target.getAttribute("data-key"));
        const product = this.products[productIndex];
        if (product && this.onAddProduct) {
          const productCopy = {
            ...product,
            price: parseFloat(product.price)
          };
          this.onAddProduct(productCopy);
        }
      }
    };

    if (this.container) {
      this.container.addEventListener('click', this.handleAddProduct);
    }
  }

  destroy() {
    if (this.handleAddProduct && this.container) {
      this.container.removeEventListener('click', this.handleAddProduct);
      this.handleAddProduct = null;
    }

    if (this.filterManager) {
      this.filterManager = null;
    }
  }
}
