json.extract! product, :id, :name, :description, :status, :price, :created_at, :updated_at
json.url main_product_url(product, format: :json)
