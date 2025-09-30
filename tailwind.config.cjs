const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/content/**/*.{md,mdx}',
    './public/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aurora: {
          50: '#f5f7ff',
          100: '#e3e9ff',
          200: '#c8d5ff',
          300: '#b4c6ff',
          400: '#8fa9ff',
          500: '#6f8dff',
          600: '#546fe5',
          700: '#4459b8',
          800: '#36478f',
          900: '#2a376d',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"Inter"', ...defaultTheme.fontFamily.sans],
        serif: ['"Source Serif 4"', ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        glow: '0 0 60px rgba(143, 169, 255, 0.25)',
      },
      maxWidth: {
        '65ch': '65ch',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.800'),
            a: {
              color: theme('colors.aurora.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            'a code': {
              color: 'inherit',
            },
            code: {
              color: theme('colors.neutral.900'),
              fontWeight: '500',
            },
            blockquote: {
              borderLeftColor: theme('colors.aurora.200'),
              color: theme('colors.neutral.700'),
              fontStyle: 'normal',
            },
            hr: {
              borderColor: theme('colors.neutral.200'),
            },
            table: {
              width: '100%',
              overflowX: 'auto',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.neutral.200'),
            a: {
              color: theme('colors.aurora.300'),
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              borderLeftColor: theme('colors.aurora.500'),
              color: theme('colors.neutral.200'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
