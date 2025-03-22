// tailwind.config.js
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#264653',
                secondary: '#E76F51',
                accent: '#2A9D8F',
                custom: "#13242a",
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                sunset: {
                    custom: "#13242a",
                },
            },
        ],
    },
};
