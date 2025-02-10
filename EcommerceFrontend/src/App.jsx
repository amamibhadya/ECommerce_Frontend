
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConformation';
import './index.css';
import Header from './components/header';

const App = () => {
  const getCartItemCount = () => {
    const cart = store.getState().cart;
    return cart.reduce((total, item) => total + item.quantity, 0); 
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Header/>

          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-conformation" element={<OrderConfirmation />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;

