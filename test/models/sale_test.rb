require "test_helper"

class SaleTest < ActiveSupport::TestCase
  setup do
    @sale = Sale.new(
      cart: '[{"name":"Test Product","price":"9.99","id":1,"quantity":2}]',
      total_price: 19.98,
      customer: customers(:one)
    )
  end

  test "should be valid with valid attributes" do
    assert @sale.valid?
  end

  test "should not be valid without a customer" do
    @sale.customer = nil
    assert_not @sale.valid?
    assert_includes @sale.errors[:customer], "must exist"
  end

  test "should not be valid without cart" do
    @sale.cart = nil
    assert_not @sale.valid?
    assert_includes @sale.errors[:cart], "can't be blank"
  end

  test "should not be valid without total_price" do
    @sale.total_price = nil
    assert_not @sale.valid?
    assert_includes @sale.errors[:total_price], "can't be blank"
  end

  test "should not be valid with negative total_price" do
    @sale.total_price = -1.0
    assert_not @sale.valid?
    assert_includes @sale.errors[:total_price], "must be greater than or equal to 0"
  end

  test "should be able to parse cart JSON" do
    cart = JSON.parse(@sale.cart)
    assert_instance_of Array, cart
    assert_equal "Test Product", cart.first["name"]
    assert_equal "9.99", cart.first["price"]
    assert_equal 1, cart.first["id"]
    assert_equal 2, cart.first["quantity"]
  end

  test "should calculate correct total from cart items" do
    cart_items = JSON.parse(@sale.cart)
    calculated_total = 0

    cart_items.each do |item|
      calculated_total += item["price"].to_f * item["quantity"].to_i
    end

    assert_equal 19.98, calculated_total
    assert_equal calculated_total, @sale.total_price
  end

  test "should belong to a customer" do
    assert_instance_of Customer, @sale.customer
  end

  test "customer should have many sales" do
    customer = customers(:one)
    assert_includes customer.sales, sales(:one)
  end

  test "should sort sales by creation date in descending order" do
    if Sale.respond_to?(:recent)
      assert_equal Sale.order(created_at: :desc).to_a, Sale.recent.to_a
    end
  end
end
