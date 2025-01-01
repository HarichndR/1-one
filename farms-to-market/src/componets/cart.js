import React, { useEffect, useState } from 'react';
import './myproduct.css'; // Import your CSS file

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  function handleRemove(productId) {
    let cart = getCart();
    cart = cart.filter(product => product._id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart); // Update state
  }

  return (
    <div className="my-product-body">
      <h1>Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        cartItems.map((product) => (
          <article className="c-card" key={product._id}>
            <header className="c-card__header">
              <img src={product.coverImageURL} className="c-card__image" alt="Card Image" />
              <button className="c-card__remove-button" onClick={() => handleRemove(product._id)}>X</button>
            </header>
            <div className="c-card__body">
              <h2 className="c-card__title">{product.title}</h2>
              <p className="c-card__subtitle">{product.bread}</p>
              <p className="c-card__intro">{product.description}</p>
            </div>
            <footer className="c-card__footer">
              <ul>
                <li>{product.createdBy.M_number}</li>
                <li>{product.createdBy.address}</li>
              </ul>
            </footer>
          </article>
        ))
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default Cart;
