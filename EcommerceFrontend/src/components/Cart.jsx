
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateQuantity, removeFromCart } from '../redux/action';

const Cart = () => {
  const cartItems = useSelector(state => state.cart); 
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    axios.get('http://localhost:5132/api/cart')
      .then(response => {
        dispatch({ type: 'SET_CART', payload: response.data });
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load cart items.');
        setLoading(false);
      });
  }, [dispatch]);


  const handleUpdateQuantity = (id, quantity) => {
    const updatedQuantity = Math.max(1, parseInt(quantity, 10));
    axios.put(`http://localhost:5132/api/cart/update-quantity/${id}?newQuantity=${updatedQuantity}`)
      .then(() => {
        dispatch(updateQuantity(id, updatedQuantity)); // Update Redux state
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  
  const handleRemoveItem = (id) => {
    axios.delete(`http://localhost:5132/api/cart/${id}`)
      .then(() => {
        dispatch(removeFromCart(id)); // Remove Redux state
      })
      .catch(error => console.error('Error removing item from cart:', error));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) return <p>Loading cart items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2>Your Cart</h2>
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <h3>{item.productName}</h3>
                <p>Price: Rs {item.price} LKR</p>

                <label>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                    className="quantity-input"
                  />
                </label>

                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">Remove</button>
                <p>Total: Rs {item.price * item.quantity} LKR</p>
              </div>
            ))
          ) : (
            <p>No products in the cart.</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <h3>Total Price: Rs {totalPrice} LKR</h3>
        )}
      </div>
    </div>
  );
};

export default Cart;
