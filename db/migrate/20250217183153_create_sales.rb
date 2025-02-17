class CreateSales < ActiveRecord::Migration[8.0]
  def change
    create_table :sales do |t|
      t.json :cart
      t.decimal :total_price
      t.references :customer, null: false, foreign_key: true

      t.timestamps
    end
  end
end
