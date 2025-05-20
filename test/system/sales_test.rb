require "application_system_test_case"

class SalesTest < ApplicationSystemTestCase
  setup do
    @sale = sales(:one)
    @customer = customers(:one)
    sign_in_user # Assuming authentication is required
  end

  test "visiting the index" do
    visit main_sales_url
    assert_selector "h1", text: "Sales"
  end

  test "should show sale details" do
    visit main_sale_url(@sale)

    assert_text @sale.customer.name
    assert_text "R$#{number_with_precision(@sale.total_price, precision: 2)}"

    # Check if cart items are displayed
    cart = JSON.parse(@sale.cart)
    cart.each do |item|
      if item["name"].present?
        assert_text item["name"]
        assert_text "R$#{number_with_precision(item["price"], precision: 2)}"
        assert_text item["quantity"].to_s
      end
    end
  end

  test "should create new sale" do
    visit main_sales_url
    visit new_main_sale_url

    # Wait for JavaScript to load products
    assert_selector "#products", wait: 5

    # Add a product to the cart
    find(".add", match: :first).click

    # Verify product was added to cart
    assert_selector "#cart table tbody tr", wait: 5

    # Select a customer
    select @customer.name, from: "sale[customer_id]"

    # Submit the form
    click_on "Submit"

    # Verify we're redirected to the sale page
    assert_text "Sale was successfully created"
    assert_selector ".cart-table"
  end

  test "should handle product search" do
    visit new_main_sale_url

    # Wait for products to load
    assert_selector "#products", wait: 5

    # Search for a product
    fill_in "search-input", with: "Bala"

    # Verify search filters the products
    rows = all("#products-table tr:not([style*='display: none'])")
    rows.each do |row|
      assert_match(/Bala/i, row.text)
    end
  end

  test "should add and remove products from cart" do
    visit new_main_sale_url

    # Wait for products to load
    assert_selector "#products", wait: 5

    # Add first product
    all(".add")[0].click

    # Verify product was added
    assert_selector "#cart table tbody tr", wait: 5

    # Add quantity
    first("button", text: "+").click

    # Verify quantity increased
    within("#cart table tbody tr", match: :first) do
      assert_text "2"
    end

    # Remove quantity
    first("button", text: "-").click

    # Verify quantity decreased
    within("#cart table tbody tr", match: :first) do
      assert_text "1"
    end

    # Remove product
    first("button", text: "🗑").click

    # Verify cart is empty
    assert_no_selector "#cart table tbody tr"
  end

  test "should update total price when adding products" do
    visit new_main_sale_url

    # Wait for products to load
    assert_selector "#products", wait: 5

    # Add first product
    all(".add")[0].click

    # Get initial price
    initial_total = find("#sale_total_price").value.to_f

    # Add another product or increase quantity
    all(".add")[0].click

    # Check if total increased
    new_total = find("#sale_total_price").value.to_f
    assert_operator new_total, :>, initial_total
  end

  test "should validate customer selection" do
    visit new_main_sale_url

    # Wait for products to load
    assert_selector "#products", wait: 5

    # Add a product
    find(".add", match: :first).click

    # Try to submit without selecting customer
    click_on "Submit"

    # Should show validation error
    assert_text "Customer can't be blank"
  end

  test "should show only active customers in dropdown" do
    # Create an inactive customer if needed for this test
    visit new_main_sale_url

    # Wait for the page to load
    assert_selector "select#sale_customer_id", wait: 5

    # Check that only active customers are in the dropdown
    active_customer_count = Customer.where(status: "active").count
    assert_equal active_customer_count, all("select#sale_customer_id option").count - 1 # -1 for prompt
  end
end
