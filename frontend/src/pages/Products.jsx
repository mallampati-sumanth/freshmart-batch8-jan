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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../api/products';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

export default function Products() {
    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 200]);

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

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'dark.900')}>
            <Container maxW={'container.xl'}>
                <Stack spacing={8}>
                    {/* Header & Search */}
                    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={4}>
                        <Heading size="lg">Our Products</Heading>
                        <InputGroup maxW={{ base: 'full', md: '400px' }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FiSearch} color="gray.400" />
                            </InputLeftElement>
                            <Input
                                variant="filled"
                                placeholder="Search for fresh food..."
                                borderRadius="full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                    </Flex>

                    <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
                        {/* Sidebar Filters */}
                        <Box w={{ base: 'full', lg: '250px' }} flexShrink={0}>
                            <FilterSidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </Box>

                        {/* Product Grid */}
                        <Box flex={1}>
                            {isLoading ? (
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <Skeleton key={i} height="350px" borderRadius="xl" />
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {productsData?.results?.map((product, index) => (
                                        <ProductCard key={product.id} product={product} index={index} />
                                    ))}
                                </SimpleGrid>
                            )}

                            {!isLoading && productsData?.results?.length === 0 && (
                                <Flex justify="center" align="center" h="200px" direction="column">
                                    <Text fontSize="xl" color="gray.500">No products found.</Text>
                                    <Button mt={4} variant="link" colorScheme="brand" onClick={() => {
                                        setSearch('');
                                        setSelectedCategories([]);
                                    }}>
                                        Clear filters
                                    </Button>
                                </Flex>
                            )}
                        </Box>
                    </Flex>
                </Stack>
            </Container>
        </Box>
    );
}

const FilterSidebar = ({ categories, selectedCategories, setSelectedCategories, priceRange, setPriceRange }) => {
    const handleCategoryChange = (catId) => {
        if (selectedCategories.includes(catId)) {
            setSelectedCategories(prev => prev.filter(c => c !== catId));
        } else {
            setSelectedCategories(prev => [...prev, catId]);
        }
    };

    return (
        <Card variant="glass" p={4} borderRadius="xl">
            <Stack spacing={4}>
                <Flex align="center" gap={2}>
                    <Icon as={FiFilter} />
                    <Text fontWeight="bold">Filters</Text>
                </Flex>

                <Accordion allowMultiple defaultIndex={[0, 1]}>
                    <AccordionItem border="none">
                        <AccordionButton px={0}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">Category</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={0}>
                            <VStack align="start" spacing={2} maxH="300px" overflowY="auto">
                                {categories?.results?.map((cat) => (
                                    <Checkbox
                                        key={cat.id}
                                        colorScheme="brand"
                                        isChecked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </Checkbox>
                                ))}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem border="none">
                        <AccordionButton px={0}>
                            <Box flex="1" textAlign="left" fontWeight="semibold">Price Range</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={0}>
                            <RangeSlider
                                aria-label={['min', 'max']}
                                defaultValue={[0, 100]}
                                min={0}
                                max={200}
                                step={5}
                                onChangeEnd={(val) => setPriceRange(val)}
                                colorScheme="brand"
                            >
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                            </RangeSlider>
                            <Flex justify="space-between" mt={2} fontSize="sm" color="gray.500">
                                <Text>${priceRange[0]}</Text>
                                <Text>${priceRange[1]}</Text>
                            </Flex>
                        </AccordionPanel>
                    </AccordionItem>

                </Accordion>
            </Stack>
        </Card>
    );
};

const ProductCard = ({ product, index }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const toast = useToast();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast({
                title: "Please login",
                description: "You need to be logged in to add items to cart",
                status: "warning",
                duration: 3000,
            });
            navigate('/login');
            return;
        }

        const result = await addToCart(product.id, 1);
        if (result.success) {
            toast({
                title: "Added to cart",
                status: "success",
                duration: 2000,
                position: 'top-right'
            });
        }
    };

    return (
        <MotionCard
            variant="glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, boxShadow: '2xl' }}
            cursor="pointer"
            position="relative"
            onClick={() => navigate(`/products/${product.id}`)}
        >
            <Box position="relative" h="220px" overflow="hidden" borderTopRadius="xl" bg="white">
                <Image
                    src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    w="full"
                    h="full"
                    objectFit="contain"
                    p={4}
                    transition="transform 0.3s ease"
                    _hover={{ transform: 'scale(1.1)' }}
                />
                {product.is_active && (
                    <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme="green"
                        bg="brand.500"
                        color="white"
                        px={2}
                        rounded="full"
                        boxShadow="md"
                    >
                        In Stock
                    </Badge>
                )}
            </Box>

            <CardBody>
                <Stack spacing={2}>
                    <Flex justify="space-between" align="start">
                        <Box>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                                {product.brand_name || 'Generic'}
                            </Text>
                            <Heading size="md" fontFamily="heading" noOfLines={1} title={product.name}>
                                {product.name}
                            </Heading>
                        </Box>
                    </Flex>

                    <Flex align="center">
                        <HStack spacing={1}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Icon key={s} viewBox="0 0 20 20" fill={s <= 4 ? "orange.400" : "gray.300"} w={3} h={3}>
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </Icon>
                            ))}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" ml={1}>({product.reviews_count || 0})</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" mt={4}>
                        <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                            ${product.price}
                        </Text>
                        <Button
                            size="sm"
                            variant="primary"
                            rightIcon={<FiShoppingCart />}
                            rounded="full"
                            onClick={handleAddToCart}
                        >
                            Add
                        </Button>
                    </Flex>
                </Stack>
            </CardBody>
        </MotionCard>
    );
};
