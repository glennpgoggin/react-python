// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Stocks from './stocks/stocks';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/stocks/*" element={<Stocks />} />
        <Route path="*" element={<Navigate to="/stocks" />} /> {}
      </Routes>
    </div>
  );
}

export default App;
