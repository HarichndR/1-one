
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from "../api/api";
const url = process.env.REACT_APP_BACKEND_URL;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get('search')?.toLowerCase() || '';
      const response = await api.get(`/product/filterdproduct?search=${searchQuery}`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
    setCartItems(getCart());
  }, [location.search]);
  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart); // Update state to reflect the changes in the cart
  };

  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };
  return (
    <div className="my-product-body">

      {products.length > 0 ? (
        products.map(product => (
          <article className="c-card" key={product._id}>
            <header className="c-card__header">
              <img src={product.coverImageURL} className="c-card__image" />
            </header>
            <div className="c-card__body">
              <h2 className="c-card__title">{product.title}</h2>
              <p className="c-card__subtitle">{product.bread}</p>
              <p className="c-card__intro">{product.description}</p>
              <p className='c-card_weight'>Weight: {product.weight}</p>
              <p className='c-card_weight'>Mobile: {product.createdBy.M_number}</p>
            </div>
            <footer className="c-card__footer">
              <ul>
                <li>{product.createdBy.address}</li>
              </ul>
            </footer>
            {isInCart(product._id) ? (
              <Link to="/cart" className=''><button className='gotocart'>Go to Cart</button>
              </Link>
            ) : (
              <button className='my-product' onClick={() => handleAddToCart(product)}>Add to Cart</button>
            )}


          </article>
        ))
      ) : (
        <p>No products available.</p>
      )}

    </div>
  );
};

export default ProductPage;
