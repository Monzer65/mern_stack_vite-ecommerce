/** @format */

import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>store page</h1>
      {loading && <ImSpinner2 className="loading-icon-products" />}
      <div className="product-cards-list">
        {products?.map?.((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </>
  );
}

export default Store;
