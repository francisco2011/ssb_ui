import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  daisyui: {
    themes: ["light", "dark", "dracula", "winter", "lofi"],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      screens: {
        'x': '320px',
        'xs': '480px', // or '320px' for smaller devices
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
} satisfies Config;
