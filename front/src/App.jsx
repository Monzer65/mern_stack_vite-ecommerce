/** @format */

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SearchResult from "./components/SearchResult";
import PropTypes from "prop-types";
import Home from "./components/Home";
import Cart from "./components/Cart";
import RegisterForm from "./components/Register";
import Login from "./components/Login";
import SampleRoute from "./components/SampleRoute";
import NotFound from "./components/NotFound";

function App() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  return (
    <Router>
      {" "}
      <Header setResults={setResults} setError={setError} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={<SearchResult results={results} error={error} />}
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sample" element={<SampleRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

App.propTypes = {
  setResults: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

App.defaultProps = { setResults: () => {}, results: [] };

export default App;
