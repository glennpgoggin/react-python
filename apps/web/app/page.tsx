'use client';

import {
  List,
  ListItem,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';

import { useGetStocksQuery } from '@nx-react-python/stocks';

export default function HomePage() {
  // const dispatch = useDispatch();

  const { data: stocks, error, isLoading } = useGetStocksQuery();
  console.log(stocks);

  return (
    <Container>
      <Typography variant="h4">Stock Market</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load stocks</Alert>}
      <List>
        {/* {stocks.map((stock) => (
          <ListItem key={stock.id}>
            <Typography>
              {stock.name} ({stock.symbol}) - ${stock.price.toFixed(2)}
            </Typography>
          </ListItem>
        ))} */}
      </List>
    </Container>
  );
}
