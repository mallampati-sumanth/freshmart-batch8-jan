import {
    Box,
    SimpleGrid,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    useColorModeValue,
    Flex,
    Icon,
} from '@chakra-ui/react';
import Sidebar from '../../components/admin/Sidebar';
import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../api/admin';

export default function AdminDashboard() {
    const { data: stats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: fetchAdminStats,
    });

    return (
        <Sidebar>
            <Box p={4}>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
                    <StatsCard
                        title={'Users'}
                        stat={stats?.customers_count || 0}
                        icon={<FiUsers size={'3em'} />}
                    />
                    <StatsCard
                        title={'Products'}
                        stat={stats?.products_count || 0}
                        icon={<FiShoppingBag size={'3em'} />}
                    />
                    <StatsCard
                        title={'Total Revenue'}
                        stat={stats?.revenue ? `$${parseFloat(stats.revenue).toLocaleString()}` : '$0.00'}
                        icon={<FiDollarSign size={'3em'} />}
                    />
                    <StatsCard
                        title={'Server'}
                        stat={'Healthy'}
                        icon={<FiActivity size={'3em'} />}
                    />
                </SimpleGrid>
            </Box>
        </Sidebar>
    );
}

function StatsCard(props) {
    const { title, stat, icon } = props;
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.200', 'gray.500')}
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}>
            <Flex justifyContent={'space-between'}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={'medium'} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'bold'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}
