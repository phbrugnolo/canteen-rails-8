class AddCpfToCustomers < ActiveRecord::Migration[8.0]
  def change
    add_column :customers, :cpf, :string
  end
end
