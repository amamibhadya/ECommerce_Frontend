
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/action';
import axios from 'axios';

const OrderConformation = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
     
      if (cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

     
      const orderPayload = {
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: calculateTotal()
      };

      // Make API call to place order
      const response = await axios.post('http://localhost:5132/api/orders', orderPayload);

     
      if (response.data) {
        setOrderStatus('success');
        dispatch(clearCart()); 
      } else {
        throw new Error('Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
      setOrderStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

 
  const renderOrderSummary = () => (
    <div className="order-summary">
      <h3 className="order-summary-title">Order Summary</h3>
      <div className="order-items">
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <div className="item-details">
              <span className="item-name">{item.productName}</span>
              <span className="item-quantity">x{item.quantity}</span>
            </div>
            <span className="item-price">Rs {item.price * item.quantity} LKR</span>
          </div>
        ))}
      </div>
      <div className="order-total">
        <span>Total Amount:</span>
        <span className="total-price">Rs {calculateTotal()} LKR</span>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="success-message">
      <div className="success-icon">✓</div>
      <h2 className="success-message-title">Order Placed Successfully!</h2>
      <p>Thank you for your purchase.</p>
      <p>Your order has been confirmed and will be processed shortly.</p>
      <button 
        className="continue-shopping"
        onClick={() => window.location.href = '/'}
      >
        Continue Shopping
      </button>
    </div>
  );

  const renderErrorMessage = () => (
    <div className="error-message">
      <div className="error-icon">✕</div>
      <h2 className="error-message-title">Order Failed</h2>
      <p>{error}</p>
      <button 
        className="try-again"
        onClick={() => setOrderStatus(null)}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="order-confirmation-container">
      {!orderStatus && (
        <>
          {renderOrderSummary()}
          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      )}

      {orderStatus === 'success' && renderSuccessMessage()}
      {orderStatus === 'error' && renderErrorMessage()}
    </div>
  );
};

export default OrderConformation;
