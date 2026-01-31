import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useColorModeValue,
    SimpleGrid,
    Icon,
    HStack,
    Button,
} from '@chakra-ui/react';
import { FiShoppingCart, FiTruck, FiCreditCard, FiPackage } from 'react-icons/fi';

export default function FAQ() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const categories = [
        {
            title: 'Orders & Shopping',
            icon: FiShoppingCart,
            faqs: [
                {
                    q: 'How do I place an order?',
                    a: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in to complete your purchase.'
                },
                {
                    q: 'Can I modify or cancel my order?',
                    a: 'You can modify or cancel your order within 30 minutes of placing it. After that, please contact our customer support team for assistance.'
                },
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets. All payments are processed securely.'
                },
                {
                    q: 'Do you offer bulk discounts?',
                    a: 'Yes! We offer discounts on bulk purchases. Check our weekly deals section or contact us for custom bulk orders.'
                },
            ]
        },
        {
            title: 'Delivery & Shipping',
            icon: FiTruck,
            faqs: [
                {
                    q: 'What are your delivery areas?',
                    a: 'We currently deliver to most areas within a 25-mile radius of our store. Enter your zip code at checkout to confirm delivery availability.'
                },
                {
                    q: 'How fast is delivery?',
                    a: 'We offer same-day delivery for orders placed before 2 PM, and express 30-minute delivery for select areas. Standard delivery takes 2-4 hours.'
                },
                {
                    q: 'What are the delivery charges?',
                    a: 'Delivery is free for orders over $50. For orders under $50, a $5.99 delivery fee applies. Express delivery has an additional $9.99 fee.'
                },
                {
                    q: 'Can I track my order?',
                    a: 'Yes! You\'ll receive a tracking link via email and SMS once your order is out for delivery. You can also track it in your account dashboard.'
                },
            ]
        },
        {
            title: 'Products & Quality',
            icon: FiPackage,
            faqs: [
                {
                    q: 'How do you ensure product freshness?',
                    a: 'We source directly from local farmers and suppliers daily. All products are stored in temperature-controlled environments and quality-checked before delivery.'
                },
                {
                    q: 'What if I receive a damaged or expired product?',
                    a: 'We have a 100% satisfaction guarantee. Contact us within 24 hours of delivery with photos, and we\'ll provide a full refund or replacement.'
                },
                {
                    q: 'Do you offer organic products?',
                    a: 'Yes! We have a wide selection of certified organic products. Use the "Organic" filter when browsing to see all organic options.'
                },
                {
                    q: 'Can I request specific products?',
                    a: 'Absolutely! Use our product request form or contact customer support. We\'ll do our best to source requested items for future orders.'
                },
            ]
        },
        {
            title: 'Account & AI Features',
            icon: FiCreditCard,
            faqs: [
                {
                    q: 'How do AI recommendations work?',
                    a: 'Our AI analyzes your purchase history, browsing behavior, and preferences to suggest products you might like. You can manage recommendation settings in your account.'
                },
                {
                    q: 'Is my data safe?',
                    a: 'Yes! We use industry-standard encryption and security measures. We never sell your personal data. Read our Privacy Policy for more details.'
                },
                {
                    q: 'Can I delete my account?',
                    a: 'Yes, you can delete your account anytime from your account settings. This will permanently remove all your data from our systems.'
                },
                {
                    q: 'How do I earn and use loyalty points?',
                    a: 'You earn 1 point for every dollar spent. Points can be redeemed for discounts on future purchases. Check your account dashboard for your current balance.'
                },
            ]
        },
    ];

    return (
        <Box py={10} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center">
                        <Heading size="2xl" color={headingColor} mb={4}>
                            Frequently Asked Questions
                        </Heading>
                        <Text color={textColor} fontSize="lg">
                            Find answers to common questions about FreshMart
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                        {categories.map((category, idx) => (
                            <Box key={idx} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                                <HStack mb={4}>
                                    <Icon as={category.icon} boxSize={6} color="brand.500" />
                                    <Heading size="md" color={headingColor}>{category.title}</Heading>
                                </HStack>

                                <Accordion allowMultiple>
                                    {category.faqs.map((faq, faqIdx) => (
                                        <AccordionItem key={faqIdx} border="none">
                                            <AccordionButton _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                                                <Box flex="1" textAlign="left" fontWeight="semibold" color={headingColor}>
                                                    {faq.q}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel pb={4} color={textColor}>
                                                {faq.a}
                                            </AccordionPanel>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Box>
                        ))}
                    </SimpleGrid>

                    <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="lg" textAlign="center">
                        <Heading size="md" color={headingColor} mb={3}>
                            Still have questions?
                        </Heading>
                        <Text color={textColor} mb={4}>
                            Can't find the answer you're looking for? Our customer support team is here to help.
                        </Text>
                        <Button colorScheme="brand" size="lg" onClick={() => window.location.href = '/contact'}>
                            Contact Support
                        </Button>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
}
