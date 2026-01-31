import {
    Box, Grid, GridItem, Heading, Text, Input, Button, VStack, HStack,
    SimpleGrid, Image, useColorModeValue, Flex, IconButton, useToast,
    InputGroup, InputRightElement, Badge, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Divider, Tag
} from '@chakra-ui/react';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiLogOut, FiPlus, FiShoppingCart, FiMinus, FiTrash2, FiMapPin, FiStar } from 'react-icons/fi';
import { fetchProducts } from '../api/products';
import api from '../api/axios';

export default function KioskDashboard() {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [kioskCustomer, setKioskCustomer] = useState(null);
    const [kioskCart, setKioskCart] = useState({ items: [], total_amount: 0 });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    // Check if kiosk user
    useEffect(() => {
        const sessionId = localStorage.getItem('kiosk_session');
        const customerData = localStorage.getItem('kiosk_customer');
        
        if (!sessionId || !customerData) {
            // If no kiosk session, redirect to kiosk login
            navigate('/kiosk-login');
        } else {
            try {
                setKioskCustomer(JSON.parse(customerData));
            } catch (error) {
                console.error('Error parsing customer data:', error);
                navigate('/kiosk-login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        loadProducts();
        loadKioskCart();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data.results || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadKioskCart = () => {
        const savedCart = localStorage.getItem('kiosk_cart');
        if (savedCart) {
            try {
                setKioskCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart:', error);
            }
        }
    };

    const saveKioskCart = (cart) => {
        localStorage.setItem('kiosk_cart', JSON.stringify(cart));
        setKioskCart(cart);
    };

    const handleAddToCart = async (product) => {
        // Add to local kiosk cart
        const existingItem = kioskCart.items.find(item => item.product.id === product.id);
        let newItems;
        
        if (existingItem) {
            newItems = kioskCart.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newItems = [...kioskCart.items, { id: Date.now(), product, quantity: 1 }];
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const newCart = { items: newItems, total_amount: total };
        saveKioskCart(newCart);
        
        // Show product details modal with recommendations
        setSelectedProduct(product);
        loadRecommendations(product.id);
        onOpen();
        
        toast({
            title: "Added " + product.name,
            status: "success",
            duration: 1000,
            position: 'top',
            containerStyle: {
                fontSize: 'xl'
            }
        });
    };

    const loadRecommendations = async (productId) => {
        try {
            const { data } = await api.get(`/products/${productId}/frequently_bought_together/`);
            setRecommendations(data.products || []);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            setRecommendations([]);
        }
    };

    const handleQuickAdd = async (product) => {
        // Add to local kiosk cart
        const existingItem = kioskCart.items.find(item => item.product.id === product.id);
        let newItems;
        
        if (existingItem) {
            newItems = kioskCart.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newItems = [...kioskCart.items, { id: Date.now(), product, quantity: 1 }];
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const newCart = { items: newItems, total_amount: total };
        saveKioskCart(newCart);
        
        toast({
            title: "Added " + product.name,
            status: "success",
            duration: 800,
            position: 'top'
        });
    };

    const handleRemoveItem = (itemId) => {
        const newItems = kioskCart.items.filter(item => item.id !== itemId);
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        saveKioskCart({ items: newItems, total_amount: total });
    };

    const handleUpdateQuantity = (itemId, change) => {
        const newItems = kioskCart.items.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        saveKioskCart({ items: newItems, total_amount: total });
    };

    // Filter products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search))
    );

    return (
        <Flex h="100vh" bg="gray.900" color="white" overflow="hidden">
            {/* Left Side: Shop */}
            <Box flex="1" p={8} overflowY="auto">
                <HStack justify="space-between" mb={8}>
                    <Heading size="2xl" bgGradient="linear(to-r, brand.400, brand.200)" bgClip="text">FreshMart Kiosk</Heading>
                    <Button leftIcon={<FiLogOut />} onClick={() => {
                        localStorage.removeItem('kiosk_session');
                        localStorage.removeItem('kiosk_customer');
                        localStorage.removeItem('kiosk_cart');
                        navigate('/kiosk-login');
                    }} variant="outline" size="lg" colorScheme="red" _hover={{ bg: 'red.500', color: 'white' }}>
                        Exit
                    </Button>
                </HStack>

                {/* Search Bar */}
                <InputGroup size="lg" mb={8}>
                    <Input
                        placeholder="Scan barcode or search item..."
                        bg="gray.800"
                        border="2px solid"
                        borderColor="brand.500"
                        _hover={{ borderColor: 'brand.400' }}
                        _focus={{ borderColor: 'brand.300', boxShadow: 'none' }}
                        fontSize="xl"
                        h="70px"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    <InputRightElement h="70px" w="70px" children={<FiSearch size="30px" color="gray.500" />} />
                </InputGroup>

                <Heading size="lg" mb={4}>Popular Items</Heading>
                <SimpleGrid columns={{ base: 2, lg: 3, xl: 4 }} spacing={6}>
                    {filteredProducts.map(product => (
                        <Box
                            key={product.id}
                            bg="gray.800"
                            rounded="2xl"
                            overflow="hidden"
                            position="relative"
                            onClick={() => handleAddToCart(product)}
                            cursor="pointer"
                            transition="all 0.2s"
                            _active={{ transform: 'scale(0.95)' }}
                            border="1px solid"
                            borderColor="whiteAlpha.100"
                        >
                            <Box h="200px" bg="white">
                                <Image src={product.image || product.image_url} w="full" h="full" objectFit="contain" />
                            </Box>
                            <Box p={5}>
                                <Text fontWeight="bold" fontSize="xl" noOfLines={1}>{product.name}</Text>
                                <HStack mt={1} spacing={2}>
                                    {product.average_rating > 0 && (
                                        <HStack spacing={1}>
                                            <FiStar color="gold" fill="gold" />
                                            <Text color="yellow.400" fontSize="sm" fontWeight="bold">
                                                {product.average_rating.toFixed(1)}
                                            </Text>
                                        </HStack>
                                    )}
                                    {product.aisle_location && (
                                        <Tag size="sm" colorScheme="blue">
                                            <HStack spacing={1}>
                                                <FiMapPin size="12px" />
                                                <Text>{product.aisle_location}</Text>
                                            </HStack>
                                        </Tag>
                                    )}
                                </HStack>
                                <Text color="brand.300" fontSize="2xl" fontWeight="bold" mt={2}>${product.price}</Text>
                            </Box>
                            <Flex
                                position="absolute"
                                bottom={4}
                                right={4}
                                bg="brand.500"
                                color="white"
                                w="50px"
                                h="50px"
                                rounded="full"
                                align="center"
                                justify="center"
                                shadow="lg"
                            >
                                <FiPlus size="24px" />
                            </Flex>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Right Side: Cart Summary */}
            <Box w="400px" bg="gray.800" borderLeft="1px solid" borderColor="gray.700" display="flex" flexDirection="column">
                <Box p={6} borderBottom="1px solid" borderColor="gray.700">
                    <HStack justify="space-between" mb={2}>
                        <Heading size="lg">Your Cart</Heading>
                        <Badge fontSize="xl" colorScheme="brand" p={2} rounded="lg">{kioskCart.items?.length || 0}</Badge>
                    </HStack>
                    <Text color="gray.400">Scan items to add them here</Text>
                </Box>

                <Box flex="1" overflowY="auto" p={4}>
                    <VStack spacing={4} align="stretch">
                        {kioskCart.items?.map(item => (
                            item?.product ? (
                            <Flex key={item.id} bg="gray.700" p={4} rounded="xl" justify="space-between" align="center">
                                <VStack align="start" spacing={0} flex="1">
                                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>{item.product.name}</Text>
                                    <Text color="brand.300" fontSize="xl" fontWeight="bold">${item.product.price}</Text>
                                </VStack>
                                <HStack spacing={2}>
                                    <IconButton
                                        icon={<FiMinus />}
                                        size="sm"
                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                        colorScheme="gray"
                                        isDisabled={item.quantity <= 1}
                                    />
                                    <Text fontSize="xl" fontWeight="bold" w="40px" textAlign="center">{item.quantity}</Text>
                                    <IconButton
                                        icon={<FiPlus />}
                                        size="sm"
                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                        colorScheme="brand"
                                    />
                                    <IconButton
                                        icon={<FiTrash2 />}
                                        size="sm"
                                        onClick={() => handleRemoveItem(item.id)}
                                        colorScheme="red"
                                        variant="ghost"
                                    />
                                </HStack>
                            </Flex>
                            ) : null
                        ))}
                    </VStack>
                    {(!kioskCart.items || kioskCart.items.length === 0) && (
                        <Flex direction="column" align="center" justify="center" h="full" color="gray.500">
                            <FiShoppingCart size="50px" />
                            <Text mt={4} fontSize="lg">Cart is empty</Text>
                        </Flex>
                    )}
                </Box>

                <Box p={6} bg="gray.900" borderTop="1px solid" borderColor="gray.700">
                    <Flex justify="space-between" mb={6}>
                        <Text fontSize="xl" color="gray.400">Total:</Text>
                        <Text fontSize="3xl" fontWeight="bold" color="brand.300">${kioskCart.total_amount?.toFixed(2) || '0.00'}</Text>
                    </Flex>
                    <Button
                        w="full"
                        h="80px"
                        fontSize="2xl"
                        colorScheme="brand"
                        size="lg"
                        isDisabled={!kioskCart.items || kioskCart.items.length === 0}
                        onClick={() => navigate('/kiosk-checkout')}
                    >
                        Checkout Now
                    </Button>
                </Box>
            </Box>

            {/* Product Details Modal with Recommendations */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>
                        <VStack align="start" spacing={2}>
                            <Text fontSize="2xl">{selectedProduct?.name}</Text>
                            <HStack>
                                {selectedProduct?.aisle_location && (
                                    <Badge colorScheme="blue" fontSize="lg" p={2} rounded="lg">
                                        <HStack spacing={1}>
                                            <FiMapPin />
                                            <Text>Aisle {selectedProduct.aisle_location}</Text>
                                        </HStack>
                                    </Badge>
                                )}
                                {selectedProduct?.average_rating > 0 && (
                                    <Badge colorScheme="yellow" fontSize="lg" p={2} rounded="lg">
                                        <HStack spacing={1}>
                                            <FiStar fill="gold" />
                                            <Text>{selectedProduct.average_rating.toFixed(1)} Rating</Text>
                                        </HStack>
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {recommendations.length > 0 && (
                            <>
                                <Divider my={4} />
                                <Heading size="md" mb={4} color="brand.300">
                                    🛒 Customers Also Bought
                                </Heading>
                                <SimpleGrid columns={2} spacing={4}>
                                    {recommendations.map(product => (
                                        <Box
                                            key={product.id}
                                            bg="gray.700"
                                            rounded="lg"
                                            overflow="hidden"
                                            cursor="pointer"
                                            onClick={() => handleQuickAdd(product)}
                                            transition="all 0.2s"
                                            _hover={{ transform: 'scale(1.05)', bg: 'gray.600' }}
                                        >
                                            <Box h="120px" bg="white">
                                                <Image 
                                                    src={product.image || product.image_url} 
                                                    w="full" 
                                                    h="full" 
                                                    objectFit="contain" 
                                                />
                                            </Box>
                                            <Box p={3}>
                                                <Text fontWeight="bold" noOfLines={1}>{product.name}</Text>
                                                <HStack justify="space-between" mt={2}>
                                                    <Text color="brand.300" fontSize="lg" fontWeight="bold">
                                                        ${product.price}
                                                    </Text>
                                                    {product.aisle_location && (
                                                        <Tag size="sm" colorScheme="blue">
                                                            {product.aisle_location}
                                                        </Tag>
                                                    )}
                                                </HStack>
                                            </Box>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
