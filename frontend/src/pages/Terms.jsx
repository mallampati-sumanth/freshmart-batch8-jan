import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Divider,
    List,
    ListItem,
    ListIcon,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

export default function TermsOfService() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="start" bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                    <Heading size="2xl" color={headingColor}>Terms of Service</Heading>
                    <Text fontSize="sm" color={textColor}>Last Updated: January 23, 2026</Text>

                    <Divider />

                    <VStack spacing={6} align="start">
                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>1. Acceptance of Terms</Heading>
                            <Text color={textColor} lineHeight="tall">
                                By accessing and using FreshMart's website and services, you accept and agree to be bound by
                                the terms and provisions of this agreement. If you do not agree to these Terms of Service,
                                please do not use our services.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>2. Use of Service</Heading>
                            <Text color={textColor} mb={3}>You agree to use our service only for lawful purposes. You agree not to:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="red.500" />
                                    Use the service in any way that violates any applicable law or regulation
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="red.500" />
                                    Transmit any harmful code, viruses, or malicious software
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="red.500" />
                                    Attempt to gain unauthorized access to our systems
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="red.500" />
                                    Interfere with or disrupt the service or servers
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="red.500" />
                                    Use automated systems to access the service without permission
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>3. Account Registration</Heading>
                            <Text color={textColor} lineHeight="tall">
                                To use certain features of our service, you must register for an account. You agree to provide
                                accurate, current, and complete information during registration and to update such information
                                to keep it accurate, current, and complete. You are responsible for safeguarding your password
                                and for all activities that occur under your account.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>4. Orders and Payments</Heading>
                            <Text color={textColor} mb={3}>When placing an order:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    All orders are subject to acceptance and availability
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Prices are subject to change without notice
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    We reserve the right to refuse or cancel any order
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Payment must be received before order processing
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    You are responsible for any applicable taxes
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>5. Delivery</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We strive to deliver orders within the estimated delivery time. However, delivery times are
                                estimates and not guaranteed. We are not liable for delays caused by circumstances beyond our
                                control. You must be available to receive delivery at the specified address.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>6. Returns and Refunds</Heading>
                            <Text color={textColor} mb={3}>Our return and refund policy:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Perishable items cannot be returned unless defective
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Report any issues within 24 hours of delivery
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Refunds will be processed within 5-7 business days
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    We reserve the right to inspect returned items
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>7. Product Information</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We strive to provide accurate product information, including descriptions, images, and prices.
                                However, we do not warrant that product descriptions or other content is accurate, complete,
                                reliable, current, or error-free. Product packaging and materials may contain more and/or
                                different information than shown on our website.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>8. Intellectual Property</Heading>
                            <Text color={textColor} lineHeight="tall">
                                The service and its original content, features, and functionality are owned by FreshMart and
                                are protected by international copyright, trademark, patent, trade secret, and other intellectual
                                property laws. You may not reproduce, distribute, modify, or create derivative works without
                                our express written permission.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>9. Limitation of Liability</Heading>
                            <Text color={textColor} lineHeight="tall">
                                To the maximum extent permitted by law, FreshMart shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
                                intangible losses resulting from your use of the service.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>10. Disclaimer of Warranties</Heading>
                            <Text color={textColor} lineHeight="tall">
                                The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind,
                                either express or implied, including but not limited to implied warranties of merchantability,
                                fitness for a particular purpose, or non-infringement.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>11. Indemnification</Heading>
                            <Text color={textColor} lineHeight="tall">
                                You agree to indemnify, defend, and hold harmless FreshMart and its officers, directors,
                                employees, and agents from any claims, liabilities, damages, losses, and expenses arising
                                out of or in any way connected with your access to or use of the service.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>12. Termination</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We may terminate or suspend your account and access to the service immediately, without prior
                                notice or liability, for any reason, including if you breach these Terms of Service.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>13. Governing Law</Heading>
                            <Text color={textColor} lineHeight="tall">
                                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                                in which FreshMart operates, without regard to its conflict of law provisions.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>14. Changes to Terms</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We reserve the right to modify or replace these Terms at any time. We will provide notice of
                                any material changes by posting the new Terms on this page and updating the "Last Updated" date.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>15. Contact Information</Heading>
                            <Text color={textColor} lineHeight="tall">
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                Email: legal@freshmart.com
                                <br />
                                Phone: 1-800-FRESH-MART
                                <br />
                                Address: 123 Fresh Street, Grocery City, FC 12345
                            </Text>
                        </Box>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
}
