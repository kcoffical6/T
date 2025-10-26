import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff2ee',
          100: '#ffe5db',
          200: '#ffcbb8',
          300: '#ffb195',
          400: '#ff9772',
          500: '#ff7f50',
          600: '#e67248',
          700: '#b35938',
          800: '#804028',
          900: '#4d2618',
          950: '#331a10',
        },
        secondary: {
          50: '#e7eaf0',
          100: '#cfd6e1',
          200: '#9faec3',
          300: '#6f86a5',
          400: '#3f5e87',
          500: '#0f3669',
          600: '#0d2f5c',
          700: '#0b284f',
          800: '#092142',
          900: '#071a35',
          950: '#051328',
        },
        accent: {
          50: '#ffffff',
          100: '#ffffff',
          200: '#ffffff',
          300: '#fffaf0',
          400: '#fff7e8',
          500: '#fff5e1',
          600: '#e6dbca',
          700: '#b3aca0',
          800: '#807d76',
          900: '#4d4b46',
          950: '#33322f',
        },
        'steel-blue': '#4682B4'
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Volkhov', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
