/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";

function Store() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3000/api/products");

        const productsArray = data.products;

        // const categoryProducts = productsArray.filter((product) =>
        //   product.category.includes("64f0523dc4a09e94dc7d73df")
        // );

        const featuredProducts = productsArray.filter(
          (product) => product.featured === true
        );

        setProducts(featuredProducts);
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
