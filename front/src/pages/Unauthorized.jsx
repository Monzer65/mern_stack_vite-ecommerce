/** @format */
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <p> اجازه دسترسی ندارید!</p>
        <Link to="/" className="not-found-button">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
