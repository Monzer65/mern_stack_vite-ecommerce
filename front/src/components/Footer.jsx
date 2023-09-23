/** @format */

// Import React and CSS modules
import "../assets/styles/footer.css";

// Define the Footer component
function Footer() {
  // Return the JSX element for the footer
  return (
    <footer className="footer">
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Shop</a>
        </li>
        <li>
          <a href="#">About Us</a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#">Contact Us</a>
        </li>
        <li>
          <a href="#">Terms &amp; Conditions</a>
        </li>
        <li>
          <a href="#">Privacy Policy</a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#">FAQs</a>
        </li>
        <li>
          <a href="#">Shipping &amp; Returns</a>
        </li>
        <li>
          <a href="#">Sitemap</a>
        </li>
      </ul>
    </footer>
  );
}

// Export the Footer component
export default Footer;
