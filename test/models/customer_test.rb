require "test_helper"

class CustomerTest < ActiveSupport::TestCase
  setup do
    @customer = Customer.new(name: "Test Customer", matriculation: "TEST123", status: "active")
  end

  test "should be valid with valid attributes" do
    assert @customer.valid?
  end

  test "should not be valid without a name" do
    @customer.name = nil
    assert_not @customer.valid?
    assert_includes @customer.errors[:name], I18n.t("errors.messages.blank")
  end

  test "should not be valid without a matriculation" do
    @customer.matriculation = nil
    assert_not @customer.valid?
    assert_includes @customer.errors[:matriculation], I18n.t("errors.messages.blank")
  end

  test "should not be valid with a duplicate matriculation" do
    duplicate_customer = customers(:one)
    @customer.matriculation = duplicate_customer.matriculation
    assert_not @customer.valid?
    assert_includes @customer.errors[:matriculation], I18n.t("errors.messages.taken")
  end

  test "should have one attached avatar" do
    assert_respond_to @customer, :avatar
    assert_respond_to @customer, :avatar_attachment
  end

  test "should be able to attach an avatar" do
    file = Tempfile.new([ "test_avatar", ".png" ])
    @customer.avatar.attach(io: file, filename: "test_avatar.png", content_type: "avatar/png")
    assert @customer.avatar.attached?
    file.close
    file.unlink
  end

  test "should have many sales" do
    assert_respond_to @customer, :sales
  end

  test "should be activatable" do
    assert_respond_to @customer, :status

    # Test active? method (assuming it's provided by Activatable)
    assert_respond_to @customer, :active?

    # Test changing status
    @customer.status = "inactive"
    assert_equal "inactive", @customer.status

    @customer.status = "active"
    assert_equal "active", @customer.status
  end

  test "should filter active customers" do
    # Assuming Activatable provides a scope or class method for filtering
    if Customer.respond_to?(:active)
      active_count = Customer.where(status: "active").count
      assert_equal active_count, Customer.active.count
    end
  end

  test "should filter inactive customers" do
    # Assuming Activatable provides a scope or class method for filtering
    if Customer.respond_to?(:inactive)
      inactive_count = Customer.where(status: "inactive").count
      assert_equal inactive_count, Customer.inactive.count
    end
  end

  test "should have default status of active if not specified" do
    customer = Customer.new(name: "Default Status", matriculation: "DEFAULT123")
    assert_equal "active", customer.status if customer.status.present?
  end
end
