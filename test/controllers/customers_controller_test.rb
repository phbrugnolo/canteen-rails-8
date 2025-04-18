require "test_helper"

class CustomersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @customer = customers(:one)
  end

  test "should get index" do
    get customers_url
    assert_response :success
  end

  test "should get new" do
    get new_customer_url
    assert_response :success
  end

  test "should create customer" do
    assert_difference("Customer.count") do
      post customers_url, params: { customer: { matriculation: @customer.matriculation, name: @customer.name, status: @customer.status } }
    end

    assert_redirected_to main_customer_url(Customer.last)
  end

  test "should show customer" do
    get main_customer_url(@customer)
    assert_response :success
  end

  test "should get edit" do
    get edit_customer_url(@customer)
    assert_response :success
  end

  test "should update customer" do
    patch main_customer_url(@customer), params: { customer: { matriculation: @customer.matriculation, name: @customer.name, status: @customer.status } }
    assert_redirected_to main_customer_url(@customer)
  end

  test "should destroy customer" do
    assert_difference("Customer.count", -1) do
      delete main_customer_url(@customer)
    end

    assert_redirected_to customers_url
  end
end
