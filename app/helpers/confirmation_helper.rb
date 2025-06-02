# app/helpers/confirmation_helper.rb
# Rails Helper for Confirmation Decorators
# Provides methods to generate buttons with confirmation behaviors

module ConfirmationHelper
  # Generate a confirmation button with decorator pattern
  def confirmation_button(text, url, action, options = {})
    entity_name = options[:entity_name] || "item"
    entity_type = options[:entity_type] || "item"
    method = options[:method] || (action == "delete" ? "DELETE" : "PATCH")
    html_class = options[:class] || default_button_class(action)
    confirm_text = options[:confirm_text]
    title = options[:title]
    icon = options[:icon]
    button_text = options[:button_text]
    on_success = options[:on_success]
    redirect_url = options[:redirect_url]

    data_attrs = {
      confirmation: true,
      action: action,
      url: url,
      method: method,
      entity_name: entity_name,
      entity_type: entity_type
    }

    data_attrs[:confirm_text] = confirm_text if confirm_text
    data_attrs[:title] = title if title
    data_attrs[:icon] = icon if icon
    data_attrs[:button_text] = button_text if button_text
    data_attrs[:on_success] = on_success if on_success
    data_attrs[:redirect_url] = redirect_url if redirect_url

    content_tag :button, text, {
      type: "button",
      class: html_class,
      data: data_attrs
    }
  end

  def activation_button(entity, options = {})
    default_options = {
      entity_name: entity_name_for_confirmation(entity),
      entity_type: entity.class.name.downcase,
      class: "btn btn-success me-1"
    }

    url = generate_activation_url(entity)
    confirmation_button(I18n.t(:activate), url, "activate", default_options.merge(options))
  end

  def deactivation_button(entity, options = {})
    default_options = {
      entity_name: entity_name_for_confirmation(entity),
      entity_type: entity.class.name.downcase,
      class: "btn btn-danger me-1"
    }

    url = generate_deactivation_url(entity)
    confirmation_button(I18n.t(:deactivate), url, "deactivate", default_options.merge(options))
  end

  def delete_button(entity, options = {})
    default_options = {
      entity_name: entity_name_for_confirmation(entity),
      entity_type: entity.class.name.downcase,
      class: "btn btn-danger",
      method: "DELETE"
    }

    url = polymorphic_path(entity_path_parts(entity) + [ entity ])
    confirmation_button(I18n.t(:delete), url, "delete", default_options.merge(options))
  end

  def status_toggle_button(entity, options = {})
    if entity.status == "active"
      deactivation_button(entity, options)
    else
      activation_button(entity, options)
    end
  end

  private

  def default_button_class(action)
    case action
    when "activate"
      "btn btn-success me-1"
    when "deactivate"
      "btn btn-danger me-1"
    when "delete"
      "btn btn-danger"
    else
      "btn btn-primary"
    end
  end

  def entity_name_for_confirmation(entity)
    case entity.class.name.downcase
    when "product"
      "produto"
    when "customer"
      "cliente"
    when "sale"
      "venda"
    when "user"
      "usuário"
    else
      entity.class.name.downcase
    end
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
end
