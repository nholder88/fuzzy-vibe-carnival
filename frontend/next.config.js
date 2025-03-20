/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/chores/:path*',
                destination: (process.env.CHORE_SERVICE_URL || 'http://chore-service:3001') + '/:path*',
            },
            {
                source: '/api/inventory/:path*',
                destination: (process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:8000') + '/:path*',
            },
            {
                source: '/api/shopping/:path*',
                destination: (process.env.SHOPPING_SERVICE_URL || 'http://shopping-service:5000') + '/:path*',
            },
            {
                source: '/api/households/:path*',
                destination: (process.env.HOUSEHOLD_SERVICE_URL || 'http://household-service:3002') + '/:path*',
            },
        ];
    },
};

module.exports = nextConfig; 