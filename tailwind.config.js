/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ===== Twilight Bonfire palette (balanced — warm dusk, not pitch black) =====
        midnight: {
          DEFAULT: '#232E47', // balanced twilight base
          900: '#1A2336', // deeper tone for overlays / image fades
          800: '#232E47', // base background
          700: '#2E3A57', // elevated surface
          card: 'rgba(255,255,255,0.06)',
        },
        ember: {
          DEFAULT: '#FBBF24', // warm amber / gold glow
          soft: '#FCD34D',
          deep: '#F59E0B',
        },
        hydra: {
          DEFAULT: '#34D399', // emerald accent
          soft: '#6EE7B7',
          deep: '#10B981',
        },
        ink: '#F1F4F9', // soft white main text
        slatey: '#A6B1C5', // muted slate text
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'ui-serif', 'cursive'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        ember: '0 24px 80px -24px rgba(251,191,36,0.45)',
        hydra: '0 24px 80px -24px rgba(52,211,153,0.40)',
      },
      transitionTimingFunction: {
        // Cinematic "expo.out" curve recommended by the design skill
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-12deg)' },
          '100%': { transform: 'translateX(250%) skewX(-12deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 8s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 3.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
