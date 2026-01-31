import {
    Box,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Flex,
    Image,
    IconButton,
    Divider,
    useColorModeValue,
    Card,
    CardBody,
    Progress,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    VStack,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiGift, FiTruck, FiDollarSign } from 'react-icons/fi';
import { FaLeaf, FaHeartbeat, FaChartLine, FaUtensils } from 'react-icons/fa';
import { useCart } from '../features/cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';

export default function Cart() {
    const { cart, loading, removeFromCart, updateQuantity, addToCart } = useCart();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'dark.800');

    // $60 minimum basket tracking
    const MINIMUM_BASKET = 60;
    const currentTotal = parseFloat(cart?.total_amount || 0);
    const remainingToMinimum = Math.max(0, MINIMUM_BASKET - currentTotal);
    const progressPercentage = Math.min(100, (currentTotal / MINIMUM_BASKET) * 100);
    const hasReachedMinimum = currentTotal >= MINIMUM_BASKET;
    const isCloseToMinimum = remainingToMinimum > 0 && remainingToMinimum <= 10;

    // Calculate rewards for reaching $45+
    const cashbackAmount = hasReachedMinimum ? (currentTotal * 0.05).toFixed(2) : 0;
    const loyaltyPoints = hasReachedMinimum ? Math.floor(currentTotal * 2) : 0;

    // Fetch smart suggestions when close to minimum
    const { data: suggestedProducts } = useQuery({
        queryKey: ['smart-suggestions', remainingToMinimum],
        queryFn: () => fetchProducts({ page_size: 6, ordering: 'price' }),
        enabled: isCloseToMinimum,
    });

    // Calculate advanced cart metrics
    const calculateCartMetrics = () => {
        if (!cart?.items?.length) return null;
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalCO2 = 0;
        let ecoScores = [];
        let totalMarketPrice = 0;
        
        cart.items.forEach(item => {
            const product = item.product || {};
            const qty = item.quantity || 1;
            
            // Nutrition (per 100g, scale by quantity)
            totalCalories += (product.calories || 0) * qty;
            totalProtein += parseFloat(product.protein || 0) * qty;
            totalCarbs += parseFloat(product.carbs || 0) * qty;
            totalFat += parseFloat(product.fat || 0) * qty;
            totalFiber += parseFloat(product.fiber || 0) * qty;
            
            // Environmental
            totalCO2 += parseFloat(product.carbon_footprint || 0) * qty;
            if (product.eco_score) ecoScores.push(product.eco_score);
            
            // Market comparison
            totalMarketPrice += parseFloat(product.market_avg_price || product.price) * qty;
        });
        
        const avgEcoScore = ecoScores.length > 0 
            ? Math.round(ecoScores.reduce((a, b) => a + b, 0) / ecoScores.length)
            : 0;
            
        const marketSavings = totalMarketPrice - currentTotal;
        const savingsPercent = totalMarketPrice > 0 ? (marketSavings / totalMarketPrice) * 100 : 0;
        
        // Health score (simple algorithm: high protein & fiber, moderate carbs)
        const healthScore = Math.min(100, Math.round(
            (totalProtein * 2) + (totalFiber * 3) - (totalFat * 0.5) + (totalCarbs * 0.2)
        ));
        
        return {
            nutrition: { totalCalories, totalProtein, totalCarbs, totalFat, totalFiber },
            eco: { totalCO2, avgEcoScore },
            market: { totalMarketPrice, marketSavings, savingsPercent },
            healthScore: Math.max(0, Math.min(100, healthScore))
        };
    };
    
    const metrics = calculateCartMetrics();

    if (loading) {
        return <Box p={20} textAlign="center">Loading cart...</Box>;
    }

    if (!cart?.items?.length) {
        return (
            <Box py={20} textAlign="center" minH="80vh">
                <Container maxW="container.md">
                    <Heading mb={4}>Your cart is empty</Heading>
                    <Text color="gray.500" mb={8}>Looks like you haven't added any fresh goodies yet.</Text>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Start Shopping
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'dark.900')}>
            <Container maxW="container.xl">
                <Heading mb={8}>Shopping Cart</Heading>

                {/* Advanced Cart Metrics */}
                {metrics && (
                    <Box mb={8}>
                        <Flex gap={4} mb={4} overflowX="auto" pb={2}>
                            {/* Health Score */}
                            <Card flex="1" minW="200px" bg="green.50" borderColor="green.300" borderWidth="2px">
                                <CardBody p={4}>
                                    <HStack spacing={2} mb={2}>
                                        <Icon as={FaHeartbeat} color="green.500" boxSize={5} />
                                        <Text fontWeight="bold" fontSize="sm" color="green.700">Health Score</Text>
                                    </HStack>
                                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                        {metrics.healthScore}/100
                                    </Text>
                                    <Progress 
                                        value={metrics.healthScore} 
                                        size="sm" 
                                        colorScheme="green" 
                                        borderRadius="full"
                                        mt={2}
                                    />
                                    <Text fontSize="xs" color="green.600" mt={1}>
                                        {metrics.nutrition.totalProtein.toFixed(1)}g protein • {metrics.nutrition.totalFiber.toFixed(1)}g fiber
                                    </Text>
                                </CardBody>
                            </Card>

                            {/* Eco Impact */}
                            <Card flex="1" minW="200px" bg="blue.50" borderColor="blue.300" borderWidth="2px">
                                <CardBody p={4}>
                                    <HStack spacing={2} mb={2}>
                                        <Icon as={FaLeaf} color="blue.500" boxSize={5} />
                                        <Text fontWeight="bold" fontSize="sm" color="blue.700">Eco Impact</Text>
                                    </HStack>
                                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                        {metrics.eco.totalCO2.toFixed(1)}kg CO₂
                                    </Text>
                                    <Badge colorScheme={metrics.eco.avgEcoScore >= 70 ? 'green' : 'orange'} mt={2}>
                                        Eco Score: {metrics.eco.avgEcoScore}/100
                                    </Badge>
                                    <Text fontSize="xs" color="blue.600" mt={1}>
                                        {metrics.eco.avgEcoScore >= 70 ? '🌱 Eco-friendly choices!' : '💡 Choose greener options'}
                                    </Text>
                                </CardBody>
                            </Card>

                            {/* Price Savings */}
                            <Card flex="1" minW="200px" bg="purple.50" borderColor="purple.300" borderWidth="2px">
                                <CardBody p={4}>
                                    <HStack spacing={2} mb={2}>
                                        <Icon as={FaChartLine} color="purple.500" boxSize={5} />
                                        <Text fontWeight="bold" fontSize="sm" color="purple.700">You're Saving</Text>
                                    </HStack>
                                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                        ${metrics.market.marketSavings.toFixed(2)}
                                    </Text>
                                    <Badge colorScheme="purple" mt={2}>
                                        {metrics.market.savingsPercent.toFixed(1)}% off market price
                                    </Badge>
                                    <Text fontSize="xs" color="purple.600" mt={1}>
                                        💰 Market avg: ${metrics.market.totalMarketPrice.toFixed(2)}
                                    </Text>
                                </CardBody>
                            </Card>

                            {/* Recipe Ideas */}
                            <Card flex="1" minW="200px" bg="orange.50" borderColor="orange.300" borderWidth="2px">
                                <CardBody p={4}>
                                    <HStack spacing={2} mb={2}>
                                        <Icon as={FaUtensils} color="orange.500" boxSize={5} />
                                        <Text fontWeight="bold" fontSize="sm" color="orange.700">Recipe Ideas</Text>
                                    </HStack>
                                    <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                                        {cart.items.length} Items
                                    </Text>
                                    <Text fontSize="xs" color="orange.600" mt={2}>
                                        🍳 You can make {Math.min(cart.items.length, 5)} delicious recipes!
                                    </Text>
                                    <Button size="xs" colorScheme="orange" variant="outline" mt={2} w="full">
                                        View Recipes
                                    </Button>
                                </CardBody>
                            </Card>
                        </Flex>
                    </Box>
                )}

                <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
                    {/* Cart Items */}
                    <Stack spacing={4} flex={2}>
                        {cart.items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={removeFromCart}
                                onUpdateQty={updateQuantity}
                                bgColor={bgColor}
                            />
                        ))}

                        {/* Smart Suggestions to Reach $45 */}
                        {isCloseToMinimum && suggestedProducts?.results?.length > 0 && (
                            <Card bg="orange.50" borderColor="orange.300" borderWidth="2px">
                                <CardBody>
                                    <HStack mb={4} spacing={2}>
                                        <Icon as={FiGift} color="orange.500" boxSize={5} />
                                        <Heading size="sm" color="orange.700">
                                            🎯 Quick Picks to Unlock Free Delivery!
                                        </Heading>
                                    </HStack>
                                    <Text fontSize="sm" color="orange.600" mb={4}>
                                        Add just ${remainingToMinimum.toFixed(2)} more to reach $60 and unlock free delivery + 5% cashback!
                                    </Text>
                                    <Flex gap={3} overflowX="auto" pb={2}>
                                        {suggestedProducts.results
                                            .filter(p => parseFloat(p.price) <= remainingToMinimum)
                                            .slice(0, 4)
                                            .map((product) => (
                                                <Box
                                                    key={product.id}
                                                    minW="140px"
                                                    bg="white"
                                                    p={3}
                                                    borderRadius="md"
                                                    borderWidth="1px"
                                                    borderColor="gray.200"
                                                    cursor="pointer"
                                                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                                                    transition="all 0.2s"
                                                >
                                                    <Image
                                                        src={product.image_url || 'https://via.placeholder.com/100'}
                                                        alt={product.name}
                                                        boxSize="80px"
                                                        objectFit="cover"
                                                        borderRadius="md"
                                                        mb={2}
                                                    />
                                                    <Text fontSize="xs" fontWeight="bold" noOfLines={2} mb={1}>
                                                        {product.name}
                                                    </Text>
                                                    <Text fontSize="sm" fontWeight="bold" color="brand.500" mb={2}>
                                                        ${product.price}
                                                    </Text>
                                                    <Button
                                                        size="xs"
                                                        colorScheme="orange"
                                                        w="full"
                                                        onClick={() => addToCart(product.id, 1)}
                                                    >
                                                        Quick Add
                                                    </Button>
                                                </Box>
                                            ))}
                                    </Flex>
                                </CardBody>
                            </Card>
                        )}
                    </Stack>

                    {/* Checkout Summary */}
                    <Box flex={1}>
                        <Card variant="glass" position="sticky" top="100px">
                            <CardBody>
                                <Heading size="md" mb={4}>Order Summary</Heading>

                                {/* $45 Minimum Basket Progress */}
                                <Box mb={6} p={4} bg={hasReachedMinimum ? 'green.50' : 'orange.50'} borderRadius="lg" borderWidth="2px" borderColor={hasReachedMinimum ? 'green.400' : 'orange.300'}>
                                    <VStack spacing={3} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontWeight="bold" fontSize="sm" color={hasReachedMinimum ? 'green.700' : 'orange.700'}>
                                                {hasReachedMinimum ? '🎉 Benefits Unlocked!' : '🎯 Reach $60 for Rewards'}
                                            </Text>
                                            <Badge colorScheme={hasReachedMinimum ? 'green' : 'orange'} fontSize="xs">
                                                ${currentTotal.toFixed(2)} / ${MINIMUM_BASKET}
                                            </Badge>
                                        </HStack>
                                        
                                        <Progress 
                                            value={progressPercentage} 
                                            size="sm" 
                                            colorScheme={hasReachedMinimum ? 'green' : 'orange'}
                                            borderRadius="full"
                                            hasStripe={!hasReachedMinimum}
                                            isAnimated={!hasReachedMinimum}
                                        />

                                        {!hasReachedMinimum && (
                                            <Text fontSize="xs" color="orange.600" fontWeight="medium">
                                                💡 Add ${remainingToMinimum.toFixed(2)} more to unlock amazing benefits!
                                            </Text>
                                        )}

                                        {hasReachedMinimum && (
                                            <VStack spacing={2} align="stretch" mt={2}>
                                                <HStack spacing={2}>
                                                    <Icon as={FiTruck} color="green.500" />
                                                    <Text fontSize="xs" color="green.700" fontWeight="bold">✓ Free Delivery</Text>
                                                </HStack>
                                                <HStack spacing={2}>
                                                    <Icon as={FiDollarSign} color="green.500" />
                                                    <Text fontSize="xs" color="green.700" fontWeight="bold">✓ ${cashbackAmount} Cashback for Next Order</Text>
                                                </HStack>
                                                <HStack spacing={2}>
                                                    <Icon as={FiGift} color="green.500" />
                                                    <Text fontSize="xs" color="green.700" fontWeight="bold">✓ {loyaltyPoints} Loyalty Points Earned</Text>
                                                </HStack>
                                            </VStack>
                                        )}
                                    </VStack>
                                </Box>
                                <Stack spacing={4}>
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Subtotal</Text>
                                        <Text fontWeight="bold">${cart.total_amount}</Text>
                                    </Flex>
                                    
                                    <Flex justify="space-between">
                                        <Text color="gray.500">Shipping</Text>
                                        {hasReachedMinimum ? (
                                            <HStack spacing={1}>
                                                <Text fontWeight="bold" color="green.500" textDecoration="line-through" fontSize="sm">$5.99</Text>
                                                <Text fontWeight="bold" color="green.500">FREE</Text>
                                            </HStack>
                                        ) : (
                                            <Text fontWeight="bold" color="gray.600">$5.99</Text>
                                        )}
                                    </Flex>

                                    {hasReachedMinimum && (
                                        <Flex justify="space-between" color="green.600">
                                            <Text fontSize="sm">💰 Next Order Cashback</Text>
                                            <Text fontWeight="bold" fontSize="sm">+${cashbackAmount}</Text>
                                        </Flex>
                                    )}
                                    <Divider />
                                    <Flex justify="space-between" fontSize="xl" fontWeight="bold">
                                        <Text>Total</Text>
                                        <Text color="brand.500">
                                            ${(currentTotal + (hasReachedMinimum ? 0 : 5.99)).toFixed(2)}
                                        </Text>
                                    </Flex>

                                    {hasReachedMinimum && (
                                        <Alert status="success" borderRadius="md" fontSize="sm">
                                            <AlertIcon />
                                            <Box>
                                                <AlertTitle fontSize="xs">You're saving big!</AlertTitle>
                                                <AlertDescription fontSize="xs">
                                                    Free delivery + ${cashbackAmount} cashback for your next visit!
                                                </AlertDescription>
                                            </Box>
                                        </Alert>
                                    )}

                                    {isCloseToMinimum && (
                                        <Alert status="warning" borderRadius="md" fontSize="sm">
                                            <AlertIcon />
                                            <AlertDescription fontSize="xs">
                                                Just ${remainingToMinimum.toFixed(2)} away from free delivery & rewards! 🎁
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        w="full"
                                        rightIcon={<FiArrowRight />}
                                        onClick={() => navigate('/checkout')}
                                    >
                                        {hasReachedMinimum ? '🎉 Checkout with Benefits' : 'Proceed to Checkout'}
                                    </Button>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}

const CartItem = ({ item, onRemove, onUpdateQty, bgColor }) => {
    return (
        <Card variant="glass" overflow="hidden">
            <Flex direction={{ base: 'column', sm: 'row' }} align="center" p={4} gap={4}>
                <Image
                    src={item.product_image || 'https://via.placeholder.com/150'}
                    alt={item.product_name}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                />

                <Box flex={1}>
                    <Heading size="sm" mb={1}>{item.product_name}</Heading>
                    <Text color="gray.500" fontSize="sm">{item.product_brand || 'Brand'}</Text>
                    <Text fontWeight="bold" mt={2} color="brand.500">${item.price}</Text>
                </Box>

                <Flex align="center" gap={4}>
                    <Flex align="center" border="1px solid" borderColor="gray.200" borderRadius="md">
                        <IconButton
                            icon={<FiMinus />}
                            size="sm"
                            variant="ghost"
                            onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            isDisabled={item.quantity <= 1}
                        />
                        <Text px={3} fontWeight="bold">{item.quantity}</Text>
                        <IconButton
                            icon={<FiPlus />}
                            size="sm"
                            variant="ghost"
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        />
                    </Flex>

                    <IconButton
                        icon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onRemove(item.id)}
                    />
                </Flex>
            </Flex>
        </Card>
    );
};
