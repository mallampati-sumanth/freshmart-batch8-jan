import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Icon,
    InputGroup,
    InputLeftElement,
    Link,
    useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../features/auth/AuthContext';

const MotionBox = motion(Box);

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, user } = useAuth();
    const toast = useToast();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/products');
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            password2: '',
            username: '',
        },
        validationSchema: Yup.object({
            email: isLogin ? Yup.string() : Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
            password2: isLogin ? Yup.string() : Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password'),
            username: Yup.string().required('Username is required'),
        }),
        onSubmit: async (values) => {
            let result;
            if (isLogin) {
                result = await login(values.username, values.password);
            } else {
                result = await register(values);
            }
            
            console.log('Auth result:', result);

            if (result.success) {
                toast({
                    title: isLogin ? 'Welcome back!' : 'Account created!',
                    description: isLogin ? 'You have successfully logged in.' : 'Your account has been created successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
                
                if (isLogin) {
                    // Check if user has preferences set up
                    try {
                        const response = await fetch('/api/accounts/preferences/', {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                            }
                        });
                        const prefs = await response.json();
                        
                        if (prefs.length === 0 || (user?.age === null && user?.city === null)) {
                            // New user or user without preferences - redirect to setup
                            navigate('/preferences-setup');
                        } else {
                            navigate('/products');
                        }
                    } catch {
                        navigate('/products'); // fallback to products if API call fails
                    }
                } else {
                    // New user registration - redirect to preferences setup
                    navigate('/preferences-setup');
                }
            } else {
                // Handle error display
                let errorMessage = 'An error occurred';
                if (typeof result.error === 'string') {
                    errorMessage = result.error;
                } else if (result.error?.message) {
                    errorMessage = result.error.message;
                } else {
                    errorMessage = JSON.stringify(result.error);
                }
                
                toast({
                    title: isLogin ? 'Login Failed' : 'Registration Failed',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        },
    });

    return (
        <Flex
            minH={'calc(100vh - 70px)'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'dark.900')}
            position="relative"
            overflow="hidden"
        >
            {/* Background Decor */}
            <Box
                position="absolute"
                top="-20%"
                left="-10%"
                w="600px"
                h="600px"
                bg="brand.400"
                filter="blur(150px)"
                opacity={0.2}
                borderRadius="full"
            />
            <Box
                position="absolute"
                bottom="-20%"
                right="-10%"
                w="500px"
                h="500px"
                bg="purple.500"
                filter="blur(150px)"
                opacity={0.2}
                borderRadius="full"
            />

            <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                w={'full'}
                maxW={'md'}
                variant="glass"
                rounded={'xl'}
                boxShadow={'2xl'}
                p={8}
                border="1px solid"
                borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')}
                bg={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(20, 20, 20, 0.6)')}
                backdropFilter="blur(20px)"
            >
                <Stack spacing={8}>
                    <Stack align={'center'}>
                        <Heading fontSize={'3xl'} textAlign={'center'}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Heading>
                        <Text fontSize={'md'} color={'gray.500'}>
                            to enjoy fresh groceries ✌️
                        </Text>
                    </Stack>

                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="username" isInvalid={formik.touched.username && formik.errors.username}>
                                <FormLabel>Username</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FiUser} color="gray.500" />
                                    </InputLeftElement>
                                    <Input
                                        variant="filled"
                                        type="text"
                                        placeholder="john_doe"
                                        {...formik.getFieldProps('username')}
                                    />
                                </InputGroup>
                            </FormControl>

                            {!isLogin && (
                                <FormControl id="email" isInvalid={formik.touched.email && formik.errors.email}>
                                    <FormLabel>Email address</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FiMail} color="gray.500" />
                                        </InputLeftElement>
                                        <Input
                                            variant="filled"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...formik.getFieldProps('email')}
                                        />
                                    </InputGroup>
                                </FormControl>
                            )}

                            <FormControl id="password" isInvalid={formik.touched.password && formik.errors.password}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FiLock} color="gray.500" />
                                    </InputLeftElement>
                                    <Input
                                        variant="filled"
                                        type="password"
                                        placeholder="••••••••"
                                        {...formik.getFieldProps('password')}
                                    />
                                </InputGroup>
                                {formik.touched.password && formik.errors.password && (
                                    <Text color="red.500" fontSize="sm" mt={1}>{formik.errors.password}</Text>
                                )}
                            </FormControl>

                            {!isLogin && (
                                <FormControl id="password2" isInvalid={formik.touched.password2 && formik.errors.password2}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FiLock} color="gray.500" />
                                        </InputLeftElement>
                                        <Input
                                            variant="filled"
                                            type="password"
                                            placeholder="••••••••"
                                            {...formik.getFieldProps('password2')}
                                        />
                                    </InputGroup>
                                    {formik.touched.password2 && formik.errors.password2 && (
                                        <Text color="red.500" fontSize="sm" mt={1}>{formik.errors.password2}</Text>
                                    )}
                                </FormControl>
                            )}

                            <Stack spacing={10}>
                                {isLogin && (
                                    <Stack
                                        direction={{ base: 'column', sm: 'row' }}
                                        align={'start'}
                                        justify={'space-between'}>
                                        <Checkbox>Remember me</Checkbox>
                                        <Link color={'brand.500'}>Forgot password?</Link>
                                    </Stack>
                                )}

                                <Button
                                    variant="primary"
                                    type="submit"
                                    loadingText="Submitting"
                                    isLoading={formik.isSubmitting}
                                >
                                    {isLogin ? 'Sign in' : 'Sign up'}
                                </Button>

                                <Stack pt={6}>
                                    <Text align={'center'}>
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <Link color={'brand.500'} onClick={() => setIsLogin(!isLogin)}>
                                            {isLogin ? 'Sign up' : 'Login'}
                                        </Link>
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>
                    </form>
                </Stack>
            </MotionBox>
        </Flex>
    );
}
