/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
        domains: ['images.pexels.com', 'airbnb-bucket666.s3.eu-north-1.amazonaws.com'], // <-- сюда список внешних хостов
    },
};

export default nextConfig;
