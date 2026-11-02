import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src="/logo.png"
          alt="Nirmal Enterprises"
          className="sidebar-logo"
        />
      </div>

      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <p className="sidebar-section-title">MAIN</p>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Home
          </NavLink>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          <p className="sidebar-section-title">BUSINESS</p>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>♙</span>
            Customers
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>⚒</span>
            Services
          </NavLink>

          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>▣</span>
            Inventory
          </NavLink>

          <NavLink
            to="/admin/sales"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>▤</span>
            Sales & Billing
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>🛒</span>
            Online Orders
          </NavLink>

          <p className="sidebar-section-title">
            COMMUNICATION
          </p>

          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>✉</span>
            Messages
          </NavLink>

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>🔔</span>
            Notifications
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>⚙</span>
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;