// Premium Enterprise Theme for FreshMart
import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// 1. Color Palette - Premium, Vibrant, Modern
const colors = {
    brand: {
        50: '#e0f2f1',
        100: '#b2dfdb',
        200: '#80cbc4',
        300: '#4db6ac',
        400: '#26a69a',
        500: '#009688', // Primary Teal
        600: '#00897b',
        700: '#00796b',
        800: '#00695c',
        900: '#004d40',
    },
    accent: {
        500: '#FF6B6B', // Vibrant Coral for CTAs
        600: '#EE5253',
    },
    dark: {
        900: '#121212', // Deepest Black
        800: '#1a1a1a', // Component Background
        700: '#2d2d2d', // Lighter Background
    },
    glass: {
        100: 'rgba(255, 255, 255, 0.1)',
        200: 'rgba(255, 255, 255, 0.2)',
        dark: 'rgba(20, 20, 20, 0.6)',
    }
};

// 2. Global Styles & Glassmorphism
const styles = {
    global: (props) => ({
        body: {
            fontFamily: "'Inter', sans-serif",
            bg: mode('gray.50', 'dark.900')(props),
            color: mode('gray.800', 'whiteAlpha.900')(props),
        },
        // Custom scrollbar
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            bg: mode('gray.100', 'dark.900')(props),
        },
        '::-webkit-scrollbar-thumb': {
            bg: mode('brand.400', 'brand.600')(props),
            borderRadius: '24px',
        },
    }),
};

// 3. Component Overrides
const components = {
    Button: {
        baseStyle: {
            fontWeight: 'bold',
            borderRadius: 'xl',
        },
        variants: {
            primary: (props) => ({
                bg: 'brand.500',
                color: 'white',
                _hover: {
                    bg: 'brand.600',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                },
                transition: 'all 0.2s',
            }),
            glass: (props) => ({
                bg: mode('rgba(255,255,255,0.7)', 'rgba(255,255,255,0.08)')(props),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: mode('rgba(255,255,255,0.8)', 'rgba(255,255,255,0.1)')(props),
                color: mode('gray.800', 'white')(props),
                _hover: {
                    bg: mode('rgba(255,255,255,0.8)', 'rgba(255,255,255,0.15)')(props),
                },
            }),
        },
    },
    Card: {
        baseStyle: (props) => ({
            container: {
                bg: mode('white', 'dark.800')(props),
                borderRadius: '2xl',
                boxShadow: mode('lg', 'dark-lg')(props),
                border: '1px solid',
                borderColor: mode('gray.100', 'whiteAlpha.100')(props),
            },
        }),
        variants: {
            glass: (props) => ({
                container: {
                    bg: mode('rgba(255,255,255,0.8)', 'rgba(20, 20, 20, 0.7)')(props),
                    backdropFilter: 'blur(16px)',
                    border: '1px solid',
                    borderColor: mode('whiteAlpha.400', 'whiteAlpha.100')(props),
                    boxShadow: 'xl',
                },
            }),
        },
    },
    Input: {
        variants: {
            filled: (props) => ({
                field: {
                    bg: mode('gray.100', 'whiteAlpha.50')(props),
                    borderRadius: 'xl',
                    _focus: {
                        bg: mode('white', 'dark.900')(props),
                        borderColor: 'brand.500',
                    },
                },
            }),
        },
    },
};

const config = {
    initialColorMode: 'dark', // Default to Dark Mode for premium feel
    useSystemColorMode: false,
};

const theme = extendTheme({
    colors,
    styles,
    components,
    config
});

export default theme;
