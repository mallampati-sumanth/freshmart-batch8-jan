import {
    Box,
    Container,
    Stack,
    SimpleGrid,
    Text,
    Link,
    Heading,
    useColorModeValue,
    IconButton,
    Divider,
    VStack,
    HStack,
    Image,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.900', 'white');

    return (
        <Box bg={bgColor} color={textColor} borderTop="1px" borderColor={borderColor}>
            <Container maxW="container.xl" py={10}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                    {/* Company Info */}
                    <Stack spacing={4}>
                        <Heading size="md" color={headingColor}>FreshMart</Heading>
                        <Text fontSize="sm">
                            Your trusted partner for fresh, organic groceries delivered with care.
                            AI-powered recommendations for a personalized shopping experience.
                        </Text>
                        <HStack spacing={2}>
                            <IconButton
                                as="a"
                                href="https://facebook.com"
                                target="_blank"
                                aria-label="Facebook"
                                icon={<FaFacebook />}
                                size="sm"
                                variant="ghost"
                            />
                            <IconButton
                                as="a"
                                href="https://twitter.com"
                                target="_blank"
                                aria-label="Twitter"
                                icon={<FaTwitter />}
                                size="sm"
                                variant="ghost"
                            />
                            <IconButton
                                as="a"
                                href="https://instagram.com"
                                target="_blank"
                                aria-label="Instagram"
                                icon={<FaInstagram />}
                                size="sm"
                                variant="ghost"
                            />
                            <IconButton
                                as="a"
                                href="https://linkedin.com"
                                target="_blank"
                                aria-label="LinkedIn"
                                icon={<FaLinkedin />}
                                size="sm"
                                variant="ghost"
                            />
                        </HStack>
                    </Stack>

                    {/* Quick Links */}
                    <Stack spacing={4}>
                        <Heading size="sm" color={headingColor}>Quick Links</Heading>
                        <VStack align="start" spacing={2}>
                            <Link as={RouterLink} to="/products" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Shop Products
                            </Link>
                            <Link as={RouterLink} to="/about" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                About Us
                            </Link>
                            <Link as={RouterLink} to="/kiosk-login" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Kiosk Mode
                            </Link>
                            <Link as={RouterLink} to="/cart" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Shopping Cart
                            </Link>
                            <Link as={RouterLink} to="/profile" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                My Account
                            </Link>
                        </VStack>
                    </Stack>

                    {/* Customer Service */}
                    <Stack spacing={4}>
                        <Heading size="sm" color={headingColor}>Customer Service</Heading>
                        <VStack align="start" spacing={2}>
                            <Link as={RouterLink} to="/contact" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Contact Us
                            </Link>
                            <Link as={RouterLink} to="/faq" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                FAQs
                            </Link>
                            <Link as={RouterLink} to="/shipping" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Shipping & Delivery
                            </Link>
                            <Link href="#" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Returns & Refunds
                            </Link>
                            <Link href="#" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Track Order
                            </Link>
                        </VStack>
                    </Stack>

                    {/* Legal */}
                    <Stack spacing={4}>
                        <Heading size="sm" color={headingColor}>Legal</Heading>
                        <VStack align="start" spacing={2}>
                            <Link as={RouterLink} to="/privacy-policy" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Privacy Policy
                            </Link>
                            <Link as={RouterLink} to="/terms-of-service" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Terms of Service
                            </Link>
                            <Link as={RouterLink} to="/cookie-policy" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Cookie Policy
                            </Link>
                            <Link href="#" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Accessibility
                            </Link>
                            <Link href="#" fontSize="sm" _hover={{ color: 'brand.500' }}>
                                Sitemap
                            </Link>
                        </VStack>
                    </Stack>
                </SimpleGrid>

                <Divider my={8} borderColor={borderColor} />

                {/* Legal Disclaimer */}
                <VStack spacing={4} align="start">
                    <Text fontSize="xs" lineHeight="tall">
                        <strong>Important Notice:</strong> FreshMart services may require enabled hardware, software, or service activation.
                        No product or component can be absolutely secure. Your costs and results may vary. Performance varies by use,
                        configuration, and other factors. All products are subject to availability and may vary by location.
                    </Text>

                    <Text fontSize="xs" lineHeight="tall">
                        FreshMart is committed to respecting human rights and avoiding causing or contributing to adverse impacts on human rights.
                        See FreshMart's Global Human Rights Principles. Our products and services are intended only to be used in applications
                        that do not cause or contribute to adverse impacts on human rights.
                    </Text>

                    <Text fontSize="xs" lineHeight="tall">
                        <strong>Health & Safety:</strong> Product information, including nutritional details and allergen warnings,
                        is provided by manufacturers and suppliers. While we strive for accuracy, we cannot guarantee that the information
                        is complete or error-free. Always read labels, warnings, and directions before using or consuming a product.
                    </Text>

                    <Text fontSize="xs" lineHeight="tall">
                        <strong>AI Recommendations:</strong> Our AI-powered recommendation system uses machine learning algorithms to suggest
                        products based on your purchase history and preferences. Recommendations are automated and may not always reflect
                        individual dietary needs or restrictions. Please review all product details before purchasing.
                    </Text>
                </VStack>

                <Divider my={8} borderColor={borderColor} />

                {/* Bottom Bar */}
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    spacing={4}
                >
                    <Text fontSize="sm">
                        © {new Date().getFullYear()} FreshMart. All rights reserved.
                    </Text>
                    <HStack spacing={4} fontSize="sm">
                        <Link href="#" _hover={{ color: 'brand.500' }}>
                            Notices & Disclaimers
                        </Link>
                        <Text>|</Text>
                        <Link href="#" _hover={{ color: 'brand.500' }}>
                            Legal Information
                        </Link>
                        <Text>|</Text>
                        <Link href="#" _hover={{ color: 'brand.500' }}>
                            Supplier Responsibility
                        </Link>
                    </HStack>
                </Stack>
            </Container>
        </Box>
    );
}
