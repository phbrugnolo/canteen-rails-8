#!/bin/bash

# CSS Class Migration Script
# This script helps migrate old class names to new namespaced ones

echo "🔄 Starting CSS class migration..."
echo "⚠️  This will modify your HTML templates. Make sure you have a backup!"
echo ""

# Get user confirmation
read -p "Do you want to proceed? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled."
    exit 1
fi

# Define the views directory
VIEWS_DIR="app/views"

if [ ! -d "$VIEWS_DIR" ]; then
    echo "❌ Views directory not found: $VIEWS_DIR"
    exit 1
fi

echo "📁 Searching in: $VIEWS_DIR"
echo ""

# Dashboard class migrations
echo "🔄 Migrating dashboard classes..."
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="container"/class="dashboard-container"/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="metric-icon/class="dashboard-metric-icon/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="metric-value/class="dashboard-metric-value/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="metric-content/class="dashboard-metric-content/g' {} \;

# Sales class migrations
echo "🔄 Migrating sales classes..."
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="product-item/class="sales-product-item/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="cart-item/class="sales-cart-item/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="cart-content/class="sales-cart-content/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="cart-summary/class="sales-cart-summary/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/class="quantity-input/class="sales-quantity-input/g' {} \;

# ID migrations for sales
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/id="search-input"/id="sales-search-input"/g' {} \;
find "$VIEWS_DIR" -name "*.html.erb" -exec sed -i 's/id="no-results"/class="sales-no-results"/g' {} \;

# JavaScript file migrations
echo "🔄 Migrating JavaScript selectors..."
if [ -d "app/javascript" ]; then
    find "app/javascript" -name "*.js" -exec sed -i 's/querySelector(.*cart-item.*)/querySelector(".sales-cart-item")/g' {} \;
    find "app/javascript" -name "*.js" -exec sed -i 's/querySelector(.*product-item.*)/querySelector(".sales-product-item")/g' {} \;
    find "app/javascript" -name "*.js" -exec sed -i 's/querySelector(.*quantity-input.*)/querySelector(".sales-quantity-input")/g' {} \;
    find "app/javascript" -name "*.js" -exec sed -i 's/getElementById.*search-input.*)/getElementById("sales-search-input")/g' {} \;
fi

echo ""
echo "✅ Migration completed!"
echo ""
echo "📋 Summary of changes:"
echo "   • Dashboard classes prefixed with 'dashboard-'"
echo "   • Sales classes prefixed with 'sales-'"
echo "   • JavaScript selectors updated"
echo ""
echo "🚨 Next steps:"
echo "   1. Test your application thoroughly"
echo "   2. Check for any remaining class conflicts"
echo "   3. Update any custom JavaScript/CSS not caught by this script"
echo "   4. Review the CSS_ARCHITECTURE_GUIDE.md for best practices"
echo ""
echo "💡 To find remaining old class names:"
echo "   grep -r 'class=\".*-item' $VIEWS_DIR"
echo "   grep -r 'class=\".*-content' $VIEWS_DIR"
