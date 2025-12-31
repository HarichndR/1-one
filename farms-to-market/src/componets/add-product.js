import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddNewProduct.module.css'; // Import your CSS module
import api from "../api/api";
//const url = process.env.REACT_APP_BACKEND_URL;

const AddNewProduct = () => {
  const [productImgPreview, setProductImgPreview] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    title: '',
    bread: '',
    Product_state: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    setImage(file)
    setProductImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('coverImage', image);
    data.append('address', formData.address);
    data.append('title', formData.title);
    data.append('bread', formData.bread);
    data.append('Product_state', formData.Product_state);
    data.append('waight', formData.waight_value + "/" + formData.waight_unit)
    try {
      const response = await api.post(`/product/add-new`, data
      );
      navigate('/myproduct');
    } catch (err) {
      setError(err.message);
    }
  };

  return (

    <div className={styles.container}>
      <h1>Add New Product</h1>

      {error && <p>Error: {error}</p>}
      <form className={styles._form} onSubmit={handleSubmit}>
        <div>
          <label className={styles._label}>Cover Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
            className={styles.input}
          />
        </div>
        {productImgPreview && (
          <div>
            <img src={productImgPreview} alt="Profile Preview" className="profile-img-preview" />
          </div>
        )}
        <div>
          < label className={styles._label}>Name</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles._label}>Bread</label>
          <input
            name="bread"
            value={formData.bread}
            onChange={handleChange}

            className={styles.input}
          />
        </div>
        <label for="combinedValue" className={styles._label}>Weight:</label>
        <div className="combined-input">
          <input type="text" id="waight_value" className={styles.waight_input} onChange={handleChange} name="waight_value" value={formData.waight_value} />
          <select id="waight_unit" name="waight_unit" className={styles.waight_salect} value={formData.waight_unit} onChange={handleChange}>
            <option value="Acer">Acer</option>
            <option value="kg">kg</option>
            <option value="quintal">quintal</option>
            <option value="tan">tan</option>
          </select>
        </div>

        <input type="hidden" id="combinedValue" name="combinedValue" />
        <div>
          <label className={styles._label}>Product State</label>
          <input
            name="Product_state"
            value={formData.Product_state}
            onChange={handleChange}

            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Add Product</button>
      </form>
    </div>
  );
};

export default AddNewProduct;
