'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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

export default function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol;
  const { data: stock, error, isLoading } = useGetStockBySymbolQuery(symbol);

  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { time: string; price: number }[]
  >([]);

  // Generate Fake Historical Data for Chart
  const generateHistoricalData = (basePrice: number) => {
    const now = new Date();
    return Array.from({ length: 48 }).map((_, index) => {
      const pastTime = new Date(now.getTime() - (48 - index) * 5 * 60 * 1000); // Every 5 min
      const fluctuation = basePrice * (Math.random() * 0.1 - 0.15);
      return {
        time: pastTime.toLocaleTimeString(),
        price: Math.max(1, basePrice + fluctuation),
      };
    });
  };

  // Set Initial Price Data
  useEffect(() => {
    if (stock?.price?.amount_in_cents !== undefined) {
      const basePrice = stock.price.amount_in_cents / 100;
      setPriceHistory(generateHistoricalData(basePrice));
      setLivePrice(basePrice);
    }
  }, [stock]);

  // WebSocket for Live Price Updates
  useEffect(() => {
    if (!symbol) return;

    const ws = new WebSocket(`ws://localhost:8000/stocks/${symbol}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price?.amount_in_cents !== undefined) {
        const newPrice = data.price.amount_in_cents / 100;
        const newPoint = {
          time: new Date(data.price_last_updated_at).toLocaleTimeString(),
          price: newPrice,
        };
        setLivePrice(newPrice);

        setPriceHistory((prev) => {
          // Keep last 50 data points & add new one
          return [...prev.slice(-49), newPoint];
        });
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
              <Link href={`/stocks/${symbol}/buy`} passHref>
                <Button
                  sx={{
                    backgroundColor: 'green',
                    '&:hover': { backgroundColor: 'darkgreen' },
                  }}
                >
                  Buy
                </Button>
              </Link>
              <Link href={`/stocks/${symbol}/sell`} passHref>
                <Button
                  sx={{
                    backgroundColor: 'red',
                    '&:hover': { backgroundColor: 'darkred' },
                  }}
                >
                  Sell
                </Button>
              </Link>
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
}
