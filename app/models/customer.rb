class Customer < ApplicationRecord
  include Activatable

  has_one_attached :avatar
  has_many :sales

  validates :name, presence: true
  validates :matriculation, presence: true, uniqueness: true
end
