import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    Stack,
    Flex,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Checkbox,
    VStack,
    HStack,
    Card,
    CardBody,
    Image,
    Badge,
    useColorModeValue,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Icon,
    Skeleton,
    useToast,
    Grid,
    GridItem,
    IconButton,
    Tag,
    Divider,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiShoppingCart, FiStar, FiPercent, FiTrendingUp, FiHeart, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { FaFire, FaTags, FaGift, FaBolt } from 'react-icons/fa';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../api/products';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function ProductsEnhanced() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [showFilters, setShowFilters] = useState(true);

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', search, selectedCategories, priceRange],
        queryFn: () => fetchProducts({
            search,
            category: selectedCategories.join(','),
            min_price: priceRange[0],
            max_price: priceRange[1]
        }),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    // Fetch personalized recommendations
    const { data: recommendations } = useQuery({
        queryKey: ['recommendations'],
        queryFn: async () => {
            if (!user) return [];
            const response = await api.get('/recommendations/');
            return response.data.recommendations || [];
        },
        enabled: !!user,
    });

    const bgColor = useColorModeValue('gray.50', 'dark.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Top Banner - Offers & Deals */}
            {user && (
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    py={6}
                >
                    <Container maxW="container.xl">
                        <HStack spacing={8} overflowX="auto" css={{
                            '&::-webkit-scrollbar': { display: 'none' },
                            scrollbarWidth: 'none',
                        }}>
                            <DealCard icon={FaBolt} title="Flash Sale" subtitle="50% OFF" color="yellow.400" />
                            <DealCard icon={FaTags} title="Special Offers" subtitle="Buy 1 Get 1" color="green.400" />
                            <DealCard icon={FaGift} title="New Arrivals" subtitle="Fresh Stock" color="pink.400" />
                            <DealCard icon={FaFire} title="Hot Deals" subtitle="Limited Time" color="red.400" />
                            <DealCard icon={FiPercent} title="Clearance" subtitle="Up to 70%" color="orange.400" />
                        </HStack>
                    </Container>
                </MotionBox>
            )}

            {/* Personalized Recommendations Section - "Only For You" */}
            {user && recommendations && recommendations.length > 0 && (
                <Box py={8} bg={cardBg} borderBottom="1px" borderColor={borderColor}>
                    <Container maxW="container.xl">
                        <Flex align="center" justify="space-between" mb={6}>
                            <HStack>
                                <Icon as={FiStar} boxSize={6} color="green.500" />
                                <Heading size="lg">Just For You</Heading>
                                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                                    Personalized
                                </Badge>
                            </HStack>
                            <Button
                                variant="link"
                                colorScheme="green"
                                rightIcon={<FiChevronRight />}
                                onClick={() => navigate('/products')}
                            >
                                View All
                            </Button>
                        </Flex>

                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
                            {recommendations.slice(0, 6).map((rec, index) => (
                                <RecommendationCard key={rec.id} recommendation={rec} index={index} />
                            ))}
                        </SimpleGrid>
                    </Container>
                </Box>
            )}

            {/* Main Content Area */}
            <Container maxW="container.xl" py={8}>
                <Stack spacing={6}>
                    {/* Search Bar */}
                    <Card bg={cardBg} shadow="sm">
                        <CardBody>
                            <Flex gap={4} direction={{ base: 'column', md: 'row' }} align="center">
                                <InputGroup flex={1}>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FiSearch} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        variant="filled"
                                        placeholder="Search for fresh food, groceries..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        size="lg"
                                    />
                                </InputGroup>
                                <Button
                                    leftIcon={<FiFilter />}
                                    colorScheme="green"
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    {showFilters ? 'Hide' : 'Show'} Filters
                                </Button>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Categories Quick Filter */}
                    <Box>
                        <HStack spacing={3} overflowX="auto" py={2} css={{
                            '&::-webkit-scrollbar': { height: '4px' },
                            '&::-webkit-scrollbar-thumb': { background: '#48BB78', borderRadius: '4px' },
                        }}>
                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={selectedCategories.length === 0 ? 'green' : 'gray'}
                                onClick={() => setSelectedCategories([])}
                                px={4}
                                py={2}
                            >
                                All Products
                            </Tag>
                            {categories?.results?.map((cat) => (
                                <Tag
                                    key={cat.id}
                                    size="lg"
                                    cursor="pointer"
                                    colorScheme={selectedCategories.includes(cat.name) ? 'green' : 'gray'}
                                    onClick={() => {
                                        setSelectedCategories(prev =>
                                            prev.includes(cat.name)
                                                ? prev.filter(c => c !== cat.name)
                                                : [...prev, cat.name]
                                        );
                                    }}
                                    px={4}
                                    py={2}
                                >
                                    {cat.name}
                                </Tag>
                            ))}
                        </HStack>
                    </Box>

                    {/* Products Grid with Sidebar */}
                    <Grid templateColumns={{ base: '1fr', lg: showFilters ? '250px 1fr' : '1fr' }} gap={6}>
                        {/* Sidebar Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <MotionBox
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    display={{ base: 'none', lg: 'block' }}
                                >
                                    <FilterSidebar
                                        categories={categories}
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={setSelectedCategories}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                    />
                                </MotionBox>
                            )}
                        </AnimatePresence>

                        {/* Product Grid */}
                        <Box>
                            <Flex justify="space-between" align="center" mb={4}>
                                <Text fontSize="sm" color="gray.600">
                                    Showing {productsData?.results?.length || 0} products
                                </Text>
                                <HStack>
                                    <Text fontSize="sm" color="gray.600">Sort by:</Text>
                                    <Button size="sm" variant="ghost">Price: Low to High</Button>
                                </HStack>
                            </Flex>

                            {isLoading ? (
                                <SimpleGrid columns={{ base: 2, md: 3, lg: showFilters ? 3 : 4 }} spacing={4}>
                                    {[...Array(8)].map((_, i) => (
                                        <Skeleton key={i} height="300px" borderRadius="lg" />
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <SimpleGrid columns={{ base: 2, md: 3, lg: showFilters ? 3 : 4 }} spacing={4}>
                                    {productsData?.results?.map((product, index) => (
                                        <ProductCard key={product.id} product={product} index={index} />
                                    ))}
                                </SimpleGrid>
                            )}
                        </Box>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
}

// Deal Card Component
const DealCard = ({ icon, title, subtitle, color }) => (
    <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(10px)"
        borderRadius="lg"
        p={4}
        minW="150px"
        cursor="pointer"
        transition="all 0.3s"
        _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-2px)' }}
    >
        <VStack spacing={2}>
            <Icon as={icon} boxSize={8} color={color} />
            <Text fontWeight="bold" fontSize="sm">{title}</Text>
            <Text fontSize="xs" opacity={0.9}>{subtitle}</Text>
        </VStack>
    </Box>
);

// Recommendation Card Component
const RecommendationCard = ({ recommendation, index }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const toast = useToast();
    const product = recommendation.product;
    const cardBg = useColorModeValue('white', 'gray.800');

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        toast({
            title: 'Added to cart',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            cursor="pointer"
            onClick={() => navigate(`/products/${product.id}`)}
            bg={cardBg}
            _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
            position="relative"
            overflow="hidden"
        >
            <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="green"
                fontSize="xs"
                zIndex={1}
            >
                For You
            </Badge>
            <CardBody p={3}>
                <VStack spacing={2} align="stretch">
                    <Box
                        h="120px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                    >
                        {product.image ? (
                            <Image src={product.image} alt={product.name} objectFit="cover" w="full" h="full" />
                        ) : (
                            <Icon as={FiShoppingCart} boxSize={10} color="gray.400" />
                        )}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={2} minH="40px">
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
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {recommendation.reason}
                    </Text>
                </VStack>
            </CardBody>
        </MotionCard>
    );
};

// Product Card Component
const ProductCard = ({ product, index }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        toast({
            title: 'Added to cart',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            cursor="pointer"
            onClick={() => navigate(`/products/${product.id}`)}
            bg={cardBg}
            _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
        >
            <CardBody p={3}>
                <VStack spacing={3} align="stretch">
                    <Box
                        h="180px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                        position="relative"
                    >
                        {product.image ? (
                            <Image src={product.image} alt={product.name} objectFit="cover" w="full" h="full" />
                        ) : (
                            <Icon as={FiShoppingCart} boxSize={12} color="gray.400" />
                        )}
                        <IconButton
                            icon={<FiHeart />}
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            bg="whiteAlpha.900"
                            _hover={{ bg: 'red.50' }}
                        />
                    </Box>
                    <VStack align="stretch" spacing={1}>
                        <Text fontSize="sm" color="gray.500">{product.brand_name}</Text>
                        <Text fontSize="md" fontWeight="medium" noOfLines={2} minH="40px">
                            {product.name}
                        </Text>
                        <HStack>
                            <Badge colorScheme="green">{product.category_name}</Badge>
                            <Badge colorScheme="blue">{product.stock_quantity} in stock</Badge>
                        </HStack>
                        <Flex justify="space-between" align="center" mt={2}>
                            <VStack align="start" spacing={0}>
                                <Text fontSize="xl" fontWeight="bold" color="green.500">
                                    ${product.price}
                                </Text>
                                <HStack spacing={1}>
                                    <Icon as={FiStar} color="yellow.400" boxSize={3} />
                                    <Text fontSize="xs" color="gray.500">4.5 (120)</Text>
                                </HStack>
                            </VStack>
                            <IconButton
                                icon={<FiShoppingCart />}
                                colorScheme="green"
                                onClick={handleAddToCart}
                                size="md"
                            />
                        </Flex>
                    </VStack>
                </VStack>
            </CardBody>
        </MotionCard>
    );
};

// Filter Sidebar Component
const FilterSidebar = ({ categories, selectedCategories, setSelectedCategories, priceRange, setPriceRange }) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Card bg={cardBg} shadow="sm" position="sticky" top="80px">
            <CardBody>
                <VStack align="stretch" spacing={6}>
                    <Heading size="md">Filters</Heading>
                    <Divider />

                    {/* Categories */}
                    <Box>
                        <Text fontWeight="bold" mb={3}>Categories</Text>
                        <VStack align="stretch" spacing={2}>
                            {categories?.results?.map((cat) => (
                                <Checkbox
                                    key={cat.id}
                                    isChecked={selectedCategories.includes(cat.name)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCategories([...selectedCategories, cat.name]);
                                        } else {
                                            setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                                        }
                                    }}
                                    colorScheme="green"
                                >
                                    {cat.name}
                                </Checkbox>
                            ))}
                        </VStack>
                    </Box>

                    <Divider />

                    {/* Price Range */}
                    <Box>
                        <Text fontWeight="bold" mb={3}>Price Range</Text>
                        <VStack align="stretch" spacing={4}>
                            <HStack justify="space-between">
                                <Text fontSize="sm">${priceRange[0]}</Text>
                                <Text fontSize="sm">${priceRange[1]}</Text>
                            </HStack>
                            <RangeSlider
                                value={priceRange}
                                onChange={setPriceRange}
                                min={0}
                                max={200}
                                step={5}
                                colorScheme="green"
                            >
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                            </RangeSlider>
                        </VStack>
                    </Box>

                    <Button colorScheme="green" variant="outline" size="sm" onClick={() => {
                        setSelectedCategories([]);
                        setPriceRange([0, 200]);
                    }}>
                        Clear All Filters
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};
