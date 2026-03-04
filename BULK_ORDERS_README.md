# Bulk Orders Feature - Shakthi Thattuvada Set Corner

## 📋 Overview

The Bulk Orders feature provides a premium wholesale ordering system for shop owners and event buyers, completely separate from regular retail orders. It offers a mobile-first, Zomato/Swiggy-inspired interface with comprehensive admin management capabilities.

## 🎯 Features

### Customer-Facing Features
- **Premium Mobile-First UI** - Modern card-based layout inspired by food delivery apps
- **Hidden Access** - Not visible in main navigation, only accessible via direct URL
- **Multiple Contact Methods** - Call, WhatsApp, Email, and Enquiry Form
- **Real-time Configuration** - Admin can update pricing and products dynamically
- **Smooth Animations** - Framer Motion powered interactions
- **Responsive Design** - Optimized for mobile devices

### Admin Features
- **Configuration Management** - Update all bulk order details
- **Enquiry Management** - View and manage customer enquiries
- **Status Tracking** - Track enquiries from pending to confirmed
- **Email Notifications** - Instant email alerts for new enquiries
- **Quick Actions** - Direct call/WhatsApp integration

## 🏗️ Architecture

### Database Schema

#### `bulk_order_config` Table
```sql
- id (UUID, Primary Key)
- title (TEXT) - Page title
- subtitle (TEXT) - Page subtitle  
- minimum_order (DECIMAL) - Minimum order amount
- small_thattu_vada_quantity (INTEGER) - Packet count
- small_thattu_vada_weight (TEXT) - Weight description
- big_muruku_quantity (INTEGER) - Packet count
- big_thattu_vada_quantity (INTEGER) - Packet count
- box_price (DECIMAL) - Packaging cost
- total_price (DECIMAL) - Total wholesale price
- contact_number (TEXT) - Contact phone
- whatsapp_number (TEXT) - WhatsApp number
- email (TEXT) - Contact email
- is_active (BOOLEAN) - Enable/disable feature
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `bulk_order_enquiries` Table
```sql
- id (UUID, Primary Key)
- name (TEXT) - Customer name
- mobile_number (TEXT) - Contact number
- order_quantity (TEXT) - Order details
- delivery_date (DATE) - Preferred delivery
- message (TEXT) - Additional notes
- status (ENUM) - pending/contacted/confirmed/cancelled
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Frontend Components

#### Pages
- **`/bulk-orders`** - Customer bulk order page
- **`/admin/bulk-orders`** - Admin management panel

#### Key Components
- **BulkOrders.tsx** - Main customer interface
- **AdminBulkOrders.tsx** - Admin management interface
- **bulkOrderService.ts** - API service layer
- **bulkOrder.ts** - TypeScript type definitions

## 🚀 Setup & Configuration

### 1. Environment Variables

Add these to your `.env` file:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID_BULK_ORDER=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. EmailJS Template Setup

Create an EmailJS template with these variables:

```
{{to_email}} - Recipient email
{{from_name}} - Customer name
{{from_email}} - Customer email/phone
{{phone}} - Customer phone number
{{order_quantity}} - Order details
{{delivery_date}} - Delivery date
{{message}} - Customer message
{{subject}} - Email subject
```

### 3. Database Migration

Run the SQL migration:

```sql
-- File: supabase/migrations/20240304_create_bulk_orders.sql
```

## 📱 User Access

### For Customers
- **Direct URL**: `https://yoursite.com/bulk-orders`
- **No Navigation Link**: Hidden from main menu
- **Mobile Optimized**: Best experience on mobile devices

### For Admins
- **Admin Panel**: `https://yoursite.com/admin/bulk-orders`
- **Full Control**: Manage configuration and enquiries
- **Real-time Updates**: Instant notification of new enquiries

## 🎨 UI/UX Design

### Design Principles
- **Mobile-First**: Optimized for mobile viewing
- **Food App Inspired**: Zomato/Swiggy-style interface
- **Premium Feel**: Clean, professional appearance
- **Accessibility**: WCAG compliant interactions

### Color Scheme
- **Primary**: Red (#E53935)
- **Secondary**: White
- **Accent**: Yellow (#FFD54F)
- **Success**: Green
- **Info**: Blue

### Animations
- **Page Load**: Fade-in effect
- **Cards**: Slide-up animations
- **Buttons**: Scale on hover/tap
- **Forms**: Smooth transitions

## 📧 Email Integration

### EmailJS Configuration

1. **Sign up** at [EmailJS](https://www.emailjs.com/)
2. **Create Email Service** (Gmail, Outlook, etc.)
3. **Create Email Template** with variables
4. **Update Environment Variables** with your IDs

### Email Template Example

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #E53935;">New Bulk Order Enquiry</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Phone:</strong> {{phone}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Order Quantity:</strong> {{order_quantity}}</p>
    <p><strong>Delivery Date:</strong> {{delivery_date}}</p>
    <p><strong>Message:</strong> {{message}}</p>
  </div>
  
  <p style="color: #666; font-size: 14px;">
    This enquiry was submitted via the Shakthi Thattuvada Set Corner bulk order form.
  </p>
</div>
```

## 🔧 Technical Implementation

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend Stack
- **Supabase** - Database & Auth
- **EmailJS** - Email notifications
- **Row Level Security** - Data protection

### Key Files Structure
```
src/
├── pages/
│   ├── BulkOrders.tsx          # Customer page
│   └── admin/
│       └── BulkOrders.tsx      # Admin page
├── lib/
│   └── bulkOrderService.ts     # API service
├── types/
│   └── bulkOrder.ts           # Type definitions
└── components/admin/
    └── AdminSidebar.tsx        # Admin navigation
```

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run deploy
```

### Environment Setup
1. **Development**: `npm run dev`
2. **Production**: Build and deploy to GitHub Pages
3. **Database**: Run migrations on Supabase

## 🔒 Security Features

### Access Control
- **RLS Policies** - Row Level Security on all tables
- **Admin Only** - Configuration updates restricted to admins
- **Public Read** - Bulk order config publicly readable
- **Enquiry Protection** - Safe form submission

### Data Validation
- **Input Sanitization** - Form data validation
- **Type Safety** - TypeScript interfaces
- **Error Handling** - Graceful failure states

## 📊 Monitoring & Analytics

### Error Tracking
- **Console Logging** - Development errors
- **User Feedback** - Form submission errors
- **Network Monitoring** - API call failures

### Performance
- **Lazy Loading** - Component optimization
- **Animation Performance** - 60fps interactions
- **Mobile Optimization** - Touch-friendly interface

## 🔄 Maintenance

### Regular Tasks
- **Monitor Enquiries** - Check for new submissions
- **Update Pricing** - Adjust bulk order prices
- **Email Template** - Update notification content
- **Database Backup** - Regular Supabase backups

### Troubleshooting

#### Common Issues
1. **Email Not Sending** - Check EmailJS configuration
2. **Form Not Submitting** - Verify Supabase connection
3. **Page Not Loading** - Check environment variables
4. **Admin Access** - Verify user permissions

#### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test EmailJS configuration
4. Check Supabase RLS policies

## 🆘 Support

### For Technical Issues
- **Documentation**: This README file
- **Code Comments**: Inline documentation
- **Type Definitions**: TypeScript interfaces

### For Business Questions
- **Bulk Orders**: Use the enquiry form
- **Admin Access**: Contact system administrator
- **Pricing Updates**: Use admin panel

## 📈 Future Enhancements

### Planned Features
- **Order Tracking** - Real-time order status
- **Payment Integration** - Online bulk order payments
- **Inventory Management** - Stock level tracking
- **Analytics Dashboard** - Bulk order insights
- **Multi-language Support** - Regional language options

### Scalability
- **Cloud Functions** - Server-side processing
- **CDN Integration** - Asset optimization
- **Database Optimization** - Query performance
- **Mobile App** - Native bulk order app

---

## 📞 Contact

For questions about the Bulk Orders feature:
- **Technical**: Development team
- **Business**: Use the bulk order enquiry form
- **Support**: Admin panel contact options

---

*Last Updated: March 2026*
*Version: 1.0.0*
