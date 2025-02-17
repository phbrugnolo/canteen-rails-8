class Product < ApplicationRecord
  include Activatable

  validates :name, presence: true
  validates :description, presence: true, length: { maximum: 50 }
  validates :price, presence: true, numericality: true
end
