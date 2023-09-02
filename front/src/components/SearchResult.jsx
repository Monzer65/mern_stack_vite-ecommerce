/** @format */

import PropTypes from "prop-types";

function SearchResult({ results, error }) {
  return (
    <div className="results">
      {error ? (
        <div className="error-message">{error}</div>
      ) : results.length === 0 ? (
        <div className="no-results">No products found.</div>
      ) : (
        results.map((result, index) => (
          <div className="result" key={index}>
            <h2>{result.name}</h2>
            <h4>{`manufacturer: ${result.manufacturer.manufacturerName}`}</h4>
            <p>{`compatibility: ${result.compatibility.make}`}</p>
            <img src={result.imageUrl} alt="" />
          </div>
        ))
      )}
    </div>
  );
}

SearchResult.propTypes = {
  results: PropTypes.array.isRequired,
  error: PropTypes.string, // Add this line
};

SearchResult.defaultProps = {
  results: [],
};

export default SearchResult;
