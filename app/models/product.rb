class Product < ApplicationRecord
  include Activatable

  has_one_attached :image

  validates :name, presence: true
  validates :description, presence: true, length: { maximum: 50 }
  validates :price, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: Float::MAX }

  def image_url
    if image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
    else
      ActionController::Base.helpers.asset_path("img-product.png")
    end
  end
end
