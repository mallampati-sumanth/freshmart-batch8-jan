import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Box, Spinner } from '@chakra-ui/react';

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    // Check if user is logged in AND is staff
    if (!user || !user.is_staff) {
        return <Navigate to="/" replace />;
    }

    return children;
}
