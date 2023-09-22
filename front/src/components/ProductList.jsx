/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import ProductCard from "./ProductCard";

function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products", {
        params: {
          page,
          limit,
          search,
          sort,
          category: selectedCategory,
          conditions: selectedConditions,
          brands: selectedBrands,
        },
      });

      const productsArray = data.products;
      setProducts(productsArray);

      const totalCount = data.count;
      const totalPagesCount = Math.ceil(totalCount / limit);
      setTotalPages(totalPagesCount);

      setLoading(false);
    } catch (err) {
      setLoading(false);
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

  const fetchConditionsAndBrands = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/conditions-and-brands"
      );
      setConditions(data.conditions);
      setBrands(data.brands);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUrl = () => {
    const queryParams = {
      page,
      limit,
      search,
      sort,
      category: selectedCategory,
      conditions: selectedConditions,
      brands: selectedBrands,
    };

    const flattenedQueryParams = Object.entries(queryParams).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            acc.push([key, item]);
          });
        } else {
          acc.push([key, value]);
        }
        return acc;
      },
      []
    );

    const queryString = flattenedQueryParams
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    navigate(`${location.pathname}?${queryString}`, { replace: true });
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownVisible((prev) => !prev);
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategory(categoryId);
    setCategoryDropdownVisible(false);
  };

  const handleConditionChange = (condition) => {
    setSort("");
    setPage(1);
    setLimit(20);
    const updatedConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updatedConditions);
  };

  const handleBrandChange = (brand) => {
    setSort("");
    setPage(1);
    setLimit(10);
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchProducts();
    setSelectedCategory("");
    setSort("");
    setPage(1);
    setLimit(20);
  };

  useEffect(() => {
    fetchCategories();
    fetchConditionsAndBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
    setLoading(true);
    updateUrl();
  }, [page, limit, sort, selectedCategory, selectedConditions, selectedBrands]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(Number(params.get("page")) || 1);
    setLimit(Number(params.get("limit")) || 10);
    setSearch(params.get("search") || "");
    setSort(params.get("sort") || "");
    setSelectedCategory(params.get("category") || "");
    setSelectedConditions(params.getAll("conditions") || []);
    setSelectedBrands(params.getAll("brands") || []);
  }, []);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>
      {/* <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setSort("");
          setPage(1);
          setLimit(20);
        }}
      >
        <option value="">All Categories</option>
        {categories?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select> */}
      <div
        className={`category-dropdown ${
          categoryDropdownVisible ? "active" : ""
        }`}
      >
        <button onClick={toggleCategoryDropdown}>Select Category</button>
        {categoryDropdownVisible && (
          <ul className="category-list">
            <li>All Categories</li>
            {categories?.map((category) => (
              <li
                key={category._id}
                onClick={() => handleCategorySelection(category._id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setPage(1);
        }}
      >
        <option value="">Default</option>
        <option value="priceLowToHigh">Price (Low to High)</option>
        <option value="priceHighToLow">Price (High to Low)</option>
        <option value="newestFirst">Newest</option>
        <option value="featuredFirst">Featured</option>
      </select>
      <div>
        <h4>Conditions:</h4>
        {conditions.map((condition) => (
          <label key={condition}>
            <input
              type="checkbox"
              value={condition}
              onChange={() => handleConditionChange(condition)}
              checked={selectedConditions.includes(condition)}
            />
            {condition}
          </label>
        ))}
      </div>

      <div>
        <h4>Brands:</h4>
        {brands.map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              value={brand}
              onChange={() => handleBrandChange(brand)}
              checked={selectedBrands.includes(brand)}
            />
            {brand}
          </label>
        ))}
      </div>
      <div className="lodaing-container">
        {loading ? (
          <ImSpinner2 className="loading-icon-products" />
        ) : (
          <div className="product-cards-list">
            {products?.map?.((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => {
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
