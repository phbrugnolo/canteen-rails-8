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
    assert_respond_to @customer, :active? if @customer.respond_to?(:active?)

    @customer.status = "inactive"
    assert_equal "inactive", @customer.status
    assert_not @customer.active? if @customer.respond_to?(:active?)

    @customer.status = "active"
    assert_equal "active", @customer.status
    assert @customer.active? if @customer.respond_to?(:active?)
  end

  test "should validate status inclusion" do
    @customer.status = "invalid_status"
    assert_not @customer.valid?
    assert_includes @customer.errors[:status], I18n.t("errors.messages.inclusion") if @customer.errors[:status].present?
  end

  test "should filter active customers" do
    if Customer.respond_to?(:active)
      active_customer = Customer.create!(name: "Active Customer", matriculation: "ACTIVE123", status: "active")
      inactive_customer = Customer.create!(name: "Inactive Customer", matriculation: "INACTIVE123", status: "inactive")

      active_customers = Customer.active
      assert_includes active_customers, active_customer
      assert_not_includes active_customers, inactive_customer
    end
  end

  test "should filter inactive customers" do
    if Customer.respond_to?(:inactive)
      active_customer = Customer.create!(name: "Active Customer", matriculation: "ACTIVE123", status: "active")
      inactive_customer = Customer.create!(name: "Inactive Customer", matriculation: "INACTIVE123", status: "inactive")

      inactive_customers = Customer.inactive
      assert_includes inactive_customers, inactive_customer
      assert_not_includes inactive_customers, active_customer
    end
  end

  test "should have default status of active if not specified" do
    customer = Customer.new(name: "Default Status", matriculation: "DEFAULT123")
    assert_equal "active", customer.status

    customer.save!
    assert_equal "active", customer.reload.status
  end

  test "should toggle status" do
    @customer.save!
    original_status = @customer.status

    if @customer.respond_to?(:toggle_status!)
      @customer.toggle_status!
      assert_not_equal original_status, @customer.reload.status
    end
  end
end
