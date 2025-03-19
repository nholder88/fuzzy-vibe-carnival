/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/chores/:path*',
                destination: process.env.CHORE_SERVICE_URL + '/:path*',
            },
            {
                source: '/api/inventory/:path*',
                destination: process.env.INVENTORY_SERVICE_URL + '/:path*',
            },
            {
                source: '/api/shopping/:path*',
                destination: process.env.SHOPPING_SERVICE_URL + '/:path*',
            },
            {
                source: '/api/households/:path*',
                destination: process.env.HOUSEHOLD_SERVICE_URL + '/:path*',
            },
        ];
    },
};

module.exports = nextConfig; 