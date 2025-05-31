/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design system colors
        background: {
          primary: '#0A0A0A',
          secondary: '#1A1A1A',
          accent: '#2A2A2A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          muted: '#666666',
        },
        accent: {
          primary: '#89a3c2', // Updated to use the blue color
          hover: '#7a94b8',
          warning: '#F59E0B',
        },
        // Legacy colors kept for backward compatibility
        darkBg: '#020305',
        menuBg: '#1b222a',
      },
      animation: {
        'spin-slow': 'spin 7s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-in-out',
        'glassFadeIn': 'glassFadeIn 0.5s ease-out forwards',
        'slideUp': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glassFadeIn: {
          '0%': { opacity: '0', backdropFilter: 'blur(0px)' },
          '100%': { opacity: '1', backdropFilter: 'blur(12px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        '3xl': '2200px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
  darkMode: ['class', '[data-theme="dark"]'],
};
