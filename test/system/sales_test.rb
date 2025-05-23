require "application_system_test_case"

class SalesTest < ApplicationSystemTestCase
  setup do
    @sale = sales(:one)
    @customer = customers(:one)
    sign_in_user
  end

  test "visiting the index" do
    visit main_sales_url
    assert_selector "h1", text: "Sales"
  end

  test "should show sale details" do
    visit main_sale_url(@sale)

    assert_text @sale.customer.name
    assert_text "R$#{ActionController::Base.helpers.number_with_precision(@sale.total_price, precision: 2)}"

    # Check if cart items are displayed
    cart = JSON.parse(@sale.cart)
    cart.each do |item|
      if item["name"].present?
        assert_text item["name"]
        assert_text "R$#{ActionController::Base.helpers.number_with_precision(item["price"], precision: 2)}"
        assert_text item["quantity"].to_s
      end
    end
  end

  test "should create new sale" do
    visit main_sales_url
    visit new_main_sale_url

    assert_selector "#products", wait: 5

    find("input.btn.btn-success.add", match: :first).click

    assert_selector "#cart table tbody tr", wait: 5

    find(".ts-control").click
    find(".ts-dropdown-content .option", text: @customer.name).click

    click_on I18n.t(:close_sale)

    assert_text I18n.t(:model_was_successfully_created, model: Sale.model_name.human)
    assert_selector ".cart-table"
  end

  test "should handle product search" do
    visit new_main_sale_url

    assert_selector "#products", wait: 5

    fill_in "search-input", with: "Bala"

    rows = all("#products-table tr:not([style*='display: none'])")
    rows.each do |row|
      assert_match(/Bala/i, row.text)
    end
  end

  test "should add and remove products from cart" do
    visit new_main_sale_url

    assert_selector "#products", wait: 5

    all("input.btn.btn-success.add")[0].click

    assert_selector "#cart table tbody tr", wait: 5

    find("button.btn.btn-primary", text: "").click

    within("#cart table tbody tr", match: :first) do
      assert_text "2"
    end

    find("button.btn.btn-primary:nth-of-type(2)").click

    within("#cart table tbody tr", match: :first) do
      assert_text "1"
    end

    find("button.btn.btn-danger").click

    assert_no_selector "#cart table tbody tr"
  end

  test "should update total price when adding products" do
    visit new_main_sale_url

    assert_selector "#products", wait: 5

    all("input.btn.btn-success.add")[0].click

    initial_total = find("#sale_total_price").value.to_f

    all("input.btn.btn-success.add")[0].click

    new_total = find("#sale_total_price").value.to_f
    assert_operator new_total, :>, initial_total
  end

  test "should validate customer selection" do
    visit new_main_sale_url

    assert_selector "#products", wait: 5

    find("input.btn.btn-success.add", match: :first).click

    click_on I18n.t(:close_sale)

    assert_text "Customer can't be blank"
  end

  test "should show only active customers in dropdown" do
    visit new_main_sale_url

    assert_selector ".ts-control", wait: 5

    find(".ts-control").click

    active_customer_count = Customer.where(status: "active").count
    assert_equal active_customer_count, all(".ts-dropdown-content .option").count
  end
end
