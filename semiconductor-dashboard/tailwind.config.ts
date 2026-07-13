import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0A',
        'bg-secondary': '#0F172A',
        'accent-blue': '#3B82F6',
        'accent-cyan': '#06B6D4',
        'accent-purple': '#8B5CF6',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'ibm-plex': ['IBM Plex Sans', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
