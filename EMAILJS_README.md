# Integrating EmailJS in Contact Form

The Contact Form is now wired up with `@emailjs/browser` to send emails straight from the client side without needing a backend server!

Follow these steps to complete the setup so you actually receive the emails.

## Step 1: Sign up and set up EmailJS
1. Go to [EmailJS (emailjs.com)](https://www.emailjs.com/) and create a free account.
2. Once logged in, go to the **Email Services** tab and add a new service (e.g., Gmail). Connect your Google account or provide SMTP credentials.
3. Note down your **Service ID** (e.g. `service_xyz123`).

## Step 2: Create an Email Template
1. Go to the **Email Templates** tab in your dashboard.
2. Create a new template and design how you want the email to look.
3. You can use variables passed from the code. Based on the integration in `Contact.tsx`, use these variables in your template:
   - `{{from_name}}` - The name of the sender
   - `{{mobile_number}}` - Their mobile number
   - `{{message}}` - The message they wrote
4. Example message body in EmailJS Template Editor:
   ```
   You have a new message from {{from_name}}.
   Mobile Number: {{mobile_number}}
   Message:
   {{message}}
   ```
5. Save the template and note down the **Template ID** (e.g. `template_abc456`).

## Step 3: Get Your Public Key
1. Go to the **Account** -> **API Keys** section in your dashboard.
2. Note down your **Public Key** (a random alphanumeric string).

## Step 4: Update the Code
Open `src/pages/Contact.tsx` and find the following block of code (around line 43 inside `handleSubmit`):

```tsx
await emailjs.send(
  'YOUR_SERVICE_ID', // e.g., 'service_xxxxx'
  'YOUR_TEMPLATE_ID', // e.g., 'template_xxxxx'
  {
    from_name: form.name,
    mobile_number: form.mobile,
    message: form.message,
  },
  'YOUR_PUBLIC_KEY' // e.g., 'xxxxxxx'
);
```

1. Replace `'YOUR_SERVICE_ID'` with your actual Service ID.
2. Replace `'YOUR_TEMPLATE_ID'` with your actual Template ID.
3. Replace `'YOUR_PUBLIC_KEY'` with your actual Public Key.

## (Optional) Step 5: Secure with Environment Variables
For better security, especially if you publish your code, you should move these keys to a `.env` file instead of hardcoding them:

1. Add these variables to the `.env` file in the root directory:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

2. Update the `Contact.tsx` file to reference these environment variables:
```tsx
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    from_name: form.name,
    mobile_number: form.mobile,
    message: form.message,
  },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

You're done! Test the contact form on your website and you should receive real emails.
