import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    Grid,
    GridItem,
    Checkbox,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Stack,
    Badge,
    Icon,
    useColorModeValue,
    useToast,
    Flex,
    Image,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaBreadSlice, FaFish, FaCoffee, FaAppleAlt, FaIceCream, FaHeart } from 'react-icons/fa';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';

const MotionBox = motion(Box);

const categoryIcons = {
    'Fresh Produce': FaAppleAlt,
    'Dairy & Eggs': FaHeart,
    'Meat & Seafood': FaFish,
    'Bakery': FaBreadSlice,
    'Beverages': FaCoffee,
    'Snacks': FaIceCream,
    'Frozen Foods': FaIceCream,
    'Pantry Staples': FaLeaf,
    'Health & Beauty': FaHeart,
    'Household': FaLeaf,
};

const PreferencesSetup = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [step, setStep] = useState(1);
    
    const [preferences, setPreferences] = useState({
        categories: [],
        brands: [],
        age: user?.age || '',
        gender: user?.gender || '',
        city: user?.city || '',
        store_branch: user?.store_branch || '',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/products/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await api.get('/api/products/brands/');
            setBrands(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleCategoryToggle = (categoryName) => {
        setPreferences(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryName)
                ? prev.categories.filter(c => c !== categoryName)
                : [...prev.categories, categoryName]
        }));
    };

    const handleBrandToggle = (brandName) => {
        setPreferences(prev => ({
            ...prev,
            brands: prev.brands.includes(brandName)
                ? prev.brands.filter(b => b !== brandName)
                : [...prev.brands, brandName]
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Update user profile
            if (preferences.age || preferences.gender || preferences.city || preferences.store_branch) {
                await api.put('/api/accounts/profile/', {
                    age: parseInt(preferences.age) || null,
                    gender: preferences.gender || null,
                    city: preferences.city || null,
                    store_branch: preferences.store_branch || null,
                });
            }

            // Add preferences
            for (const category of preferences.categories) {
                try {
                    await api.post('/api/accounts/preferences/', {
                        category,
                        preference_score: 1.0,
                    });
                } catch (error) {
                    // Ignore if preference already exists
                    if (error.response?.status !== 400) {
                        throw error;
                    }
                }
            }

            // Add brand preferences
            for (const brand of preferences.brands) {
                try {
                    await api.post('/api/accounts/preferences/', {
                        category: 'All', // Generic category for brand preferences
                        brand,
                        preference_score: 0.8,
                    });
                } catch (error) {
                    // Ignore if preference already exists
                    if (error.response?.status !== 400) {
                        throw error;
                    }
                }
            }

            // Trigger recommendation generation
            await api.post('/recommendations/refresh/');

            toast({
                title: 'Preferences saved!',
                description: 'Your personalized shopping experience is ready!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            navigate('/products');
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast({
                title: 'Error saving preferences',
                description: 'Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
            <Container maxW="4xl">
                <VStack spacing={8} align="center">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        textAlign="center"
                    >
                        <Heading size="xl" mb={4}>
                            Welcome to FreshMart, {user.first_name || user.username}! 🎉
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Let's personalize your shopping experience by setting up your preferences
                        </Text>
                        <Text fontSize="md" color="gray.500" mt={2}>
                            Step {step} of 3
                        </Text>
                    </MotionBox>

                    {step === 1 && (
                        <MotionBox
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            bg={bgColor}
                            borderRadius="xl"
                            p={8}
                            border="1px"
                            borderColor={borderColor}
                            w="full"
                        >
                            <VStack spacing={6}>
                                <Heading size="lg" textAlign="center">
                                    Tell us about yourself
                                </Heading>

                                <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="full">
                                    <FormControl>
                                        <FormLabel>Age</FormLabel>
                                        <NumberInput
                                            value={preferences.age}
                                            onChange={(value) => setPreferences(prev => ({ ...prev, age: value }))}
                                            min={13}
                                            max={100}
                                        >
                                            <NumberInputField placeholder="Enter your age" />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Gender</FormLabel>
                                        <Select
                                            placeholder="Select gender"
                                            value={preferences.gender}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, gender: e.target.value }))}
                                        >
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                            <option value="N">Prefer not to say</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>City</FormLabel>
                                        <Select
                                            placeholder="Select your city"
                                            value={preferences.city}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, city: e.target.value }))}
                                        >
                                            <option value="New York">New York</option>
                                            <option value="Los Angeles">Los Angeles</option>
                                            <option value="Chicago">Chicago</option>
                                            <option value="Houston">Houston</option>
                                            <option value="Phoenix">Phoenix</option>
                                            <option value="Philadelphia">Philadelphia</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Preferred Store Branch</FormLabel>
                                        <Select
                                            placeholder="Select store branch"
                                            value={preferences.store_branch}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, store_branch: e.target.value }))}
                                        >
                                            <option value="Downtown">Downtown</option>
                                            <option value="Mall Plaza">Mall Plaza</option>
                                            <option value="Westside">Westside</option>
                                            <option value="Eastside">Eastside</option>
                                            <option value="Suburb Center">Suburb Center</option>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Button
                                    colorScheme="green"
                                    size="lg"
                                    onClick={() => setStep(2)}
                                    w={{ base: 'full', md: 'auto' }}
                                    px={8}
                                >
                                    Next: Choose Categories
                                </Button>
                            </VStack>
                        </MotionBox>
                    )}

                    {step === 2 && (
                        <MotionBox
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            bg={bgColor}
                            borderRadius="xl"
                            p={8}
                            border="1px"
                            borderColor={borderColor}
                            w="full"
                        >
                            <VStack spacing={6}>
                                <Heading size="lg" textAlign="center">
                                    What types of products interest you?
                                </Heading>
                                <Text color="gray.600" textAlign="center">
                                    Select all categories that match your shopping preferences
                                </Text>

                                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} w="full">
                                    {categories.map((category) => {
                                        const IconComponent = categoryIcons[category.name] || FaLeaf;
                                        const isSelected = preferences.categories.includes(category.name);
                                        
                                        return (
                                            <MotionBox
                                                key={category.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Flex
                                                    p={4}
                                                    borderRadius="lg"
                                                    border="2px"
                                                    borderColor={isSelected ? 'green.500' : borderColor}
                                                    bg={isSelected ? 'green.50' : bgColor}
                                                    cursor="pointer"
                                                    align="center"
                                                    onClick={() => handleCategoryToggle(category.name)}
                                                    transition="all 0.2s"
                                                >
                                                    <Icon 
                                                        as={IconComponent} 
                                                        boxSize={6} 
                                                        color={isSelected ? 'green.500' : 'gray.400'}
                                                        mr={3}
                                                    />
                                                    <VStack align="start" spacing={1} flex={1}>
                                                        <Text fontWeight="medium">{category.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {category.description}
                                                        </Text>
                                                    </VStack>
                                                    <Checkbox 
                                                        isChecked={isSelected} 
                                                        colorScheme="green"
                                                        onChange={() => handleCategoryToggle(category.name)}
                                                    />
                                                </Flex>
                                            </MotionBox>
                                        );
                                    })}
                                </Grid>

                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                    Selected: {preferences.categories.length} categories
                                </Text>

                                <Flex gap={4}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        px={8}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        colorScheme="green"
                                        size="lg"
                                        onClick={() => setStep(3)}
                                        isDisabled={preferences.categories.length === 0}
                                        px={8}
                                    >
                                        Next: Choose Brands
                                    </Button>
                                </Flex>
                            </VStack>
                        </MotionBox>
                    )}

                    {step === 3 && (
                        <MotionBox
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            bg={bgColor}
                            borderRadius="xl"
                            p={8}
                            border="1px"
                            borderColor={borderColor}
                            w="full"
                        >
                            <VStack spacing={6}>
                                <Heading size="lg" textAlign="center">
                                    Any favorite brands?
                                </Heading>
                                <Text color="gray.600" textAlign="center">
                                    Select brands you prefer (optional)
                                </Text>

                                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="full">
                                    {brands.map((brand) => {
                                        const isSelected = preferences.brands.includes(brand.name);
                                        
                                        return (
                                            <MotionBox
                                                key={brand.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Flex
                                                    p={4}
                                                    borderRadius="lg"
                                                    border="2px"
                                                    borderColor={isSelected ? 'blue.500' : borderColor}
                                                    bg={isSelected ? 'blue.50' : bgColor}
                                                    cursor="pointer"
                                                    align="center"
                                                    justify="space-between"
                                                    onClick={() => handleBrandToggle(brand.name)}
                                                    transition="all 0.2s"
                                                >
                                                    <VStack align="start" spacing={1} flex={1}>
                                                        <Text fontWeight="medium">{brand.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {brand.description}
                                                        </Text>
                                                    </VStack>
                                                    <Checkbox 
                                                        isChecked={isSelected} 
                                                        colorScheme="blue"
                                                        onChange={() => handleBrandToggle(brand.name)}
                                                    />
                                                </Flex>
                                            </MotionBox>
                                        );
                                    })}
                                </Grid>

                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                    Selected: {preferences.brands.length} brands
                                </Text>

                                <Flex gap={4}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(2)}
                                        px={8}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        colorScheme="green"
                                        size="lg"
                                        onClick={handleSubmit}
                                        isLoading={loading}
                                        loadingText="Setting up..."
                                        px={8}
                                    >
                                        Complete Setup
                                    </Button>
                                </Flex>
                            </VStack>
                        </MotionBox>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default PreferencesSetup;