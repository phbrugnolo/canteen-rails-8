class Product < ApplicationRecord
  include Activatable

  has_one_attached :image

  validates :name, presence: true
  validates :description, presence: true, length: { maximum: 50 }
  validates :price, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: Float::MAX }
end
