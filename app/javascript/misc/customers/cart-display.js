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
    const showCartButtons = document.querySelectorAll(".customers-show-btn-toggle, .customers-show-btn-primary.show-cart, .show-cart");

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
    const card = button.closest(".customers-show-sale-card") || button.closest(".card");
    if (!card) return;

    this.toggleCartTables(card);
    this.updateButtonText(button);
    this.updateButtonState(button);
  }

  toggleCartTables(card) {
    const cartTables = card.querySelectorAll(".customers-show-cart-details, .customers-show-cart-table, .cart-table");

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
    table.classList.add('show');
  }

  hideTable(table) {
    table.style.display = "none";
    table.classList.add('hidden');
    table.classList.remove('show');
  }

  updateButtonText(button) {
    const card = button.closest(".customers-show-sale-card") || button.closest(".card");
    if (!card) return;

    const cartTable = card.querySelector(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    if (!cartTable) return;

    const isVisible = !this.isElementHidden(cartTable);

    const buttonTextSpan = button.querySelector('.customers-show-btn-text');
    const targetElement = buttonTextSpan || button;

    if (isVisible) {
      const hideText = button.dataset.hideText || "Esconder Carrinho";
      if (buttonTextSpan) {
        buttonTextSpan.textContent = hideText;
      } else {
        targetElement.textContent = hideText;
      }
    } else {
      const showText = button.dataset.showText || "Mostrar Carrinho";
      if (buttonTextSpan) {
        buttonTextSpan.textContent = showText;
      } else {
        targetElement.textContent = showText;
      }
    }
  }

  updateButtonState(button) {
    const card = button.closest(".customers-show-sale-card") || button.closest(".card");
    if (!card) return;

    const cartTable = card.querySelector(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    if (!cartTable) return;

    const isVisible = !this.isElementHidden(cartTable);
    const chevron = button.querySelector('.customers-show-btn-chevron');

    if (isVisible) {
      button.classList.add('expanded');
    } else {
      button.classList.remove('expanded');
    }

    if (chevron) {
      if (isVisible) {
        chevron.style.transform = 'rotate(180deg)';
      } else {
        chevron.style.transform = 'rotate(0deg)';
      }
    }
  }

  showAllCarts() {
    const cartTables = document.querySelectorAll(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    const buttons = document.querySelectorAll(".customers-show-btn-toggle, .customers-show-btn-primary.show-cart, .show-cart");

    cartTables.forEach(table => this.showTable(table));
    buttons.forEach(button => {
      this.updateButtonText(button);
      this.updateButtonState(button);
    });
  }

  hideAllCarts() {
    const cartTables = document.querySelectorAll(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    const buttons = document.querySelectorAll(".customers-show-btn-toggle, .customers-show-btn-primary.show-cart, .show-cart");

    cartTables.forEach(table => this.hideTable(table));
    buttons.forEach(button => {
      this.updateButtonText(button);
      this.updateButtonState(button);
    });
  }

  refresh() {
    this.setupCartButtons();
  }

  destroy() {
    const showCartButtons = document.querySelectorAll(".customers-show-btn-toggle, .customers-show-btn-primary.show-cart, .show-cart");
    showCartButtons.forEach((button) => {
      button.removeEventListener("click", this.handleCartToggle.bind(this));
    });
  }

  expandAllCarts() {
    this.showAllCarts();
  }

  collapseAllCarts() {
    this.hideAllCarts();
  }

  toggleAllCarts() {
    const cartTables = document.querySelectorAll(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    const visibleTables = Array.from(cartTables).filter(table => !this.isElementHidden(table));

    if (visibleTables.length > 0) {
      this.hideAllCarts();
    } else {
      this.showAllCarts();
    }
  }

  getCartVisibilityState() {
    const cartTables = document.querySelectorAll(".customers-show-cart-details, .customers-show-cart-table, .cart-table");
    const totalCarts = cartTables.length;
    const visibleCarts = Array.from(cartTables).filter(table => !this.isElementHidden(table)).length;

    return {
      total: totalCarts,
      visible: visibleCarts,
      hidden: totalCarts - visibleCarts,
      allVisible: visibleCarts === totalCarts,
      allHidden: visibleCarts === 0
    };
  }
}
