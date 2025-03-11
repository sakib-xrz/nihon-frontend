

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // This allows images from any hostname over HTTPS
        },
      ],
    },
  };
  
  export default nextConfig;