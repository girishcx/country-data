#!/bin/bash

# Deployment script for Country Data Dashboard on EC2

echo "🚀 Starting deployment of Country Data Dashboard..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python 3 and pip if not already installed
echo "🐍 Installing Python 3 and pip..."
sudo apt install python3 python3-pip python3-venv -y

# Install nginx for reverse proxy (optional but recommended)
echo "🌐 Installing nginx..."
sudo apt install nginx -y

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/country-data
sudo chown -R $USER:$USER /var/www/country-data
cd /var/www/country-data

# Copy application files (assuming they're in the current directory)
echo "📋 Copying application files..."
cp -r /path/to/your/country-data/* /var/www/country-data/

# Create virtual environment
echo "🔧 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create systemd service file
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/country-data.service > /dev/null <<EOF
[Unit]
Description=Country Data Dashboard Flask App
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=/var/www/country-data
Environment="PATH=/var/www/country-data/venv/bin"
Environment="FLASK_DEBUG=False"
ExecStart=/var/www/country-data/venv/bin/gunicorn --config gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Configure nginx (optional)
echo "🌐 Configuring nginx..."
sudo tee /etc/nginx/sites-available/country-data > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/country-data /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start and enable services
echo "🔄 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable country-data
sudo systemctl start country-data
sudo systemctl enable nginx
sudo systemctl restart nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable

# Check service status
echo "📊 Checking service status..."
sudo systemctl status country-data --no-pager
sudo systemctl status nginx --no-pager

echo "✅ Deployment completed!"
echo "🌐 Your application should be accessible at:"
echo "   - Direct: http://your-ec2-ip:5000"
echo "   - Via nginx: http://your-ec2-ip"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set up your GEMINI_API_KEY in /var/www/country-data/.env"
echo "   2. Update the nginx server_name with your domain/IP"
echo "   3. Configure SSL certificate if needed"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: sudo journalctl -u country-data -f"
echo "   - Restart app: sudo systemctl restart country-data"
echo "   - Check status: sudo systemctl status country-data"
