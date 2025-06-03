/**
 * ProductManager - Gerencia a listagem e busca de produtos
 */
export class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("products");
  }

  /**
   * Inicializa o gerenciador de produtos
   * @param {Array} products - Lista de produtos
   */
  initialize(products) {
    this.products = products;
    this.render();
    this.setupSearch();
  }

  /**
   * Renderiza a interface de produtos
   */
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
  }

  /**
   * Gera as linhas HTML dos produtos
   * @returns {string} HTML das linhas de produtos
   */
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

  /**
   * Configura a funcionalidade de busca
   */
  setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("keyup", (event) => {
      this.performSearch(event.target.value);
    });

    this.adjustTableSize();
  }

  /**
   * Executa a busca de produtos
   * @param {string} searchValue - Valor da busca
   */
  performSearch(searchValue) {
    const value = searchValue.toLowerCase().trim();
    const rows = document.querySelectorAll("#products-table tr");

    rows.forEach(row => {
      const isVisible = row.textContent.toLowerCase().includes(value);
      row.style.display = isVisible ? "" : "none";
    });

    this.adjustTableSize();
  }

  /**
   * Ajusta o tamanho da tabela baseado no número de itens visíveis
   */
  adjustTableSize() {
    const rows = Array.from(document.querySelectorAll("#products-table tr"));
    const visibleRows = rows.filter(row => row.style.display !== "none");
    const tableWrapper = document.querySelector("#products .table-wrapper-scroll-y");

    if (tableWrapper) {
      tableWrapper.style.maxHeight = visibleRows.length <= 5 ? "none" : "400px";
    }
  }

  /**
   * Vincula eventos de clique nos botões de adicionar
   * @param {Function} onAddProduct - Callback para quando um produto é adicionado
   */
  bindAddEvents(onAddProduct) {
    const addButtons = document.getElementsByClassName("add");

    Array.from(addButtons).forEach(button => {
      button.addEventListener("click", (event) => {
        const productIndex = parseInt(event.target.getAttribute("data-key"));
        const product = this.products[productIndex];
        if (product && onAddProduct) {
          onAddProduct(product);
        }
      });
    });
  }
}
