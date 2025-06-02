
export class CartDisplay {
  constructor() {
    this.init();
  }

  init() {
    this.bindCartToggleEvents();
  }
  bindCartToggleEvents() {
    if (document.readyState === 'loading') {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupCartButtons();
      });
    } else {
      this.setupCartButtons();
    }
  }

  setupCartButtons() {
    const showCartButtons = document.querySelectorAll(".show-cart");

    showCartButtons.forEach((button) => {
      button.removeEventListener("click", this.handleCartToggle.bind(this));

      button.addEventListener("click", this.handleCartToggle.bind(this));
    });
  }

  handleCartToggle(event) {
    event.preventDefault();
    const button = event.currentTarget;
    this.toggleCartDisplay(button);
  }
  toggleCartDisplay(button) {
    const card = button.closest(".card");
    if (!card) return;

    this.toggleCartTables(card);
    this.updateButtonText(button);
  }

  toggleCartTables(card) {
    const cartTables = card.querySelectorAll(".cart-table");

    cartTables.forEach((cartTable) => {
      const isHidden = this.isElementHidden(cartTable);

      if (isHidden) {
        this.showTable(cartTable);
      } else {
        this.hideTable(cartTable);
      }
    });
  }

  isElementHidden(element) {
    const computedStyle = window.getComputedStyle(element);
    const hasHiddenClass = element.classList.contains('hidden');
    const isDisplayNone = computedStyle.display === "none";

    return isDisplayNone || hasHiddenClass;
  }

  showTable(table) {
    table.style.display = "block";
    table.classList.remove('hidden');
  }

  hideTable(table) {
    table.style.display = "none";
    table.classList.add('hidden');
  }

  updateButtonText(button) {
    const card = button.closest(".card");
    if (!card) return;

    const cartTable = card.querySelector(".cart-table");
    if (!cartTable) return;

    const isVisible = !this.isElementHidden(cartTable);

    if (isVisible) {
      button.textContent = button.dataset.hideText || "Esconder Carrinho";
    } else {
      button.textContent = button.dataset.showText || "Mostrar Carrinho";
    }
  }

  showAllCarts() {
    const cartTables = document.querySelectorAll(".cart-table");
    cartTables.forEach(table => this.showTable(table));
  }

  hideAllCarts() {
    const cartTables = document.querySelectorAll(".cart-table");
    cartTables.forEach(table => this.hideTable(table));
  }

  refresh() {
    this.setupCartButtons();
  }

  destroy() {
    const showCartButtons = document.querySelectorAll(".show-cart");
    showCartButtons.forEach((button) => {
      button.removeEventListener("click", this.handleCartToggle);
    });
  }
}
