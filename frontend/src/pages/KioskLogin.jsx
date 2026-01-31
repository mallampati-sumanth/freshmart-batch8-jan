import {
    Flex,
    Box,
    Stack,
    Heading,
    Text,
    Input,
    Button,
    useColorModeValue,
    Image,
    useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MotionBox = motion(Box);

export default function KioskLogin() {
    const [loyaltyCard, setLoyaltyCard] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState(1); // 1 = Enter card, 2 = Enter OTP
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!loyaltyCard) return;

        try {
            setLoading(true);
            const { data } = await api.post('/kiosk/request-otp/', { loyalty_card: loyaltyCard });

            if (data.success) {
                setCustomerName(data.customer_name);
                setStep(2);
                toast({
                    title: 'OTP Sent!',
                    description: data.message,
                    status: 'success',
                    duration: 5000,
                    position: 'top',
                });
            }
        } catch (error) {
            toast({
                title: 'Invalid Loyalty Card',
                description: error.response?.data?.error || 'Please check your card number and try again.',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            toast({
                title: 'Invalid OTP',
                description: 'Please enter a 6-digit OTP',
                status: 'warning',
            });
            return;
        }

        try {
            setLoading(true);
            console.log('Verifying OTP:', { loyalty_card: loyaltyCard, otp_code: otpCode });
            
            const response = await api.post('/kiosk/verify-otp/', { 
                loyalty_card: loyaltyCard,
                otp_code: otpCode 
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.success) {
                // Store kiosk session
                localStorage.setItem('kiosk_session', response.data.session_id);
                localStorage.setItem('kiosk_customer', JSON.stringify(response.data.customer));

                console.log('Session stored, navigating to dashboard...');

                toast({
                    title: `Welcome back, ${response.data.customer.username}!`,
                    description: 'Login successful',
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                });

                // Use setTimeout to ensure toast displays before navigation
                setTimeout(() => {
                    navigate('/kiosk-dashboard');
                }, 500);
            } else {
                toast({
                    title: 'Verification Failed',
                    description: response.data?.error || 'Invalid response from server',
                    status: 'error',
                });
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            console.error('Error Response:', error.response?.data);
            
            toast({
                title: 'Invalid OTP',
                description: error.response?.data?.error || 'Please check your OTP and try again.',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="gray.900"
            position="relative"
            overflow="hidden"
        >
            {/* Kiosk Background */}
            <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                position="absolute"
                w="full"
                h="full"
                objectFit="cover"
                opacity={0.4}
            />

            <MotionBox
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                zIndex={1}
                bg="rgba(0, 0, 0, 0.7)"
                backdropFilter="blur(20px)"
                p={12}
                rounded="3xl"
                border="2px solid"
                borderColor="brand.500"
                textAlign="center"
                maxW="lg"
                w="full"
            >
                <Heading color="white" mb={2} size="2xl">In-Store Kiosk</Heading>
                <Text color="gray.300" mb={10} fontSize="xl">
                    {step === 1 ? 'Enter your loyalty card to get OTP' : `Welcome, ${customerName}! Enter your OTP`}
                </Text>

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        <Stack spacing={6}>
                            <Input
                                placeholder="Loyalty Card (e.g. FM-1234-5678)"
                                size="lg"
                                h="80px"
                                fontSize="2xl"
                                value={loyaltyCard}
                                onChange={(e) => setLoyaltyCard(e.target.value.toUpperCase())}
                                bg="whiteAlpha.200"
                                color="white"
                                borderColor="brand.500"
                                _hover={{ borderColor: 'brand.400' }}
                                _placeholder={{ color: 'gray.400' }}
                                autoFocus
                            />

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                h="70px"
                                fontSize="2xl"
                                isLoading={loading}
                                loadingText="Sending OTP..."
                            >
                                📧 Get OTP via Email
                            </Button>
                        </Stack>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <Stack spacing={6}>
                            <Box>
                                <Text color="gray.400" fontSize="sm" mb={2}>Loyalty Card</Text>
                                <Text color="green.400" fontSize="lg" fontWeight="bold">{loyaltyCard}</Text>
                            </Box>

                            <Input
                                placeholder="Enter 6-digit OTP"
                                size="lg"
                                h="80px"
                                fontSize="2xl"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                bg="whiteAlpha.200"
                                color="white"
                                borderColor="brand.500"
                                _hover={{ borderColor: 'brand.400' }}
                                _placeholder={{ color: 'gray.400' }}
                                autoFocus
                                maxLength={6}
                            />

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                h="70px"
                                fontSize="2xl"
                                isLoading={loading}
                                loadingText="Verifying..."
                                isDisabled={otpCode.length !== 6}
                            >
                                ✓ Verify & Login
                            </Button>

                            <Button
                                variant="ghost"
                                color="gray.400"
                                onClick={() => {
                                    setStep(1);
                                    setOtpCode('');
                                }}
                            >
                                ← Back to Card Entry
                            </Button>

                            <Button
                                variant="link"
                                color="brand.400"
                                onClick={handleRequestOTP}
                                isLoading={loading}
                                size="sm"
                            >
                                Resend OTP
                            </Button>
                        </Stack>
                    </form>
                )}

                <Text color="gray.500" mt={8} fontSize="sm">
                    {step === 1 ? '💳 Find your loyalty card in your profile' : '📱 Check your email for the OTP code'}
                </Text>
            </MotionBox>
        </Flex>
    );
}
