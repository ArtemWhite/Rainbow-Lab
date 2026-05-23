/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          night: '#000000',
          'night-soft': '#0a0a0a',
          light: '#ffffff',
          cool: '#f0f0fa',
        },
        ink: {
          DEFAULT: '#000000',
          mute: '#5a5a5f',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          mute: '#f0f0fa',
        },
        hairline: {
          dark: '#3a3a3f',
          light: '#e0e0e8',
        },
      },
      fontFamily: {
        display: ['Inter', 'Arial Narrow', 'Arial', 'Verdana', 'sans-serif'],
        body: ['Inter', 'Arial', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        'display-xxl': ['80px', { lineHeight: '0.95', letterSpacing: '1.6px', fontWeight: '700' }],
        'display-xl': ['60px', { lineHeight: '1.2', letterSpacing: '1.2px', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '1.25', letterSpacing: '0.96px', fontWeight: '700' }],
        'button-cap': ['13.008px', { lineHeight: '0.94', letterSpacing: '1.17px', fontWeight: '700' }],
        'micro-cap': ['12px', { lineHeight: '2.0', letterSpacing: '0.96px' }],
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '18px',
        xl: '24px',
        xxl: '32px',
        huge: '48px',
      },
      borderRadius: {
        pill: '32px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delay-1': 'float 10s ease-in-out 1s infinite',
        'float-delay-2': 'float 7s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
