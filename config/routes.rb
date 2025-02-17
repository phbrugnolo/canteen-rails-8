Rails.application.routes.draw do
  resources :customers
  concern :activatable do
    member do
      put :activate
      put :deactivate
    end
  end

  root "main/main#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  namespace :main, path: "", path_names: { new: "novo", create: "novo", edit: "editar", update: "editar" } do
    with_options concerns: [ :activatable ], except: [ :destroy ] do
      resources :products, path: "produtos"
      resources :customers, path: "clientes"
    end
  end
end
