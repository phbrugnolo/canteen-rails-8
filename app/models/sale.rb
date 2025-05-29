class Sale < ApplicationRecord
  belongs_to :customer

  validates :cart, presence: true
  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :recent, -> { order(created_at: :desc) }

  def self.group_by_month(column = :created_at, options = {})
    format = options[:format] || "%Y-%m"

    group(Arel.sql("strftime('#{format}', #{column})")).order(Arel.sql("strftime('#{format}', #{column}) DESC"))
  end
end
