import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Input,
    Select,
    Card,
    CardBody,
    Grid,
    Badge,
    Icon,
    useToast,
    useColorModeValue,
    Divider,
    List,
    ListItem,
    ListIcon,
    SimpleGrid,
    Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaUsers, FaCalendarAlt, FaDollarSign, FaShoppingCart, FaCheck, FaStar } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPackageRecommendations, addPackageToCart } from '../api/packages';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const MotionBox = motion(Box);

export default function FreshieBot() {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    
    const [people, setPeople] = useState(2);
    const [days, setDays] = useState(7);
    const [budget, setBudget] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    // Calculate recommended budget range
    const getRecommendedBudget = () => {
        const baseCost = people * days * 10; // $10 per person per day (increased for $60 minimum)
        const minBudget = Math.round(baseCost * 0.7);
        const maxBudget = Math.round(baseCost * 1.3);
        return { min: minBudget, max: maxBudget, ideal: Math.round(baseCost) };
    };
    
    const recommendedBudget = getRecommendedBudget();

    // Get recommendations only when user clicks the button
    const { data: recommendations, isLoading, refetch } = useQuery({
        queryKey: ['package-recommendations', people, days, budget],
        queryFn: () => getPackageRecommendations(people, days, budget),
        enabled: false, // Don't fetch automatically
    });

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: addPackageToCart,
        onSuccess: (data) => {
            toast({
                title: 'Package added to cart!',
                description: `${data.items_added} items added successfully`,
                status: 'success',
                duration: 3000,
            });
            navigate('/cart');
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to add package to cart',
                status: 'error',
                duration: 3000,
            });
        },
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please login to use FreshieBot',
                status: 'warning',
                duration: 3000,
            });
            navigate('/login');
        }
    }, [user, navigate, toast]);

    const handleGetRecommendations = () => {
        // Validate budget if provided
        if (budget) {
            const budgetNum = parseFloat(budget);
            const { min, max } = recommendedBudget;
            
            if (budgetNum < min * 0.5) {
                toast({
                    title: 'Budget too low',
                    description: `For ${people} ${people === 1 ? 'person' : 'people'} for ${days} days, we recommend at least $${min} for good quality groceries.`,
                    status: 'warning',
                    duration: 5000,
                });
                // Continue anyway to show what's available
            } else if (budgetNum > max * 2) {
                toast({
                    title: 'High budget detected',
                    description: `We'll show you our premium packages. Consider ${max * 1.5} as ideal for best value.`,
                    status: 'info',
                    duration: 5000,
                });
            }
        }
        
        setShowResults(true);
        refetch();
    };

    const handleAddToCart = (packageId) => {
        addToCartMutation.mutate(packageId);
    };

    // Show nothing while checking auth (will redirect if not logged in)
    if (!user) {
        return null;
    }

    return (
        <Box minH="100vh" bg={bgColor} pt="70px">
            {/* Hero Section */}
            <Box bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={6} textAlign="center">
                        <Icon as={FaRobot} boxSize={20} />
                        <Heading size="2xl">Meet FreshieBot</Heading>
                        <Text fontSize="xl" maxW="600px">
                            Your intelligent shopping assistant! Tell me your needs, and I'll create the perfect grocery package for you.
                        </Text>
                    </VStack>
                </Container>
            </Box>

            {/* Chat Interface */}
            <Container maxW="container.xl" py={10}>
                <Card bg={cardBg} boxShadow="xl" mb={8}>
                    <CardBody p={8}>
                        <VStack spacing={6} align="stretch">
                            <HStack>
                                <Icon as={FaRobot} color="purple.500" boxSize={8} />
                                <VStack align="start" spacing={0}>
                                    <Heading size="lg">FreshieBot</Heading>
                                    <Badge colorScheme="green">Online</Badge>
                                </VStack>
                            </HStack>

                            <Box
                                bg={useColorModeValue('purple.50', 'purple.900')}
                                p={6}
                                borderRadius="xl"
                            >
                                <VStack align="start" spacing={4}>
                                    <Text fontWeight="bold" color="purple.600">
                                        FreshieBot says:
                                    </Text>
                                    <Text fontSize="lg">
                                        Hi there! 👋 I'm here to help you find the perfect grocery package. 
                                        Just answer a few quick questions, and I'll recommend packages tailored to your needs!
                                    </Text>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Questions */}
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                {/* People Count */}
                                <VStack align="start" spacing={3}>
                                    <HStack>
                                        <Icon as={FaUsers} color="purple.500" />
                                        <Text fontWeight="semibold">How many people?</Text>
                                    </HStack>
                                    <NumberInput
                                        min={1}
                                        max={10}
                                        value={people}
                                        onChange={(_, val) => setPeople(val)}
                                        w="full"
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </VStack>

                                {/* Days */}
                                <VStack align="start" spacing={3}>
                                    <HStack>
                                        <Icon as={FaCalendarAlt} color="purple.500" />
                                        <Text fontWeight="semibold">How many days?</Text>
                                    </HStack>
                                    <Select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                                        <option value={1}>1 day</option>
                                        <option value={3}>3 days</option>
                                        <option value={5}>5 days</option>
                                        <option value={7}>7 days (1 week)</option>
                                        <option value={10}>10 days</option>
                                    </Select>
                                </VStack>

                                {/* Budget */}
                                <VStack align="start" spacing={3}>
                                    <HStack>
                                        <Icon as={FaDollarSign} color="purple.500" />
                                        <Text fontWeight="semibold">Budget (optional)</Text>
                                    </HStack>
                                    <Input
                                        type="number"
                                        placeholder={`Recommended: $${recommendedBudget.min}-$${recommendedBudget.max}`}
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                    />
                                    <Text fontSize="xs" color="gray.600">
                                        💡 Best deals: ${recommendedBudget.min}-${recommendedBudget.max} range
                                    </Text>
                                </VStack>
                            </SimpleGrid>

                            <Button
                                colorScheme="purple"
                                size="lg"
                                rightIcon={<FaRobot />}
                                onClick={handleGetRecommendations}
                                isLoading={isLoading}
                                w="full"
                            >
                                Get My Perfect Package
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Results - Only show when user clicks Get Recommendations */}
                {showResults && (
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isLoading ? (
                            <Box textAlign="center" py={12}>
                                <Icon as={FaRobot} boxSize={16} color="purple.500" mb={4} />
                                <Heading size="md" color="purple.600" mb={2}>
                                    FreshieBot is analyzing your preferences...
                                </Heading>
                                <Text color="gray.600">Finding the perfect packages for you!</Text>
                            </Box>
                        ) : recommendations?.recommendations && recommendations.recommendations.length > 0 ? (
                            <VStack spacing={6} align="stretch">
                                <Box bg="purple.50" p={6} borderRadius="xl" textAlign="center">
                                    <HStack justify="center" mb={3}>
                                        <Icon as={FaStar} color="yellow.500" boxSize={6} />
                                        <Heading size="lg" color="purple.700">
                                            {recommendations.match_type === 'exact' 
                                                ? 'Perfect Match! 🎯' 
                                                : recommendations.match_type === 'flexible'
                                                ? 'Great Options For You! ✨'
                                                : recommendations.match_type === 'budget'
                                                ? `Within Your $${budget} Budget! 💰`
                                                : recommendations.match_type === 'adjusted'
                                                ? 'Best Available Packages! 💡'
                                                : recommendations.match_type === 'dynamic'
                                                ? '✨ Custom Packages Created For You! 🎁'
                                                : 'Recommended Packages 📦'}
                                        </Heading>
                                    </HStack>
                                    <Text fontSize="lg" color="gray.700">
                                        {recommendations.match_type === 'adjusted' ? (
                                            <>Showing closest matches for {people} {people === 1 ? 'person' : 'people'}, {days} days. {budget && `Your budget: $${budget}`}</>
                                        ) : recommendations.match_type === 'dynamic' ? (
                                            <>Personalized packages for {people} {people === 1 ? 'person' : 'people'}, {days} days{budget && `, $${budget} budget`}</>
                                        ) : recommendations.match_type === 'budget' ? (
                                            <>Showing what you can get with ${budget}</>
                                        ) : (
                                            <>
                                                For {people} {people === 1 ? 'person' : 'people'}, {days} days
                                                {budget && ` with $${budget} budget`}
                                                {recommendations.match_type === 'flexible' && ' (similar matches)'}
                                            </>
                                        )}
                                    </Text>
                                </Box>

                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                                    {recommendations.recommendations.map((pkg) => (
                                        <PackageCard
                                            key={pkg.id}
                                            package={pkg}
                                            onAddToCart={handleAddToCart}
                                            isLoading={addToCartMutation.isPending}
                                        />
                                    ))}
                                </Grid>

                                <Box textAlign="center" mt={6}>
                                    <Button
                                        variant="outline"
                                        colorScheme="purple"
                                        onClick={() => setShowResults(false)}
                                    >
                                        Try Different Options
                                    </Button>
                                </Box>
                            </VStack>
                        ) : (
                            <Box textAlign="center" py={12}>
                                <Icon as={FaRobot} boxSize={16} color="gray.400" mb={4} />
                                <Heading size="md" color="gray.600" mb={2}>
                                    No packages match your criteria
                                </Heading>
                                <Text color="gray.600" mb={4}>
                                    Try adjusting your budget or requirements
                                </Text>
                                <Button
                                    colorScheme="purple"
                                    onClick={() => setShowResults(false)}
                                >
                                    Try Again
                                </Button>
                            </Box>
                        )}
                    </MotionBox>
                )}
            </Container>
        </Box>
    );
}

// Package Card Component
const PackageCard = ({ package: pkg, onAddToCart, isLoading }) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Card
            bg={cardBg}
            boxShadow="lg"
            _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
            transition="all 0.3s"
        >
            <CardBody>
                <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                        <Text fontSize="4xl">{pkg.icon}</Text>
                        <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                            Save ${pkg.savings.toFixed(2)}
                        </Badge>
                    </HStack>

                    <Heading size="md">{pkg.name}</Heading>
                    <Text color="gray.600" fontSize="sm" noOfLines={3}>
                        {pkg.description}
                    </Text>

                    <HStack spacing={4} fontSize="sm">
                        <HStack>
                            <Icon as={FaUsers} color="purple.500" />
                            <Text>{pkg.people_count} people</Text>
                        </HStack>
                        <HStack>
                            <Icon as={FaCalendarAlt} color="purple.500" />
                            <Text>{pkg.days} days</Text>
                        </HStack>
                    </HStack>

                    <Divider />

                    <VStack align="start" spacing={2}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                            Includes {pkg.items?.length || 0} items:
                        </Text>
                        <List spacing={1} w="full">
                            {pkg.items?.slice(0, 4).map((item) => (
                                <ListItem key={item.id} fontSize="sm">
                                    <ListIcon as={FaCheck} color="green.500" />
                                    {item.product.name} x{item.quantity}
                                </ListItem>
                            ))}
                            {pkg.items?.length > 4 && (
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    + {pkg.items.length - 4} more items
                                </Text>
                            )}
                        </List>
                    </VStack>

                    <Divider />

                    <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                                ${pkg.total_price}
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                ${pkg.final_price}
                            </Text>
                        </VStack>
                        <Button
                            colorScheme="green"
                            rightIcon={<FaShoppingCart />}
                            onClick={() => onAddToCart(pkg.id)}
                            isLoading={isLoading}
                        >
                            Add to Cart
                        </Button>
                    </Flex>
                </VStack>
            </CardBody>
        </Card>
    );
};
