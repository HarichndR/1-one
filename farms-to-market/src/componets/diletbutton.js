import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DeleteProductButton = ({ productId, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // Assuming you have user information in the Redux store

  const handleDeleteProduct = async () => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8001/product/delete/${productId}`, {
          headers: {
            // Add any required headers here, such as authorization tokens
            Authorization: `Bearer ${user.token}`, // Assuming user token is stored in user state
          },
        });
        console.log(response.data.msg);
        // Call the onDeleteSuccess callback to update the state after successful deletion
        if (onDeleteSuccess) {
          onDeleteSuccess(productId);
        }
      } catch (err) {
        console.error('Error deleting product:', err.response ? err.response.data.error : err.message);
      }
    } else {
      navigate('/myproduct');
    }
  };

  return (
    <button className='c-card__remove-button' onClick={handleDeleteProduct}>
      X
    </button>
  );
};

export default DeleteProductButton;
