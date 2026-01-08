# Deployment Guide - Fixing 403 Forbidden Error

## Problem
Getting `403 Forbidden` error from OpenResty/Nginx on khetaliyagroup.com

## Common Causes of 403 Forbidden

1. **File Permissions** - Files/directories don't have proper read permissions
2. **Directory Index** - Server can't find index.html
3. **Server Configuration** - Nginx/OpenResty blocking access
4. **SELinux** (if enabled) - Security context blocking access

## Solution Steps

### Step 1: Check File Permissions

SSH into your server and run:

```bash
# Navigate to your website directory
cd /var/www/khetaliyagroup.com  # or wherever your files are

# Set proper permissions
chmod 755 .                      # Directory permissions
find . -type f -exec chmod 644 {} \;  # File permissions
find . -type d -exec chmod 755 {} \;  # Directory permissions

# Ensure index.html is readable
chmod 644 index.html
```

### Step 2: Check File Ownership

```bash
# Make sure files are owned by the web server user (usually www-data or nginx)
chown -R www-data:www-data /var/www/khetaliyagroup.com

# Or if using nginx user:
chown -R nginx:nginx /var/www/khetaliyagroup.com
```

### Step 3: Configure Nginx/OpenResty

1. **Edit your Nginx configuration file** (usually in `/etc/nginx/sites-available/khetaliyagroup.com` or `/etc/nginx/conf.d/khetaliyagroup.conf`)

2. **Use the provided `nginx.conf`** as a reference or copy the server block configuration

3. **Key settings to check:**
   ```nginx
   root /var/www/khetaliyagroup.com;  # Must point to your actual directory
   index index.html index.htm;         # Must include index.html
   
   location / {
       try_files $uri $uri/ /index.html;  # Important for SPA routing
   }
   ```

4. **Test configuration:**
   ```bash
   nginx -t
   # or
   openresty -t
   ```

5. **Reload Nginx:**
   ```bash
   systemctl reload nginx
   # or
   systemctl reload openresty
   ```

### Step 4: Check SELinux (if enabled)

```bash
# Check SELinux status
getenforce

# If enabled and causing issues, set proper context:
chcon -R -t httpd_sys_content_t /var/www/khetaliyagroup.com

# Or temporarily set to permissive mode (not recommended for production):
setenforce 0
```

### Step 5: Verify Directory Structure

Ensure your files are in the correct location:
```
/var/www/khetaliyagroup.com/
├── index.html
├── about-us.html
├── contact-us.html
├── css/
├── js/
├── images/
└── fonts/
```

### Step 6: Check Nginx Error Logs

```bash
# Check error logs for specific issues
tail -f /var/log/nginx/error.log
# or
tail -f /var/log/nginx/khetaliyagroup_error.log
```

## Quick Fix Commands

Run these commands in order:

```bash
# 1. Set permissions
cd /var/www/khetaliyagroup.com
chmod 755 .
chmod 644 index.html
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# 2. Set ownership (adjust user/group as needed)
chown -R www-data:www-data .

# 3. Test and reload Nginx
nginx -t && systemctl reload nginx
```

## Verify Configuration

After making changes, verify:

1. **Check if index.html exists:**
   ```bash
   ls -la /var/www/khetaliyagroup.com/index.html
   ```

2. **Check permissions:**
   ```bash
   ls -la /var/www/khetaliyagroup.com/
   ```

3. **Test locally:**
   ```bash
   curl -I http://localhost/
   ```

4. **Check Nginx configuration:**
   ```bash
   nginx -T | grep -A 20 "server_name khetaliyagroup.com"
   ```

## Additional Troubleshooting

### If still getting 403:

1. **Check if autoindex is disabled:**
   ```nginx
   autoindex off;  # Should be in your config
   ```

2. **Verify root directory path is correct:**
   ```nginx
   root /var/www/khetaliyagroup.com;  # Must be absolute path
   ```

3. **Check for .htaccess conflicts** (if using Apache alongside Nginx)

4. **Verify firewall isn't blocking:**
   ```bash
   firewall-cmd --list-all
   # or
   ufw status
   ```

## Contact Your Hosting Provider

If you're using a managed hosting service, they may have specific requirements. Contact their support with:
- Domain: khetaliyagroup.com
- Error: 403 Forbidden
- Server: OpenResty/Nginx
- Requested: Help configuring static HTML site

## Files Included

- `.htaccess` - Apache configuration (if needed)
- `nginx.conf` - Nginx/OpenResty server block configuration
- This guide - Troubleshooting steps
