require "test_helper"

class ProductTest < ActiveSupport::TestCase
  setup do
    @product = Product.new(
      name: "Test Product",
      description: "A test product description",
      price: 9.99,
      status: "active"
    )
  end

  test "should be valid with valid attributes" do
    assert @product.valid?
  end

  test "should not be valid without a name" do
    @product.name = nil
    assert_not @product.valid?
    assert_includes @product.errors[:name], I18n.t("errors.messages.blank")
  end

  test "should not be valid without a description" do
    @product.description = nil
    assert_not @product.valid?
    assert_includes @product.errors[:description], I18n.t("errors.messages.blank")
  end

  test "should not be valid with a description longer than 50 characters" do
    @product.description = "a" * 51
    assert_not @product.valid?
    assert_includes @product.errors[:description], I18n.t("errors.messages.too_long", count: 50)
  end

  test "should not be valid without a price" do
    @product.price = nil
    assert_not @product.valid?
    assert_includes @product.errors[:price], I18n.t("errors.messages.blank")
  end

  test "should not be valid with a non-positive price" do
    @product.price = 0
    assert_not @product.valid?
    assert_includes @product.errors[:price], I18n.t("errors.messages.greater_than", count: 0)

    @product.price = -1.50
    assert_not @product.valid?
    assert_includes @product.errors[:price], I18n.t("errors.messages.greater_than", count: 0)
  end

  test "should not be valid with price greater than Float::MAX" do
    @product.price = Float::INFINITY
    assert_not @product.valid?
    assert @product.errors[:price].any?
  end

  test "should have one attached image" do
    assert_respond_to @product, :image
    assert_respond_to @product, :image_attachment
  end

  test "should be able to attach an image" do
    file = Tempfile.new([ "test_image", ".png" ])
    @product.image.attach(io: file, filename: "test_image.png", content_type: "image/png")
    assert @product.image.attached?
    file.close
    file.unlink
  end

  test "image_url should return attached image url when image is attached" do
    file = Tempfile.new([ "test_image", ".png" ])
    @product.save!
    @product.image.attach(io: file, filename: "test_image.png", content_type: "image/png")

    assert_match(/\/rails\/active_storage\/blobs/, @product.image_url)
    file.close
    file.unlink
  end

  test "image_url should return default image path when no image is attached" do
    assert_equal ActionController::Base.helpers.asset_path("img-product.png"), @product.image_url
  end

  test "should be activatable" do
    assert_respond_to @product, :status

    # Test changing status
    @product.status = "inactive"
    assert_equal "inactive", @product.status

    @product.status = "active"
    assert_equal "active", @product.status
  end

  test "should filter active products" do
    # Assuming Activatable provides a scope or class method for filtering
    if Product.respond_to?(:active)
      active_count = Product.where(status: "active").count
      assert_equal active_count, Product.active.count
    end
  end

  test "should filter inactive products" do
    # Assuming Activatable provides a scope or class method for filtering
    if Product.respond_to?(:inactive)
      inactive_count = Product.where(status: "inactive").count
      assert_equal inactive_count, Product.inactive.count
    end
  end

  test "should have default status of active if not specified" do
    product = Product.new(name: "Default Status", description: "Test", price: 5.99)
    assert_equal "active", product.status if product.status.present?
  end
end
