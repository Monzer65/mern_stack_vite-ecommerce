/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";

function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("sort");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true initially

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products", {
        params: {
          page,
          limit,
          search,
          sort,
          category: selectedCategory,
        },
      });
      setProducts(data.products);
      setTotalPages(Math.ceil(data.count / limit));
      setLoading(false);
    } catch (err) {
      setLoading(false); // Set loading to false in case of an error
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  function updateUrl() {
    const queryParams = {
      page,
      limit,
      search,
      sort,
      selectedCategory,
    };

    navigate({
      pathname: location.pathname,
      search: new URLSearchParams(queryParams).toString(),
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchProducts();
    updateUrl();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, limit, sort, selectedCategory]);

  useEffect(() => {
    // Update state based on URL parameters
    const params = new URLSearchParams(location.search);
    setPage(Number(params.get("page")) || 1);
    setLimit(Number(params.get("limit")) || 10);
    setSearch(params.get("search") || "");
    setSort(params.get("sort") || "");
    setSelectedCategory(params.get("selectedCategory") || "");
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [page, limit, sort, selectedCategory]);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setLoading(false);
          }}
        />
        <button type="submit">Search</button>
      </form>
      <select
        value={sort}
        onChange={(e) => {
          updateUrl();
          setSort(e.target.value);
        }}
      >
        <option value="date_added_to_store">Newest</option>
        <option value="price">Price (Low to High)</option>
        <option value="-price">Price (High to Low)</option>
        <option value="featured">Featured</option>
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSort("sort");
          setPage(1);
          setLimit(10);
          setSelectedCategory(e.target.value);
          updateUrl();
        }}
      >
        <option value="">All Categories</option>
        {categories?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="lodaing-container">
        {loading ? (
          <ImSpinner2 className="loading-icon-products" />
        ) : (
          <div className="product-list-contaoner">
            {products?.map((product) => (
              <ul key={product._id}>
                <li>
                  <img src={product.images[0]} alt={product.name} />
                </li>

                <li>{product.name}</li>
                <li>Price: ${product.price}</li>
                <li>Featured: {product.featured ? "Yes" : "No"}</li>
              </ul>
            ))}
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            updateUrl();
            setPage(page - 1);
          }}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => {
            updateUrl();
            setPage(page + 1);
          }}
          disabled={page === totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default ProductList;
