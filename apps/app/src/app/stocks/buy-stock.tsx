import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetStockBySymbolQuery,
  useGetNBBOPriceQuery,
  useBuyStockMutation,
  BuyStockPayload,
  OrderType,
} from '@nx-react-python/stocks';
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

  const [buyStock, { isLoading: isBuying }] = useBuyStockMutation();

  const [livePrice, setLivePrice] = useState<{
    bid: number;
    ask: number;
  } | null>(null);

  useEffect(() => {
    if (!stock) return;

    const ws = new WebSocket(`wss://marketdata.example.com/${stock.symbol}`);

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

  const bestBid = livePrice?.bid || nbboPrice?.bid || stock?.price || 0;
  const bestAsk = livePrice?.ask || nbboPrice?.ask || stock?.price || 0;
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Market);
  const [limitPrice, setLimitPrice] = useState<number>(bestAsk);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      const payload: BuyStockPayload = {
        symbol: stock?.symbol || '',
        quantity,
        order_type: orderType,
        price: orderType === 'limit' ? limitPrice : bestAsk,
      };
      await buyStock({ payload }).unwrap();

      setConfirmOpen(false);
      alert(`Successfully bought ${quantity} shares of ${stock?.symbol}!`);
      navigate(`/stock/${symbol}`);
    } catch (error) {
      console.error('Buy Error:', error);
      alert('Error buying stock. Please try again.');
    }
  };

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
            Best Bid: ${bestBid.toFixed(2)}
          </Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}
          >
            Best Ask: ${bestAsk.toFixed(2)}
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
          {orderType === 'limit' && (
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
            Total: $
            {(
              quantity * (orderType === 'limit' ? limitPrice : bestAsk)
            ).toFixed(2)}
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
            <b>${(orderType === 'limit' ? limitPrice : bestAsk).toFixed(2)}</b>{' '}
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
