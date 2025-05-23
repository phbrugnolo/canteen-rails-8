require "test_helper"

class CustomersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @customer = customers(:one)
    sign_in_user
  end

  test "should get index" do
    get main_customers_url
    assert_response :success
  end

  test "should get new" do
    get new_main_customer_url
    assert_response :success
  end

  test "should create customer" do
    assert_difference("Customer.count") do
      post main_customers_url, params: { customer: { matriculation: "12345678", name: "New Customer", status: "active" } }
    end

    assert_redirected_to main_customer_url(Customer.last)
  end

  test "should not create customer with duplicate matriculation" do
    assert_no_difference("Customer.count") do
      post main_customers_url, params: { customer: { matriculation: @customer.matriculation, name: "Another Customer", status: "active" } }
    end

    assert_response :unprocessable_entity
  end

  test "should not create customer without name" do
    assert_no_difference("Customer.count") do
      post main_customers_url, params: { customer: { matriculation: "12345678", name: "", status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not create customer without matriculation" do
    assert_no_difference("Customer.count") do
      post main_customers_url, params: { customer: { matriculation: "", name: "Customer Name", status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not update customer with invalid attributes" do
    patch main_customer_url(@customer), params: { customer: { matriculation: "", name: "", status: @customer.status } }
    assert_response :unprocessable_entity
  end

  test "should create customer with attached avatar" do
    file = fixture_file_upload(Rails.root.join("test", "fixtures", "files", "img-perfil.png"), "image/png")

    assert_difference("Customer.count") do
      post main_customers_url, params: { customer: {
        matriculation: "87654321",
        name: "Customer with Avatar",
        status: "active",
        avatar: file
      } }
    end

    assert_redirected_to main_customer_url(Customer.last)
    assert Customer.last.avatar.attached?
  end
end
