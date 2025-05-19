class User < ApplicationRecord
  devise :database_authenticatable, :recoverable, :rememberable, :validatable

  enum :role, { admin: 0, user: 1 }

  def admin?
    role == "admin"
  end
end
