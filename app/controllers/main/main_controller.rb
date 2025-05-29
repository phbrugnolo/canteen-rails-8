class Main::MainController < ApplicationController
  def index
    @total_customers = Customer.count
    @active_customers = Customer.active.count
    @total_products = Product.count
    @active_products = Product.active.count
    @total_sales = Sale.count
    @total_revenue = Sale.sum(:total_price)
    @recent_sales = Sale.includes(:customer).recent.limit(5)
    @monthly_sales = monthly_sales_data
    @top_customers = top_customers_data
  end

  private

  def monthly_sales_data
    Sale.group_by_month(:created_at, last: 6).sum(:total_price)
  end

  def top_customers_data
    Customer.joins(:sales)
            .group(:id, :name)
            .sum("sales.total_price")
            .sort_by { |_, total| -total }
            .first(5)
            .map { |customer_data, total| { name: customer_data[1], total: total } }
  end
end
