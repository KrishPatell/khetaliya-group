# Formspree Integration Setup Guide

## Overview
All email forms on the website are now configured to work with Formspree. The integration is **ready to use** - no API key needed! Formspree endpoint is already configured.

## Setup Status: ✅ Complete

The Formspree endpoint `https://formspree.io/f/mvzgedqj` has been configured for all forms.

## How It Works

- All forms on the website automatically submit to Formspree
- Form data is sent via POST request to Formspree
- Formspree sends an email to the recipient email configured in your Formspree dashboard
- Success/error messages are displayed to users without page reload

## Form Configuration

The contact form (`contact-us.html`) is already configured with:
- **Action**: `https://formspree.io/f/mvzgedqj`
- **Method**: `POST`
- **Form Fields**: All fields have proper `name` attributes:
  - `name-2` - User's name
  - `Email-2` - User's email
  - `Phone` - Phone number
  - `field-2` - Message/inquiry

## Adding Formspree to Other Forms

If you add new forms, the JavaScript handler will automatically:
1. Set the form `action` to the Formspree endpoint
2. Set the form `method` to `POST`
3. Handle submissions with loading states and success/error messages

**Important**: Make sure all form inputs have `name` attributes for Formspree to capture the data.

Example:
```html
<form>
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## Configure Recipient Emails

The form is configured to send emails to all three addresses:
- `info@khetaliyagroup.com`
- `khetaliyainfraventuresllp@gmail.com`
- `redevelopment@khetaliyagroup.com`

### Option 1: Using Hidden Fields (Already Configured)
The form includes a hidden `_to` field with all three email addresses. Formspree will send submissions to all of them.

### Option 2: Configure in Formspree Dashboard (Recommended)
1. Log in to your Formspree account
2. Go to your form settings for `mvzgedqj`
3. Add all three email addresses as recipients:
   - `info@khetaliyagroup.com`
   - `khetaliyainfraventuresllp@gmail.com`
   - `redevelopment@khetaliyagroup.com`
4. All form submissions will be sent to all three addresses

## Testing

1. Open `contact-us.html` in your browser (or visit your live site)
2. Fill out the contact form
3. Submit the form
4. Check your email inbox for the submission
5. You should see a success message on the page

## Files Modified

- `js/forms-pre-config.js` - Formspree endpoint configuration
- `js/forms-pre-handler.js` - Form submission handler with loading states
- All HTML files - Added Formspree script references
- `contact-us.html` - Updated form with Formspree action URL

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the Formspree endpoint is correct: `https://formspree.io/f/mvzgedqj`
3. Ensure recipient email is configured in Formspree dashboard
4. Check that all form fields have `name` attributes
5. Verify form method is set to `POST`
