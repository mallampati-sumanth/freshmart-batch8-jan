import { extendTheme } from '@chakra-ui/react';

// Modern Fresh Grocery theme with better visibility
const flipkartTheme = extendTheme({
  colors: {
    brand: {
      50: '#e8f5f1',
      100: '#c1e4d9',
      200: '#99d3c0',
      300: '#70c2a7',
      400: '#48b18e',
      500: '#2ea074', // Main green - better contrast
      600: '#258059',
      700: '#1c603e',
      800: '#124023',
      900: '#092008',
    },
    accent: {
      50: '#fff8e6',
      100: '#ffecb3',
      200: '#ffe080',
      300: '#ffd44d',
      400: '#ffc81a',
      500: '#ffbc00', // Brighter yellow-orange
      600: '#e6a900',
      700: '#cc9600',
      800: '#b38300',
      900: '#997000',
    },
  },
  fonts: {
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#f8fafc',
        color: '#1a202c',
        lineHeight: '1.6',
      },
      '*': {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
        transition: 'all 0.25s ease',
        _focus: {
          boxShadow: '0 0 0 3px rgba(46, 160, 116, 0.3)',
        },
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          },
          _active: {
            transform: 'translateY(0)',
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
          },
        }),
        outline: {
          borderWidth: '2px',
          _hover: {
            transform: 'translateY(-2px)',
          },
        },
        ghost: {
          _hover: {
            bg: 'brand.50',
          },
        },
      },
      sizes: {
        lg: {
          px: 8,
          py: 6,
          fontSize: 'lg',
        },
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'gray.100',
          _hover: {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
            borderColor: 'brand.200',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: '700',
        textTransform: 'none',
        fontSize: 'xs',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
        }),
        subtle: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.50' : undefined,
          color: props.colorScheme === 'brand' ? 'brand.700' : undefined,
        }),
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            border: '2px solid',
            borderColor: 'gray.200',
            _hover: {
              bg: 'white',
              borderColor: 'gray.300',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(46, 160, 116, 0.3)',
            },
          },
        },
        outline: {
          field: {
            borderWidth: '2px',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(46, 160, 116, 0.3)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        lineHeight: '1.2',
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(46, 160, 116, 0.3)',
  },
});

export default flipkartTheme;
