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

export default function PrivacyPolicy() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="start" bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                    <Heading size="2xl" color={headingColor}>Privacy Policy</Heading>
                    <Text fontSize="sm" color={textColor}>Last Updated: January 23, 2026</Text>

                    <Divider />

                    <VStack spacing={6} align="start">
                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>1. Introduction</Heading>
                            <Text color={textColor} lineHeight="tall">
                                Welcome to FreshMart. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our
                                website or use our services and tell you about your privacy rights and how the law protects you.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>2. Information We Collect</Heading>
                            <Text color={textColor} mb={3}>We collect and process the following types of information:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Personal Information:</strong> Name, email address, phone number, delivery address
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Payment Information:</strong> Credit card details, billing address (processed securely)
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Purchase History:</strong> Products ordered, order dates, preferences
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Technical Data:</strong> IP address, browser type, device information, cookies
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Usage Data:</strong> How you use our website, products viewed, search queries
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>3. How We Use Your Information</Heading>
                            <Text color={textColor} mb={3}>We use your personal data for the following purposes:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To process and deliver your orders
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To manage your account and provide customer support
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To provide personalized AI-powered product recommendations
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To send you marketing communications (with your consent)
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To improve our website, products, and services
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    To comply with legal obligations
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>4. AI and Machine Learning</Heading>
                            <Text color={textColor} lineHeight="tall">
                                FreshMart uses artificial intelligence and machine learning algorithms to provide personalized
                                product recommendations. Our AI system analyzes your purchase history, browsing behavior, and
                                preferences to suggest products you might like. You can opt out of personalized recommendations
                                at any time in your account settings.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>5. Data Sharing and Disclosure</Heading>
                            <Text color={textColor} mb={3}>We may share your personal data with:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Service Providers:</strong> Payment processors, delivery partners, cloud hosting services
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale
                                </ListItem>
                            </List>
                            <Text color={textColor} mt={3}>
                                We do not sell your personal data to third parties for marketing purposes.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>6. Data Security</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We implement appropriate technical and organizational measures to protect your personal data
                                against unauthorized access, alteration, disclosure, or destruction. However, no method of
                                transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>7. Your Rights</Heading>
                            <Text color={textColor} mb={3}>You have the right to:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Access your personal data
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Correct inaccurate data
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Request deletion of your data
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Object to processing of your data
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Request data portability
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Withdraw consent at any time
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>8. Cookies</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We use cookies and similar tracking technologies to track activity on our website and store
                                certain information. You can instruct your browser to refuse all cookies or to indicate when
                                a cookie is being sent. However, if you do not accept cookies, you may not be able to use
                                some portions of our service.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>9. Children's Privacy</Heading>
                            <Text color={textColor} lineHeight="tall">
                                Our service is not intended for children under 13 years of age. We do not knowingly collect
                                personal information from children under 13. If you are a parent or guardian and believe your
                                child has provided us with personal data, please contact us.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>10. Changes to This Policy</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by
                                posting the new Privacy Policy on this page and updating the "Last Updated" date.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>11. Contact Us</Heading>
                            <Text color={textColor} lineHeight="tall">
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                Email: privacy@freshmart.com
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
