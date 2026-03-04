# Bulk Orders - Contact Numbers Configuration Guide

## 📞 Updating Contact Numbers

This guide explains how to update the contact numbers for the Call and WhatsApp buttons on the Bulk Orders page.

## 🔄 Two Methods to Update Contact Numbers

### Method 1: Via Admin Panel (Recommended)

1. **Access Admin Panel**
   - Go to: `https://yoursite.com/admin`
   - Login with admin credentials

2. **Navigate to Bulk Orders**
   - Click on "Bulk Orders" in the admin sidebar
   - Select the "Configuration" tab

3. **Update Contact Information**
   - **Contact Number**: Update the phone number for the Call button
   - **WhatsApp Number**: Update the WhatsApp number for the WhatsApp button
   - **Email**: Update the email for notifications (optional)

4. **Save Changes**
   - Click "Save Configuration" button
   - Changes will be reflected immediately on the bulk orders page

### Method 2: Via Database (Direct)

1. **Access Supabase Dashboard**
   - Login to your Supabase project
   - Go to Table Editor

2. **Update `bulk_order_config` Table**
   ```sql
   UPDATE bulk_order_config 
   SET 
     contact_number = '+919876543210',
     whatsapp_number = '+919876543210',
     updated_at = NOW()
   WHERE id = 'your-config-id';
   ```

## 📱 Contact Number Formats

### Supported Formats
- **International**: `+919876543210`
- **National**: `09876543210`
- **With spaces**: `+91 98765 43210`
- **With dashes**: `+91-98765-43210`

### Best Practices
- **Use international format** (`+91` for India)
- **Include country code** for WhatsApp
- **Test both Call and WhatsApp** after updating

## 🔧 Technical Implementation

### How Contact Numbers Work

#### Call Button
```typescript
const handleCall = () => {
  if (config?.contact_number) {
    window.open(`tel:${config.contact_number}`, '_blank');
  }
};
```

#### WhatsApp Button
```typescript
const handleWhatsApp = () => {
  if (config?.whatsapp_number) {
    const message = encodeURIComponent('Hi! I\'m interested in placing a bulk order.');
    window.open(`https://wa.me/${config.whatsapp_number.replace(/[^\d]/g, '')}?text=${message}`, '_blank');
  }
};
```

### Number Processing
- **Call**: Uses the number as-is with `tel:` protocol
- **WhatsApp**: Strips all non-digits for `wa.me/` URL

## 📋 Configuration Fields

### In Admin Panel
| Field | Purpose | Example |
|-------|---------|---------|
| Contact Number | Call button phone | `+919876543210` |
| WhatsApp Number | WhatsApp button | `+919876543210` |
| Email | Email notifications | `orders@shakthithattuvada.com` |

### In Database
```sql
-- Table: bulk_order_config
contact_number TEXT NOT NULL DEFAULT '+919876543210',
whatsapp_number TEXT NOT NULL DEFAULT '+919876543210',
email TEXT NOT NULL DEFAULT 'orders@shakthithattuvada.com'
```

## 🚀 Quick Setup

### Step 1: Test Current Numbers
1. Visit `/bulk-orders` page
2. Click "Call Now" button
3. Click "WhatsApp" button
4. Verify both work correctly

### Step 2: Update Numbers
1. Login to admin panel
2. Go to Bulk Orders → Configuration
3. Update contact numbers
4. Click Save

### Step 3: Verify Updates
1. Refresh bulk orders page
2. Test Call and WhatsApp buttons again
3. Confirm new numbers are working

## 🛠️ Troubleshooting

### Common Issues

#### Call Button Not Working
- **Check number format**: Ensure valid phone number
- **Mobile device**: Call buttons work best on mobile
- **Browser permissions**: Some browsers block automatic dialing

#### WhatsApp Button Not Working
- **Number format**: WhatsApp needs clean digits only
- **WhatsApp installed**: User must have WhatsApp app
- **Internet connection**: Required for WhatsApp Web

#### Changes Not Reflecting
- **Clear cache**: Refresh browser cache
- **Check admin save**: Ensure configuration was saved
- **Database sync**: Verify database update

### Debug Steps

1. **Check Browser Console**
   ```javascript
   // Open browser console and run:
   console.log('Current config:', window.location);
   ```

2. **Verify API Response**
   - Check network tab for bulk order config API call
   - Verify contact numbers in response

3. **Test Direct URLs**
   ```javascript
   // Test call URL:
   window.open('tel:+919876543210');
   
   // Test WhatsApp URL:
   window.open('https://wa.me/919876543210?text=Test');
   ```

## 📱 Mobile vs Desktop Behavior

### Mobile Devices
- **Call Button**: Opens phone dialer app
- **WhatsApp Button**: Opens WhatsApp app
- **Email Button**: Opens email client

### Desktop
- **Call Button**: May prompt for phone app
- **WhatsApp Button**: Opens WhatsApp Web
- **Email Button**: Opens default email client

## 🔒 Security Considerations

### Public Information
- Contact numbers are **publicly visible**
- Consider using **business numbers** only
- Avoid personal phone numbers

### Spam Prevention
- **WhatsApp Business**: Recommended for professional use
- **Call filtering**: Consider call management services
- **Email filtering**: Use business email addresses

## 📞 Recommended Contact Setup

### For Business Use
```typescript
// Recommended configuration:
contact_number: '+919876543210',     // Business landline
whatsapp_number: '+919876543210',     // WhatsApp Business
email: 'orders@shakthithattuvada.com' // Business email
```

### Testing Numbers
```typescript
// For testing:
contact_number: '+919876543210',
whatsapp_number: '+919876543210',
email: 'test@shakthithattuvada.com'
```

## 🔄 Bulk Updates

### Multiple Locations
If you have multiple locations, consider:
1. **Multiple configs**: Create separate configurations
2. **Location selector**: Add location dropdown
3. **Dynamic numbers**: Change based on user location

### Time-Based Updates
For different numbers based on time:
1. **Business hours**: Show business numbers
2. **After hours**: Show emergency numbers
3. **Holidays**: Special holiday contact

## 📊 Analytics Tracking

### Track Contact Usage
```javascript
// Add tracking to contact buttons:
const handleCall = () => {
  // Track analytics
  analytics.track('bulk_order_call_clicked');
  
  if (config?.contact_number) {
    window.open(`tel:${config.contact_number}`, '_blank');
  }
};
```

### Monitor Performance
- **Call button clicks**: Track engagement
- **WhatsApp opens**: Measure messaging usage
- **Email opens**: Monitor email contact rate

## 🎯 Best Practices

### Number Management
1. **Use consistent format** across all platforms
2. **Test regularly** to ensure numbers work
3. **Update promptly** when numbers change
4. **Document changes** for team reference

### User Experience
1. **Clear labeling** of contact methods
2. **Multiple options** for user preference
3. **Mobile optimization** for touch devices
4. **Error handling** for failed attempts

## 🆘 Support

### If Issues Persist
1. **Check this guide** for troubleshooting steps
2. **Verify environment variables** are set correctly
3. **Test EmailJS configuration** if emails aren't sending
4. **Contact development team** for technical issues

### Emergency Updates
For urgent contact number changes:
1. **Direct database update** (see Method 2)
2. **Clear CDN cache** if using CDN
3. **Force refresh** on client devices

---

## 📞 Quick Reference

### Admin Panel Path
`/admin/bulk-orders` → Configuration tab

### Database Table
`bulk_order_config` → `contact_number`, `whatsapp_number`

### Environment Variables
```env
VITE_EMAILJS_SERVICE_ID=service_h09rktf
VITE_EMAILJS_TEMPLATE_ID_BULK_ORDER=template_d9jd4fq
VITE_EMAILJS_PUBLIC_KEY=ffIR_wLr6XXU2vBOG
```

### Test URLs
- Call: `tel:+919876543210`
- WhatsApp: `https://wa.me/919876543210`
- Email: `mailto:orders@shakthithattuvada.com`

---

*Last Updated: March 2026*
*Version: 1.0.0*
