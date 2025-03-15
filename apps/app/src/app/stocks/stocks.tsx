import { Routes, Route } from 'react-router-dom';
import StocksList from './stocks-list';
import StockDetails from './stock-details';
import BuyStock from './buy-stock';

export default function Stocks() {
  return (
    <div>
      <Routes>
        <Route path="" element={<StocksList />} />
        <Route path="/:symbol" element={<StockDetails />} /> {}
        <Route path="/:symbol/buy" element={<BuyStock />} /> {}
      </Routes>
    </div>
  );
}
