import { Box, SimpleGrid, Heading, useColorModeValue, Container, Select, Flex, Center, Spinner } from '@chakra-ui/react';
import Sidebar from '../../components/admin/Sidebar';
import Chart from 'react-apexcharts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../api/admin';

export default function Analytics() {
    const bg = useColorModeValue('white', 'gray.800');
    const [timeRange, setTimeRange] = useState('week');

    const { data: stats, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: fetchAdminStats,
    });

    if (isLoading || !stats) {
        return (
            <Sidebar>
                <Center h="50vh">
                    <Spinner size="xl" />
                </Center>
            </Sidebar>
        )
    }

    const revenueOptions = {
        chart: { type: 'area', toolbar: { show: false } },
        colors: ['#38A169'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: { categories: stats.revenue_trend.categories },
        tooltip: { y: { formatter: (val) => `$${val}` } }
    };

    const revenueSeries = [{ name: 'Revenue', data: stats.revenue_trend.revenue }];

    const categoryOptions = {
        chart: { type: 'donut' },
        labels: stats.category_distribution.labels,
        colors: ['#48BB78', '#F6E05E', '#4299E1', '#ED8936', '#9F7AEA'],
        responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }]
    };

    const categorySeries = stats.category_distribution.series;

    const ordersOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        colors: ['#3182CE'],
        plotOptions: { bar: { borderRadius: 4, horizontal: false } },
        dataLabels: { enabled: false },
        xaxis: { categories: stats.orders_trend.categories }
    };

    const ordersSeries = [{ name: 'Orders', data: stats.orders_trend.orders }];

    const growthOptions = {
        chart: { type: 'line', toolbar: { show: false } },
        colors: ['#805AD5'],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: stats.customer_growth.months }
    };

    const growthSeries = [{ name: 'New Customers', data: stats.customer_growth.counts }];

    return (
        <Sidebar>
            <Container maxW="container.xl" p={0}>
                <Flex justify="space-between" mb={6} align="center">
                    <Heading size="lg">Analytics</Heading>
                    <Select w="200px" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </Select>
                </Flex>

                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
                    {/* Revenue Chart */}
                    <Box bg={bg} p={6} rounded="xl" shadow="sm">
                        <Heading size="md" mb={4}>Revenue Trend</Heading>
                        <Chart options={revenueOptions} series={revenueSeries} type="area" height={350} />
                    </Box>

                    {/* Orders Chart */}
                    <Box bg={bg} p={6} rounded="xl" shadow="sm">
                        <Heading size="md" mb={4}>Orders Overview</Heading>
                        <Chart options={ordersOptions} series={ordersSeries} type="bar" height={350} />
                    </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                    {/* Category Distribution */}
                    <Box bg={bg} p={6} rounded="xl" shadow="sm" gridColumn={{ lg: 'span 1' }}>
                        <Heading size="md" mb={4}>Sales by Category</Heading>
                        {categorySeries.length > 0 ? (
                            <Chart options={categoryOptions} series={categorySeries} type="donut" height={350} />
                        ) : (
                            <Center h="300px">No data available</Center>
                        )}
                    </Box>

                    {/* Top Products (Placeholder for Table or another Chart) */}
                    <Box bg={bg} p={6} rounded="xl" shadow="sm" gridColumn={{ lg: 'span 2' }}>
                        <Heading size="md" mb={4}>Customer Growth</Heading>
                        <Chart
                            options={growthOptions}
                            series={growthSeries}
                            type="line"
                            height={350}
                        />
                    </Box>
                </SimpleGrid>
            </Container>
        </Sidebar>
    );
}
