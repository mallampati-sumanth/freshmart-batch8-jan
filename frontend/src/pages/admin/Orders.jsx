import {
    Box, Table, Thead, Tbody, Tr, Th, Td,
    Heading, useColorModeValue, Center, Spinner, Select, useToast
} from '@chakra-ui/react';
import Sidebar from '../../components/admin/Sidebar';
import { adminFetchOrders, updateOrderStatus } from '../../api/admin';
import { useEffect, useState } from 'react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const bg = useColorModeValue('white', 'gray.800');
    const toast = useToast();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await adminFetchOrders();
            setOrders(data.results || []);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            toast({ title: 'Status updated', status: 'success' });
            loadOrders();
        } catch (error) {
            toast({ title: 'Failed to update', status: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'green';
            case 'pending': return 'yellow';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Sidebar>
            <Box bg={bg} p={8} rounded="xl" shadow="sm">
                <Heading size="lg" mb={6}>Orders</Heading>

                {loading ? (
                    <Center py={10}><Spinner /></Center>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Order ID</Th>
                                    <Th>Customer</Th>
                                    <Th>Items</Th>
                                    <Th>Total</Th>
                                    <Th>Date</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orders.map(order => (
                                    <Tr key={order.id}>
                                        <Td>#{order.id}</Td>
                                        <Td fontWeight="bold">{order.customer_name}</Td>
                                        <Td>{order.items?.length || 0} items</Td>
                                        <Td fontWeight="bold">${order.total_amount}</Td>
                                        <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                                        <Td>
                                            <Select
                                                size="sm"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                borderColor={getStatusColor(order.status) + '.300'}
                                                fontWeight="bold"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </Select>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Box>
        </Sidebar>
    );
}
