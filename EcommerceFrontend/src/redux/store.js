import { createStore } from 'redux';
import cartReducer from './reducers';

const persistedCart = JSON.parse(localStorage.getItem('cart')) || [];

const store = createStore(cartReducer, {
  cart: persistedCart, 
});

store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart));
});

export default store;
