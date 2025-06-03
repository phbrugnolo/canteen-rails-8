class Main::ReportsController < ApplicationController
  def index; end

  def promissory
    @customers = Customer.all.select do |customer|
      customer.monthly_sales_total.positive?
    end

    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "promissory",
               page_size: 'A4',
               orientation: 'Portrait'
      end
    end
  end
end
