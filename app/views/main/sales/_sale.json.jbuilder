json.extract! sale, :id, :cart, :total_price, :customer_id, :created_at, :updated_at
json.url main_sale_url(sale, format: :json)
