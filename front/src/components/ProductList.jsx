/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import ProductCard from "./ProductCard";
import CategoryOption from "./CategoryOption";
import { useSearch } from "../contexts/SearchContext";
import "../assets/styles/productList.css";

function ProductList() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } =
    useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products", {
        params: {
          page,
          limit,
          searchTerm,
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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/categories");
      const nestedCategories = buildCategoryTree(data);
      setCategories(nestedCategories);
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
      searchTerm,
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

  function buildCategoryTree(categories, parentId = null) {
    const categoryTree = [];
    for (const category of categories) {
      if (category.parent === parentId) {
        const children = buildCategoryTree(categories, category._id);
        if (children.length) {
          category.children = children;
        }
        categoryTree.push(category);
      }
    }
    return categoryTree;
  }

  const majorParentCategories = categories.filter(
    (category) => category.parent === null
  );

  const toggleCategory = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSort("");
    setPage(1);
    setLimit(20);
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

  const handleSearchTermChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    updateUrl();
    await fetchProducts();
    setSelectedCategory("");
    setSort("");
    setPage(1);
    setLimit(20);
  };

  useEffect(() => {
    fetchProducts();
    setLoading(true);
    updateUrl();
  }, [page, limit, sort, selectedCategory, selectedConditions, selectedBrands]);

  useEffect(() => {
    fetchCategories();
    fetchConditionsAndBrands();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPage(Number(params.get("page")) || 1);
    setLimit(Number(params.get("limit")) || 10);
    setSearchTerm(params.get("searchTerm") || "");
    setSort(params.get("sort") || "");
    setSelectedCategory(params.get("category") || "");
    setSelectedConditions(params.getAll("conditions") || []);
    setSelectedBrands(params.getAll("brands") || []);
  }, []);

  return (
    <div>
      <form onSubmit={handleSearchTermChange}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>
      <ul className="category-drop-down">
        <li className="all-categories-option">
          <button
            onClick={() => {
              setSelectedCategory("");
              setSort("");
              setPage(1);
              setLimit(20);
            }}
          >
            All Categories
          </button>
          <button className="category-toggle" onClick={toggleCategory}>
            {isOpen ? <FaAngleDown /> : <FaAngleRight />}
          </button>
        </li>
        <li className="major-categories-option">
          {isOpen &&
            majorParentCategories?.map((category) => (
              <CategoryOption
                category={category}
                key={category._id}
                onSelectCategory={handleCategoryChange}
              />
            ))}
        </li>
      </ul>

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
