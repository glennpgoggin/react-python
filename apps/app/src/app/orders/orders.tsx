import { Routes, Route } from 'react-router-dom';
import OrdersList from './orders-list';

export default function Orders() {
  return (
    <div>
      <Routes>
        <Route path="" element={<OrdersList />} />
      </Routes>
    </div>
  );
}
