# Cantina - RD 🍽️

A modern canteen management system built with Ruby on Rails 8, designed to streamline customer management, product inventory, and sales tracking for educational institutions.

## 📋 Features

### 🧑‍🎓 Customer Management
- Complete customer registration with CPF validation
- Profile pictures with Active Storage
- Student matriculation tracking
- Active/Inactive status management
- Top customers analytics

### 🛍️ Product Management
- Product catalog with descriptions and images
- Price management
- Inventory status control (Active/Inactive)
- Product image uploads

### 💰 Sales Management
- Shopping cart functionality
- Real-time sales tracking
- Revenue analytics by period (today, this month, this year, etc.)
- Recent sales overview
- Customer purchase history

### 📊 Dashboard & Analytics
- Real-time statistics overview
- Revenue tracking by different periods
- Customer and product counts
- Recent sales monitoring
- Top customers ranking

### 🔐 Authentication & Authorization
- User authentication with Devise
- Role-based access (Admin/User)
- Secure session management

## 🛠️ Tech Stack

- **Backend**: Ruby on Rails 8.0.1
- **Database**: SQLite3 (development), configurable for production
- **Frontend**: Bootstrap 5.3.7
- **Styling**: SCSS with Bootstrap theming
- **JavaScript**: ESBuild bundling
- **File Storage**: Active Storage
- **Authentication**: Devise
- **Forms**: Simple Form
- **Internationalization**: Portuguese (pt-BR)

## 📦 Dependencies

### Ruby Gems
- `rails` - Web application framework
- `devise` - Authentication solution
- `simple_form` - Form builder
- `str_enum` - String enumerations
- `cpf_cnpj` - Brazilian document validation
- `image_processing` - Image variants and processing
- `solid_cache`, `solid_queue`, `solid_cable` - Database-backed Rails features

### JavaScript/CSS
- `bootstrap` - UI framework
- `bootstrap-icons` - Icon library
- `sweetalert2` - Modern alert dialogs
- `tom-select` - Advanced select component
- `@rails/ujs` - Rails UJS helpers

## 🚀 Getting Started

### Prerequisites
- Ruby 3.2+
- Node.js 18+
- Yarn package manager
- SQLite3

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canteen-rails-8
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   yarn install
   ```

4. **Setup the database**
   ```bash
   ./scripts/recreate_database.sh
   ```

5. **Start the development server**
   ```bash
   bin/dev
   ```

   This will start:
   - Rails server on port 3000
   - JavaScript build watcher
   - CSS build watcher

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

### Models Overview

- **User**: Authentication and authorization
- **Customer**: Student/customer information with CPF validation
- **Product**: Canteen products with pricing and images
- **Sale**: Transaction records with cart data and totals

### Key Relationships
- Customer has many Sales
- Product images via Active Storage
- Customer avatars via Active Storage

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first Bootstrap layout
- **Modern Interface**: Clean, intuitive user experience
- **Real-time Updates**: Dynamic content updates
- **Image Handling**: Drag-and-drop file uploads
- **Form Validation**: Client and server-side validation
- **Internationalization**: Full Portuguese localization

## 📱 API Endpoints

The application provides JSON API endpoints for:
- Customer management (`/clientes`)
- Product catalog (`/produtos`)
- Sales processing (`/vendas`)
- Dashboard data (revenue, statistics)

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `RAILS_ENV` - Rails environment
- `SECRET_KEY_BASE` - Rails secret key

### Localization
- Default locale: Portuguese (pt-BR)
- Timezone: America/Sao_Paulo (Brasilia)

## 🚀 Deployment

### Docker Support
The application includes Docker configuration:
```bash
docker build -t canteen-app .
docker run -p 3000:3000 canteen-app
```

### Kamal Deployment
Ready for deployment with Kamal:
```bash
kamal setup
kamal deploy
```

## 🧪 Testing

Run the test suite:
```bash
bin/rails test
bin/rails test:system
```

## 📈 Development

### Code Quality
- **Rubocop**: Ruby style guide enforcement
- **Brakeman**: Security vulnerability scanning
- **ESLint**: JavaScript linting

### Asset Pipeline
- **CSS**: SCSS compilation with autoprefixer
- **JavaScript**: ESBuild bundling with watch mode
- **Images**: Optimized serving via Rails asset pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
