import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons';
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MotionBox = motion(Box);

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const isLoggedIn = !!user;
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  // All useColorModeValue calls at the top level
  const textColor = useColorModeValue('gray.800', 'white');
  const bgLight = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)');
  const bgLightScrolled = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderBottomColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200');
  const borderColor = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200');
  const menuBg = useColorModeValue('white', 'gray.800');
  const menuBorderColor = useColorModeValue('gray.200', 'gray.700');
  const logoGradient = useColorModeValue(
    'linear(to-r, green.400, green.600)',
    'linear(to-r, green.200, green.400)'
  );

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cart?.items?.length || 0;

  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={1000} px={{ base: 2, md: 4 }}>
      <MotionBox
        initial={false}
        animate={{
          marginTop: isScrolled ? 16 : 0,
          marginLeft: isScrolled ? 24 : 0,
          marginRight: isScrolled ? 24 : 0,
          borderRadius: isScrolled ? '24px' : '0px',
          boxShadow: isScrolled
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : 'none',
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        bg={isScrolled ? bgLightScrolled : bgLight}
        sx={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        borderBottom={!isScrolled ? '1px solid' : 'none'}
        borderBottomColor={borderBottomColor}
        border={isScrolled ? '1px solid' : 'none'}
        borderColor={borderColor}
      >
        <Flex
          color={textColor}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4, md: 6 }}
          align={'center'}
        >
          {/* Mobile menu toggle */}
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>

          {/* Logo */}
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
            <Text
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight={'bold'}
              bgGradient={logoGradient}
              bgClip="text"
              cursor="pointer"
              onClick={() => navigate('/')}
              _hover={{
                transform: 'scale(1.05)',
              }}
              transition="all 0.3s ease"
            >
              🌿 FreshMart
            </Text>

            {/* Desktop Navigation */}
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          {/* Right side actions */}
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={3}
            align="center"
          >
            {/* Search Icon */}
            <IconButton
              icon={<FiSearch />}
              variant="ghost"
              aria-label="Search"
              display={{ base: 'none', md: 'flex' }}
              _hover={{ bg: hoverBg }}
            />

            {/* Theme Toggle */}
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle Theme"
              _hover={{ bg: hoverBg }}
            />

            {/* Cart */}
            <Box position="relative">
              <IconButton
                icon={<FiShoppingCart />}
                variant="ghost"
                aria-label="Cart"
                onClick={() => navigate('/cart')}
                _hover={{ bg: hoverBg }}
              />
              {cartItemCount > 0 && (
                <Flex
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="red.500"
                  borderRadius="full"
                  w="18px"
                  h="18px"
                  align="center"
                  justify="center"
                >
                  <Text fontSize="xs" color="white" fontWeight="bold">
                    {cartItemCount}
                  </Text>
                </Flex>
              )}
            </Box>

            {/* User Menu or Sign In */}
            {isLoggedIn ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'sm'} name={user?.name || user?.email} />
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  borderColor={menuBorderColor}
                  backdropFilter="blur(10px)"
                >
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/profile')}>My Orders</MenuItem>
                  {(user?.role === 'admin' || user?.is_staff) && (
                    <>
                      <MenuDivider />
                      <MenuItem onClick={() => navigate('/admin/dashboard')}>
                        Admin Dashboard
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={logout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                fontSize={'sm'}
                fontWeight={600}
                colorScheme="green"
                size="sm"
                onClick={() => navigate('/login')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.3s ease"
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Flex>

        {/* Mobile Navigation */}
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </MotionBox>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.700', 'gray.200');
  const linkHoverColor = useColorModeValue('green.600', 'green.300');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();

  return (
    <Stack direction={'row'} spacing={6}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                onClick={() => navItem.href && navigate(navItem.href)}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                cursor="pointer"
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                transition="all 0.3s ease"
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
                backdropFilter="blur(10px)"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const navigate = useNavigate();

  return (
    <Link
      onClick={() => navigate(href)}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      cursor="pointer"
      _hover={{ bg: useColorModeValue('green.50', 'gray.900') }}
      transition="all 0.3s ease"
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'green.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'green.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      backdropFilter="blur(10px)"
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        onClick={() => !children && href && navigate(href)}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                onClick={() => navigate(child.href)}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Shop',
    children: [
      {
        label: 'All Products',
        subLabel: 'Explore our fresh collection',
        href: '/products',
      },
      {
        label: 'Fresh Produce',
        subLabel: 'Farm fresh vegetables and fruits',
        href: '/products?category=produce',
      },
      {
        label: 'Featured',
        subLabel: 'Trending items this week',
        href: '/products?featured=true',
      },
    ],
  },
  {
    label: '🤖 FreshieBot',
    href: '/freshiebot',
  },
  {
    label: 'Kiosk Mode',
    href: '/kiosk-login',
  },
  {
    label: 'About',
    href: '/about',
  },
];