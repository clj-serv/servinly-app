// tailwind.config.js
/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-fg))" },
        secondary: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-fg))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-fg))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-fg))" },
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-fg))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-fg))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-fg))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-fg))" },
        popover: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-fg))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: { lg: "12px", xl: "16px", "2xl": "20px" },
    },
  },
  plugins: [],
};
