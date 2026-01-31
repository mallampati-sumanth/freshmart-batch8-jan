import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    useColorModeValue,
    Icon,
    HStack,
    useToast,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { useState } from 'react';

export default function ContactUs() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: 'Message sent!',
            description: 'We\'ll get back to you within 24 hours.',
            status: 'success',
            duration: 5000,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center">
                        <Heading size="2xl" color={headingColor} mb={4}>Get In Touch</Heading>
                        <Text color={textColor} fontSize="lg">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                        {/* Contact Information */}
                        <VStack spacing={6} align="stretch" bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                            <Heading size="lg" color={headingColor}>Contact Information</Heading>

                            <VStack align="start" spacing={4}>
                                <HStack spacing={4}>
                                    <Icon as={FiMail} boxSize={6} color="brand.500" />
                                    <Box>
                                        <Text fontWeight="bold" color={headingColor}>Email</Text>
                                        <Text color={textColor}>support@freshmart.com</Text>
                                    </Box>
                                </HStack>

                                <HStack spacing={4}>
                                    <Icon as={FiPhone} boxSize={6} color="brand.500" />
                                    <Box>
                                        <Text fontWeight="bold" color={headingColor}>Phone</Text>
                                        <Text color={textColor}>1-800-FRESH-MART</Text>
                                        <Text color={textColor} fontSize="sm">(1-800-373-7462)</Text>
                                    </Box>
                                </HStack>

                                <HStack spacing={4}>
                                    <Icon as={FiMapPin} boxSize={6} color="brand.500" />
                                    <Box>
                                        <Text fontWeight="bold" color={headingColor}>Address</Text>
                                        <Text color={textColor}>123 Fresh Street</Text>
                                        <Text color={textColor}>Grocery City, FC 12345</Text>
                                    </Box>
                                </HStack>

                                <HStack spacing={4}>
                                    <Icon as={FiClock} boxSize={6} color="brand.500" />
                                    <Box>
                                        <Text fontWeight="bold" color={headingColor}>Business Hours</Text>
                                        <Text color={textColor}>Monday - Friday: 8:00 AM - 8:00 PM</Text>
                                        <Text color={textColor}>Saturday - Sunday: 9:00 AM - 6:00 PM</Text>
                                    </Box>
                                </HStack>
                            </VStack>

                            <Box mt={6}>
                                <Heading size="md" color={headingColor} mb={3}>Customer Support</Heading>
                                <Text color={textColor} mb={2}>
                                    For order-related inquiries: orders@freshmart.com
                                </Text>
                                <Text color={textColor} mb={2}>
                                    For technical support: tech@freshmart.com
                                </Text>
                                <Text color={textColor}>
                                    For partnerships: partnerships@freshmart.com
                                </Text>
                            </Box>
                        </VStack>

                        {/* Contact Form */}
                        <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                            <Heading size="lg" color={headingColor} mb={6}>Send Us a Message</Heading>

                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Subject</FormLabel>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What is this regarding?"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Message</FormLabel>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Your message..."
                                            rows={6}
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="brand"
                                        size="lg"
                                        w="full"
                                    >
                                        Send Message
                                    </Button>
                                </VStack>
                            </form>
                        </Box>
                    </SimpleGrid>

                    {/* FAQ Section */}
                    <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
                        <Heading size="lg" color={headingColor} mb={4}>Frequently Asked Questions</Heading>
                        <Text color={textColor} mb={4}>
                            Before reaching out, you might find answers to common questions in our FAQ section.
                        </Text>
                        <Button colorScheme="brand" variant="outline" onClick={() => window.location.href = '/faq'}>
                            View FAQs
                        </Button>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}
