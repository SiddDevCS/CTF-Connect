/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'cyber-blue': '#1E90FF',
          'dark-navy': '#121212',
          'text-light': '#F5F5F5',
        },
      },
    },
    plugins: [],
  }