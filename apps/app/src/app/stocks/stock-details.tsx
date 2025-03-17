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

  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { time: string; price: number }[]
  >([]);

  const generateHistoricalData = (basePrice: number) => {
    const now = new Date();
    return Array.from({ length: 48 }).map((_, index) => {
      const pastTime = new Date(now.getTime() - (48 - index) * 5 * 60 * 1000); // Every 5 minutes
      const fluctuation = basePrice * (Math.random() * 0.1 - 0.15);
      return {
        time: pastTime.toLocaleTimeString(),
        price: Math.max(1, basePrice + fluctuation),
      };
    });
  };

  useEffect(() => {
    if (stock?.price?.amount_in_cents !== undefined) {
      const basePrice = stock.price.amount_in_cents / 100;
      setPriceHistory(generateHistoricalData(basePrice));
      setLivePrice(basePrice);
    }
  }, [stock]);

  useEffect(() => {
    if (!symbol) return;

    const ws = new WebSocket(`ws://localhost:8000/stocks/${symbol}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price?.amount_in_cents !== undefined) {
        const newPrice = data.price.amount_in_cents / 100;
        setLivePrice(newPrice);

        setPriceHistory((prev) => [
          ...prev.slice(-50),
          {
            time: new Date(data.price_last_updated_at).toLocaleTimeString(),
            price: newPrice,
          },
        ]);
      }
    };

    ws.onclose = () => {
      console.warn(`WebSocket for ${symbol} closed.`);
    };

    return () => ws.close();
  }, [symbol]);

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
            ${livePrice?.toFixed(2) ?? 'N/A'}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'gray' }}
          >
            Live Price (via WebSocket)
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

          <Typography variant="h6" sx={{ mb: 2 }}>
            Price History (Last 4 Hours + Live Updates)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceHistory}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
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
