import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function CustomerHeader({ cartCount = 0, customerUser, setCustomerUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu whenever page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (setCustomerUser) {
      setCustomerUser(null);
      setMobileMenuOpen(false);
      navigate("/");
    }
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="customer-header">
      <div className="customer-header-inner">
        <div className="customer-header-left">
          {/* Mobile Menu Hamburger Toggle (left side beside logo) */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <Link to="/" className="customer-logo" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="Nirmal Enterprises"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="customer-navigation desktop-only">
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

        {/* Header Action Buttons (Desktop Only) */}
        <div className="customer-header-actions desktop-only">
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
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

          <Link
            to="/cart"
            className="customer-cart-link"
            onClick={closeMenu}
          >
            🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>

        {/* Mobile Quick Navigation Bar: Home first, Services, Products, Cart at the end */}
        <nav className="customer-navigation mobile-quick-nav mobile-only">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/products" onClick={closeMenu}>Products</Link>
          <Link to="/cart" onClick={closeMenu} className="mobile-cart-tab">
            🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </Link>
        </nav>
      </div>

      {/* Mobile Dropdown Drawer for ALL features */}
      {mobileMenuOpen && (
        <div className="customer-mobile-drawer">
          <div className="mobile-drawer-account">
            {customerUser ? (
              <div className="mobile-user-status">
                <span className="user-icon">👤</span>
                <div>
                  <strong>{customerUser.name || "Customer Account"}</strong>
                  <p>{customerUser.mobile || ""}</p>
                </div>
              </div>
            ) : (
              <div className="mobile-guest-status">
                <p>Welcome to Nirmal Enterprises</p>
                <Link to="/login" className="drawer-login-btn" onClick={closeMenu}>
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="mobile-drawer-links">
            <Link to="/" onClick={closeMenu}>
              <span>⌂</span> Home
            </Link>
            <Link to="/services" onClick={closeMenu}>
              <span>🔧</span> RO Services & Repair
            </Link>
            <Link to="/products" onClick={closeMenu}>
              <span>🛍️</span> Products & Spare Parts
            </Link>
            <Link to="/cart" onClick={closeMenu}>
              <span>🛒</span> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            <div className="drawer-divider"></div>
            <p className="drawer-section-label">CONTACT US</p>
            <a href="tel:+919329688963">
              <span>📞</span> Call Now
            </a>
            <a
              href="https://wa.me/919329688963?text=Hello%20Nirmal%20Enterprises,%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noreferrer"
              style={{ color: '#25D366' }}
            >
              <span>💬</span> WhatsApp
            </a>

            {customerUser && (
              <>
                <div className="drawer-divider"></div>
                <p className="drawer-section-label">MY ACCOUNT</p>
                <Link to="/orders" onClick={closeMenu}>
                  <span>📦</span> My Orders
                </Link>
                <Link to="/messages" onClick={closeMenu}>
                  <span>💬</span> Customer Support
                </Link>
                <Link to="/settings" onClick={closeMenu}>
                  <span>⚙️</span> Account Settings
                </Link>
                <div className="drawer-divider"></div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="drawer-logout-btn"
                >
                  <span>🚪</span> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default CustomerHeader;