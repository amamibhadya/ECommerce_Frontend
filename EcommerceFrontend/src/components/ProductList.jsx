
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/action';
import productlistImage from '../assets/pic3.jpg'; // image

const ProductList = () => {
  const [products, setProducts] = useState([]); // store products
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch products from the backend API using axios
    axios.get('http://localhost:5132/api/products') 
      .then(response => {
        console.log('Fetched product data:', response.data); 
        setProducts(response.data); 
      })
      .catch(error => {
        console.error('Error fetching products:', error); 
      });
  }, []); 

  const handleAddToCart = (product) => {
    
    const cartItem = {
      productId: product.id,
      productName: product.name, 
      price: product.price,       
      quantity: 1,                
    };
  
    console.log('Sending to backend:', cartItem);
  
    axios.post('http://localhost:5132/api/Cart', cartItem)
      .then(response => {
        console.log('Added to cart:', response.data);
        dispatch(addToCart(response.data)); 
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
  };
  
  return (
    <div className="product-list-container">
      {/* First section for the background image */}
      <div className="background-section">
        <img 
          src={productlistImage} 
          alt="E-commerce Background" 
          className="background-image" 
        />
      </div>

      {/* Second section for the product boxes */}
      <div className="product-section">
        
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="product-card"> {/* Unique key with index */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Rs {product.price} LKR</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-stock">Stock: {product.quantityInStock}</p>
                  <button 
                    onClick={() => handleAddToCart(product)} 
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
