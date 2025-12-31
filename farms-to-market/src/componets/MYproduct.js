
import React, { useEffect, useState } from 'react';

import './myproduct.css'; // Import your CSS file
import DeleteProductButton from './diletbutton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from './userSlice';
import { Link } from 'react-router-dom';
//const url = process.env.REACT_APP_BACKEND_URL;
import api from "../api/api";

const MYproduct = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/product/my-product`);
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products / please sign in');
      }
    };

    fetchProducts();
  }, [dispatch]);

  if (error) {
    return <div>{error}</div>;
  }
  function handleDeleteSuccess(productId) {
    setProducts(products.filter(product => product._id !== productId));
  }
  return (

    <div className='main'>
      <div className='my-product-body'>

        {products.map(product => (
          <article className="c-card" key={product._id}>
            <header className="c-card__header">

              <img src={product.coverImageURL} className="c-card__image" alt="Card Image" />
              <DeleteProductButton className='c-card__remove-button' productId={product._id} onDeleteSuccess={handleDeleteSuccess} />

            </header>
            <div className="c-card__body">
              <div className="c-card__details">
                <h2 className="c-card__title">{product.title}</h2>
                <p className="c-card__subtitle">{product.bread}</p>
                <p className="c-card__weight">Weight: {product.waight}</p>
                <p className='c-card_weight'>Mobile:{product.createdBy.M_number}</p>
              </div>
            </div>
            <footer className="c-card__footer">
              <ul>

                <li>{product.createdBy.address}</li>
              </ul>
            </footer>
          </article>
        ))}
      </div>
      <Link to='/add-product'>
        <div className='sticky-div'>Add Product</div>
      </Link>
    </div>
  );
};

export default MYproduct;
