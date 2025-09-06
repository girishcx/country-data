# Country Data Dashboard - EC2 Deployment Guide

This guide will help you deploy the Country Data Dashboard on an Amazon EC2 instance.

## Prerequisites

- An AWS EC2 instance (Ubuntu 20.04 or later recommended)
- SSH access to your EC2 instance
- A Gemini API key (optional, for AI functionality)

## Quick Deployment

1. **Upload your code to EC2:**
   ```bash
   # From your local machine
   scp -r /path/to/country-data ubuntu@your-ec2-ip:/home/ubuntu/
   ```

2. **SSH into your EC2 instance:**
   ```bash
   ssh ubuntu@your-ec2-ip
   ```

3. **Run the deployment script:**
   ```bash
   cd /home/ubuntu/country-data
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Set up your environment variables:**
   ```bash
   cd /var/www/country-data
   cp env.example .env
   nano .env  # Add your GEMINI_API_KEY
   ```

5. **Restart the service:**
   ```bash
   sudo systemctl restart country-data
   ```

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx -y
```

### 2. Application Setup
```bash
# Create application directory
sudo mkdir -p /var/www/country-data
sudo chown -R $USER:$USER /var/www/country-data
cd /var/www/country-data

# Copy your application files here
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
```bash
# Create environment file
cp env.example .env
nano .env  # Add your GEMINI_API_KEY
```

### 4. Service Configuration
```bash
# Create systemd service
sudo nano /etc/systemd/system/country-data.service
```

Add the following content:
```ini
[Unit]
Description=Country Data Dashboard Flask App
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/country-data
Environment="PATH=/var/www/country-data/venv/bin"
Environment="FLASK_DEBUG=False"
ExecStart=/var/www/country-data/venv/bin/gunicorn --config gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

### 5. Nginx Configuration (Optional)
```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/country-data
```

Add the following content:
```nginx
server {
    listen 80;
    server_name your-ec2-ip;  # Replace with your EC2 public IP

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Start Services
```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable country-data
sudo systemctl start country-data
sudo systemctl enable nginx
sudo systemctl restart nginx

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable
```

## Accessing Your Application

- **Direct access:** `http://your-ec2-ip:5000`
- **Via nginx:** `http://your-ec2-ip` (if nginx is configured)

## Useful Commands

```bash
# View application logs
sudo journalctl -u country-data -f

# Restart application
sudo systemctl restart country-data

# Check application status
sudo systemctl status country-data

# View nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Security Considerations

1. **Firewall:** Only open necessary ports (22, 80, 443)
2. **SSL:** Consider setting up SSL certificates for HTTPS
3. **API Key:** Keep your Gemini API key secure and never commit it to version control
4. **Updates:** Regularly update your system and dependencies

## Troubleshooting

### Application not starting
```bash
# Check logs
sudo journalctl -u country-data -f

# Check if port is in use
sudo netstat -tlnp | grep :5000
```

### Nginx issues
```bash
# Test nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx
```

### Permission issues
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/country-data
```

## Chrome Extension Configuration

Update your Chrome extension's `manifest.json` to point to your EC2 instance:

```json
{
    "host_permissions": [
        "http://your-ec2-ip:5000/",
        "https://your-ec2-ip:5000/"
    ]
}
```

And update the API URL in `popup.js`:
```javascript
const API_BASE_URL = 'http://your-ec2-ip:5000';
```

## Monitoring

Consider setting up monitoring tools like:
- CloudWatch (AWS native)
- Prometheus + Grafana
- Simple uptime monitoring services

## Backup

Regularly backup your application:
```bash
# Create backup
tar -czf country-data-backup-$(date +%Y%m%d).tar.gz /var/www/country-data

# Store backup in S3 or another location
aws s3 cp country-data-backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```
