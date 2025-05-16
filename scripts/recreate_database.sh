#!/bin/bash

# Saída no caso de qualquer comando falhar
set -e

# Roda dentro do ambiente de desenvolvimento
RAILS_ENV=development

# Mensagens informativas
echo "Dropping the database..."
bin/rails db:drop RAILS_ENV=$RAILS_ENV

echo "Creating the database..."
bin/rails db:create RAILS_ENV=$RAILS_ENV

echo "Migrating the database..."
bin/rails db:migrate RAILS_ENV=$RAILS_ENV

echo "Seeding the database..."
bin/rails db:seed RAILS_ENV=$RAILS_ENV

echo "Database rebuild completed!"
