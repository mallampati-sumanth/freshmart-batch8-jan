import {
    Box, Container, Grid, GridItem, Heading, Text, VStack, HStack, Avatar,
    useColorModeValue, Badge, Accordion, AccordionItem, AccordionButton,
    AccordionPanel, AccordionIcon, Spinner, Center, Divider, Image,
    Tabs, TabList, TabPanels, Tab, TabPanel, Button, FormControl, FormLabel,
    Input, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalFooter, useDisclosure, Alert, AlertIcon, Card, CardBody, Icon, Stat,
    StatLabel, StatNumber, StatHelpText, Progress, SimpleGrid
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useEffect, useState } from 'react';
import { getOrders } from '../api/purchases';
import { FiShoppingBag, FiSettings, FiTrash2, FiGift, FiDollarSign, FiTrendingUp, FiAward } from 'react-icons/fi';
import api from '../api/axios';

export default function Profile() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const toast = useToast();

    // Calculate loyalty rewards from orders
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const ordersOver45 = orders.filter(order => parseFloat(order.total_amount || 0) >= 60).length;
    const totalCashback = (totalSpent * 0.05).toFixed(2); // 5% on orders $45+
    const loyaltyPoints = Math.floor(totalSpent * 2); // 2 points per dollar
    const nextRewardAt = 1000;
    const rewardProgress = (loyaltyPoints / nextRewardAt) * 100;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(Array.isArray(data) ? data : data.results || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (!user) {
        return <Center minH="50vh"><Text>Please log in.</Text></Center>;
    }

    return (
        <Container maxW="container.xl" py={10}>
            <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
                {/* Profile Sidebar */}
                <GridItem>
                    <VStack
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        spacing={4}
                        shadow="sm"
                        position="sticky"
                        top="100px"
                    >
                        <Avatar size="2xl" name={user.username} src={user.profile_image} mb={4} />
                        <Heading size="md">{user.username}</Heading>
                        <Text color="gray.500">{user.email}</Text>
                        <Badge colorScheme="brand" variant="subtle" px={2} py={1} rounded="full" textTransform="capitalize">
                            {user.role || 'Customer'}
                        </Badge>
                        
                        {/* Loyalty Card Display */}
                        {user.loyalty_card && (
                            <>
                                <Divider />
                                <VStack w="full" align="stretch" spacing={2} bg="green.50" p={4} borderRadius="md" borderWidth="2px" borderColor="green.400">
                                    <HStack justify="space-between">
                                        <Text fontSize="xs" color="green.700" fontWeight="bold">💳 LOYALTY CARD</Text>
                                        <Badge colorScheme="green" fontSize="xs">Active</Badge>
                                    </HStack>
                                    <Text fontSize="lg" fontWeight="bold" color="green.600" letterSpacing="wide" textAlign="center">
                                        {user.loyalty_card}
                                    </Text>
                                    <Button 
                                        size="xs" 
                                        colorScheme="green" 
                                        variant="outline"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.loyalty_card);
                                            toast({
                                                title: 'Card number copied!',
                                                status: 'success',
                                                duration: 2000
                                            });
                                        }}
                                    >
                                        📋 Copy Number
                                    </Button>
                                    <Text fontSize="xs" color="green.600" textAlign="center">
                                        Use at Kiosk for OTP login
                                    </Text>
                                </VStack>
                            </>
                        )}
                        
                        <Divider />
                        <VStack w="full" align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500" fontWeight="bold">USER INFO</Text>
                            <Text fontSize="sm">ID: {user.id}</Text>
                        </VStack>

                        {(user.role === 'admin' || user.is_staff) && (
                            <>
                                <Divider />
                                <Button
                                    as={Link}
                                    to="/admin/dashboard"
                                    w="full"
                                    colorScheme="purple"
                                    variant="outline"
                                >
                                    Admin Dashboard
                                </Button>
                            </>
                        )}
                    </VStack>
                </GridItem>

                {/* Main Content Area */}
                <GridItem>
                    <Box bg={bgColor} p={6} rounded="xl" border="1px solid" borderColor={borderColor} shadow="sm" minH="500px">
                        <Tabs variant="soft-rounded" colorScheme="brand">
                            <TabList mb={6}>
                                <Tab><HStack><FiGift /><Text>Rewards</Text></HStack></Tab>
                                <Tab><HStack><FiShoppingBag /><Text>Orders</Text></HStack></Tab>
                                <Tab><HStack><FiSettings /><Text>Settings</Text></HStack></Tab>
                            </TabList>

                            <TabPanels>
                                {/* Rewards Panel */}
                                <TabPanel p={0}>
                                    <VStack spacing={6} align="stretch">
                                        <Box>
                                            <Heading size="lg" mb={2}>🎁 Your Rewards</Heading>
                                            <Text color="gray.500" fontSize="sm">
                                                Shop more, save more! Reach $60 per order to unlock amazing benefits.
                                            </Text>
                                        </Box>

                                        {/* Rewards Stats */}
                                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                            <Card bg="green.50" borderColor="green.300" borderWidth="2px">
                                                <CardBody>
                                                    <Stat>
                                                        <HStack mb={2}>
                                                            <Icon as={FiDollarSign} color="green.500" boxSize={5} />
                                                            <StatLabel color="green.700" fontWeight="bold">Available Cashback</StatLabel>
                                                        </HStack>
                                                        <StatNumber color="green.600" fontSize="3xl">${totalCashback}</StatNumber>
                                                        <StatHelpText color="green.600">Use on your next order!</StatHelpText>
                                                    </Stat>
                                                </CardBody>
                                            </Card>

                                            <Card bg="purple.50" borderColor="purple.300" borderWidth="2px">
                                                <CardBody>
                                                    <Stat>
                                                        <HStack mb={2}>
                                                            <Icon as={FiAward} color="purple.500" boxSize={5} />
                                                            <StatLabel color="purple.700" fontWeight="bold">Loyalty Points</StatLabel>
                                                        </HStack>
                                                        <StatNumber color="purple.600" fontSize="3xl">{loyaltyPoints}</StatNumber>
                                                        <StatHelpText color="purple.600">2 points per $1 spent</StatHelpText>
                                                    </Stat>
                                                </CardBody>
                                            </Card>

                                            <Card bg="orange.50" borderColor="orange.300" borderWidth="2px">
                                                <CardBody>
                                                    <Stat>
                                                        <HStack mb={2}>
                                                            <Icon as={FiTrendingUp} color="orange.500" boxSize={5} />
                                                            <StatLabel color="orange.700" fontWeight="bold">$60+ Orders</StatLabel>
                                                        </HStack>
                                                        <StatNumber color="orange.600" fontSize="3xl">{ordersOver45}</StatNumber>
                                                        <StatHelpText color="orange.600">Free delivery unlocked!</StatHelpText>
                                                    </Stat>
                                                </CardBody>
                                            </Card>
                                        </SimpleGrid>

                                        {/* Progress to Next Reward */}
                                        <Card borderColor="brand.300" borderWidth="2px">
                                            <CardBody>
                                                <VStack align="stretch" spacing={3}>
                                                    <HStack justify="space-between">
                                                        <HStack>
                                                            <Icon as={FiGift} color="brand.500" boxSize={6} />
                                                            <Heading size="md">Next Reward</Heading>
                                                        </HStack>
                                                        <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
                                                            {loyaltyPoints} / {nextRewardAt} points
                                                        </Badge>
                                                    </HStack>
                                                    <Progress 
                                                        value={rewardProgress} 
                                                        colorScheme="brand" 
                                                        size="lg" 
                                                        borderRadius="full"
                                                        hasStripe
                                                        isAnimated
                                                    />
                                                    <Text fontSize="sm" color="gray.600">
                                                        Earn {nextRewardAt - loyaltyPoints} more points to unlock $20 gift card! 🎊
                                                    </Text>
                                                </VStack>
                                            </CardBody>
                                        </Card>

                                        {/* How to Earn */}
                                        <Card bg="blue.50" borderColor="blue.200" borderWidth="1px">
                                            <CardBody>
                                                <Heading size="sm" mb={3} color="blue.700">💡 How to Maximize Your Rewards</Heading>
                                                <VStack align="stretch" spacing={2}>
                                                    <HStack>
                                                        <Badge colorScheme="green">✓</Badge>
                                                        <Text fontSize="sm">Spend $60+ per order → Free delivery + 5% cashback</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Badge colorScheme="purple">✓</Badge>
                                                        <Text fontSize="sm">Earn 2 loyalty points per dollar spent</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Badge colorScheme="orange">✓</Badge>
                                                        <Text fontSize="sm">Reach 1,000 points → Unlock $20 gift card</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Badge colorScheme="blue">✓</Badge>
                                                        <Text fontSize="sm">Shop regularly → Build loyalty status & exclusive deals</Text>
                                                    </HStack>
                                                </VStack>
                                            </CardBody>
                                        </Card>

                                        {/* Call to Action */}
                                        <Alert status="success" borderRadius="md">
                                            <AlertIcon />
                                            <Box flex="1">
                                                <Text fontWeight="bold">Ready to earn more rewards?</Text>
                                                <Text fontSize="sm">Your cashback is waiting! Use it on your next ${totalCashback > 0 ? '$' + totalCashback + ' discount available' : 'order over $60'}.</Text>
                                            </Box>
                                            <Button as={Link} to="/products" colorScheme="brand" size="sm">
                                                Shop Now
                                            </Button>
                                        </Alert>
                                    </VStack>
                                </TabPanel>

                                {/* Orders Panel */}
                                <TabPanel p={0}>
                                    <Heading size="lg" mb={6}>Order History</Heading>
                                    {loading ? (
                                        <Center py={10}><Spinner /></Center>
                                    ) : orders.length === 0 ? (
                                        <Text color="gray.500">No orders found.</Text>
                                    ) : (
                                        <Accordion allowToggle defaultIndex={[0]}>
                                            {orders.map(order => (
                                                <AccordionItem key={order.id} border="none" mb={4} bg={useColorModeValue('gray.50', 'whiteAlpha.100')} rounded="lg">
                                                    <h2>
                                                        <AccordionButton _expanded={{ bg: 'brand.500', color: 'white' }} rounded="lg">
                                                            <Box flex="1" textAlign="left">
                                                                <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} alignItems="center">
                                                                    <Text fontWeight="bold">Order #{order.id}</Text>
                                                                    <Text fontSize="sm">{new Date(order.created_at).toLocaleDateString()}</Text>
                                                                    <Badge colorScheme={order.status === 'completed' ? 'green' : 'yellow'} textAlign="center" width="fit-content">
                                                                        {order.status}
                                                                    </Badge>
                                                                    <Text fontWeight="bold" textAlign={{ base: 'left', md: 'right' }}>${order.total_amount}</Text>
                                                                </Grid>
                                                            </Box>
                                                            <AccordionIcon ml={4} />
                                                        </AccordionButton>
                                                    </h2>
                                                    <AccordionPanel pb={4}>
                                                        <VStack align="stretch" spacing={3} mt={4}>
                                                            <Text fontWeight="semibold" fontSize="sm" color="gray.500">ITEMS</Text>
                                                            {order.items && order.items.map(item => (
                                                                <HStack key={item.id} justify="space-between" borderBottom="1px dashed" borderColor="gray.200" pb={2}>
                                                                    <HStack>
                                                                        {item.product_image && (
                                                                            <Image src={item.product_image} boxSize="40px" objectFit="cover" rounded="md" />
                                                                        )}
                                                                        <Text>{item.product_name}</Text>
                                                                        <Text fontSize="sm" color="gray.500">x {item.quantity}</Text>
                                                                    </HStack>
                                                                    <Text fontWeight="medium">${item.subtotal}</Text>
                                                                </HStack>
                                                            ))}
                                                            <Divider my={2} />
                                                            <HStack justify="space-between">
                                                                <Text color="gray.500">Payment Method</Text>
                                                                <Text fontWeight="medium" textTransform="capitalize">{order.payment_method}</Text>
                                                            </HStack>
                                                            <HStack justify="space-between">
                                                                <Text fontWeight="bold" fontSize="lg">Total</Text>
                                                                <Text fontWeight="bold" fontSize="lg">${order.total_amount}</Text>
                                                            </HStack>
                                                        </VStack>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}
                                </TabPanel>

                                {/* Settings Panel */}
                                <TabPanel p={0}>
                                    <SettingsTab user={user} logout={logout} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
}

const SettingsTab = ({ user, logout }) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    // Profile Update State
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
    });

    // Password Update State
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.patch('/accounts/profile/', formData);
            toast({ title: 'Profile updated', status: 'success' });
        } catch (error) {
            toast({ title: 'Update failed', description: error.response?.data?.message || 'Error', status: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            toast({ title: "Passwords don't match", status: "error" });
            return;
        }
        setIsLoading(true);
        try {
            await api.patch('/accounts/profile/', { password: passwordData.password });
            toast({ title: 'Password updated', status: 'success' });
            setPasswordData({ password: '', confirmPassword: '' });
        } catch (error) {
            toast({ title: 'Update failed', status: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await api.delete('/accounts/profile/');
            toast({ title: 'Account deleted', status: 'success' });
            logout();
        } catch (error) {
            toast({ title: 'Delete failed', status: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Personal Info */}
            <Box as="form" onSubmit={handleProfileUpdate}>
                <Heading size="md" mb={4}>Personal Information</Heading>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mb={4}>
                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                    </FormControl>
                    <FormControl gridColumn={{ md: 'span 2' }}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={formData.email} isReadOnly variant="filled" />
                    </FormControl>
                </Grid>
                <Button type="submit" colorScheme="brand" isLoading={isLoading}>Save Changes</Button>
            </Box>

            <Divider />

            {/* Password Change */}
            <Box as="form" onSubmit={handlePasswordUpdate}>
                <Heading size="md" mb={4}>Change Password</Heading>
                <VStack spacing={4} align="start">
                    <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" value={passwordData.password} onChange={e => setPasswordData({ ...passwordData, password: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                    </FormControl>
                    <Button type="submit" variant="outline" colorScheme="brand" isLoading={isLoading}>Update Password</Button>
                </VStack>
            </Box>

            <Divider />

            {/* Danger Zone */}
            <Box>
                <Heading size="md" mb={4} color="red.500">Danger Zone</Heading>
                <Text color="gray.500" mb={4}>Once you delete your account, there is no going back. Please be certain.</Text>
                <Button colorScheme="red" leftIcon={<FiTrash2 />} onClick={onOpen}>Delete Account</Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Account?</ModalHeader>
                        <ModalBody>
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                This action cannot be undone. All your data including order history will be permanently removed.
                            </Alert>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleDeleteAccount} isLoading={isLoading}>Delete Permanently</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </VStack>
    );
};
