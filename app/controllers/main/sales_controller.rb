class Main::SalesController < ApplicationController
  before_action :set_sale, only: %i[ show ]

  # GET /sales or /sales.json
  def index
    @sales = Sale.all
  end

  # GET /sales/1 or /sales/1.json
  def show; end

  # GET /sales/new
  def new
    @sale = Sale.new
    @customers = Customer.where(status: "active")
    @products = Product.where(status: "active")

    respond_to do |format|
      format.html
      format.json { render json: { products: @products.as_json(methods: :image_url) } }
    end
  end

  # POST /sales or /sales.json
  def create
    @sale = Sale.new(sale_params)

    respond_to do |format|
      if @sale.save
        format.html { redirect_to main_sale_url(@sale), notice: I18n.t(:model_was_successfully_created, model: @sale.model_name.human) }
        format.json { render :show, status: :created, location: @sale }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @sale.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sale
      @sale = Sale.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def sale_params
      params.expect(sale: %i[cart total_price customer_id])
    end
end
