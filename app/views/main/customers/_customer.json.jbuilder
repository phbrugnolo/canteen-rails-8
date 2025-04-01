json.extract! customer, :id, :name, :matriculation, :status, :created_at, :updated_at
json.url main_customer_url(customer, format: :json)
