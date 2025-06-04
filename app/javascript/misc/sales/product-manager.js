export class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("products");
    this.filterManager = null;
    this.handleMouseEnter = null;
    this.handleMouseLeave = null;
    this.handleSearch = null;
    this.handleAddProduct = null;
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
      <!-- Search Section -->
      <div class="p-3 bg-light border-bottom">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input id="search-input"
                 type="text"
                 placeholder="Buscar produto..."
                 class="form-control border-start-0"
                 style="box-shadow: none;">
        </div>
      </div>

      <!-- Products Grid -->
      <div class="p-3">
        <div id="products-grid" class="row g-3">
          ${this.generateProductCards()}
        </div>
        <div id="no-results" class="text-center py-5 d-none">
          <i class="bi bi-search display-1 text-muted"></i>
          <p class="text-muted mt-3">Nenhum produto encontrado</p>
          <small class="text-muted">Tente buscar com outras palavras</small>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  generateProductCards() {
    return this.products.map((product, index) => {
      const formattedPrice = parseFloat(product.price).toFixed(2);
      return `
        <div class="col-md-6 col-lg-4 product-card" data-name="${product.name.toLowerCase()}">
          <div class="card h-100 shadow-sm border-0 product-item" style="transition: all 0.3s ease;">
            <div class="card-img-top d-flex align-items-center justify-content-center bg-light"
                 style="height: 120px; overflow: hidden;">
              <img src="${product.image_url}"
                   alt="Imagem do produto ${product.name}"
                   class="img-fluid"
                   style="max-height: 100px; max-width: 100%; object-fit: contain;"
                   onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cg=='"/>
            </div>
            <div class="card-body p-3">
              <h6 class="card-title mb-2 fw-semibold text-truncate" title="${product.name}">
                ${product.name}
              </h6>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0 text-success fw-bold">R$ ${formattedPrice}</span>
                <button type="button"
                        class="btn btn-success btn-sm add fw-semibold px-3"
                        data-key="${index}"
                        style="border-radius: 20px; box-shadow: 0 2px 8px rgba(25, 135, 84, 0.3);">
                  <i class="bi bi-plus-circle me-1"></i>
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  setupFilter() {
    const searchInput = document.getElementById('search-input');
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');

    if (!searchInput || !productsGrid) return;

    this.handleSearch = (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      const productCards = productsGrid.querySelectorAll('.product-card');
      let visibleCount = 0;

      productCards.forEach(card => {
        const productName = card.dataset.name;
        const isVisible = productName.includes(searchTerm);

        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
      });

      if (noResults) {
        noResults.classList.toggle('d-none', visibleCount > 0);
      }
    };

    searchInput.addEventListener('input', this.handleSearch);

    this.addHoverEffects();
  }

  addHoverEffects() {
    this.handleMouseEnter = (e) => {
      if (e.target.closest('.product-item')) {
        const card = e.target.closest('.product-item');
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }
    };

    this.handleMouseLeave = (e) => {
      if (e.target.closest('.product-item')) {
        const card = e.target.closest('.product-item');
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }
    };

    this.container.addEventListener('mouseenter', this.handleMouseEnter, true);
    this.container.addEventListener('mouseleave', this.handleMouseLeave, true);
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

        const button = event.target;
        const productIndex = parseInt(button.getAttribute("data-key"));
        const product = this.products[productIndex];

        if (product && this.onAddProduct) {
          button.classList.add('animate-success');
          button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Adicionado!';
          button.disabled = true;

          setTimeout(() => {
            button.classList.remove('animate-success');
            button.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Adicionar';
            button.disabled = false;
          }, 1000);

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

    if (this.handleMouseEnter && this.container) {
      this.container.removeEventListener('mouseenter', this.handleMouseEnter, true);
      this.handleMouseEnter = null;
    }

    if (this.handleMouseLeave && this.container) {
      this.container.removeEventListener('mouseleave', this.handleMouseLeave, true);
      this.handleMouseLeave = null;
    }

    const searchInput = document.getElementById('search-input');
    if (this.handleSearch && searchInput) {
      searchInput.removeEventListener('input', this.handleSearch);
      this.handleSearch = null;
    }
  }
}
