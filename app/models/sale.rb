class Sale < ApplicationRecord
  belongs_to :customer

  validates :cart, presence: true
  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :recent, -> { order(created_at: :desc) }
end
