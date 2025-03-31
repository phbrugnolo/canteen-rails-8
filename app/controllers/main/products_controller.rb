class Main::ProductsController < ApplicationController
  before_action :set_product, only: %i[ show edit update deactivate activate ]

  # GET /products or /products.json
  def index
    @products = Product.order(status: :asc)
  end

  # GET /products/1 or /products/1.json
  def show; end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit; end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)

    respond_to do |format|
      if @product.save
        format.html { redirect_to main_product_url(@product), notice: I18n.t(:model_was_successfully_created, model: @product.model_name.human) }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1 or /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to main_product_url(@product), notice: I18n.t(:model_was_successfully_updated, model: @product.model_name.human) }
        format.json { render :show, status: :ok, location: @product }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  def activate
    @product.update(status: "active") # This line updates the status of the product to 'inactive'
    @product.save!
    redirect_to main_products_path
  end

  def deactivate
    @product.update(status: "inactive") # This line updates the status of the product to 'inactive'
    @product.save!
    redirect_to main_products_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.expect(product: %i[name description status price image])
    end
end
