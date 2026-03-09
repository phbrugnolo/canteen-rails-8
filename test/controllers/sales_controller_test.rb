require "test_helper"

class SalesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sale = sales(:one)
    sign_in_user
  end

  test "should get index" do
    get main_sales_url
    assert_response :success
  end

  test "should paginate index" do
    get main_sales_url, params: { page: 1 }
    assert_response :success
    assert_not_nil assigns(:sales)
    assert assigns(:sales).size <= 12, "Page should contain at most 12 items"
  end

  test "should get new" do
    get new_main_sale_url
    assert_response :success
  end

  test "should create sale" do
    assert_difference("Sale.count") do
      post main_sales_url, params: { sale: { cart: @sale.cart, customer_id: @sale.customer_id, total_price: @sale.total_price } }
    end

    assert_redirected_to main_sale_url(Sale.last)
  end

  test "should show sale" do
    get main_sale_url(@sale)
    assert_response :success
  end

  test "should not create sale without customer" do
    assert_no_difference("Sale.count") do
      post main_sales_url, params: { sale: { cart: @sale.cart, total_price: @sale.total_price, customer_id: nil } }
    end
    assert_response :unprocessable_entity
    assert_select "div.sale_customer .invalid-feedback", "Cliente não pode ficar em branco"
  end

  test "should get new with products as JSON" do
    get new_main_sale_url, as: :json
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_not_nil json_response["products"]
  end

  test "should create sale with JSON response" do
    assert_difference("Sale.count") do
      post main_sales_url, params: { sale: { cart: @sale.cart, customer_id: @sale.customer_id, total_price: @sale.total_price } }, as: :json
    end

    assert_response :created
  end

  test "should create sale with empty cart" do
    empty_cart_sale = sales(:two)
    assert_difference("Sale.count") do
      post main_sales_url, params: { sale: { cart: empty_cart_sale.cart, customer_id: empty_cart_sale.customer_id, total_price: empty_cart_sale.total_price } }
    end

    assert_redirected_to main_sale_url(Sale.last)
  end

  test "should only show active customers in new form" do
    get new_main_sale_url
    assert_response :success
    assert_select "option", { count: 1, text: "Teste" }
    assert_select "option", { count: 0, text: "Teste 2" }
  end
end
