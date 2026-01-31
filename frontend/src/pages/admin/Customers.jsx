import {
    Box, Table, Thead, Tbody, Tr, Th, Td, Badge,
    Heading, useColorModeValue, Center, Spinner,
    Menu, MenuButton, MenuList, MenuItem, IconButton,
    useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalFooter, Button,
    FormControl, FormLabel, Select, useToast, AlertDialog,
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
    AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import Sidebar from '../../components/admin/Sidebar';
import { adminFetchCustomers, updateCustomer, deleteCustomer } from '../../api/admin';
import { useEffect, useState, useRef } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const bg = useColorModeValue('white', 'gray.800');
    const toast = useToast();

    // Edit Modal State
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [roleToUpdate, setRoleToUpdate] = useState('');
    const [updating, setUpdating] = useState(false);

    // Delete Alert State
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef();
    const [customerToDelete, setCustomerToDelete] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await adminFetchCustomers();
            setCustomers(data.results || []);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setRoleToUpdate(customer.role || 'customer');
        onEditOpen();
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await updateCustomer(selectedCustomer.id, { role: roleToUpdate });
            toast({ title: 'Customer updated', status: 'success' });
            loadCustomers();
            onEditClose();
        } catch (error) {
            toast({ title: 'Update failed', description: error.response?.data?.detail || 'Error', status: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        onDeleteOpen();
    };

    const handleDelete = async () => {
        try {
            await deleteCustomer(customerToDelete.id);
            toast({ title: 'Customer deleted', status: 'success' });
            loadCustomers();
            onDeleteClose();
        } catch (error) {
            toast({ title: 'Delete failed', description: error.response?.data?.detail || 'Error', status: 'error' });
        }
    };

    return (
        <Sidebar>
            <Box bg={bg} p={8} rounded="xl" shadow="sm">
                <Heading size="lg" mb={6}>Customers</Heading>

                {loading ? (
                    <Center py={10}><Spinner /></Center>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>User</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Joined</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {customers.map(c => (
                                    <Tr key={c.id}>
                                        <Td>#{c.id}</Td>
                                        <Td fontWeight="bold">{c.username}</Td>
                                        <Td>{c.email}</Td>
                                        <Td>
                                            <Badge
                                                colorScheme={c.role === 'admin' ? 'purple' : 'green'}
                                                variant="subtle"
                                                rounded="full"
                                                px={2}
                                            >
                                                {c.role || 'customer'}
                                            </Badge>
                                        </Td>
                                        <Td>{new Date(c.date_joined).toLocaleDateString()}</Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" size="sm" />
                                                <MenuList>
                                                    <MenuItem icon={<FiEdit2 />} onClick={() => handleEditClick(c)}>
                                                        Edit Role
                                                    </MenuItem>
                                                    <MenuItem icon={<FiTrash2 />} onClick={() => handleDeleteClick(c)} color="red.500">
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Box>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Customer</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Role</FormLabel>
                            <Select value={roleToUpdate} onChange={(e) => setRoleToUpdate(e.target.value)}>
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </Select>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onEditClose}>Cancel</Button>
                        <Button colorScheme="brand" onClick={handleUpdate} isLoading={updating}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Alert */}
            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Customer
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Sidebar>
    );
}
