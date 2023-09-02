/** @format */

// 404.js
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>
          Sorry, but the page you are looking for does not exist, has been
          removed, or is temporarily unavailable.
        </p>
        <Link to="/" className="not-found-button">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
