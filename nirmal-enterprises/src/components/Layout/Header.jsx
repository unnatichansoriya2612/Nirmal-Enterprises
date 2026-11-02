import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="top-header">
      <div>
        <p className="header-label">
          OWNER PANEL
        </p>

        <h1>Nirmal Enterprises</h1>
      </div>

      <div className="header-profile">
        <Link
          to="/admin/notifications"
          className="notification-button"
          aria-label="Notifications"
        >
          🔔
        </Link>

        <div className="owner-avatar">
          O
        </div>

        <div className="owner-info">
          <strong>Owner</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Header;