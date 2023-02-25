/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                slideDownAndFade: {
                    from: {
                        opacity: 0,
                        transform:
                            'translate(var(--tw-translate-x), calc(var(--tw-translate-y) - 4px)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                    to: {
                        opacity: 1,
                        transform:
                            'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                },
                slideLeftAndFade: {
                    from: {
                        opacity: 0,
                        transform:
                            'translate(calc(var(--tw-translate-x) - 4px), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                    to: {
                        opacity: 1,
                        transform:
                            'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                },
                slideUpAndFade: {
                    from: {
                        opacity: 0,
                        transform:
                            'translate(var(--tw-translate-x), calc(var(--tw-translate-y) + 4px)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                    to: {
                        opacity: 1,
                        transform:
                            'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                },
                slideRightAndFade: {
                    from: {
                        opacity: 0,
                        transform:
                            'translate(calc(var(--tw-translate-x) + 4px), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                    to: {
                        opacity: 1,
                        transform:
                            'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
                    },
                },
            },
        },
        animation: {
            slideDownAndFade:
                'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideLeftAndFade:
                'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideUpAndFade:
                'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            slideRightAndFade:
                'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        },
    },
    plugins: [],
};
