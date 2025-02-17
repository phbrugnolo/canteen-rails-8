module Activatable
  extend ActiveSupport::Concern

  included do
    str_enum :status, %w[active inactive],
             accessor_methods: true,
             allow_nil: false,
             default: true,
             prefix: false,
             scopes: true,
             suffix: false,
             update_methods: true,
             validate: true

    scope :active, -> { where status: :active }
    scope :inactive, -> { where status: :inactive }

    validates :status, presence: true
  end
end
