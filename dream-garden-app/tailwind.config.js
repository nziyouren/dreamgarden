/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#25f425",
                "primary-dark": "#1bc41b",
                "secondary": "#FFD700",
                "accent": "#FF6B6B",
                "background-light": "#E0F7FA",
                "background-dark": "#0A1F22",
                "card-light": "#ffffff",
                "card-dark": "#14282B",
                "text-main": "#0D1B1E",
                "text-muted": "#4A6E73",
                "glass-border": "rgba(255, 255, 255, 0.5)",
                "accent-blue": "#4ABDE7",
                "accent-green": "#7AC74F",
                "duggee-soil": "#8d6e63",
                "duggee-green": "#7cb342",
                "duggee-cloud": "#90a4ae",
                "duggee-rain": "#4fc3f7",
                "modal-primary": "#f48c25",
                "modal-primary-dark": "#d67315",
            },
            fontFamily: {
                "display": ["Spline Sans", "Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {
                "lg": "2rem",
                "xl": "3rem",
            },
            boxShadow: {
                'soft': '0 8px 30px -4px rgba(37, 244, 37, 0.2)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'hover': '0 10px 25px -5px rgba(37, 244, 37, 0.25)',
                'inner-lg': 'inset 0 4px 10px rgba(0,0,0,0.05)',
                'glow-primary': '0 0 40px rgba(37, 244, 37, 0.4)'
            },
            backgroundImage: {
                'terrarium-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                droop: {
                    '0%, 100%': { transform: 'rotate(5deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                },
                tear: {
                    '0%, 60%': { transform: 'translateY(0) scale(0)', opacity: '0' },
                    '70%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                    '100%': { transform: 'translateY(24px) scale(0.5)', opacity: '0' },
                },
                sway: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'droop': 'droop 3s ease-in-out infinite',
                'tear': 'tear 4s ease-in-out infinite',
                'sway': 'sway 4s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
