/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import axios from "axios";

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
      <li>
        <Link to="/admin">Admin panel</Link>
      </li>
      <div className="product-cards-list">
        {products?.map?.((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </>
  );
}

export default Store;
