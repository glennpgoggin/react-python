import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetStockBySymbolQuery,
  useGetNBBOPriceQuery,
} from '@nx-react-python/stocks';
import {
  useCreateOrderMutation,
  CreateOrderPayload,
} from '@nx-react-python/orders';
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
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { OrderType } from '@nx-react-python/shared';

const BuyStock: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const {
    data: stock,
    error,
    isLoading,
  } = useGetStockBySymbolQuery(symbol ?? '');
  const { data: nbboPrice, refetch } = useGetNBBOPriceQuery(symbol ?? '', {
    skip: !stock,
    pollingInterval: 2000, // Polling every 2s as a fallback
  });

  const [createOrder, { isLoading: isBuying }] = useCreateOrderMutation();

  const [livePrice, setLivePrice] = useState<{
    bid: number;
    ask: number;
  } | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Market);
  const [limitPrice, setLimitPrice] = useState<number>(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const getSafePrice = (priceInCents?: number) =>
    priceInCents !== undefined ? priceInCents / 100 : 0;

  useEffect(() => {
    if (!stock) return;

    const ws = new WebSocket(`ws://localhost:8000/stocks/${symbol}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.bid && data.ask) {
          setLivePrice({ bid: data.bid, ask: data.ask });
        }
      } catch (error) {
        console.error('WebSocket Data Error:', error);
      }
    };

    ws.onerror = (error) => console.error('WebSocket Error:', error);

    ws.onclose = () => {
      console.warn('WebSocket Disconnected. Retrying in 5s...');
      setTimeout(() => {
        refetch(); // Fallback to polling
      }, 5000);
    };

    return () => ws.close(); // Cleanup WebSocket on component unmount
  }, [stock, refetch]);

  const bestBid =
    livePrice?.bid ??
    nbboPrice?.bid ??
    getSafePrice(stock?.price?.amount_in_cents);
  const bestAsk =
    livePrice?.ask ??
    nbboPrice?.ask ??
    getSafePrice(stock?.price?.amount_in_cents);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1)); // Prevents invalid values
  };

  const handleOrderTypeChange = (event: any) => {
    const newOrderType = event.target.value as OrderType;
    setOrderType(newOrderType);

    // Set default limit price when switching to limit order
    if (newOrderType === OrderType.Limit) {
      setLimitPrice(bestAsk);
    }
  };

  const handleConfirmBuy = () => setConfirmOpen(true);
  const handleCancelBuy = () => setConfirmOpen(false);

  const handleBuy = async () => {
    try {
      const payload: CreateOrderPayload = {
        user_id: 1,
        items: [
          {
            stock_symbol: stock?.symbol || '',
            quantity,
            order_type: orderType,
            limit_price_in_cents:
              orderType === OrderType.Limit
                ? Math.round(limitPrice * 100)
                : undefined,
          },
        ],
      };

      await createOrder({ payload }).unwrap();
      setConfirmOpen(false);
      alert(`Successfully bought ${quantity} shares of ${stock?.symbol}!`);
      navigate(`/orders`);
    } catch (error) {
      console.error('Buy Error:', error);
      alert('Error buying stock. Please try again.');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);

  if (!symbol) return <Alert severity="error">Invalid stock selection.</Alert>;
  if (isLoading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error)
    return <Alert severity="error">Error loading stock details.</Alert>;

  return (
    <Container sx={{ maxWidth: '600px', marginTop: 4 }}>
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
                Buy {stock?.name} ({stock?.symbol})
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* NBBO Prices */}
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Best Bid: {formatCurrency(bestBid)}
          </Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}
          >
            Best Ask: {formatCurrency(bestAsk)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Order Type Toggle */}
          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={handleOrderTypeChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="market">Market Order</ToggleButton>
            <ToggleButton value="limit">Limit Order</ToggleButton>
          </ToggleButtonGroup>

          {/* Quantity Input */}
          <TextField
            type="number"
            label="Shares to Buy"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Limit Price Input (Only for Limit Orders) */}
          {orderType === OrderType.Limit && (
            <TextField
              type="number"
              label="Limit Price"
              value={limitPrice}
              onChange={(e) =>
                setLimitPrice(parseFloat(e.target.value) || bestAsk)
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          )}

          {/* Total Calculation */}
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
            Total:{' '}
            {formatCurrency(
              quantity * (orderType === OrderType.Limit ? limitPrice : bestAsk)
            )}
          </Typography>

          {/* Buy Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            disabled={isBuying || quantity < 1}
            onClick={handleConfirmBuy}
          >
            {isBuying ? 'Processing...' : `Buy ${quantity} Shares`}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancelBuy}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to buy <b>{quantity} shares</b> of{' '}
            <b>{stock?.symbol}</b> at{' '}
            <b>
              {formatCurrency(orderType === 'limit' ? limitPrice : bestAsk)}
            </b>{' '}
            per share?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelBuy} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBuy} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BuyStock;
