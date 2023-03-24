/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-image': "url('https://cdn.shopify.com/s/files/1/0734/4868/5855/files/website_photo_banner_no_text-1.webp?v=1679621282')",
      }
    },
  },
  plugins: [],
};
