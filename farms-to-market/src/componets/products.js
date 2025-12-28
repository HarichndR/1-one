import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './myproduct.css';
import { useSelector } from 'react-redux';
const url=process.env.BACKEND_URL;
function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  const { user } = useSelector((state) => state.user); // get logged-in user

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
    if (user?._id) {
      setCartItems(getCart(user._id));
    }
  }, [user]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem(`cart_${user._id}`)) || [];
    cart.push(product);
    localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));
    setCartItems(cart);
  };

  const getCart = (userId) => {
    return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  };

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
              <Link to="/cart"><button className='gotocart'>Go to Cart</button></Link>
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
