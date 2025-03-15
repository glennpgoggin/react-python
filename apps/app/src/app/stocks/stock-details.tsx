import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetStockBySymbolQuery } from '@nx-react-python/stocks';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StockDetails: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const {
    data: stock,
    error,
    isLoading,
  } = useGetStockBySymbolQuery(symbol ?? '');

  // ✅ Live price updates (Simulated WebSocket for now)
  const [livePrice, setLivePrice] = useState<number | null>(null);
  useEffect(() => {
    if (stock) {
      setLivePrice(stock.price);
      const interval = setInterval(() => {
        setLivePrice((prev) => prev && prev + (Math.random() - 0.5) * 2); // Simulated small price changes
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [stock]);

  // ✅ Timeframe state for the chart
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>(
    'today'
  );

  // ✅ Mock historical price data for different timeframes
  const generateMockChartData = (days: number) =>
    stock
      ? Array.from({ length: days }).map((_, i) => ({
          time: days === 24 ? `${i + 1}h` : `${i + 1}d`,
          price:
            stock.price -
            i * (stock.price * 0.01) +
            Math.random() * (stock.price * 0.01),
        }))
      : [];

  const chartData =
    timeframe === 'today'
      ? generateMockChartData(24) // 24 hours (hourly prices)
      : timeframe === 'week'
      ? generateMockChartData(7) // 7 days (daily prices)
      : generateMockChartData(30); // 30 days (daily prices)

  if (!symbol) return <Alert severity="error">Invalid stock selection.</Alert>;
  if (isLoading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error)
    return <Alert severity="error">Error loading stock details.</Alert>;

  return (
    <Container sx={{ maxWidth: '700px', marginTop: 4 }}>
      <Card sx={{ borderRadius: '16px', p: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={stock?.logo_url}
              alt={stock?.name}
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {stock?.name} ({stock?.symbol})
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}
          >
            ${livePrice?.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'gray' }}
          >
            Live Price (Updated every 5s)
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Buy & Sell Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ButtonGroup variant="contained">
              <Button
                component={Link}
                to={`/stocks/${symbol}/buy`}
                sx={{
                  backgroundColor: 'green',
                  '&:hover': { backgroundColor: 'darkgreen' },
                }}
              >
                Buy
              </Button>
              <Button
                component={Link}
                to={`/stocks/${symbol}/sell`}
                sx={{
                  backgroundColor: 'red',
                  '&:hover': { backgroundColor: 'darkred' },
                }}
              >
                Sell
              </Button>
            </ButtonGroup>
          </Box>

          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={(_, newTimeframe) =>
              newTimeframe && setTimeframe(newTimeframe)
            }
            sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="week">1 Week</ToggleButton>
            <ToggleButton value="month">1 Month</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Price History ({timeframe === 'today' ? 'Hourly' : 'Daily'})
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1976d2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StockDetails;
