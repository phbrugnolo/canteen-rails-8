class Customer < ApplicationRecord
  include Activatable

  CURRENT_MONTH_RANGE = Time.current.beginning_of_month..Time.current.end_of_month

  has_one_attached :avatar
  has_many :sales

  validates :name, presence: true
  validates :matriculation, presence: true, uniqueness: true

  def monthly_sales_total
    sales.where(created_at: CURRENT_MONTH_RANGE).sum(:total_price)
  end

  def self.top_customers_data
    joins(:sales)
      .select("customers.id, customers.name, SUM(sales.total_price) AS total_sales")
      .where(sales: { created_at: CURRENT_MONTH_RANGE })
      .group("customers.id, customers.name")
      .order("total_sales DESC")
      .limit(5)
      .map { |customer| { name: customer.name, total: customer.total_sales } }
  end
end
