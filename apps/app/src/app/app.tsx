// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Stocks from './stocks/stocks';
import Orders from './orders/orders';
import NavBar from './layout/navbar';

export function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/stocks/*" element={<Stocks />} />
        <Route path="/orders/*" element={<Orders />} />
        <Route path="*" element={<Navigate to="/stocks" />} /> {}
      </Routes>
    </div>
  );
}

export default App;
