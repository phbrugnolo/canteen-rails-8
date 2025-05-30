class Main::MainController < ApplicationController
  def index
    @total_customers = Customer.count
    @active_customers = Customer.active.count
    @total_products = Product.count
    @active_products = Product.active.count
    @total_sales = Sale.count
    @recent_sales = Sale.includes(:customer).recent.limit(5)
    @top_customers = Customer.top_customers_data

    period = params[:period]&.to_sym || :this_month
    @period_revenue = Sale.revenue_for_period(period)
  end
end
