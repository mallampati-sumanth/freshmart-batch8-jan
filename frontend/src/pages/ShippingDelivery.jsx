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
    SimpleGrid,
    Icon,
    Badge,
} from '@chakra-ui/react';
import { MdCheckCircle, MdLocalShipping, MdAccessTime, MdAttachMoney } from 'react-icons/md';
import { FiPackage, FiTruck, FiClock } from 'react-icons/fi';

export default function ShippingDelivery() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center">
                        <Heading size="2xl" color={headingColor} mb={4}>
                            Shipping & Delivery
                        </Heading>
                        <Text color={textColor} fontSize="lg">
                            Fast, reliable delivery of fresh groceries to your doorstep
                        </Text>
                    </Box>

                    {/* Delivery Options */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" textAlign="center">
                            <Icon as={FiTruck} boxSize={12} color="brand.500" mb={4} />
                            <Heading size="md" mb={2} color={headingColor}>Express Delivery</Heading>
                            <Badge colorScheme="green" mb={3}>30 Minutes</Badge>
                            <Text color={textColor} fontSize="sm">
                                Ultra-fast delivery for urgent orders in select areas
                            </Text>
                            <Text fontWeight="bold" mt={3} color="brand.500">$9.99</Text>
                        </Box>

                        <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" textAlign="center">
                            <Icon as={FiClock} boxSize={12} color="brand.500" mb={4} />
                            <Heading size="md" mb={2} color={headingColor}>Same-Day Delivery</Heading>
                            <Badge colorScheme="blue" mb={3}>2-4 Hours</Badge>
                            <Text color={textColor} fontSize="sm">
                                Order before 2 PM for same-day delivery
                            </Text>
                            <Text fontWeight="bold" mt={3} color="brand.500">$5.99</Text>
                        </Box>

                        <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" textAlign="center">
                            <Icon as={FiPackage} boxSize={12} color="brand.500" mb={4} />
                            <Heading size="md" mb={2} color={headingColor}>Standard Delivery</Heading>
                            <Badge colorScheme="purple" mb={3}>Next Day</Badge>
                            <Text color={textColor} fontSize="sm">
                                Scheduled delivery at your convenience
                            </Text>
                            <Text fontWeight="bold" mt={3} color="green.500">FREE over $50</Text>
                        </Box>
                    </SimpleGrid>

                    {/* Delivery Information */}
                    <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                        <Heading size="lg" mb={6} color={headingColor}>Delivery Information</Heading>

                        <VStack spacing={6} align="start">
                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Delivery Areas</Heading>
                                <Text color={textColor} lineHeight="tall">
                                    We currently deliver to most areas within a 25-mile radius of our distribution centers.
                                    Enter your zip code at checkout to confirm delivery availability in your area. We're
                                    constantly expanding our delivery zones!
                                </Text>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Delivery Windows</Heading>
                                <List spacing={2}>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        <strong>Morning:</strong> 8:00 AM - 12:00 PM
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        <strong>Afternoon:</strong> 12:00 PM - 4:00 PM
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        <strong>Evening:</strong> 4:00 PM - 8:00 PM
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        <strong>Express:</strong> Available 9:00 AM - 7:00 PM
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Delivery Fees</Heading>
                                <List spacing={2}>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdAttachMoney} color="green.500" />
                                        <strong>Free Delivery:</strong> Orders over $50
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdAttachMoney} color="green.500" />
                                        <strong>Standard Fee:</strong> $5.99 for orders under $50
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdAttachMoney} color="green.500" />
                                        <strong>Express Fee:</strong> Additional $9.99
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdAttachMoney} color="green.500" />
                                        <strong>Remote Areas:</strong> May incur additional charges
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Order Tracking</Heading>
                                <Text color={textColor} lineHeight="tall" mb={3}>
                                    Track your order in real-time:
                                </Text>
                                <List spacing={2}>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Receive email and SMS notifications
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Track delivery driver location
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Get estimated arrival time
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        View order status in your account
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Delivery Guidelines</Heading>
                                <List spacing={2}>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Someone must be present to receive the delivery
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Provide clear delivery instructions (gate codes, apartment numbers)
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Ensure pets are secured during delivery
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Check items immediately upon delivery
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                        Report any issues within 24 hours
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Temperature-Controlled Delivery</Heading>
                                <Text color={textColor} lineHeight="tall">
                                    All perishable items are delivered in temperature-controlled packaging to ensure maximum
                                    freshness. Frozen items are packed with dry ice, and refrigerated items are kept in
                                    insulated bags with ice packs.
                                </Text>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Missed Delivery</Heading>
                                <Text color={textColor} lineHeight="tall">
                                    If you miss your delivery, our driver will attempt to contact you. If unsuccessful,
                                    you'll receive instructions to reschedule or arrange pickup. Perishable items cannot
                                    be left unattended for safety reasons.
                                </Text>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="md" mb={3} color={headingColor}>Contact Delivery Support</Heading>
                                <Text color={textColor} lineHeight="tall">
                                    For delivery-related questions or issues:
                                    <br />
                                    Phone: 1-800-FRESH-MART
                                    <br />
                                    Email: delivery@freshmart.com
                                    <br />
                                    Live Chat: Available 8 AM - 8 PM daily
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}
