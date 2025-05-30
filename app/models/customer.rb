class Customer < ApplicationRecord
  include Activatable

  has_one_attached :avatar
  has_many :sales

  validates :name, presence: true
  validates :matriculation, presence: true, uniqueness: true

  def self.top_customers_data
    joins(:sales).group(:id, :name).sum("sales.total_price").sort_by { |_, total| -total }.first(5).map { |customer_data, total| { name: customer_data[1], total: total } }
  end
end
