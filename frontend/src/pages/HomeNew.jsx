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
    Flex,
    Badge,
    HStack,
    VStack,
    Card,
    CardBody,
    Image,
    IconButton,
    useToast,
    SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaFire, FaTags, FaGift, FaBolt, FaPercent, FaShoppingCart, FaStar, FaArrowRight, FaHeart, FaRobot } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import api from '../api/axios';
import { useRef } from 'react';

const MotionBox = motion(Box);

export default function HomeNew() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Hero Banner */}
            <HeroBanner navigate={navigate} user={user} />
            
            {/* Hot Deals Section */}
            <HotDealsSection />
            
            {/* Only For You - Personalized Recommendations */}
            {user && <PersonalizedSection user={user} navigate={navigate} />}
            
            {/* FreshieBot Section */}
            {user && <FreshieBotSection navigate={navigate} />}
            
            {/* This Week Special */}
            <ThisWeekSection navigate={navigate} />
            
            {/* Live Offers */}
            <LiveOffersSection navigate={navigate} />
            
            {/* Sales Section */}
            <SalesSection navigate={navigate} />
            
            {/* Categories */}
            <CategoriesSection navigate={navigate} />
        </Box>
    );
}

// Hero Banner Component
const HeroBanner = ({ navigate, user }) => (
    <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        py={20}
    >
        <Container maxW="container.xl">
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
                <VStack align="start" spacing={6}>
                    <Badge colorScheme="yellow" fontSize="md" px={4} py={2} borderRadius="full">
                        🔥 Flash Sale Today!
                    </Badge>
                    <Heading fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="900">
                        {user ? `Welcome back, ${user.first_name || user.username}!` : 'Fresh Groceries Delivered'}
                    </Heading>
                    <Text fontSize="xl" opacity={0.9}>
                        Exclusive deals • Personalized picks • Fast delivery
                    </Text>
                    <HStack spacing={4}>
                        <Button
                            size="lg"
                            colorScheme="yellow"
                            rightIcon={<FaArrowRight />}
                            onClick={() => navigate('/products')}
                        >
                            Shop Now
                        </Button>
                        {!user && (
                            <Button size="lg" variant="outline" color="white" borderColor="white" onClick={() => navigate('/login')}>
                                Sign Up
                            </Button>
                        )}
                    </HStack>
                </VStack>
                <Box display={{ base: 'none', lg: 'block' }}>
                    <Image src="/hero-image.png" alt="Shopping" fallback={
                        <Box h="400px" bg="whiteAlpha.200" borderRadius="2xl" />
                    } />
                </Box>
            </Grid>
        </Container>
    </MotionBox>
);

// Hot Deals Section
const HotDealsSection = () => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <Box py={10} bg={useColorModeValue('white', 'gray.800')}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <HStack>
                        <Icon as={FaFire} color="red.500" boxSize={8} />
                        <Heading size="xl">Hot Deals</Heading>
                        <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                            Limited Time
                        </Badge>
                    </HStack>
                </Flex>
                
                <HorizontalScroll>
                    <HStack spacing={4} pb={4}>
                        <DealCard
                            title="Flash Sale"
                            discount="50% OFF"
                            subtitle="Fresh Produce"
                            bgGradient="linear(to-r, red.400, pink.500)"
                            icon={FaBolt}
                        />
                        <DealCard
                            title="Buy 1 Get 1"
                            discount="BOGO"
                            subtitle="Dairy Products"
                            bgGradient="linear(to-r, blue.400, cyan.500)"
                            icon={FaTags}
                        />
                        <DealCard
                            title="Weekend Special"
                            discount="40% OFF"
                            subtitle="Bakery Items"
                            bgGradient="linear(to-r, orange.400, yellow.500)"
                            icon={FaGift}
                        />
                        <DealCard
                            title="Clearance"
                            discount="70% OFF"
                            subtitle="Selected Items"
                            bgGradient="linear(to-r, purple.400, pink.500)"
                            icon={FaPercent}
                        />
                    </HStack>
                </HorizontalScroll>
            </Container>
        </Box>
    );
};

// Personalized "Only For You" Section
const PersonalizedSection = ({ user, navigate }) => {
    const { data: recommendations, isLoading } = useQuery({
        queryKey: ['recommendations', user?.id],
        queryFn: async () => {
            const response = await api.get('/recommendations/');
            return response.data.recommendations || [];
        },
        enabled: !!user,
    });

    if (isLoading) {
        return (
            <Box py={10} bg={useColorModeValue('green.50', 'gray.900')}>
                <Container maxW="container.xl">
                    <Text textAlign="center">Loading your personalized picks...</Text>
                </Container>
            </Box>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return (
            <Box py={10} bg={useColorModeValue('green.50', 'gray.900')}>
                <Container maxW="container.xl">
                    <VStack spacing={4}>
                        <Heading size="lg">No recommendations yet</Heading>
                        <Text>Start shopping to get personalized recommendations!</Text>
                        <Button colorScheme="green" onClick={() => navigate('/products')}>
                            Browse Products
                        </Button>
                    </VStack>
                </Container>
            </Box>
        );
    }

    return (
        <Box py={10} bg={useColorModeValue('green.50', 'gray.900')}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <HStack>
                        <Icon as={FaStar} color="green.500" boxSize={8} />
                        <Heading size="xl">Only For You</Heading>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                            Personalized
                        </Badge>
                    </HStack>
                    <Button variant="link" colorScheme="green" rightIcon={<FaArrowRight />} onClick={() => navigate('/products')}>
                        View All
                    </Button>
                </Flex>

                <HorizontalScroll>
                    <HStack spacing={4} pb={4}>
                        {recommendations.map((rec) => (
                            <RecommendationProductCard key={rec.id} recommendation={rec} />
                        ))}
                    </HStack>
                </HorizontalScroll>
            </Container>
        </Box>
    );
};

// This Week Special Section
const ThisWeekSection = ({ navigate }) => {
    return (
        <Box py={10}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <HStack>
                        <Icon as={FaGift} color="purple.500" boxSize={8} />
                        <Heading size="xl">This Week's Special</Heading>
                        <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                            New Arrivals
                        </Badge>
                    </HStack>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <LongCard
                        title="Fresh Organic Bread"
                        subtitle="Just baked this morning"
                        price="$3.99"
                        oldPrice="$5.99"
                        badge="New This Week"
                        bgGradient="linear(to-r, orange.100, yellow.100)"
                        onClick={() => navigate('/products')}
                    />
                    <LongCard
                        title="Premium Greek Yogurt"
                        subtitle="Rich & Creamy"
                        price="$4.49"
                        oldPrice="$6.99"
                        badge="Best Seller"
                        bgGradient="linear(to-r, blue.100, cyan.100)"
                        onClick={() => navigate('/products')}
                    />
                </SimpleGrid>
            </Container>
        </Box>
    );
};

// Live Offers Section
const LiveOffersSection = ({ navigate }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <Box py={10} bg={useColorModeValue('yellow.50', 'gray.800')}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <HStack>
                        <Icon as={FaBolt} color="yellow.500" boxSize={8} />
                        <Heading size="xl">Live Offers</Heading>
                        <Badge colorScheme="yellow" fontSize="md" px={3} py={1} animation="pulse 2s infinite">
                            🔴 LIVE
                        </Badge>
                    </HStack>
                </Flex>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <OfferCard
                        title="Midnight Sale"
                        discount="60% OFF"
                        subtitle="Ends in 2 hours"
                        icon={FaBolt}
                        colorScheme="red"
                    />
                    <OfferCard
                        title="Happy Hours"
                        discount="Buy 2 Get 1"
                        subtitle="4 PM - 8 PM"
                        icon={FaGift}
                        colorScheme="green"
                    />
                    <OfferCard
                        title="Weekend Blast"
                        discount="45% OFF"
                        subtitle="All categories"
                        icon={FaFire}
                        colorScheme="orange"
                    />
                </Grid>
            </Container>
        </Box>
    );
};

// Sales Section
const SalesSection = ({ navigate }) => {
    return (
        <Box py={10} bg={useColorModeValue('red.50', 'gray.900')}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <HStack>
                        <Icon as={FaPercent} color="red.500" boxSize={8} />
                        <Heading size="xl">Mega Sales</Heading>
                        <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                            Up to 70% OFF
                        </Badge>
                    </HStack>
                    <Button colorScheme="red" rightIcon={<FaArrowRight />} onClick={() => navigate('/products')}>
                        Shop Sales
                    </Button>
                </Flex>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SaleCard
                        title="Fresh Fruits"
                        discount="50% OFF"
                        image="🍎"
                    />
                    <SaleCard
                        title="Vegetables"
                        discount="40% OFF"
                        image="🥬"
                    />
                    <SaleCard
                        title="Dairy"
                        discount="35% OFF"
                        image="🥛"
                    />
                    <SaleCard
                        title="Bakery"
                        discount="45% OFF"
                        image="🍞"
                    />
                </SimpleGrid>
            </Container>
        </Box>
    );
};

// Categories Section
const CategoriesSection = ({ navigate }) => {
    const categories = [
        { name: 'Fresh Produce', emoji: '🥬', color: 'green' },
        { name: 'Dairy & Eggs', emoji: '🥛', color: 'blue' },
        { name: 'Meat & Seafood', emoji: '🥩', color: 'red' },
        { name: 'Bakery', emoji: '🍞', color: 'orange' },
        { name: 'Beverages', emoji: '☕', color: 'purple' },
        { name: 'Snacks', emoji: '🍪', color: 'yellow' },
    ];

    return (
        <Box py={10}>
            <Container maxW="container.xl">
                <Heading size="xl" mb={6}>Shop by Category</Heading>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                    {categories.map((cat) => (
                        <CategoryCard key={cat.name} {...cat} onClick={() => navigate('/products')} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

// FreshieBot Section
const FreshieBotSection = ({ navigate }) => {
    return (
        <Box py={10} bg={useColorModeValue('purple.50', 'gray.800')}>
            <Container maxW="container.xl">
                <Card
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    boxShadow="2xl"
                >
                    <CardBody p={10}>
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} alignItems="center">
                            <VStack align="start" spacing={6}>
                                <HStack>
                                    <Icon as={FaRobot} boxSize={16} />
                                </HStack>
                                <Heading size="2xl">Meet FreshieBot 🤖</Heading>
                                <Text fontSize="xl" opacity={0.95}>
                                    Let our AI assistant create the perfect grocery package for you! 
                                    Just tell us your needs - family size, number of days, and budget.
                                </Text>
                                <VStack align="start" spacing={3} w="full">
                                    <HStack>
                                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>👨‍👩‍👧‍👦 Family</Badge>
                                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>👤 Solo</Badge>
                                        <Badge colorScheme="orange" fontSize="md" px={3} py={1}>👫 Duo</Badge>
                                    </HStack>
                                    <Text fontSize="sm" opacity={0.9}>
                                        ✨ Instant package creation • 💰 Save up to 20% • 🛒 One-click add to cart
                                    </Text>
                                </VStack>
                                <Button
                                    size="lg"
                                    colorScheme="green"
                                    rightIcon={<FaArrowRight />}
                                    onClick={() => navigate('/freshiebot')}
                                    boxShadow="xl"
                                    _hover={{ transform: 'translateY(-2px)' }}
                                >
                                    Try FreshieBot Now
                                </Button>
                            </VStack>
                            <Box display={{ base: 'none', md: 'block' }} textAlign="center">
                                <Text fontSize="9xl">🤖</Text>
                            </Box>
                        </Grid>
                    </CardBody>
                </Card>
            </Container>
        </Box>
    );
};

// Reusable Components

const HorizontalScroll = ({ children }) => (
    <Box
        overflowX="auto"
        css={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: '#48BB78', borderRadius: '4px' },
        }}
    >
        {children}
    </Box>
);

const DealCard = ({ title, discount, subtitle, bgGradient, icon }) => {
    const navigate = useNavigate();
    
    return (
        <Card
            minW="280px"
            bgGradient={bgGradient}
            color="white"
            cursor="pointer"
            _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
            transition="all 0.3s"
        >
            <CardBody>
                <VStack spacing={3}>
                    <Icon as={icon} boxSize={12} />
                    <Heading size="lg">{discount}</Heading>
                    <Text fontSize="lg" fontWeight="bold">{title}</Text>
                    <Text opacity={0.9}>{subtitle}</Text>
                    <Button 
                        colorScheme="whiteAlpha" 
                        size="sm"
                        onClick={() => navigate('/products')}
                    >
                        Shop Now
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};

const RecommendationProductCard = ({ recommendation }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const toast = useToast();
    const product = recommendation.product;
    const cardBg = useColorModeValue('white', 'gray.800');

    const handleAddToCart = (e) => {
        e.stopPropagation();
        
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please login to add items to cart',
                status: 'warning',
                duration: 3000,
            });
            navigate('/login');
            return;
        }
        
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        toast({ title: 'Added to cart', status: 'success', duration: 2000 });
    };

    return (
        <Card
            minW="200px"
            maxW="200px"
            cursor="pointer"
            onClick={() => navigate(`/products/${product.id}`)}
            bg={cardBg}
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
        >
            <CardBody p={3}>
                <VStack spacing={3} align="stretch">
                    <Box
                        h="150px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {product.image ? (
                            <Image src={product.image} alt={product.name} objectFit="cover" w="full" h="full" />
                        ) : (
                            <Icon as={FiShoppingCart} boxSize={10} color="gray.400" />
                        )}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                        {product.name}
                    </Text>
                    <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="green.500">
                            ${product.price}
                        </Text>
                        <IconButton
                            icon={<FiShoppingCart />}
                            size="sm"
                            colorScheme="green"
                            onClick={handleAddToCart}
                        />
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
};

const LongCard = ({ title, subtitle, price, oldPrice, badge, bgGradient, onClick }) => (
    <Card
        bgGradient={bgGradient}
        cursor="pointer"
        onClick={onClick}
        _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
        transition="all 0.3s"
    >
        <CardBody>
            <Flex justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                    <Badge colorScheme="purple">{badge}</Badge>
                    <Heading size="lg">{title}</Heading>
                    <Text color="gray.600">{subtitle}</Text>
                    <HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="green.600">
                            {price}
                        </Text>
                        <Text fontSize="lg" textDecoration="line-through" color="gray.500">
                            {oldPrice}
                        </Text>
                    </HStack>
                    <Button colorScheme="green" size="lg">Add to Cart</Button>
                </VStack>
                <Box fontSize="6xl">🛒</Box>
            </Flex>
        </CardBody>
    </Card>
);

const OfferCard = ({ title, discount, subtitle, icon, colorScheme }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <Card
            bg={cardBg}
            cursor="pointer"
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
        >
            <CardBody>
                <VStack spacing={3}>
                    <Icon as={icon} boxSize={10} color={`${colorScheme}.500`} />
                    <Heading size="md">{title}</Heading>
                    <Text fontSize="2xl" fontWeight="bold" color={`${colorScheme}.500`}>
                        {discount}
                    </Text>
                    <Text color="gray.500">{subtitle}</Text>
                </VStack>
            </CardBody>
        </Card>
    );
};

const SaleCard = ({ title, discount, image }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <Card
            bg={cardBg}
            cursor="pointer"
            _hover={{ shadow: 'xl', transform: 'scale(1.05)' }}
            transition="all 0.3s"
        >
            <CardBody>
                <VStack spacing={2}>
                    <Text fontSize="4xl">{image}</Text>
                    <Text fontWeight="bold">{title}</Text>
                    <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                        {discount}
                    </Badge>
                </VStack>
            </CardBody>
        </Card>
    );
};

const CategoryCard = ({ name, emoji, color, onClick }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <Card
            bg={cardBg}
            cursor="pointer"
            onClick={onClick}
            _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
        >
            <CardBody>
                <VStack spacing={2}>
                    <Text fontSize="3xl">{emoji}</Text>
                    <Text fontWeight="medium" textAlign="center">
                        {name}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
};
