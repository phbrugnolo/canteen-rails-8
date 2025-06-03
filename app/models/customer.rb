class Customer < ApplicationRecord
  include Activatable

  has_one_attached :avatar
  has_many :sales

  validates :name, presence: true
  validates :matriculation, presence: true, uniqueness: true

  def monthly_sales_total
    sales.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month).sum(:total_price)
  end

  def self.top_customers_data
    joins(:sales)
      .select("customers.id, customers.name, SUM(sales.total_price) AS total_sales")
      .group("customers.id, customers.name")
      .order("total_sales DESC")
      .limit(5)
      .map { |customer| { name: customer.name, total: customer.total_sales } }
  end
end
