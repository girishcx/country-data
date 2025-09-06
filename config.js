// Configuration file for Country Data Dashboard
// Update these values according to your deployment

const CONFIG = {
    // Local Development Configuration
    LOCALHOST: '127.0.0.1',
    PORT: '5000',
    
    // AWS Instance Configuration (for web app deployment)
    // Replace 'your-aws-ip' with your actual AWS instance IP address
    AWS_IP: 'your-aws-ip', // e.g., '54.123.45.67'
    
    // API Configuration
    get LOCAL_API_URL() {
        return `http://${this.LOCALHOST}:${this.PORT}`;
    },
    
    get AWS_API_URL() {
        return `http://${this.AWS_IP}:${this.PORT}`;
    },
    
    // Chrome Extension Configuration (uses localhost)
    get EXTENSION_API_URL() {
        return this.LOCAL_API_URL;
    },
    
    // Web App Configuration (uses relative URLs)
    WEB_APP_API_ENDPOINT: '/get_country_data'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
