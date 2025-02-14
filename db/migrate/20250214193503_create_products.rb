class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.string :status
      t.decimal :price

      t.timestamps
    end
  end
end
