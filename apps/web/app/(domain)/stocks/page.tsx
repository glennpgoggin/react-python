'use client';

import Link from 'next/link';
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
import { useGetStocksQuery } from '@nx-react-python/stocks';

export default function StocksList() {
  const { data: stocks, error, isLoading } = useGetStocksQuery();

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
              Recommended Stocks
            </Typography>
          </Box>

          {/* Loading / Error Handling */}
          {isLoading && (
            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
          )}
          {error && <Alert severity="error">Failed to load stocks</Alert>}

          <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stocks?.map((stock) => (
              <Link key={stock.id} href={`/stocks/${stock.symbol}`} passHref>
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #eee',
                    py: 2,
                    '&:last-child': { borderBottom: 'none' },
                    cursor: 'pointer',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={stock.logo_url}
                        alt={stock.name}
                        sx={{ width: 40, height: 40, borderRadius: '8px' }}
                      />
                    </ListItemAvatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {stock.symbol}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stock.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" fontWeight="bold">
                      {stock.price.formatted}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          stock.price.amount_in_cents > 0 ? 'green' : 'red',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        gap: 0.5,
                      }}
                    >
                      {stock.price.amount_in_cents > 0 ? '▲' : '▼'}{' '}
                      {((stock.price.amount_in_cents / 10000) * 2).toFixed(2)}%
                    </Typography>
                  </Box>
                </ListItem>
              </Link>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
