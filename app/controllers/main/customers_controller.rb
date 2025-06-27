class Main::CustomersController < ApplicationController
  before_action :set_customer, only: %i[ show edit update deactivate activate ]

  # GET /customers or /customers.json
  def index
    @customers = Customer.order(:name)
  end

  # GET /customers/1 or /customers/1.json
  def show; end

  # GET /customers/new
  def new
    @customer = Customer.new
  end

  # GET /customers/1/edit
  def edit; end

  # POST /customers or /customers.json
  def create
    @customer = Customer.new(customer_params)

    respond_to do |format|
      if @customer.save
        format.html { redirect_to main_customer_url(@customer), notice: I18n.t(:model_was_successfully_created, model: @customer.model_name.human) }
        format.json { render :show, status: :created, location: @customer }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /customers/1 or /customers/1.json
  def update
    respond_to do |format|
      if @customer.update(customer_params)
        format.html { redirect_to main_customer_url(@customer), notice: I18n.t(:model_was_successfully_updated, model: @customer.model_name.human) }
        format.json { render :show, status: :ok, location: @customer }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  def activate
    respond_to do |format|
      if @customer.activate!
        format.html { redirect_to main_customer_url(@customer), notice: I18n.t(:model_was_successfully_activated, model: @customer.model_name.human) }
        format.json { render :show, status: :ok, location: @customer }
      else
        format.html { redirect_to main_customer_url(@customer), status: :unprocessable_entity }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  def deactivate
    respond_to do |format|
      if @customer.deactivate!
        format.html { redirect_to main_customer_url(@customer), notice: I18n.t(:model_was_successfully_deactivated, model: @customer.model_name.human) }
        format.json { render :show, status: :ok, location: @customer }
      else
        format.html { redirect_to main_customer_url(@customer), status: :unprocessable_entity }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_customer
      @customer = Customer.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def customer_params
      params.expect(customer: %i[name matriculation status avatar])
    end
end
