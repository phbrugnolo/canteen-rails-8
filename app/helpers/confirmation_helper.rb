module ConfirmationHelper
  def confirmation_button(text, url, action, options = {})
    entity_name = options[:entity_name] || "item"
    entity_type = options[:entity_type] || "item"
    method = options[:method] || (action == "delete" ? "DELETE" : "PATCH")
    html_class = options[:class] || default_button_class(action)
    enhanced = options[:enhanced] || false

    data_attrs = {
      confirmation: true,
      action: action,
      url: url,
      method: method,
      entity_name: entity_name,
      entity_type: entity_type
    }

    add_optional_data_attr(data_attrs, :confirm_text, options[:confirm_text])
    add_optional_data_attr(data_attrs, :title, options[:title])
    add_optional_data_attr(data_attrs, :icon, options[:icon])
    add_optional_data_attr(data_attrs, :button_text, options[:button_text])
    add_optional_data_attr(data_attrs, :redirect_url, options[:redirect_url])

    if enhanced
      add_optional_data_attr(data_attrs, :success_message, options[:success_message])
      add_optional_data_attr(data_attrs, :error_message, options[:error_message])
      data_attrs[:enhanced] = true
    end

    if options[:confirmation_config]
      data_attrs[:confirmation_config] = options[:confirmation_config].to_json
    end

    data_attrs[:confirmation_initialized] = false

    content_tag :button, text, {
      type: "button",
      class: html_class,
      data: data_attrs
    }
  end

  def enhanced_confirmation_button(text, url, action, options = {})
    confirmation_button(text, url, action, options.merge(enhanced: true))
  end

  def activation_button(entity, options = {})
    entity_name = entity_name_for_confirmation(entity)
    context_class = get_context_class(entity, "activate")

    default_options = {
      entity_name: entity_name,
      entity_type: entity.class.name.downcase,
      class: "btn-status-toggle activate #{context_class}",
      title: I18n.t("confirmations.activate.title"),
      confirm_text: I18n.t("confirmations.activate.text", entity: entity_name),
      button_text: I18n.t("confirmations.activate.button"),
      icon: "question",
      success_message: I18n.t("confirmations.activate.success", entity: entity_name),
      error_message: I18n.t("confirmations.activate.error", entity: entity_name)
    }

    url = generate_activation_url(entity)
    method_name = options[:enhanced] ? :enhanced_confirmation_button : :confirmation_button

    button_text = content_tag(:i, "", class: "bi bi-toggle-on btn-icon") + " " + I18n.t(:activate)
    send(method_name, button_text.html_safe, url, "activate", default_options.merge(options))
  end

  def deactivation_button(entity, options = {})
    entity_name = entity_name_for_confirmation(entity)
    context_class = get_context_class(entity, "deactivate")

    default_options = {
      entity_name: entity_name,
      entity_type: entity.class.name.downcase,
      class: "btn-status-toggle deactivate #{context_class}",
      title: I18n.t("confirmations.deactivate.title"),
      confirm_text: I18n.t("confirmations.deactivate.text", entity: entity_name),
      button_text: I18n.t("confirmations.deactivate.button"),
      icon: "warning",
      success_message: I18n.t("confirmations.deactivate.success", entity: entity_name),
      error_message: I18n.t("confirmations.deactivate.error", entity: entity_name)
    }

    url = generate_deactivation_url(entity)
    method_name = options[:enhanced] ? :enhanced_confirmation_button : :confirmation_button

    button_text = content_tag(:i, "", class: "bi bi-toggle-off btn-icon") + " " + I18n.t(:deactivate)
    send(method_name, button_text.html_safe, url, "deactivate", default_options.merge(options))
  end

  def delete_button(entity, options = {})
    entity_name = entity_name_for_confirmation(entity)

    default_options = {
      entity_name: entity_name,
      entity_type: entity.class.name.downcase,
      class: "btn-secondary",
      method: "DELETE",
      title: I18n.t("confirmations.delete.title"),
      confirm_text: I18n.t("confirmations.delete.text", entity: entity_name),
      button_text: I18n.t("confirmations.delete.button"),
      icon: "error",
      success_message: I18n.t("confirmations.delete.success", entity: entity_name),
      error_message: I18n.t("confirmations.delete.error", entity: entity_name)
    }

    url = polymorphic_path(entity_path_parts(entity) + [ entity ])
    method_name = options[:enhanced] ? :enhanced_confirmation_button : :confirmation_button
    send(method_name, I18n.t(:delete), url, "delete", default_options.merge(options))
  end

  def status_toggle_button(entity, options = {})
    if entity.active?
      deactivation_button(entity, options)
    else
      activation_button(entity, options)
    end
  end

  def enhanced_status_toggle_button(entity, options = {})
    status_toggle_button(entity, options.merge(enhanced: true))
  end

  def custom_confirmation_button(text, url, custom_config, options = {})
    confirmation_button(text, url, custom_config[:action] || "custom",
      options.merge(confirmation_config: custom_config))
  end

  def confirmation_translations_for_js
    {
      activate: {
        title: I18n.t("confirmations.activate.title"),
        text: I18n.t("confirmations.activate.text", entity: "{{entityName}}"),
        button: I18n.t("confirmations.activate.button"),
        success: I18n.t("confirmations.activate.success", entity: "{{entityName}}"),
        error: I18n.t("confirmations.activate.error", entity: "{{entityName}}")
      },
      deactivate: {
        title: I18n.t("confirmations.deactivate.title"),
        text: I18n.t("confirmations.deactivate.text", entity: "{{entityName}}"),
        button: I18n.t("confirmations.deactivate.button"),
        success: I18n.t("confirmations.deactivate.success", entity: "{{entityName}}"),
        error: I18n.t("confirmations.deactivate.error", entity: "{{entityName}}")
      },
      delete: {
        title: I18n.t("confirmations.delete.title"),
        text: I18n.t("confirmations.delete.text", entity: "{{entityName}}"),
        button: I18n.t("confirmations.delete.button"),
        success: I18n.t("confirmations.delete.success", entity: "{{entityName}}"),
        error: I18n.t("confirmations.delete.error", entity: "{{entityName}}")
      },
      default: {
        title: I18n.t("confirmations.default.title"),
        text: I18n.t("confirmations.default.text", entity: "{{entityName}}"),
        button: I18n.t("confirmations.default.button"),
        success: I18n.t("confirmations.default.success", entity: "{{entityName}}"),
        error: I18n.t("confirmations.default.error", entity: "{{entityName}}")
      },
      cancel: I18n.t(:cancel),
      entities: {
        product: Product.model_name.human.downcase,
        customer: Customer.model_name.human.downcase,
        sale: Sale.model_name.human.downcase,
        user: User.model_name.human.downcase
      }
    }
  end

  def confirmation_config_for_js
    content_tag :script, type: "application/json", id: "confirmation-config" do
      confirmation_translations_for_js.to_json.html_safe
    end
  end

  private

  def add_optional_data_attr(data_attrs, key, value)
    data_attrs[key] = value if value.present?
  end

  def default_button_class(action)
    case action
    when "activate"
      "btn-status-toggle activate"
    when "deactivate"
      "btn-status-toggle deactivate"
    when "delete"
      "btn-secondary"
    else
      "btn-primary"
    end
  end

  def entity_name_for_confirmation(entity)
    entity.class.model_name.human.downcase
  end

  def entity_path_parts(entity)
    if controller.class.name.start_with?("Main::")
      [ :main ]
    elsif controller.class.name.start_with?("Admin::")
      [ :admin ]
    else
      []
    end
  end

  def generate_activation_url(entity)
    case entity.class.name.downcase
    when "product"
      activate_main_product_path(entity)
    when "customer"
      activate_main_customer_path(entity)
    else
      polymorphic_path([ :activate ] + entity_path_parts(entity) + [ entity ])
    end
  end

  def generate_deactivation_url(entity)
    case entity.class.name.downcase
    when "product"
      deactivate_main_product_path(entity)
    when "customer"
      deactivate_main_customer_path(entity)
    else
      polymorphic_path([ :deactivate ] + entity_path_parts(entity) + [ entity ])
    end
  end

  def get_context_class(entity, action)
    controller_name = controller.controller_name
    entity_type = entity.class.name.downcase

    case controller_name
    when "products"
      "products-status-#{action}"
    when "customers"
      "customers-status-#{action}"
    else
      "#{entity_type}-status-#{action}"
    end
  end
end
