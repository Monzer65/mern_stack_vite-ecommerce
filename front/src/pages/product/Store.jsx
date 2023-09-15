/** @format */

import { useState, useEffect } from "react";
import ProductCard from "../../components/product/ProductCard";
import axios from "axios";

import PropTypes from "prop-types";

function Store() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3000/api/products");

        const productsArray = data.products;
        setProducts(productsArray);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>welcome to store page</h1>
      <div className="product-cards-list">
        {products?.map?.((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </>
  );
}

Store.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Store;
