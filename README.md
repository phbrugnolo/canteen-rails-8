# 🍽️ Canteen Management System

A modern canteen management application built with Rails 8, designed to streamline sales operations, customer management, and product inventory for educational institutions and cafeterias.

## ✨ Features

### 📊 Dashboard
- Real-time sales overview
- Revenue tracking (daily, monthly, yearly)
- Top customers analytics
- Recent sales monitoring

### 👥 Customer Management
- Customer registration with avatar support
- Student matriculation tracking
- Customer status management (active/inactive)
- Purchase history tracking
- Customer profile with tabbed interface

### 🛍️ Product Management
- Product catalog with image support
- Price and description management
- Product status control (active/inactive)
- Inventory tracking
- Product search and filtering

### 💳 Sales Management
- Interactive point-of-sale interface
- Real-time cart management
- Customer selection with active customer filtering
- Sales history and reporting
- JSON-based cart storage
- Advanced sales filtering by customer and date

### 🔍 Advanced Features
- Multi-language support (Portuguese/English)
- Responsive design with Bootstrap
- Real-time search and filtering
- Modal confirmations for critical actions
- Form validation with Simple Form
- File upload support for avatars and product images

## 🛠️ Technology Stack

- **Backend**: Ruby on Rails 8.0.1
- **Database**: SQLite3 (development), PostgreSQL ready
- **Frontend**: Bootstrap 5, JavaScript ES6+
- **Authentication**: Devise
- **File Processing**: Active Storage
- **Build Tools**: esbuild, CSS bundling
- **Testing**: Minitest with system tests
- **Deployment**: Docker & Kamal ready

## 📋 Requirements

- Ruby 3.3+
- Rails 8.0.1
- Node.js 18+
- SQLite3 (development)
- ImageMagick (for image processing)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canteen-rails-8
   ```

2. **Install dependencies**
   ```bash
   bundle install
   npm install
   ```

3. **Database setup**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the development server**
   ```bash
   bin/dev
   ```

   This will start both the Rails server and the asset build processes.

### Alternative startup options

- **Rails server only**: `rails server`
- **Build assets**: `npm run build`
- **Watch CSS**: `npm run watch:css`

## 🧪 Testing

### Run the complete test suite
```bash
rails test
```

### Run specific test types
```bash
# Unit tests
rails test:models

# Controller tests
rails test:controllers

# System tests (browser automation)
rails test:system

# Test with coverage
rails test --verbose
```

## 📁 Project Structure

```
app/
├── controllers/
│   ├── main/                    # Main application controllers
│   │   ├── customers_controller.rb
│   │   ├── products_controller.rb
│   │   ├── sales_controller.rb
│   │   └── main_controller.rb   # Dashboard
│   └── users/                   # Authentication controllers
├── models/
│   ├── customer.rb              # Customer with Activatable concern
│   ├── product.rb               # Product with image support
│   ├── sale.rb                  # Sales with JSON cart
│   └── concerns/
│       └── activatable.rb       # Status management concern
├── views/
│   ├── main/                    # Main application views
│   └── layouts/
└── javascript/
    ├── application.js
    ├── shared/                  # Shared JS components
    └── misc/                    # Feature-specific JS modules
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# Database
DATABASE_URL=sqlite3:storage/development.sqlite3

# Rails
RAILS_ENV=development
RAILS_SERVE_STATIC_FILES=true

# Image processing
IMAGE_PROCESSING_MAX_WIDTH=1920
IMAGE_PROCESSING_MAX_HEIGHT=1080
```

### Database Configuration

The application uses SQLite3 for development and testing. For production, configure PostgreSQL in `config/database.yml`.

### Asset Pipeline

The application uses:
- **esbuild** for JavaScript bundling
- **SASS** for CSS compilation
- **Propshaft** for asset serving

## 🌐 Internationalization

The application supports multiple languages:
- Portuguese (pt-BR) - Default
- English (en)

Translation files are located in `config/locales/`.

## 🐳 Docker Support

### Development with Docker

```bash
# Build the image
docker build -t canteen-app .

# Run the container
docker run -p 3000:3000 canteen-app
```

### Production Deployment with Kamal

```bash
# Setup Kamal
bundle exec kamal setup

# Deploy
bundle exec kamal deploy
```

## 📊 Database Schema

### Core Models

- **Users**: Authentication (Devise)
- **Customers**: Student/customer information with avatars
- **Products**: Inventory items with images and pricing
- **Sales**: Transaction records with JSON cart data

### Key Relationships

- Customer `has_many` Sales
- Sale `belongs_to` Customer
- Customer and Product both include `Activatable` concern

## 🔍 API Endpoints

### Main Routes

- `GET /` - Dashboard
- `GET /main/customers` - Customer management
- `GET /main/products` - Product management
- `GET /main/sales` - Sales management
- `POST /main/sales` - Create new sale

### JSON API Support

Most controllers support JSON responses for AJAX interactions:
- `GET /main/sales/new.json` - Products data for POS
- Customer and product filtering endpoints

## 🛡️ Security Features

- CSRF protection
- Content Security Policy
- Parameter filtering for sensitive data
- Secure file upload validation
- Authentication required for all main features

## 🎨 UI/UX Features

- Responsive Bootstrap 5 design
- Interactive modals for confirmations
- Real-time search and filtering
- Tabbed interfaces for complex forms
- Progress indicators for long operations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Rails conventions
- Write tests for new features
- Update documentation
- Use semantic commit messages
- Ensure responsive design compatibility

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the test files for usage examples
3. Consult the Rails 8 documentation
4. Create a new issue with detailed information

## 🔄 Recent Updates

- ✅ Rails 8.0.1 compatibility
- ✅ Modern JavaScript with esbuild
- ✅ Enhanced filtering and search
- ✅ Improved responsive design
- ✅ Comprehensive test suite
- ✅ Docker and Kamal deployment support

---
