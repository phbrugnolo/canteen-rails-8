class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string  :name
      t.string  :email,              null: false, index: { unique: true }
      t.string  :encrypted_password, null: false
      t.integer :role,               null: false, default: 0
      t.timestamps
    end
  end
end
