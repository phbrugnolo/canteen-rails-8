class CreateCustomers < ActiveRecord::Migration[8.0]
  def change
    create_table :customers do |t|
      t.string :name
      t.string :matriculation
      t.string :status

      t.timestamps
    end
  end
end
