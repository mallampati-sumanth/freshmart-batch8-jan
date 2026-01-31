import {
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Link,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiSettings,
    FiMenu,
    FiGrid,
    FiUser,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../common/Navbar';

const HEADER_HEIGHT = 20;

const LinkItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
    { name: 'Products', icon: FiGrid, path: '/admin/products' },
    { name: 'Customers', icon: FiUser, path: '/admin/customers' },
    { name: 'Analytics', icon: FiTrendingUp, path: '/admin/analytics' },
    { name: 'Orders', icon: FiCompass, path: '/admin/orders' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

export default function Sidebar({ children, title }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState === 'true';
    });

    // Persist state change
    const toggleCollapsed = (newState) => {
        setCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState);
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            {/* Main Navbar */}
            <Navbar />

            <SidebarContent
                onClose={() => onClose}
                collapsed={collapsed}
                setCollapsed={toggleCollapsed}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} collapsed={false} />
                </DrawerContent>
            </Drawer>
            {/* Mobile Nav - REMOVED per request */}
            {/* <MobileNav onOpen={onOpen} collapsed={collapsed} title={title} /> */}

            <Box ml={{ base: 0, md: collapsed ? 20 : 60 }} transition="all 0.3s" p="4" mt="70px">
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({ onClose, collapsed, setCollapsed, ...rest }) => {
    return (
        <Box
            transition="all 0.3s"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: collapsed ? 20 : 60 }}
            pos="fixed"
            top="70px"
            h="calc(100vh - 70px)"
            {...rest}>
            <Flex h="20" alignItems="center" mx={collapsed ? 2 : 8} justifyContent="space-between">
                {!collapsed && (
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                        FreshAdmin
                    </Text>
                )}
                {collapsed && (
                    <Text fontSize="xl" fontFamily="monospace" fontWeight="bold" textAlign="center" w="full">
                        FA
                    </Text>
                )}

                {/* Collapse Toggle for Desktop */}
                <IconButton
                    display={{ base: 'none', md: 'flex' }}
                    aria-label="Toggle Sidebar"
                    icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}
                />

                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>

            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} path={link.path} collapsed={collapsed}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, path, collapsed, ...rest }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Tooltip label={collapsed ? children : ''} placement="right" hasArrow>
            <Link as={RouterLink} to={path} style={{ textDecoration: 'none' }}>
                <Flex
                    align="center"
                    p="2"
                    mx="2"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    bg={isActive ? 'brand.500' : 'transparent'}
                    color={isActive ? 'white' : 'inherit'}
                    _hover={{
                        bg: 'brand.400',
                        color: 'white',
                    }}
                    justify={collapsed ? 'center' : 'flex-start'}
                    {...rest}>
                    {icon && (
                        <Icon
                            mr={collapsed ? 0 : 4}
                            fontSize="16"
                            _groupHover={{
                                color: 'white',
                            }}
                            as={icon}
                        />
                    )}
                    {!collapsed && children}
                </Flex>
            </Link>
        </Tooltip>
    );
};
