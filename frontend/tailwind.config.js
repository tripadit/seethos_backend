/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      border: {
        dash: '1px dashed 4px #344054',
      },
      fontFamily: {
        inter: ['Inter', 'sans'],
        roboto: ['Roboto Condensed'],
      },
      animationDuration: {
        '2s': '2s',
      },
      fontSize: {
        52: '52px',
        60: '60px',
        48: '48px',
        38: '38px',
        40: '40px',
        32: '32px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(94deg, #FF6C00 0%, #8A00E1 99.68%)',
        'hero-section-gradient':
          'linear-gradient(90deg, rgba(255, 255, 255, 0.028) 4.13%, rgba(255, 255, 255, 0.12) 80.29%)',
        'secondary-gradient': 'linear-gradient(93.57deg, #DC3450 0%, #E1401C 99.68%)',
        'business-need-gradient':
          'linear-gradient(93.57deg, rgba(196, 52, 220, 0.1) 0%, rgba(115, 28, 225, 0.1) 99.68%)',
        'love-us-gradient':
          'linear-gradient(93.47deg, rgba(148, 42, 232, 0.28) 0%, rgba(127, 23, 232, 0.28) 100%)',
        'unreial-primary-btn-color': 'linear-gradient(93.57deg, #A634DC 0%, #5B1CE1 99.68%)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          muted: '#667085',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          50: '#F9E9EA',
          400: '#DC3450',
          600: '#B51E24',
          700: '#8D171C',
        },
        unrealPrimary: {
          DEFAULT: '#DC3450',
          400: '#F5536E',
        },
        blueGray: {
          300: '#CBD5E1',
          500: '#64748B',
        },
        gray: {
          100: '#F2F4F7',
          200: '#EAECF0',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
          1000: '#667085',
          1100: '#ACACAC',
        },
        success: {
          50: '#ECFDF3',
          500: '#12B76A',
          700: '#027A48',
        },
        blue: {
          500: '#2447FF',
        },
        blueLight: {
          50: '#F0F9FF',
          700: '#026AA2',
        },
        purple: {
          0: '#F7EAFE',
          50: '#f7eafe',
          100: '#e5bffd',
          200: '#d9a0fc',
          300: '#c775fa',
          400: '#bd5af9',
          500: '#ac31f8',
          600: '#9d2de2',
          700: '#7a23b0',
          800: '#5f1b88',
          900: '#481568',
          950: '#6941C6',
        },
        warning: {
          50: '#FFFAEB',
          100: '#FEF0C7',
          DEFAULT: '#FFC107',
          600: '#DC6803',
        },
        neutral: {
          700: '#374151',
          900: '#111827',
        },
        dark: {
          100: '#07081A',
          200: '#FF6C00',
        },
        charcoal: '$344054',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        scale: {
          '0%': { width: '50%', height: '50%' },
          '100%': { width: '100%', height: '100%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        scale: 'scale 1s ease-in-out infinite',
      },
      spacing: {
        body: 'calc(100vh - 68px)',
        header: '68px',
        'header-with-tag': '104px',
        'body-with-tag': 'calc(100vh - 104px)',
        'sidebar-close': '48px',
        70: '70px',
        'email-sample': 'calc(100vh - 354px)',
        574: '574px',
        306: '306px',
        120: '120px',
        80.1: '80px',
      },
      maxWidth: {
        370: '370px',
        385: '385px',
        465: '465px',
        600: '600px',
        1220: '1220px',
        800: '800px',
      },
      minWidth: {
        280: '280px',
        170: '170px',
      },
      maxHeight: {
        300: '300px',
        500: '500px',
      },
      width: {
        206: '206px',
        418: '418px',
      },
      height: {
        'email-sample': 'calc(100vh - 204px)',
      },
      boxShadow: {
        header: '0px 2px 8px 0px #34405405',
        card: '0px 1px 2px 0px #1018280D',
        table: '0px 1px 2px 0px #1018280F,0px 1px 3px 0px #1018281A',
        pricingCard: '0px 4px 6px -2px #10182808,0px 12px 16px -4px #10182814',
        card100: '0px 2px 14px 0px rgba(16, 24, 40, 0.10)',
        benifitsCardItem: '0px 0px 16px 0px #0000000D',
        blogItem: '0px 10px 20px 0px #9D4B8B0D',
        heroInput: '0px 6px 16px 0px #00000008',
        professionalAssistance: '0px 16px 24px 0px #00000040',
        qrCard: '0px 2px 8px 0px #10182814',
      },
      lineHeight: {
        62: '62px',
        66: '66px',
      },
      screens: {
        laptop: '1025px',
        desktop: '1280px',
        large: '1440px',
        extraLarge: '1900px',
        mobile: {
          max: '767px',
        },
        tablet: {
          min: '768px',
          max: '1024px',
        },
        small: {
          max: '1024px',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
