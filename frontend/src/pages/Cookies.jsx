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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

export default function CookiePolicy() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="start" bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                    <Heading size="2xl" color={headingColor}>Cookie Policy</Heading>
                    <Text fontSize="sm" color={textColor}>Last Updated: January 23, 2026</Text>

                    <Divider />

                    <VStack spacing={6} align="start">
                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>What Are Cookies?</Heading>
                            <Text color={textColor} lineHeight="tall">
                                Cookies are small text files that are placed on your computer or mobile device when you visit
                                a website. They are widely used to make websites work more efficiently and provide information
                                to website owners.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>How We Use Cookies</Heading>
                            <Text color={textColor} mb={3}>FreshMart uses cookies for the following purposes:</Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Essential Cookies:</strong> Required for the website to function properly
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Performance Cookies:</strong> Help us understand how visitors use our website
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Functionality Cookies:</strong> Remember your preferences and settings
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Targeting Cookies:</strong> Deliver relevant advertisements and content
                                </ListItem>
                            </List>
                        </Box>

                        <Box w="100%">
                            <Heading size="md" mb={3} color={headingColor}>Types of Cookies We Use</Heading>
                            <Box overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Cookie Type</Th>
                                            <Th>Purpose</Th>
                                            <Th>Duration</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td fontWeight="bold">Session Cookies</Td>
                                            <Td>Maintain your login session</Td>
                                            <Td>Session</Td>
                                        </Tr>
                                        <Tr>
                                            <Td fontWeight="bold">Authentication</Td>
                                            <Td>Remember your login credentials</Td>
                                            <Td>30 days</Td>
                                        </Tr>
                                        <Tr>
                                            <Td fontWeight="bold">Shopping Cart</Td>
                                            <Td>Store items in your cart</Td>
                                            <Td>7 days</Td>
                                        </Tr>
                                        <Tr>
                                            <Td fontWeight="bold">Preferences</Td>
                                            <Td>Remember your settings (theme, language)</Td>
                                            <Td>1 year</Td>
                                        </Tr>
                                        <Tr>
                                            <Td fontWeight="bold">Analytics</Td>
                                            <Td>Track website usage and performance</Td>
                                            <Td>2 years</Td>
                                        </Tr>
                                        <Tr>
                                            <Td fontWeight="bold">AI Recommendations</Td>
                                            <Td>Personalize product suggestions</Td>
                                            <Td>1 year</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>Third-Party Cookies</Heading>
                            <Text color={textColor} lineHeight="tall" mb={3}>
                                We may also use third-party cookies from trusted partners:
                            </Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Google Analytics for website analytics
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Payment processors for secure transactions
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Social media platforms for sharing features
                                </ListItem>
                            </List>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>Managing Cookies</Heading>
                            <Text color={textColor} lineHeight="tall" mb={3}>
                                You can control and manage cookies in various ways:
                            </Text>
                            <List spacing={2}>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Opt-Out Tools:</strong> Use browser extensions or privacy tools
                                </ListItem>
                                <ListItem color={textColor}>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    <strong>Account Settings:</strong> Manage preferences in your FreshMart account
                                </ListItem>
                            </List>
                            <Text color={textColor} mt={3} fontSize="sm" fontStyle="italic">
                                Note: Blocking certain cookies may affect your ability to use some features of our website.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>Do Not Track Signals</Heading>
                            <Text color={textColor} lineHeight="tall">
                                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that
                                you do not want to have your online activity tracked. We currently do not respond to DNT signals,
                                but you can manage cookies through your browser settings.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>Updates to This Policy</Heading>
                            <Text color={textColor} lineHeight="tall">
                                We may update this Cookie Policy from time to time to reflect changes in our practices or for
                                other operational, legal, or regulatory reasons. Please check this page periodically for updates.
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb={3} color={headingColor}>Contact Us</Heading>
                            <Text color={textColor} lineHeight="tall">
                                If you have questions about our use of cookies, please contact us at:
                                <br />
                                Email: privacy@freshmart.com
                                <br />
                                Phone: 1-800-FRESH-MART
                            </Text>
                        </Box>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
}
