import {
    Box,
    Container,
    Heading,
    Flex,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    useColorModeValue,
    Card,
    CardBody,
    Radio,
    RadioGroup,
    Divider,
    useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
    const { cart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    if (!cart?.items?.length) {
        navigate('/cart');
        return null;
    }

    const formik = useFormik({
        initialValues: {
            address: '',
            city: user?.city || '',
            zip: '',
            paymentMethod: 'credit_card',
        },
        validationSchema: Yup.object({
            address: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            zip: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                // Call backend checkout endpoint
                await api.post('/purchases/checkout/', {
                    payment_method: values.paymentMethod,
                    shipping_address: `${values.address}, ${values.city} ${values.zip}`
                });

                toast({
                    title: 'Order Placed Successfully!',
                    description: 'Thank you for shopping with FreshMart.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                await fetchCart(); // Clear cart state
                navigate('/profile'); // Redirect to orders
            } catch (error) {
                toast({
                    title: 'Checkout Failed',
                    description: error.response?.data?.error || 'Please try again',
                    status: 'error',
                });
            }
        },
    });

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'dark.900')}>
            <Container maxW="container.xl">
                <Heading mb={8}>Checkout</Heading>
                <Flex direction={{ base: 'column', md: 'row' }} gap={8}>

                    {/* Shipping & Payment Form */}
                    <Box flex={2}>
                        <Card variant="glass">
                            <CardBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack spacing={6}>
                                        <Heading size="md">Shipping Address</Heading>

                                        <FormControl isInvalid={formik.touched.address && formik.errors.address}>
                                            <FormLabel>Address</FormLabel>
                                            <Input {...formik.getFieldProps('address')} placeholder="123 Fresh St" />
                                        </FormControl>

                                        <Flex gap={4}>
                                            <FormControl isInvalid={formik.touched.city && formik.errors.city}>
                                                <FormLabel>City</FormLabel>
                                                <Input {...formik.getFieldProps('city')} />
                                            </FormControl>
                                            <FormControl isInvalid={formik.touched.zip && formik.errors.zip}>
                                                <FormLabel>ZIP Code</FormLabel>
                                                <Input {...formik.getFieldProps('zip')} />
                                            </FormControl>
                                        </Flex>

                                        <Divider />

                                        <Heading size="md">Payment Method</Heading>
                                        <RadioGroup
                                            value={formik.values.paymentMethod}
                                            onChange={(val) => formik.setFieldValue('paymentMethod', val)}
                                        >
                                            <Stack>
                                                <Radio value="credit_card">Credit Card</Radio>
                                                <Radio value="debit_card">Debit Card</Radio>
                                                <Radio value="cash">Cash on Delivery</Radio>
                                            </Stack>
                                        </RadioGroup>

                                        {formik.values.paymentMethod !== 'cash' && (
                                            <Box p={4} bg="gray.50" borderRadius="md">
                                                <Text fontSize="sm" color="gray.500">
                                                    (Mock Payment Gateway) - No sensitive details required for demo.
                                                </Text>
                                            </Box>
                                        )}

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            mt={4}
                                            isLoading={formik.isSubmitting}
                                        >
                                            Place Order (${cart.total_amount})
                                        </Button>
                                    </Stack>
                                </form>
                            </CardBody>
                        </Card>
                    </Box>

                    {/* Order Summary */}
                    <Box flex={1}>
                        <Card variant="glass">
                            <CardBody>
                                <Heading size="md" mb={4}>Review Order</Heading>
                                <Stack spacing={3}>
                                    {cart.items.map(item => (
                                        <Flex key={item.id} justify="space-between">
                                            <Text>{item.quantity}x {item.product_name}</Text>
                                            <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
                                        </Flex>
                                    ))}
                                    <Divider my={2} />
                                    <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                                        <Text>Total</Text>
                                        <Text>${cart.total_amount}</Text>
                                    </Flex>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Box>

                </Flex>
            </Container>
        </Box>
    );
}
