require "application_system_test_case"

class ProductsTest < ApplicationSystemTestCase
  setup do
    @product = products(:one)
    sign_in_user
  end

  test "visiting the index" do
    visit main_products_url
    assert_selector "h1", text: I18n.t("activerecord.models.product.other")
  end

  test "should filter products by name" do
    visit main_products_url

    fill_in "search_name", with: @product.name

    assert_selector "#products .card", count: Product.where("name LIKE ?", "%#{@product.name}%").count
  end

  test "should filter products by status" do
    visit main_products_url

    select I18n.t("active"), from: "search_status"

    assert_selector "#products .card", count: Product.where(status: "active").count
  end

  test "should create product" do
    visit main_products_url
    click_on I18n.t(:add, scope: %i[activerecord], model: Product.model_name.human)

    fill_in I18n.t("activerecord.attributes.product.name"), with: "New Test Product"
    fill_in I18n.t("activerecord.attributes.product.description"), with: "New product description"
    fill_in I18n.t("activerecord.attributes.product.price"), with: "19.99"

    click_on I18n.t("form.actions.submit")

    assert_text I18n.t("model_was_successfully_created", model: Product.model_name.human)
  end

  test "should upload product image" do
    visit main_products_url
    click_on I18n.t(:add, scope: %i[activerecord], model: Product.model_name.human)

    fill_in I18n.t("activerecord.attributes.product.name"), with: "Product with Image"
    fill_in I18n.t("activerecord.attributes.product.description"), with: "Product with uploaded image"
    fill_in I18n.t("activerecord.attributes.product.price"), with: "29.99"
    attach_file I18n.t("activerecord.attributes.product.image"), Rails.root.join("test/fixtures/files/image-product.png")

    click_on I18n.t("form.actions.submit")

    assert_text I18n.t("model_was_successfully_created", model: Product.model_name.human)
    assert Product.last.image.attached?
  end

  test "should update Product" do
    visit main_product_url(@product)
    click_on I18n.t("edit")

    fill_in I18n.t("activerecord.attributes.product.name"), with: @product.name + " Updated"
    click_on I18n.t("form.actions.submit")

    assert_text I18n.t("model_was_successfully_updated", model: Product.model_name.human)
  end

  test "should view product details" do
    visit main_product_url(@product)

    assert_selector "h5.card-title", text: @product.name
    assert_selector "p.card-text", text: @product.description
    assert_text "R$#{ActionController::Base.helpers.number_with_precision(@product.price, precision: 2)}"

    if @product.status == "active"
      assert_selector ".text-success", text: I18n.t("active")
    else
      assert_selector ".text-danger", text: I18n.t("inactive")
    end
  end

  test "should deactivate active product" do
    @product.update(status: "active")

    visit main_product_url(@product)

    page.execute_script("showModal('confirmDeactivateModal')")

    assert_selector "#confirmDeactivateModal", visible: true
    within "#confirmDeactivateModal" do
      assert_text I18n.t("confirm_deactivation")
      click_on I18n.t("deactivate")
    end

    assert_current_path main_products_path

    @product.reload
    assert_equal "inactive", @product.status
  end

  test "should activate inactive product" do
    @product.update(status: "inactive")

    visit main_product_url(@product)

    page.execute_script("showModal('confirmActivateModal')")

    assert_selector "#confirmActivateModal", visible: true
    within "#confirmActivateModal" do
      assert_text I18n.t("confirm_activation")
      click_on I18n.t("activate")
    end

    assert_current_path main_products_path

    @product.reload
    assert_equal "active", @product.status
  end

  test "should cancel product deactivation" do
    @product.update(status: "active")

    visit main_product_url(@product)

    page.execute_script("showModal('confirmDeactivateModal')")

    within "#confirmDeactivateModal" do
      click_on I18n.t("cancel")
    end

    assert_selector "#confirmDeactivateModal", visible: false

    @product.reload
    assert_equal "active", @product.status
  end

  test "should navigate back to product list" do
    visit main_product_url(@product)
    click_on I18n.t("return")

    assert_current_path main_products_path
  end

  test "should show deactivate button for active products" do
    @product.update(status: "active")
    visit main_product_url(@product)

    assert_selector "button", text: I18n.t("deactivate")
    assert_no_selector "button", text: I18n.t("activate")
  end

  test "should show activate button for inactive products" do
    @product.update(status: "inactive")
    visit main_product_url(@product)

    assert_selector "button", text: I18n.t("activate")
    assert_no_selector "button", text: I18n.t("deactivate")
  end

  test "should display product image" do
    visit main_product_url(@product)

    assert_selector "img.card-img-top.standard-image-size-product"
  end

  test "should navigate to edit from show page" do
    visit main_product_url(@product)
    click_on I18n.t("edit")

    assert_current_path edit_main_product_path(@product)
    assert_selector "h1", text: I18n.t("activerecord.edit", model: Product.model_name.human)
  end

  test "should navigate back from form" do
    visit new_main_product_path
    click_on I18n.t("return")

    assert_current_path main_products_path
  end
end
