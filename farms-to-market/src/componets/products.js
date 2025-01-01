import { useEffect, useState } from 'react';
import { Link,  } from 'react-router-dom';
import axios from 'axios';
import './myproduct.css'; // Import your CSS file

const url = process.env.Backend_URL;

function Products() {
  
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/product/products`);
        setProducts(response.data);
      } catch (error) {
        setError('Cannot get products');
      }
    };
    fetchProducts();
    setCartItems(getCart());
  }, []);

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
      {error && <p>{error}</p>}
      {products.length > 0 ? (
        products.map(product => (
          <article className="c-card" key={product._id}>
            <header className="c-card__header">
              <img src={product.coverImageURL} className="c-card__image"  />
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
        !error && <p>No products available.</p>
      )}
      
    </div>
  );
}

export default Products;
