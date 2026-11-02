import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Nirmal Enterprises</h2>

      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/services">Services</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/sales">Sales</Link>
      </div>
    </nav>
  );
}

export default Navbar;