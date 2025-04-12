/** @type {import('next').NextConfig} */
module.exports = {
  /* config options here */
  webpack: (config) => {
    return config;
  },
  images: {
    domains: [
      'via.placeholder.com',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
      'images.unsplash.com',
      'localhost'
    ],
  }
} 