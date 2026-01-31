import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    List,
    ListItem,
    Badge,
    Icon,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Avatar,
    Textarea,
    HStack,
    Select,
    Tooltip,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProduct, createReview } from '../api/products';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { FiShoppingCart, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const MotionBox = motion(Box);

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
    });

    // Check if user has purchased this product
    const { data: purchaseCheck } = useQuery({
        queryKey: ['purchase-check', id],
        queryFn: async () => {
            if (!user) return { has_purchased: false };
            const { data } = await api.get(`/products/${id}/check-purchase/`);
            return data;
        },
        enabled: !!user,
    });

    const reviewMutation = useMutation({
        mutationFn: (newReview) => createReview(id, newReview),
        onSuccess: () => {
            queryClient.invalidateQueries(['product', id]);
            toast({ title: 'Review added successfully', status: 'success' });
            setComment('');
            setRating(5);
        },
        onError: (error) => {
            toast({
                title: 'Failed to add review',
                description: error.response?.data?.error || 'Something went wrong',
                status: 'error'
            });
        },
    });

    if (isLoading) return <Box p={20} textAlign="center">Loading...</Box>;
    if (!product) return <Box p={20} textAlign="center">Product not found</Box>;

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const res = await addToCart(product.id, quantity);
        if (res.success) {
            toast({ title: 'Added to cart', status: 'success', position: 'top-right' });
        }
    };

    const handleSubmitReview = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        reviewMutation.mutate({ rating, comment });
    };

    const hasPurchased = purchaseCheck?.has_purchased || false;
    const canReview = user && hasPurchased;

    return (
        <Container maxW={'container.xl'} py={10}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                {/* Product Image */}
                <Flex>
                    <MotionBox
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        w="full"
                    >
                        <Image
                            rounded={'3xl'}
                            alt={product.name}
                            src={product.image || 'https://via.placeholder.com/600'}
                            fit={'cover'}
                            align={'center'}
                            w={'100%'}
                            h={{ base: '100%', sm: '400px', lg: '500px' }}
                            boxShadow={'2xl'}
                        />
                    </MotionBox>
                </Flex>

                {/* Product Info */}
                <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={'header'}>
                        <Heading
                            lineHeight={1.1}
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                            {product.name}
                        </Heading>
                        <Text
                            color={useColorModeValue('gray.900', 'gray.400')}
                            fontWeight={300}
                            fontSize={'2xl'}
                            mt={2}>
                            ${product.price}
                        </Text>
                    </Box>

                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                            />
                        }>
                        <VStack spacing={{ base: 4, sm: 6 }}>
                            <Text
                                color={useColorModeValue('gray.500', 'gray.400')}
                                fontSize={'lg'}
                                fontWeight={'300'}>
                                {product.description}
                            </Text>
                        </VStack>

                        <Box>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                color={useColorModeValue('brand.500', 'brand.300')}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Details
                            </Text>

                            <List spacing={2}>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>Brand:</Text> {product.brand_name || 'Generic'}
                                </ListItem>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>Category:</Text> {product.category_name}
                                </ListItem>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>Stock:</Text> {product.stock_quantity > 0 ? `${product.stock_quantity} units` : 'Out of Stock'}
                                </ListItem>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>Aisle:</Text> {product.aisle_location || 'Ask Staff'}
                                </ListItem>
                            </List>
                        </Box>
                    </Stack>

                    <Flex gap={4} align="center">
                        <Select w="100px" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                        </Select>
                        <Button
                            rounded={'full'}
                            w={'full'}
                            size={'lg'}
                            variant="primary"
                            rightIcon={<FiShoppingCart />}
                            onClick={handleAddToCart}
                            isDisabled={!product.in_stock}
                        >
                            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </Flex>

                    <Stack direction="row" alignItems="center" justifyContent={'center'}>
                        <FiTruck />
                        <Text>2-3 business days delivery</Text>
                        <FiShield style={{ marginLeft: '20px' }} />
                        <Text>Freshness Guaranteed</Text>
                    </Stack>
                </Stack>
            </SimpleGrid>

            {/* Reviews Tabs */}
            <Box mt={20}>
                <Tabs variant="enclosed" colorScheme="brand">
                    <TabList>
                        <Tab fontWeight="bold">Reviews ({product.reviews?.length || 0})</Tab>
                        <Tab fontWeight="bold">QR Code</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Stack spacing={8} py={8}>
                                {/* Review Form */}
                                {user && (
                                    <Box p={6} borderRadius="xl" bg={useColorModeValue('gray.50', 'dark.800')} opacity={canReview ? 1 : 0.7}>
                                        <Heading size="md" mb={4}>Write a Review</Heading>
                                        {!hasPurchased && (
                                            <Text color="orange.500" fontSize="sm" mb={4}>
                                                ℹ️ You need to purchase this product before you can leave a review
                                            </Text>
                                        )}
                                        <Stack spacing={4}>
                                            <HStack>
                                                <Text>Rating:</Text>
                                                <Select
                                                    w="100px"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                    isDisabled={!canReview}
                                                >
                                                    <option value="5">5 ★</option>
                                                    <option value="4">4 ★</option>
                                                    <option value="3">3 ★</option>
                                                    <option value="2">2 ★</option>
                                                    <option value="1">1 ★</option>
                                                </Select>
                                            </HStack>
                                            <Textarea
                                                placeholder="Share your thoughts..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                isDisabled={!canReview}
                                            />
                                            <Tooltip
                                                label={!hasPurchased ? "Purchase this product to leave a review" : ""}
                                                placement="top"
                                                hasArrow
                                            >
                                                <Button
                                                    alignSelf="flex-start"
                                                    colorScheme="brand"
                                                    isLoading={reviewMutation.isPending}
                                                    onClick={handleSubmitReview}
                                                    isDisabled={!canReview}
                                                >
                                                    Post Review
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                )}

                                {/* Reviews List */}
                                {product.reviews?.map((review) => (
                                    <Stack key={review.id} p={4} borderRadius="lg" bg={useColorModeValue('white', 'whiteAlpha.100')} boxShadow="sm">
                                        <Flex justify="space-between">
                                            <HStack>
                                                <Avatar size="sm" name={review.customer_name} />
                                                <Text fontWeight="bold">{review.customer_name}</Text>
                                            </HStack>
                                            <Flex color="yellow.400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon key={i} as={FiStar} fill={i < review.rating ? "currentColor" : "none"} />
                                                ))}
                                            </Flex>
                                        </Flex>
                                        <Text mt={2}>{review.comment}</Text>
                                        <Text fontSize="xs" color="gray.500">{new Date(review.created_at).toLocaleDateString()}</Text>
                                    </Stack>
                                ))}
                                {product.reviews?.length === 0 && <Text color="gray.500">No reviews yet. Be the first!</Text>}
                            </Stack>
                        </TabPanel>
                        <TabPanel>
                            <Flex justify="center" align="center" direction="column" py={10}>
                                {product.qr_code ? (
                                    <Image src={product.qr_code} boxSize="200px" />
                                ) : (
                                    <Text>QR Code not available</Text>
                                )}
                                <Text mt={4} color="gray.500">Scan at kiosk for info</Text>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}
