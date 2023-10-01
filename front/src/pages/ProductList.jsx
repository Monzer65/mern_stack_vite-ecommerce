/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { FaWindowClose } from "react-icons/fa";
import { FcFilledFilter, FcGenericSortingDesc } from "react-icons/fc";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../contexts/SearchContext";
import "../assets/styles/productList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } =
    useSearch();
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

  const toggleFilter = () => {
    setIsOpenFilter(!isOpenFilter);
  };

  const toggleSort = () => {
    setIsOpenSort(!isOpenSort);
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products", {
        params: {
          searchTerm,
          category: selectedCategory,
          conditions: selectedConditions,
          brands: selectedBrands,
          sort,
          limit,
          page,
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

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
    setLimit(10);
    setIsOpenSort(false);
  };

  const updateUrl = () => {
    const queryParams = {
      searchTerm,
      category: selectedCategory,
      conditions: selectedConditions,
      brands: selectedBrands,
      sort,
      limit,
      page,
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

  useEffect(() => {
    fetchProducts();
    setLoading(true);
    updateUrl();
  }, [
    page,
    limit,
    sort,
    selectedCategory,
    searchTerm,
    selectedConditions,
    selectedBrands,
  ]);

  useEffect(() => {
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
    <div className="product-list-container">
      <div className="header">
        <div className="sort">
          <div className="title" onClick={toggleSort}>
            <FcGenericSortingDesc /> مرتب سازی
          </div>
          {isOpenSort && (
            <ul className={`sort-menu ${isOpenSort ? "open-sort" : ""}`}>
              <FaWindowClose onClick={toggleSort} />
              <li
                onClick={() => handleSortChange("")}
                className={sort === "" ? "active" : ""}
              >
                مرتبط ترین
              </li>
              <li
                onClick={() => handleSortChange("priceLowToHigh")}
                className={sort === "priceLowToHigh" ? "active" : ""}
              >
                قیمت (کم به زیاد)
              </li>
              <li
                onClick={() => handleSortChange("priceHighToLow")}
                className={sort === "priceHighToLow" ? "active" : ""}
              >
                قیمت (زیاد به کم)
              </li>
              <li
                onClick={() => handleSortChange("newestFirst")}
                className={sort === "newestFirst" ? "active" : ""}
              >
                جدیدترین
              </li>
              <li
                onClick={() => handleSortChange("featuredFirst")}
                className={sort === "featuredFirst" ? "active" : ""}
              >
                محصولات
              </li>
            </ul>
          )}
        </div>
        <div className="filter">
          <div className="title" onClick={toggleFilter}>
            <FcFilledFilter />
            فیلتر
          </div>
          {isOpenFilter && (
            <div className={`filter-menu ${isOpenFilter ? "open-filter" : ""}`}>
              <FaWindowClose onClick={toggleFilter} />
              <div className="conditions">
                <h4>وضعیت</h4>
                {conditions.map((condition) => (
                  <div key={condition} className="filter-item">
                    <label>
                      <input
                        type="checkbox"
                        value={condition}
                        onChange={() => handleConditionChange(condition)}
                        checked={selectedConditions.includes(condition)}
                      />
                      {condition}
                    </label>
                  </div>
                ))}
              </div>

              <div className="brands">
                <h4>برند</h4>
                {brands.map((brand) => (
                  <div key={brand} className="filter-item">
                    <label>
                      <input
                        type="checkbox"
                        value={brand}
                        onChange={() => handleBrandChange(brand)}
                        checked={selectedBrands.includes(brand)}
                      />
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
      <div className="pagination-container">
        <button
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page === 1}
        >
          قبل
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={page === totalPages}
        >
          بعد
        </button>
      </div>
    </div>
  );
}

export default ProductList;
