/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: "0rem",
          sm: "1rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "992px",
          xl: "1280px",
          "2xl": "1536px",
          "3xl": "2000px",
        },
        maxWidth: {
          sm: '640px',
          md: '768px',
          lg: '992px',
          xl: '1280px',
          '2xl': '1536px',
          '3xl': '2000px',
        }
      },
      extend: {
        // if this is changed, update the breakpoint util in utils/breakpoint.ts in web  
        screens: {
          sm: "640px",
          md: "768px",
          lg: "992px",
          xl: "1280px",
          "2xl": "1536px",
          "3xl": "2000px",
        },
        maxWidth: {
          "container-wide": "960px",
          "container-extrawide": "1080px",
        },
        colors: {
          border: "rgba(var(--border))",
          input: "rgba(var(--input))",
          ring: "rgba(var(--ring))",
          background: "rgba(var(--background))",
          foreground: "rgba(var(--foreground))",
          primary: {
            DEFAULT: "rgba(var(--primary))",
            foreground: "rgba(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "rgba(var(--secondary))",
            foreground: "rgba(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "rgba(var(--destructive))",
            foreground: "rgba(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "rgba(var(--muted))",
            foreground: "rgba(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "rgba(var(--accent))",
            foreground: "rgba(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "rgba(var(--popover))",
            foreground: "rgba(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "rgba(var(--card))",
            foreground: "rgba(var(--card-foreground))",
          },
        },
        borderRadius: {
          lg: "0.5rem",
          md: "calc(0.5rem - 2px)",
          sm: "calc(0.5rem - 4px)",
        },
        borderColor: {
          DEFAULT: "rgba(var(--border))",
        },
      },
    },
    plugins: [
      require('daisyui'),
    ],
  }

  