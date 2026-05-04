/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        /* ── Base structural tokens ──────────────────── */
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* ── Primary ─────────────────────────────────── */
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          hover:      "hsl(var(--primary-hover))",
          active:     "hsl(var(--primary-active))",
          muted:      "hsl(var(--primary-muted))",
          foreground: "hsl(var(--primary-foreground))",
        },

        /* ── Secondary ───────────────────────────────── */
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          hover:      "hsl(var(--secondary-hover))",
          active:     "hsl(var(--secondary-active))",
          muted:      "hsl(var(--secondary-muted))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        /* ── Destructive / Danger ────────────────────── */
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        danger: {
          DEFAULT:    "hsl(var(--danger))",
          hover:      "hsl(var(--danger-hover))",
          active:     "hsl(var(--danger-active))",
          muted:      "hsl(var(--danger-muted))",
          foreground: "hsl(var(--danger-foreground))",
        },

        /* ── Success ─────────────────────────────────── */
        success: {
          DEFAULT:    "hsl(var(--success))",
          hover:      "hsl(var(--success-hover))",
          active:     "hsl(var(--success-active))",
          muted:      "hsl(var(--success-muted))",
          foreground: "hsl(var(--success-foreground))",
        },

        /* ── Warning ─────────────────────────────────── */
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          hover:      "hsl(var(--warning-hover))",
          active:     "hsl(var(--warning-active))",
          muted:      "hsl(var(--warning-muted))",
          foreground: "hsl(var(--warning-foreground))",
        },

        /* ── Info ────────────────────────────────────── */
        info: {
          DEFAULT:    "hsl(var(--info))",
          hover:      "hsl(var(--info-hover))",
          active:     "hsl(var(--info-active))",
          muted:      "hsl(var(--info-muted))",
          foreground: "hsl(var(--info-foreground))",
        },

        /* ── Light ───────────────────────────────────── */
        light: {
          DEFAULT:    "hsl(var(--light))",
          hover:      "hsl(var(--light-hover))",
          active:     "hsl(var(--light-active))",
          foreground: "hsl(var(--light-foreground))",
        },

        /* ── Dark ────────────────────────────────────── */
        dark: {
          DEFAULT:    "hsl(var(--dark))",
          hover:      "hsl(var(--dark-hover))",
          active:     "hsl(var(--dark-active))",
          foreground: "hsl(var(--dark-foreground))",
        },

        /* ── Muted / Accent ──────────────────────────── */
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        /* ── Popover / Card ──────────────────────────── */
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ── Sidebar ─────────────────────────────────── */
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },

        /* ── Semantic text/bg aliases ────────────────── */
        "text-heading":  "hsl(var(--text-heading))",
        "text-body":     "hsl(var(--text-body))",
        "text-muted-ds": "hsl(var(--text-muted))",
        "text-disabled": "hsl(var(--text-disabled))",
        "text-link":     "hsl(var(--text-link))",
        "bg-surface":    "hsl(var(--bg-surface))",
        "bg-elevated":   "hsl(var(--bg-elevated))",
        "bg-overlay":    "hsl(var(--bg-overlay))",
        "bg-sunken":     "hsl(var(--bg-sunken))",
      },

      /* ── Border radius ────────────────────────────── */
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl":"var(--radius-2xl)",
        full: "var(--radius-full)",
      },

      /* ── Font family ─────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      /* ── Font size ────────────────────────────────── */
      fontSize: {
        "ds-xs":   ["var(--text-xs)",   { lineHeight: "var(--leading-xs)" }],
        "ds-sm":   ["var(--text-sm)",   { lineHeight: "var(--leading-sm)" }],
        "ds-md":   ["var(--text-md)",   { lineHeight: "var(--leading-md)" }],
        "ds-base": ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        "ds-lg":   ["var(--text-lg)",   { lineHeight: "var(--leading-lg)" }],
        "ds-xl":   ["var(--text-xl)",   { lineHeight: "var(--leading-xl)" }],
        "ds-xxl":  ["var(--text-xxl)",  { lineHeight: "var(--leading-xxl)" }],
      },

      /* ── Font weight ──────────────────────────────── */
      fontWeight: {
        light:    "var(--font-light)",
        regular:  "var(--font-regular)",
        medium:   "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold:     "var(--font-bold)",
      },

      /* ── Box shadow ───────────────────────────────── */
      boxShadow: {
        "2xs":      "var(--shadow-2xs)",
        xs:         "var(--shadow-xs)",
        sm:         "var(--shadow-sm)",
        DEFAULT:    "var(--shadow)",
        md:         "var(--shadow-md)",
        lg:         "var(--shadow-lg)",
        xl:         "var(--shadow-xl)",
        "2xl":      "var(--shadow-2xl)",
        card:       "var(--shadow-card)",
        modal:      "var(--shadow-modal)",
        dropdown:   "var(--shadow-dropdown)",
        focus:      "var(--shadow-focus)",
      },

      /* ── Transition duration ─────────────────────── */
      transitionDuration: {
        fast:   "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow:   "var(--duration-slow)",
      },

      /* ── Transition timing ───────────────────────── */
      transitionTimingFunction: {
        smooth:   "var(--ease-smooth)",
        "ease-in-custom":  "var(--ease-in)",
        "ease-out-custom": "var(--ease-out)",
        bounce:   "var(--ease-bounce)",
      },

      /* ── Keyframe animations ─────────────────────── */
      keyframes: {
        "ds-spin":    { to: { transform: "rotate(360deg)" } },
        "ds-pulse":   { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "ds-fade-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "ds-scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "ds-slide-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "ds-slide-bottom": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "ds-spin":         "ds-spin var(--duration-slow) linear infinite",
        "ds-spin-fast":    "ds-spin var(--duration-fast) linear infinite",
        "ds-pulse":        "ds-pulse 2s var(--ease-smooth) infinite",
        "ds-fade-in":      "ds-fade-in var(--duration-normal) var(--ease-smooth)",
        "ds-scale-in":     "ds-scale-in var(--duration-normal) var(--ease-smooth)",
        "ds-slide-right":  "ds-slide-right var(--duration-normal) var(--ease-smooth)",
        "ds-slide-bottom": "ds-slide-bottom var(--duration-normal) var(--ease-smooth)",
      },

      /* ── Spacing extensions ──────────────────────── */
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
