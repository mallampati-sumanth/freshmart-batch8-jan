import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Image,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    NumberInput,
    NumberInputField,
    useToast,
    HStack,
    Switch,
    AspectRatio,
    VStack,
    Text,
    Tag,
    Divider,
    SimpleGrid,
} from '@chakra-ui/react';
import Sidebar from '../../components/admin/Sidebar';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiMapPin, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin';
import { fetchCategories, fetchBrands } from '../../api/products';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axios';

export default function AdminProducts() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: () => adminFetchProducts(1),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['adminProducts']);
            toast({ title: 'Product deleted', status: 'success' });
        },
    });

    const handleEdit = (product) => {
        setEditingProduct(product);
        onOpen();
    };

    const handleAdd = () => {
        setEditingProduct(null);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleViewDetails = async (product) => {
        setViewingProduct(product);
        // Load recommendations
        try {
            const { data } = await api.get(`/products/${product.id}/frequently_bought_together/`);
            setRecommendations(data.products || []);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            setRecommendations([]);
        }
        onDetailsOpen();
    };

    return (
        <Sidebar>
            <Box p={4} bg="white" minH="85vh" borderRadius="xl" shadow="sm">
                <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="md">Product Management</Heading>
                    <Button leftIcon={<FiPlus />} colorScheme="brand" onClick={handleAdd}>
                        Add Product
                    </Button>
                </Flex>

                {isLoading ? (
                    <Box>Loading...</Box>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Image</Th>
                                    <Th>Name</Th>
                                    <Th>Category</Th>
                                    <Th>Price</Th>
                                    <Th>Stock</Th>
                                    <Th>Location</Th>
                                    <Th>Rating</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {productsData?.results?.map((product) => (
                                    <Tr key={product.id}>
                                        <Td>
                                            <Image
                                                src={product.image || 'https://via.placeholder.com/50'}
                                                boxSize="50px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                        </Td>
                                        <Td fontWeight="bold">{product.name}</Td>
                                        <Td>{product.category_name}</Td>
                                        <Td>${product.price}</Td>
                                        <Td>{product.stock_quantity}</Td>
                                        <Td>
                                            {product.aisle_location ? (
                                                <Tag size="sm" colorScheme="blue" leftIcon={<FiMapPin />}>
                                                    {product.aisle_location}
                                                </Tag>
                                            ) : (
                                                <Text fontSize="xs" color="gray.500">N/A</Text>
                                            )}
                                        </Td>
                                        <Td>
                                            {product.average_rating > 0 ? (
                                                <HStack spacing={1}>
                                                    <FiStar fill="gold" color="gold" />
                                                    <Text fontWeight="bold">{product.average_rating.toFixed(1)}</Text>
                                                </HStack>
                                            ) : (
                                                <Text fontSize="xs" color="gray.500">No reviews</Text>
                                            )}
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={product.is_active ? 'green' : 'red'}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    icon={<FiEye />}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    onClick={() => handleViewDetails(product)}
                                                    title="View details"
                                                />
                                                <IconButton
                                                    icon={<FiEdit2 />}
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                />
                                                <IconButton
                                                    icon={<FiTrash2 />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => handleDelete(product.id)}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Box>

            {/* Product Modal */}
            <ProductModal
                isOpen={isOpen}
                onClose={onClose}
                initialData={editingProduct}
            />

            {/* Product Details Modal */}
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="3xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <VStack align="start" spacing={2}>
                            <Text fontSize="2xl">{viewingProduct?.name}</Text>
                            <HStack>
                                {viewingProduct?.aisle_location && (
                                    <Badge colorScheme="blue" fontSize="md" p={2}>
                                        <HStack>
                                            <FiMapPin />
                                            <Text>Aisle {viewingProduct.aisle_location}</Text>
                                        </HStack>
                                    </Badge>
                                )}
                                {viewingProduct?.average_rating > 0 && (
                                    <Badge colorScheme="yellow" fontSize="md" p={2}>
                                        <HStack>
                                            <FiStar fill="gold" />
                                            <Text>{viewingProduct.average_rating.toFixed(1)} Stars</Text>
                                        </HStack>
                                    </Badge>
                                )}
                                <Badge colorScheme="green" fontSize="md" p={2}>
                                    ${viewingProduct?.price}
                                </Badge>
                                <Badge colorScheme="purple" fontSize="md" p={2}>
                                    Stock: {viewingProduct?.stock_quantity}
                                </Badge>
                            </HStack>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack align="stretch" spacing={4}>
                            <Box>
                                <Text fontWeight="bold" mb={2}>Description:</Text>
                                <Text color="gray.600">{viewingProduct?.description}</Text>
                            </Box>

                            {recommendations.length > 0 && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Heading size="sm" mb={3} color="brand.500">
                                            <HStack>
                                                <FiShoppingCart />
                                                <Text>Frequently Bought Together</Text>
                                            </HStack>
                                        </Heading>
                                        <SimpleGrid columns={3} spacing={3}>
                                            {recommendations.map(product => (
                                                <Box
                                                    key={product.id}
                                                    borderWidth="1px"
                                                    rounded="lg"
                                                    overflow="hidden"
                                                    _hover={{ shadow: 'md' }}
                                                >
                                                    <Box h="100px" bg="gray.50">
                                                        <Image 
                                                            src={product.image || product.image_url} 
                                                            w="full" 
                                                            h="full" 
                                                            objectFit="contain" 
                                                        />
                                                    </Box>
                                                    <Box p={2}>
                                                        <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                                                            {product.name}
                                                        </Text>
                                                        <HStack justify="space-between" mt={1}>
                                                            <Text color="brand.500" fontWeight="bold" fontSize="sm">
                                                                ${product.price}
                                                            </Text>
                                                            {product.aisle_location && (
                                                                <Tag size="sm" colorScheme="blue">
                                                                    {product.aisle_location}
                                                                </Tag>
                                                            )}
                                                        </HStack>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                </>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Sidebar>
    );
}

const ProductModal = ({ isOpen, onClose, initialData }) => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const isEdit = !!initialData;

    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
    const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || '',
            stock_quantity: initialData?.stock_quantity || 0,
            category: initialData?.category || '',
            brand: initialData?.brand || '',
            is_active: initialData?.is_active ?? true,
            image: null,
            image_url: initialData?.image_url || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            price: Yup.number().required('Required'),
            category: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                // If edit, use updateProduct, else createProduct
                // Handle category/brand IDs
                const payload = {
                    ...values,
                    // If image is null, don't send it unless cleanup logic exists but our api handles it
                };

                if (isEdit) {
                    await updateProduct(initialData.id, payload);
                    toast({ title: 'Product updated', status: 'success' });
                } else {
                    await createProduct(payload);
                    toast({ title: 'Product created', status: 'success' });
                }
                queryClient.invalidateQueries(['adminProducts']);
                onClose();
                formik.resetForm();
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to save product', status: 'error' });
            }
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEdit ? 'Edit Product' : 'Add Product'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
                            <FormControl isInvalid={formik.touched.name && formik.errors.name} gridColumn="span 2">
                                <FormLabel>Product Name</FormLabel>
                                <Input {...formik.getFieldProps('name')} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Price</FormLabel>
                                <NumberInput min={0}>
                                    <NumberInputField {...formik.getFieldProps('price')} />
                                </NumberInput>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Stock</FormLabel>
                                <NumberInput min={0}>
                                    <NumberInputField {...formik.getFieldProps('stock_quantity')} />
                                </NumberInput>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Category</FormLabel>
                                <Select {...formik.getFieldProps('category')} placeholder="Select category">
                                    {categories?.results?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    )) || categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Brand</FormLabel>
                                <Select {...formik.getFieldProps('brand')} placeholder="Select brand">
                                    {brands?.results?.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    )) || brands?.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl gridColumn="span 2">
                                <FormLabel>Description</FormLabel>
                                <Textarea {...formik.getFieldProps('description')} />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Active?</FormLabel>
                                <Switch isChecked={formik.values.is_active} onChange={formik.handleChange} name="is_active" />
                            </FormControl>
                        </Box>

                        <Button mt={4} colorScheme="brand" type="submit" w="full" isLoading={formik.isSubmitting}>
                            Save Product
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
