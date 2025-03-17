import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { useGetOrdersQuery } from '@nx-react-python/orders';
import { OrderStatus } from '@nx-react-python/shared';
import { Link } from 'react-router-dom';

export default function OrdersList() {
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  const getStatusDot = (status: string) => (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: status === OrderStatus.Complete ? 'green' : 'red',
        display: 'inline-block',
        marginRight: 1,
      }}
    />
  );

  return (
    <Container sx={{ maxWidth: '600px', marginTop: '20px' }}>
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          p: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              My Orders
            </Typography>
          </Box>

          {/* Loading / Error Handling */}
          {isLoading && (
            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
          )}
          {error && <Alert severity="error">Failed to load orders</Alert>}

          <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {orders?.map((order) => (
              <Box key={order.id} sx={{ mb: 2 }}>
                {order.items.map((item) => (
                  <ListItem
                    key={item.stock.symbol}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #eee',
                      py: 2,
                      '&:last-child': { borderBottom: 'none' },
                    }}
                    component={Link}
                    to={`/stocks/${item.stock.symbol}`}
                  >
                    {/* Stock Symbol & Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.stock.logo_url}
                          alt={item.stock.symbol}
                          sx={{ width: 40, height: 40, borderRadius: '8px' }}
                        />
                      </ListItemAvatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.stock.symbol}{' '}
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            (#{order.id})
                          </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} shares at{' '}
                          {item.status === 'complete'
                            ? item.executed_price
                              ? item.executed_price.formatted
                              : 'Market Price'
                            : item.limit_price
                            ? item.limit_price.formatted
                            : 'Pending Execution'}{' '}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Order Type & Status */}
                    <Box
                      sx={{
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {getStatusDot(item.status)}
                    </Box>
                  </ListItem>
                ))}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
