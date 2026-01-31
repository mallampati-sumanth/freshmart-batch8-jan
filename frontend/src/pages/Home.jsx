import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    Grid,
    GridItem,
    Image,
    Flex,
    Badge,
    HStack,
    VStack,
    Avatar,
    AvatarGroup,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaLeaf, FaShippingFast, FaShieldAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import { FiTruck, FiClock, FiPercent } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../api/products';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')}>
            <HeroSection navigate={navigate} />
            <BentoGridSection navigate={navigate} />
            <CategoriesSection navigate={navigate} />
            <TestimonialsSection />
            <CTASection navigate={navigate} />
        </Box>
    );
}

const HeroSection = ({ navigate }) => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 600], [1, 0.95]);

    return (
        <MotionBox
            style={{ opacity, scale }}
            position="relative"
            minH="100vh"
            display="flex"
            alignItems="center"
            overflow="hidden"
            bg={useColorModeValue(
                'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
                'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
            )}
        >
            {/* Animated Background Blobs */}
            <Box
                position="absolute"
                top="-20%"
                right="-10%"
                w="600px"
                h="600px"
                bg="brand.400"
                filter="blur(150px)"
                opacity={0.2}
                borderRadius="full"
                as={motion.div}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <Box
                position="absolute"
                bottom="-10%"
                left="-5%"
                w="400px"
                h="400px"
                bg="green.300"
                filter="blur(120px)"
                opacity={0.15}
                borderRadius="full"
            />

            <Container maxW="container.xl" position="relative" zIndex={1}>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
                    <VStack align="start" spacing={6}>
                        <Badge
                            colorScheme="green"
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="sm"
                            as={motion.div}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            🌿 100% Organic & Fresh
                        </Badge>

                        <Heading
                            as={motion.h1}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                            fontWeight="900"
                            lineHeight="1.1"
                        >
                            Fresh Groceries,{' '}
                            <Text
                                as="span"
                                bgGradient="linear(to-r, brand.400, green.400)"
                                bgClip="text"
                            >
                                Delivered Smart
                            </Text>
                        </Heading>

                        <Text
                            as={motion.p}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            fontSize="xl"
                            color={useColorModeValue('gray.600', 'gray.400')}
                            maxW="500px"
                        >
                            AI-powered recommendations, ultra-fast delivery, and the freshest produce.
                            Your personalized grocery experience starts here.
                        </Text>

                        <HStack
                            spacing={4}
                            as={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                size="lg"
                                variant="primary"
                                rightIcon={<FaArrowRight />}
                                onClick={() => navigate('/products')}
                                as={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                px={8}
                            >
                                Shop Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/kiosk-login')}
                            >
                                Try Kiosk
                            </Button>
                        </HStack>

                        {/* Trust Indicators */}
                        <HStack spacing={6} pt={6}>
                            <HStack>
                                <AvatarGroup size="sm" max={3}>
                                    <Avatar name="User 1" src="https://bit.ly/dan-abramov" />
                                    <Avatar name="User 2" src="https://bit.ly/kent-c-dodds" />
                                    <Avatar name="User 3" src="https://bit.ly/prosper-baba" />
                                </AvatarGroup>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold" fontSize="sm">10k+</Text>
                                    <Text fontSize="xs" color="gray.500">Happy Customers</Text>
                                </VStack>
                            </HStack>
                            <HStack>
                                <HStack color="yellow.400">
                                    {[1, 2, 3, 4, 5].map(i => <Icon key={i} as={FaStar} boxSize={3} />)}
                                </HStack>
                                <Text fontSize="sm" fontWeight="bold">4.9</Text>
                            </HStack>
                        </HStack>
                    </VStack>

                    {/* Hero Image */}
                    <Box
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        display={{ base: 'none', lg: 'block' }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
                            alt="Fresh Groceries"
                            borderRadius="3xl"
                            boxShadow="2xl"
                            objectFit="cover"
                            h="500px"
                            w="100%"
                        />
                    </Box>
                </Grid>
            </Container>
        </MotionBox>
    );
};

const BentoGridSection = ({ navigate }) => {
    const { data: products } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => fetchProducts({ featured: true, limit: 4 }),
    });

    const cardBg = useColorModeValue('white', 'gray.800');
    const accentBg = useColorModeValue('brand.500', 'brand.400');

    return (
        <Box py={20}>
            <Container maxW="container.xl">
                <VStack spacing={4} mb={12}>
                    <Heading textAlign="center" size="xl">
                        Discover Fresh Favorites
                    </Heading>
                    <Text color="gray.500" textAlign="center" maxW="600px">
                        Explore our handpicked selection of the freshest products
                    </Text>
                </VStack>

                {/* Bento Grid */}
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
                    templateRows={{ base: 'auto', md: 'repeat(2, 280px)' }}
                    gap={4}
                >
                    {/* Large Featured Card */}
                    <GridItem
                        colSpan={{ base: 1, md: 2 }}
                        rowSpan={{ base: 1, md: 2 }}
                        as={motion.div}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            bg={accentBg}
                            borderRadius="3xl"
                            h="100%"
                            p={8}
                            position="relative"
                            overflow="hidden"
                            cursor="pointer"
                            onClick={() => navigate('/products')}
                        >
                            <VStack align="start" spacing={4} color="white" position="relative" zIndex={1}>
                                <Badge bg="whiteAlpha.300" color="white" px={3} py={1} borderRadius="full">
                                    New Season
                                </Badge>
                                <Heading size="2xl">Fresh Produce</Heading>
                                <Text fontSize="lg" opacity={0.9}>
                                    Farm-fresh vegetables and fruits delivered to your doorstep
                                </Text>
                                <Button
                                    variant="solid"
                                    bg="white"
                                    color="brand.500"
                                    _hover={{ bg: 'gray.100' }}
                                    rightIcon={<FaArrowRight />}
                                >
                                    Explore Now
                                </Button>
                            </VStack>
                            <Image
                                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400"
                                position="absolute"
                                bottom="-20px"
                                right="-20px"
                                w="250px"
                                opacity={0.3}
                                transform="rotate(-15deg)"
                            />
                        </Box>
                    </GridItem>

                    {/* Stats Card */}
                    <GridItem as={motion.div} whileHover={{ scale: 1.02 }}>
                        <Box
                            bg={cardBg}
                            borderRadius="3xl"
                            h="100%"
                            p={6}
                            boxShadow="lg"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <Icon as={FiTruck} boxSize={8} color="brand.500" mb={4} />
                            <Heading size="lg">30 min</Heading>
                            <Text color="gray.500">Express Delivery</Text>
                        </Box>
                    </GridItem>

                    {/* Savings Card */}
                    <GridItem as={motion.div} whileHover={{ scale: 1.02 }}>
                        <Box
                            bg="orange.400"
                            borderRadius="3xl"
                            h="100%"
                            p={6}
                            color="white"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <Icon as={FiPercent} boxSize={8} mb={4} />
                            <Heading size="lg">Up to 40%</Heading>
                            <Text opacity={0.9}>Weekly Discounts</Text>
                        </Box>
                    </GridItem>

                    {/* Product Card 1 */}
                    <GridItem as={motion.div} whileHover={{ scale: 1.02 }}>
                        <Box
                            bg={cardBg}
                            borderRadius="3xl"
                            h="100%"
                            overflow="hidden"
                            boxShadow="lg"
                            cursor="pointer"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
                                h="60%"
                                w="100%"
                                objectFit="cover"
                            />
                            <Box p={4}>
                                <Text fontWeight="bold">Organic Apples</Text>
                                <Text color="brand.500" fontWeight="bold">$4.99/lb</Text>
                            </Box>
                        </Box>
                    </GridItem>

                    {/* Product Card 2 */}
                    <GridItem as={motion.div} whileHover={{ scale: 1.02 }}>
                        <Box
                            bg={cardBg}
                            borderRadius="3xl"
                            h="100%"
                            overflow="hidden"
                            boxShadow="lg"
                            cursor="pointer"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400"
                                h="60%"
                                w="100%"
                                objectFit="cover"
                            />
                            <Box p={4}>
                                <Text fontWeight="bold">Fresh Milk</Text>
                                <Text color="brand.500" fontWeight="bold">$3.29</Text>
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};

const CategoriesSection = ({ navigate }) => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    // Better fallback images for common categories
    const getCategoryImage = (category) => {
        // First try to use the category's own image
        if (category.image) {
            return category.image;
        }

        // Fallback images based on category name
        const imageMap = {
            'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
            'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
            'Dairy & Eggs': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
            'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
            'Fresh Produce': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop',
            'Produce': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop',
            'Frozen Foods': 'https://images.unsplash.com/photo-1476887334197-56adbf254e1a?w=300&h=300&fit=crop',
            'Frozen': 'https://images.unsplash.com/photo-1476887334197-56adbf254e1a?w=300&h=300&fit=crop',
            'Health & Beauty': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop',
            'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop',
            'Vegetables': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&h=300&fit=crop',
            'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop',
            'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
            'Seafood': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=300&h=300&fit=crop',
        };

        return imageMap[category.name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop';
    };

    const catList = categories?.results || categories || [];

    return (
        <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={10}>
                    <Heading size="xl">Shop by Category</Heading>
                    <Button variant="ghost" rightIcon={<FaArrowRight />} onClick={() => navigate('/products')}>
                        View All
                    </Button>
                </Flex>

                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={6}>
                    {catList.slice(0, 6).map((cat, idx) => (
                        <Box
                            key={cat.id || idx}
                            as={motion.div}
                            whileHover={{ y: -10 }}
                            cursor="pointer"
                            onClick={() => navigate(`/products?category=${cat.id}`)}
                        >
                            <VStack
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="2xl"
                                p={6}
                                spacing={4}
                                transition="all 0.3s"
                                _hover={{ boxShadow: 'xl', bg: useColorModeValue('white', 'gray.600') }}
                            >
                                <Image
                                    src={getCategoryImage(cat)}
                                    boxSize="80px"
                                    borderRadius="xl"
                                    objectFit="cover"
                                    fallbackSrc="https://via.placeholder.com/80?text=Category"
                                    loading="lazy"
                                />
                                <Text fontWeight="bold" textAlign="center" fontSize="sm">{cat.name}</Text>
                            </VStack>
                        </Box>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { name: 'Sarah M.', text: 'Best grocery delivery service! Always fresh and on time.', rating: 5 },
        { name: 'John D.', text: 'The AI recommendations are spot on. Love this app!', rating: 5 },
        { name: 'Emily R.', text: 'Finally, a grocery app that understands my preferences.', rating: 5 },
    ];

    return (
        <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.xl">
                <Heading textAlign="center" mb={12}>What Our Customers Say</Heading>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
                    {testimonials.map((t, idx) => (
                        <Box
                            key={idx}
                            as={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            bg={useColorModeValue('white', 'gray.800')}
                            p={8}
                            borderRadius="2xl"
                            boxShadow="lg"
                        >
                            <HStack color="yellow.400" mb={4}>
                                {[...Array(t.rating)].map((_, i) => <Icon key={i} as={FaStar} />)}
                            </HStack>
                            <Text fontSize="lg" mb={6}>"{t.text}"</Text>
                            <Text fontWeight="bold">{t.name}</Text>
                        </Box>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const CTASection = ({ navigate }) => {
    return (
        <Box py={20}>
            <Container maxW="container.xl">
                <Box
                    bgGradient="linear(to-r, brand.500, green.400)"
                    borderRadius="3xl"
                    p={{ base: 10, md: 16 }}
                    textAlign="center"
                    color="white"
                    position="relative"
                    overflow="hidden"
                >
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="600px"
                        h="600px"
                        bg="whiteAlpha.100"
                        borderRadius="full"
                        filter="blur(60px)"
                    />
                    <VStack spacing={6} position="relative" zIndex={1}>
                        <Heading size="2xl">Ready to Eat Fresh?</Heading>
                        <Text fontSize="xl" maxW="600px" opacity={0.9}>
                            Join thousands of happy customers and start your fresh food journey today
                        </Text>
                        <Button
                            size="lg"
                            bg="white"
                            color="brand.500"
                            _hover={{ bg: 'gray.100' }}
                            rightIcon={<FaArrowRight />}
                            onClick={() => navigate('/products')}
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                        >
                            Start Shopping
                        </Button>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};
