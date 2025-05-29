class Sale < ApplicationRecord
  belongs_to :customer

  validates :cart, presence: true
  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :recent, -> { order(created_at: :desc) }
  scope :this_month, -> { where(created_at: Date.current.beginning_of_month..Date.current.end_of_month) }
  scope :this_year, -> { where(created_at: Date.current.beginning_of_year..Date.current.end_of_year) }
  scope :last_month, -> { where(created_at: 1.month.ago.beginning_of_month..1.month.ago.end_of_month) }
  scope :last_year, -> { where(created_at: 1.year.ago.beginning_of_year..1.year.ago.end_of_year) }
  scope :today, -> { where(created_at: Date.current.beginning_of_day..Date.current.end_of_day) }

  def self.group_by_month(column = :created_at, options = {})
    format = options[:format] || "%Y-%m"

    group(Arel.sql("strftime('#{format}', #{column})")).order(Arel.sql("strftime('#{format}', #{column}) DESC"))
  end

  def self.revenue_for_period(period = :all_time)
    case period
    when :today
      today.sum(:total_price)
    when :this_month
      this_month.sum(:total_price)
    when :this_year
      this_year.sum(:total_price)
    when :last_month
      last_month.sum(:total_price)
    when :last_year
      last_year.sum(:total_price)
    else
      sum(:total_price)
    end
  end
end
