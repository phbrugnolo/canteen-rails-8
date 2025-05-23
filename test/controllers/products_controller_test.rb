require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product = products(:one)
    sign_in_user
  end

  test "should get index" do
    get main_products_url
    assert_response :success
  end

  test "should get new" do
    get new_main_product_url
    assert_response :success
  end

  test "should create product" do
    assert_difference("Product.count") do
      post main_products_url, params: { product: { description: "New product description", name: "New Product", price: 9.99, status: "active" } }
    end

    assert_redirected_to main_product_url(Product.last)
  end

  test "should not create product without name" do
    assert_no_difference("Product.count") do
      post main_products_url, params: { product: { description: "Description", name: "", price: 9.99, status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not create product without description" do
    assert_no_difference("Product.count") do
      post main_products_url, params: { product: { description: "", name: "Product", price: 9.99, status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not create product with description longer than 50 characters" do
    assert_no_difference("Product.count") do
      post main_products_url, params: { product: {
        description: "A" * 51,
        name: "Product",
        price: 9.99,
        status: "active"
      } }
    end
    assert_response :unprocessable_entity
  end

  test "should not create product without price" do
    assert_no_difference("Product.count") do
      post main_products_url, params: { product: { description: "Description", name: "Product", price: nil, status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not create product with non-positive price" do
    assert_no_difference("Product.count") do
      post main_products_url, params: { product: { description: "Description", name: "Product", price: 0, status: "active" } }
    end
    assert_response :unprocessable_entity
  end

  test "should not update product with invalid attributes" do
    patch main_product_url(@product), params: { product: { description: "", name: "", price: -5, status: @product.status } }
    assert_response :unprocessable_entity
  end

  test "should create product with attached image" do
    file = fixture_file_upload(Rails.root.join("test", "fixtures", "files", "image-product.png"), "image/png")

    assert_difference("Product.count") do
      post main_products_url, params: { product: {
        description: "With image",
        name: "Product with image",
        price: 19.99,
        status: "active",
        image: file
      } }
    end

    assert_redirected_to main_product_url(Product.last)
    assert Product.last.image.attached?
  end
end
