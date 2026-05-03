import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcf8fa",
        surface: "#fcf8fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f5",
        "surface-container": "#f0edef",
        "surface-container-high": "#eae7e9",
        "surface-container-highest": "#e4e2e4",
        "on-surface": "#1b1b1d",
        "on-surface-variant": "#45464d",
        outline: "#76777d",
        "outline-variant": "#c6c6cd",
        secondary: "#0058be",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#dae2fd",
        "on-primary-fixed": "#131b2e",
        "secondary-fixed": "#d8e2ff",
        "on-secondary-fixed": "#001a42",
        "tertiary-fixed": "#fcdeb5",
        "on-tertiary-fixed": "#271901"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem"
      },
      spacing: {
        "margin-page": "32px",
        gutter: "24px",
        "card-padding": "20px",
        "stack-sm": "8px",
        "stack-md": "16px"
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["30px", { lineHeight: "38px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-base": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "400" }],
        "data-tabular": ["14px", { lineHeight: "20px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};

export default config;
