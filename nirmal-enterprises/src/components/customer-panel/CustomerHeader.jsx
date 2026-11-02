import { Link, useNavigate } from "react-router-dom";

function CustomerHeader({ cartCount = 0, customerUser, setCustomerUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setCustomerUser) {
      setCustomerUser(null);
      navigate("/");
    }
  };

  return (
    <header className="customer-header">
      <div className="customer-header-inner">
        <Link to="/" className="customer-logo">
          <img
            src="/logo.png"
            alt="Nirmal Enterprises"
          />
        </Link>

        <nav className="customer-navigation">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/products">Products</Link>
          {customerUser && (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/messages">Support</Link>
              <Link to="/settings">Settings</Link>
            </>
          )}
        </nav>

        <div className="customer-header-actions">
          <Link
            to="/cart"
            className="customer-cart-link"
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          {customerUser ? (
            <button
              onClick={handleLogout}
              className="customer-login-button"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="customer-login-button"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;