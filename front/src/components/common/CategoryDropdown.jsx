/** @format */

import PropTypes from "prop-types";
import useAxios from "../../hooks/UseAxios";

function CategoryDropdown({ onChange }) {
  const {
    data: data,
    loading,
    error,
  } = useAxios("http://localhost:3000/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data && (
        <div>
          <select onChange={onChange}>
            <option value="all">All</option>
            {data
              .filter((d) => d.parent === null || d.parent === "")
              .map(({ _id, name }) => (
                <option key={_id} value={_id}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}

CategoryDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CategoryDropdown;
