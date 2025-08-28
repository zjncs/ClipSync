import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#3B82F6',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1D4ED8',
              },
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgb(243 244 246)',
              color: 'inherit',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
          },
        },
        invert: {
          css: {
            color: 'rgb(209 213 219)',
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#3B82F6',
              },
            },
            code: {
              backgroundColor: 'rgb(31 41 55)',
            },
            pre: {
              backgroundColor: 'rgb(31 41 55)',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};