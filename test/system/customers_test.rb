require "application_system_test_case"

class CustomersTest < ApplicationSystemTestCase
  setup do
    @customer = customers(:one)
    sign_in_user
  end

  test "visiting the index" do
    visit main_customers_url
    assert_selector "h1", text: I18n.t(:customer, scope: %i[activerecord models], count: 2)
  end

  test "should create customer" do
    visit main_customers_url
    click_on I18n.t(:add, scope: %i[activerecord], model: Customer.model_name.human)

    fill_in I18n.t(:name, scope: %i[activerecord attributes customer]), with: "New Test Customer"
    fill_in I18n.t(:matriculation, scope: %i[activerecord attributes customer]), with: "UNIQUE123"
    click_on I18n.t(:submit, scope: %i[form actions])

    assert_text I18n.t(:model_was_successfully_created, model: @customer.model_name.human)
  end

  test "should update Customer" do
    visit main_customer_url(@customer)
    click_on I18n.t(:edit)

    fill_in I18n.t(:name, scope: %i[activerecord attributes customer]), with: @customer.name + " Updated"
    click_on I18n.t(:submit, scope: %i[form actions])

    assert_text I18n.t(:model_was_successfully_updated, model: @customer.model_name.human)
  end

  test "should view customer profile details" do
    visit main_customer_url(@customer)

    within "#profile-tab-pane" do
      assert_text @customer.name
      assert_text @customer.matriculation

      if @customer.status == "active"
        assert_selector ".text-success", text: I18n.t(:active)
      else
        assert_selector ".text-danger", text: I18n.t(:inactive)
      end
    end
  end

  test "should view customer purchases" do
    visit main_customer_url(@customer)
    click_on I18n.t(:purchases)

    assert_selector "#purchases-tab-pane.active", wait: 1

    within "#purchases-tab-pane" do
      if @customer.sales.any?
        assert_selector ".card.border-info", minimum: 1

        find(".show-cart").click
        assert_selector ".cart-table", visible: true

        find(".show-cart").click
        assert_selector ".cart-table", visible: false
      else
        assert_text I18n.t(:no_purchases_made)
      end
    end
  end

  test "should deactivate active customer" do
    @customer.update(status: "active")

    visit main_customer_url(@customer)
    click_on I18n.t(:deactivate)

    assert_selector "#confirmDeactivateModal", visible: true
    within "#confirmDeactivateModal" do
      assert_text I18n.t(:confirm_deactivation)
      click_on I18n.t(:deactivate, scope: %i[activerecord], model: @customer.model_name.human)
    end

    assert_current_path main_customers_path

    @customer.reload
    assert_equal "inactive", @customer.status
  end

  test "should activate inactive customer" do
    @customer.update(status: "inactive")

    visit main_customer_url(@customer)
    click_on I18n.t(:activate)

    assert_selector "#confirmActivateModal", visible: true
    within "#confirmActivateModal" do
      assert_text I18n.t(:confirm_activation)
      click_on I18n.t(:activate, scope: %i[activerecord], model: @customer.model_name.human)
    end

    assert_current_path main_customers_path

    @customer.reload
    assert_equal "active", @customer.status
  end

  test "should cancel customer deactivation" do
    @customer.update(status: "active")

    visit main_customer_url(@customer)
    click_on I18n.t(:deactivate)

    within "#confirmDeactivateModal" do
      click_on I18n.t(:cancel)
    end

    assert_selector "#confirmDeactivateModal", visible: false

    @customer.reload
    assert_equal "active", @customer.status
  end

  test "should view tabs navigation" do
    visit main_customer_url(@customer)

    assert_selector "#profile-tab-pane.active"

    click_on I18n.t(:purchases)
    assert_selector "#purchases-tab-pane.active", wait: 1

    click_on I18n.t(:documents)
    assert_selector "#documents-tab-pane.active", wait: 1

    click_on I18n.t(:profile)
    assert_selector "#profile-tab-pane.active", wait: 1
  end
end
