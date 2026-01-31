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
    SimpleGrid,
    Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
    FaShoppingCart, 
    FaHeart, 
    FaTruck, 
    FaLeaf, 
    FaMobile, 
    FaPercent,
    FaRobot,
    FaStar,
    FaUsers,
    FaArrowRight 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function Landing() {
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.900');
    const gradientBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    return (
        <Box minH="100vh">
            {/* Hero Section */}
            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                bgGradient={gradientBg}
                color="white"
                py={{ base: 20, md: 32 }}
                position="relative"
                overflow="hidden"
            >
                {/* Animated Background Blobs */}
                <MotionBox
                    position="absolute"
                    top="10%"
                    right="10%"
                    w="400px"
                    h="400px"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    filter="blur(80px)"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <MotionBox
                    position="absolute"
                    bottom="10%"
                    left="10%"
                    w="300px"
                    h="300px"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    filter="blur(60px)"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <Container maxW="container.xl" position="relative" zIndex={1}>
                    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
                        <MotionVStack
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            align="start"
                            spacing={8}
                        >
                            <Badge 
                                colorScheme="green" 
                                fontSize="lg" 
                                px={6} 
                                py={3} 
                                borderRadius="full"
                                boxShadow="lg"
                            >
                                🌿 100% Fresh & Organic
                            </Badge>
                            
                            <Heading 
                                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} 
                                fontWeight="900"
                                lineHeight="1.2"
                            >
                                Shop Smarter,
                                <br />
                                Live Healthier
                            </Heading>
                            
                            <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.95} maxW="500px">
                                Experience personalized grocery shopping with AI-powered recommendations, 
                                exclusive deals, and doorstep delivery. Your perfect shopping companion awaits!
                            </Text>
                            
                            <HStack spacing={4}>
                                <Button
                                    size="lg"
                                    colorScheme="green"
                                    rightIcon={<FaArrowRight />}
                                    onClick={() => navigate('/login')}
                                    boxShadow="2xl"
                                    _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                                    transition="all 0.3s"
                                >
                                    Get Started Free
                                </Button>
                                <Button
                                    size="lg"
                                    colorScheme="purple"
                                    leftIcon={<FaRobot />}
                                    onClick={() => navigate('/freshiebot')}
                                    boxShadow="2xl"
                                    _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                                    transition="all 0.3s"
                                >
                                    Try FreshieBot
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    color="white"
                                    borderColor="white"
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                    onClick={() => navigate('/products')}
                                >
                                    Browse Products
                                </Button>
                            </HStack>

                            <HStack spacing={8} pt={4}>
                                <VStack spacing={1} align="start">
                                    <Text fontSize="3xl" fontWeight="bold">50K+</Text>
                                    <Text fontSize="sm" opacity={0.8}>Happy Customers</Text>
                                </VStack>
                                <VStack spacing={1} align="start">
                                    <Text fontSize="3xl" fontWeight="bold">1000+</Text>
                                    <Text fontSize="sm" opacity={0.8}>Fresh Products</Text>
                                </VStack>
                                <VStack spacing={1} align="start">
                                    <HStack>
                                        <Text fontSize="3xl" fontWeight="bold">4.9</Text>
                                        <Icon as={FaStar} color="yellow.300" />
                                    </HStack>
                                    <Text fontSize="sm" opacity={0.8}>Rating</Text>
                                </VStack>
                            </HStack>
                        </MotionVStack>

                        <MotionBox
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            display={{ base: 'none', lg: 'block' }}
                        >
                            <Box
                                position="relative"
                                w="full"
                                h="500px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize="9xl">🛒</Text>
                            </Box>
                        </MotionBox>
                    </Grid>
                </Container>
            </MotionBox>

            {/* Features Section */}
            <Box py={20} bg={bgColor}>
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={16} textAlign="center">
                        <Heading size="2xl">Why Choose FreshMart?</Heading>
                        <Text fontSize="xl" color="gray.600" maxW="600px">
                            Experience the future of grocery shopping with our innovative features
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                        <FeatureCard
                            icon={FaRobot}
                            title="FreshieBot Assistant"
                            description="AI-powered shopping assistant creates personalized packages for your family, solo living, or duo needs"
                            color="purple"
                        />
                        <FeatureCard
                            icon={FaHeart}
                            title="Personalized For You"
                            description="Get smart recommendations based on your preferences, shopping history, and dietary needs"
                            color="red"
                        />
                        <FeatureCard
                            icon={FaPercent}
                            title="Exclusive Deals"
                            description="Enjoy daily flash sales, mega discounts, and special offers tailored just for you"
                            color="orange"
                        />
                        <FeatureCard
                            icon={FaTruck}
                            title="Fast Delivery"
                            description="Same-day delivery to your doorstep. Fresh products delivered within hours"
                            color="blue"
                        />
                        <FeatureCard
                            icon={FaLeaf}
                            title="100% Organic"
                            description="Premium quality organic products sourced directly from trusted farmers"
                            color="green"
                        />
                        <FeatureCard
                            icon={FaMobile}
                            title="Easy Shopping"
                            description="Shop on any device with our responsive design. Your cart syncs everywhere"
                            color="teal"
                        />
                    </SimpleGrid>
                </Container>
            </Box>

            {/* FreshieBot Section */}
            <Box py={20} bg={useColorModeValue('purple.50', 'gray.800')}>
                <Container maxW="container.xl">
                    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
                        <VStack align="start" spacing={6}>
                            <Badge colorScheme="purple" fontSize="md" px={4} py={2} borderRadius="full">
                                🤖 Coming Soon
                            </Badge>
                            <Heading size="2xl">Meet FreshieBot</Heading>
                            <Text fontSize="lg" color="gray.600">
                                Your intelligent shopping assistant that understands your needs. 
                                Just tell FreshieBot what you need, and it creates perfect packages for you!
                            </Text>
                            
                            <VStack align="start" spacing={3} w="full">
                                <HStack>
                                    <Icon as={FaUsers} color="purple.500" boxSize={6} />
                                    <Text fontWeight="semibold">Family Packages - Complete weekly groceries</Text>
                                </HStack>
                                <HStack>
                                    <Icon as={FaShoppingCart} color="purple.500" boxSize={6} />
                                    <Text fontWeight="semibold">Solo Packages - Perfect for one person</Text>
                                </HStack>
                                <HStack>
                                    <Icon as={FaHeart} color="purple.500" boxSize={6} />
                                    <Text fontWeight="semibold">Duo Packages - Ideal for couples</Text>
                                </HStack>
                            </VStack>

                            <Text fontSize="md" color="gray.500" fontStyle="italic">
                                "Need groceries for a family of 4 for 7 days? Just ask FreshieBot!"
                            </Text>
                        </VStack>

                        <Box
                            bg={useColorModeValue('white', 'gray.700')}
                            p={8}
                            borderRadius="2xl"
                            boxShadow="2xl"
                        >
                            <VStack spacing={4} align="stretch">
                                <Flex justify="space-between" align="center">
                                    <HStack>
                                        <Icon as={FaRobot} color="purple.500" boxSize={8} />
                                        <Heading size="md">FreshieBot</Heading>
                                    </HStack>
                                    <Badge colorScheme="green">Online</Badge>
                                </Flex>
                                
                                <Box
                                    bg={useColorModeValue('gray.50', 'gray.600')}
                                    p={4}
                                    borderRadius="xl"
                                >
                                    <Text fontSize="sm" color="gray.600" mb={2}>You:</Text>
                                    <Text>"I need groceries for a family of 4 for one week"</Text>
                                </Box>

                                <Box
                                    bg="purple.500"
                                    color="white"
                                    p={4}
                                    borderRadius="xl"
                                >
                                    <Text fontSize="sm" opacity={0.9} mb={2}>FreshieBot:</Text>
                                    <Text>
                                        "Perfect! I've created a Family Package with fresh produce, 
                                        dairy, proteins, and pantry essentials for 4 people for 7 days. 
                                        Added to your cart! 🛒"
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    </Grid>
                </Container>
            </Box>

            {/* How It Works */}
            <Box py={20} bg={bgColor}>
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={16} textAlign="center">
                        <Heading size="2xl">How It Works</Heading>
                        <Text fontSize="xl" color="gray.600" maxW="600px">
                            Start your personalized shopping journey in 3 simple steps
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        <StepCard
                            step="1"
                            title="Sign Up Free"
                            description="Create your account and set your preferences in minutes"
                            icon={FaUsers}
                        />
                        <StepCard
                            step="2"
                            title="Get Personalized"
                            description="Receive AI-powered recommendations based on your needs"
                            icon={FaHeart}
                        />
                        <StepCard
                            step="3"
                            title="Shop & Enjoy"
                            description="Order with one click and enjoy fast doorstep delivery"
                            icon={FaTruck}
                        />
                    </SimpleGrid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                py={20}
                bgGradient={gradientBg}
                color="white"
                textAlign="center"
            >
                <Container maxW="container.md">
                    <VStack spacing={6}>
                        <Heading size="2xl">Ready to Transform Your Shopping?</Heading>
                        <Text fontSize="xl" opacity={0.9}>
                            Join thousands of happy customers and experience the future of grocery shopping today!
                        </Text>
                        <Button
                            size="lg"
                            colorScheme="green"
                            rightIcon={<FaArrowRight />}
                            onClick={() => navigate('/login')}
                            boxShadow="2xl"
                            _hover={{ transform: 'translateY(-2px)' }}
                        >
                            Start Shopping Now
                        </Button>
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <VStack
                p={8}
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="lg"
                spacing={4}
                align="start"
                h="full"
                _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
            >
                <Icon as={icon} boxSize={12} color={`${color}.500`} />
                <Heading size="md">{title}</Heading>
                <Text color="gray.600">{description}</Text>
            </VStack>
        </MotionBox>
    );
};

// Step Card Component
const StepCard = ({ step, title, description, icon }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    
    return (
        <VStack spacing={4} position="relative">
            <Box
                w="80px"
                h="80px"
                borderRadius="full"
                bg="purple.500"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="3xl"
                fontWeight="bold"
                boxShadow="xl"
            >
                {step}
            </Box>
            <VStack
                p={6}
                bg={cardBg}
                borderRadius="xl"
                boxShadow="md"
                spacing={3}
                w="full"
            >
                <Icon as={icon} boxSize={8} color="purple.500" />
                <Heading size="md" textAlign="center">{title}</Heading>
                <Text color="gray.600" textAlign="center">{description}</Text>
            </VStack>
        </VStack>
    );
};
