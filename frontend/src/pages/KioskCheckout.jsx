import {
    Box, Flex, Heading, Text, VStack, HStack, Button, useToast,
    Divider, Image, Badge, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import api from '../api/axios';

export default function KioskCheckout() {
    const [kioskCart, setKioskCart] = useState({ items: [], total_amount: 0 });
    const [kioskCustomer, setKioskCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // Load kiosk session and cart
        const sessionId = localStorage.getItem('kiosk_session');
        const customerData = localStorage.getItem('kiosk_customer');
        const cartData = localStorage.getItem('kiosk_cart');

        if (!sessionId || !customerData || !cartData) {
            toast({
                title: 'Session expired',
                description: 'Please login again',
                status: 'warning'
            });
            navigate('/kiosk-login');
            return;
        }

        try {
            setKioskCustomer(JSON.parse(customerData));
            const cart = JSON.parse(cartData);
            if (!cart.items || cart.items.length === 0) {
                toast({
                    title: 'Cart is empty',
                    status: 'warning'
                });
                navigate('/kiosk-dashboard');
                return;
            }
            setKioskCart(cart);
        } catch (error) {
            console.error('Error parsing data:', error);
            navigate('/kiosk-login');
        }
    }, [navigate, toast]);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            // Create purchase via API
            const sessionId = localStorage.getItem('kiosk_session');
            
            // First create cart items in backend
            for (const item of kioskCart.items) {
                await api.post('/purchases/cart/items/', {
                    product_id: item.product.id,
                    quantity: item.quantity
                }, {
                    headers: {
                        'X-Kiosk-Session': sessionId
                    }
                });
            }

            // Then checkout
            const response = await api.post('/purchases/checkout/', {
                payment_method: paymentMethod,
                shipping_address: 'In-store pickup',
                is_kiosk_purchase: true
            }, {
                headers: {
                    'X-Kiosk-Session': sessionId
                }
            });

            // Clear kiosk cart
            localStorage.removeItem('kiosk_cart');
            setKioskCart({ items: [], total_amount: 0 });

            // Show success modal
            onOpen();
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'Checkout Failed',
                description: error.response?.data?.error || 'Please try again',
                status: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        // Clear session and return to login
        localStorage.removeItem('kiosk_session');
        localStorage.removeItem('kiosk_customer');
        localStorage.removeItem('kiosk_cart');
        navigate('/kiosk-login');
    };

    const rewardsEarned = kioskCart.total_amount >= 60 
        ? { cashback: (kioskCart.total_amount * 0.05).toFixed(2), points: Math.floor(kioskCart.total_amount * 2) }
        : null;

    return (
        <Flex h="100vh" bg="gray.900" color="white" overflow="hidden">
            {/* Left Side: Order Summary */}
            <Box flex="1" p={8} overflowY="auto">
                <Heading size="2xl" mb={2} bgGradient="linear(to-r, brand.400, brand.200)" bgClip="text">
                    Review Your Order
                </Heading>
                <Text color="gray.400" fontSize="lg" mb={8}>
                    Customer: {kioskCustomer?.username || 'Guest'} | Card: {kioskCustomer?.loyalty_card}
                </Text>

                <VStack spacing={4} align="stretch">
                    {kioskCart.items.map(item => (
                        <Flex
                            key={item.id}
                            bg="gray.800"
                            p={5}
                            rounded="xl"
                            align="center"
                            gap={4}
                        >
                            <Box w="80px" h="80px" bg="white" rounded="lg" overflow="hidden">
                                <Image 
                                    src={item.product.image || item.product.image_url} 
                                    w="full" 
                                    h="full" 
                                    objectFit="contain"
                                />
                            </Box>
                            <VStack align="start" flex="1" spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">{item.product.name}</Text>
                                <Text color="gray.400">${item.product.price} × {item.quantity}</Text>
                            </VStack>
                            <Text fontWeight="bold" fontSize="2xl" color="brand.300">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                        </Flex>
                    ))}
                </VStack>

                {rewardsEarned && (
                    <Box mt={6} p={5} bg="green.900" border="2px solid" borderColor="green.500" rounded="xl">
                        <Heading size="md" mb={3} color="green.300">🎉 Rewards Unlocked!</Heading>
                        <VStack align="start" spacing={2}>
                            <Text fontSize="lg">✓ Free Delivery</Text>
                            <Text fontSize="lg">✓ ${rewardsEarned.cashback} Cashback</Text>
                            <Text fontSize="lg">✓ {rewardsEarned.points} Loyalty Points</Text>
                        </VStack>
                    </Box>
                )}
            </Box>

            {/* Right Side: Payment & Total */}
            <Box w="500px" bg="gray.800" borderLeft="1px solid" borderColor="gray.700" p={8} display="flex" flexDirection="column">
                <Heading size="lg" mb={6}>Payment Method</Heading>
                
                <VStack spacing={4} mb={8}>
                    <Button
                        w="full"
                        h="80px"
                        fontSize="xl"
                        leftIcon={<FiDollarSign size="30px" />}
                        bg={paymentMethod === 'cash' ? 'brand.500' : 'gray.700'}
                        _hover={{ bg: 'brand.400' }}
                        onClick={() => setPaymentMethod('cash')}
                    >
                        Cash Payment
                    </Button>
                    <Button
                        w="full"
                        h="80px"
                        fontSize="xl"
                        leftIcon={<FiCreditCard size="30px" />}
                        bg={paymentMethod === 'credit_card' ? 'brand.500' : 'gray.700'}
                        _hover={{ bg: 'brand.400' }}
                        onClick={() => setPaymentMethod('credit_card')}
                    >
                        Card Payment
                    </Button>
                </VStack>

                <Divider my={6} />

                <VStack spacing={4} flex="1">
                    <Flex w="full" justify="space-between" fontSize="xl">
                        <Text color="gray.400">Subtotal:</Text>
                        <Text fontWeight="bold">${kioskCart.total_amount.toFixed(2)}</Text>
                    </Flex>
                    <Flex w="full" justify="space-between" fontSize="xl">
                        <Text color="gray.400">Delivery:</Text>
                        <Text fontWeight="bold" color={rewardsEarned ? 'green.400' : 'white'}>
                            {rewardsEarned ? 'FREE' : '$5.00'}
                        </Text>
                    </Flex>
                    {rewardsEarned && (
                        <Flex w="full" justify="space-between" fontSize="xl">
                            <Text color="gray.400">Cashback:</Text>
                            <Text fontWeight="bold" color="green.400">-${rewardsEarned.cashback}</Text>
                        </Flex>
                    )}
                    <Divider />
                    <Flex w="full" justify="space-between" fontSize="3xl">
                        <Text fontWeight="bold">Total:</Text>
                        <Text fontWeight="bold" color="brand.300">
                            ${(kioskCart.total_amount + (rewardsEarned ? 0 : 5)).toFixed(2)}
                        </Text>
                    </Flex>
                </VStack>

                <VStack spacing={4} mt={8}>
                    <Button
                        w="full"
                        h="80px"
                        fontSize="2xl"
                        colorScheme="brand"
                        onClick={handleCheckout}
                        isLoading={loading}
                        loadingText="Processing..."
                    >
                        Complete Order
                    </Button>
                    <Button
                        w="full"
                        h="60px"
                        fontSize="lg"
                        variant="outline"
                        onClick={() => navigate('/kiosk-dashboard')}
                        isDisabled={loading}
                    >
                        Back to Shopping
                    </Button>
                </VStack>
            </Box>

            {/* Success Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>
                        <Flex align="center" gap={3}>
                            <Box bg="green.500" rounded="full" p={3}>
                                <FiCheck size="40px" />
                            </Box>
                            <Heading size="lg">Order Complete!</Heading>
                        </Flex>
                    </ModalHeader>
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="start">
                            <Text fontSize="xl">
                                Thank you for shopping at FreshMart, {kioskCustomer?.username}!
                            </Text>
                            <Text fontSize="lg" color="gray.400">
                                Your order total: <Text as="span" color="brand.300" fontWeight="bold">
                                    ${(kioskCart.total_amount + (rewardsEarned ? 0 : 5)).toFixed(2)}
                                </Text>
                            </Text>
                            {rewardsEarned && (
                                <Box p={4} bg="green.900" rounded="lg" w="full">
                                    <Text fontWeight="bold" mb={2}>Rewards Added:</Text>
                                    <Text>• ${rewardsEarned.cashback} Cashback</Text>
                                    <Text>• {rewardsEarned.points} Loyalty Points</Text>
                                </Box>
                            )}
                            <Text fontSize="lg" mt={4}>
                                Please proceed to the payment counter.
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="brand"
                            size="lg"
                            w="full"
                            h="60px"
                            fontSize="xl"
                            onClick={handleFinish}
                        >
                            Finish & Logout
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
