class User < ApplicationRecord
  has_secure_password

  enum :role, { admin: 0, user: 1 }
end
