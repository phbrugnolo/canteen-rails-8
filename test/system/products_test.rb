require "application_system_test_case"

class ProductsTest < ApplicationSystemTestCase
  setup do
    @product = products(:one)
    sign_in_user
  end

  test "visiting the index" do
    visit main_products_url
    assert_selector "h1", text: "Products"
  end

  test "should filter products by name" do
    visit main_products_url

    fill_in "search_name", with: @product.name

    # Ensure only matching products are visible
    assert_selector ".card", count: Product.where("name LIKE ?", "%#{@product.name}%").count
  end

  test "should filter products by status" do
    visit main_products_url

    select "Active", from: "search_status"

    # Ensure only active products are visible
    assert_selector ".card", count: Product.where(status: "active").count
  end

  test "should create product" do
    visit main_products_url
    click_on "Add Product"

    fill_in "Name", with: "New Test Product"
    fill_in "Description", with: "New product description"
    fill_in "Price", with: "19.99"

    click_on "Submit"

    assert_text "Product was successfully created"
  end

  test "should upload product image" do
    visit main_products_url
    click_on "Add Product"

    fill_in "Name", with: "Product with Image"
    fill_in "Description", with: "Product with uploaded image"
    fill_in "Price", with: "29.99"
    attach_file "Image", Rails.root.join("test/fixtures/files/img-product.png")

    click_on "Submit"

    assert_text "Product was successfully created"
    assert Product.last.image.attached?
  end

  test "should update Product" do
    visit main_product_url(@product)
    click_on "Edit"

    fill_in "Name", with: @product.name + " Updated"
    click_on "Submit"

    assert_text "Product was successfully updated"
  end

  test "should view product details" do
    visit main_product_url(@product)

    assert_selector "h5.card-title", text: @product.name
    assert_selector "p.card-text", text: @product.description
    assert_text "R$#{number_with_precision(@product.price, precision: 2)}"

    if @product.status == "active"
      assert_selector ".text-success", text: "Active"
    else
      assert_selector ".text-danger", text: "Inactive"
    end
  end

  test "should deactivate active product" do
    @product.update(status: "active")

    visit main_product_url(@product)
    click_on "Deactivate"

    # Test modal appears
    assert_selector "#confirmDeactivateModal", visible: true
    within "#confirmDeactivateModal" do
      assert_text "Confirm Deactivation"
      click_on "Deactivate"
    end

    # Should be redirected to index
    assert_current_path main_products_path

    # Verify product status changed
    @product.reload
    assert_equal "inactive", @product.status
  end

  test "should activate inactive product" do
    @product.update(status: "inactive")

    visit main_product_url(@product)
    click_on "Activate"

    # Test modal appears
    assert_selector "#confirmActivateModal", visible: true
    within "#confirmActivateModal" do
      assert_text "Confirm Activation"
      click_on "Activate"
    end

    # Should be redirected to index
    assert_current_path main_products_path

    # Verify product status changed
    @product.reload
    assert_equal "active", @product.status
  end

  test "should cancel product deactivation" do
    @product.update(status: "active")

    visit main_product_url(@product)
    click_on "Deactivate"

    within "#confirmDeactivateModal" do
      click_on "Cancel"
    end

    # Modal should be hidden
    assert_selector "#confirmDeactivateModal", visible: false

    # Product status should remain unchanged
    @product.reload
    assert_equal "active", @product.status
  end

  test "should navigate back to product list" do
    visit main_product_url(@product)
    click_on "Return"

    assert_current_path main_products_path
  end
end
