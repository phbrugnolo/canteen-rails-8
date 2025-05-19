# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Product.create([
  {
    name: "Bala",
    description: "7belo",
    status: "active",
    price: 0.25
  },
  {
    name: "RTX 4090",
    description: "roda td",
    status: "inactive",
    price: 13000
  },
  {
    name: "Diversos",
    description: "diverso",
    status: "active",
    price: 0.50
  }
])

Customer.create([
  {
    name: "João Nome Muito Grande Grande Grande Grande",
    matriculation: "123456",
    status: "active"
  },
  {
    name: "Pedro",
    matriculation: "654321",
    status: "active"
  },
  {
    name: "Teste",
    matriculation: "1456789",
    status: "inactive"
  }
])

Sale.create([
  {
    customer_id: 1,
    cart: "[{\"name\":\"Bala\",\"price\":\"0.25\",\"id\":1,\"quantity\":4},{\"name\":\"Diversos\",\"price\":\"0.50\",\"id\":2,\"quantity\":2}]",
    total_price: 2.00
  }
])

users = {
  admin: { name: "admin", email: "admin@exemplo.com", password: "admin123" },
  user: { name: "user", email: "user@exemplo.com", password: "user123" }
}

users.each do |role, attrs|
  user = User.find_or_initialize_by(name: attrs[:name])
  user.email = attrs[:email]
  user.password = attrs[:password] if user.new_record? || attrs[:password].present?
  user.role = role
  user.save!
end
