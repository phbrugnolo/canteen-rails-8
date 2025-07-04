# frozen_string_literal: true

module Activatable
  extend ActiveSupport::Concern

  included do
    str_enum :status, %w[active inactive], default: nil, validate: false, scopes: false, accessor_methods: false, update_methods: false

    scope :active, (-> { where status: :active })
    scope :inactive, (-> { where status: :inactive })

    define_model_callbacks :activate, :deactivate

    after_initialize :activatable_defaultable_values

    validates :status, presence: true

    def active?
      status == "active"
    end

    def inactive?
      status == "inactive"
    end

    def activate
      run_callbacks :activate do
        self.status = :active
        self.save
      end
    end

    def activate!
      run_callbacks :activate do
        self.status = :active
        self.save!
      end
    end

    def deactivate
      run_callbacks :deactivate do
        self.status = :inactive
        self.save
      end
    end

    def deactivate!
      run_callbacks :deactivate do
        self.status = :inactive
        self.save!
      end
    end

    private

    def activatable_defaultable_values
      self.status ||= "active" if new_record?
    end
  end
end
