require "application_system_test_case"

class SalesTest < ApplicationSystemTestCase
  setup do
    @sale = sales(:one)
    @customer = customers(:one)
    sign_in_user
  end

  test "visiting the index" do
    visit main_sales_url
    assert_selector "h1", text: I18n.t(:sale, scope: %i[activerecord models], count: 2)
  end

  test "should show sale details" do
    visit main_sale_url(@sale)

    assert_text @sale.customer.name
    assert_text ActionController::Base.helpers.number_to_currency(@sale.total_price)

    cart = JSON.parse(@sale.cart)
    cart.each do |item|
      if item["name"].present?
        assert_text item["name"]
        assert_text ActionController::Base.helpers.number_to_currency(item["price"])
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

    within("#cart table tbody tr", match: :first) do
      find("i.bi-plus-circle").click
    end

    within("#cart table tbody tr", match: :first) do
      assert_text "2"
    end

    within("#cart table tbody tr", match: :first) do
      find("i.bi-dash-circle").click
    end

    within("#cart table tbody tr", match: :first) do
      assert_text "1"
    end

    find("i.bi-trash3").click

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

    assert_text I18n.t("simple_form.error_notification.default_message")
  end

  test "should show only active customers in dropdown" do
    visit new_main_sale_url

    assert_selector ".ts-control", wait: 5

    find(".ts-control").click

    active_customer_count = Customer.where(status: "active").count
    assert_equal active_customer_count, all(".ts-dropdown-content .option").count
  end
end
