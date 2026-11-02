import { Link } from "react-router-dom";

function Home({
  customers,
  services,
  products,
  sales,
}) {
  const lowStockProducts = products.filter(
    (product) =>
      product.currentStock <= product.minimumStock
  );

  const pendingPayments = [
    ...sales.map((sale) => ({
      amount: sale.remainingAmount,
    })),
    ...services.map((service) => ({
      amount:
        service.totalAmount -
        service.paidAmount,
    })),
  ].reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  return (
    <div className="home-page">
      <section className="hero-section">
        <div>
          <p className="eyebrow">WELCOME BACK</p>

          <h2>
            Manage your business
            <br />
            from one place.
          </h2>

          <p className="hero-description">
            Keep track of customers, RO services,
            products, inventory and sales from
            your Nirmal Enterprises management
            system.
          </p>
        </div>

        <div className="hero-summary">
          <span>Business Overview</span>
          <strong>Everything in one place</strong>
        </div>
      </section>

      <section className="quick-actions-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">QUICK ACTIONS</p>
            <h2>What would you like to do?</h2>
          </div>
        </div>

        <div className="quick-actions-grid">
          <Link
            to="/customers"
            className="quick-action-card"
          >
            <div className="action-icon">♙</div>
            <div>
              <h3>Add Customer</h3>
              <p>
                Create and manage customer records.
              </p>
            </div>
            <span className="action-arrow">→</span>
          </Link>

          <Link
            to="/services"
            className="quick-action-card"
          >
            <div className="action-icon">⚒</div>
            <div>
              <h3>New Service</h3>
              <p>
                Record an RO service or repair.
              </p>
            </div>
            <span className="action-arrow">→</span>
          </Link>

          <Link
            to="/sales"
            className="quick-action-card"
          >
            <div className="action-icon">▤</div>
            <div>
              <h3>Create Sale</h3>
              <p>
                Record an offline sale and generate
                a bill.
              </p>
            </div>
            <span className="action-arrow">→</span>
          </Link>

          <Link
            to="/sales"
            className="quick-action-card"
          >
            <div className="action-icon">+</div>
            <div>
              <h3>Add Product</h3>
              <p>
                Add RO products or spare parts.
              </p>
            </div>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="home-overview">
        <div className="overview-card">
          <span>Total Customers</span>
          <strong>{customers.length}</strong>
          <Link to="/customers">
            View customers →
          </Link>
        </div>

        <div className="overview-card">
          <span>Active Services</span>
          <strong>{services.length}</strong>
          <Link to="/services">
            View services →
          </Link>
        </div>

        <div className="overview-card">
          <span>Products</span>
          <strong>{products.length}</strong>
          <Link to="/sales">
            Manage products →
          </Link>
        </div>

        <div className="overview-card">
          <span>Sales Recorded</span>
          <strong>{sales.length}</strong>
          <Link to="/sales">
            View sales →
          </Link>
        </div>
      </section>

      <section className="home-alerts">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ATTENTION</p>
            <h2>Business alerts</h2>
          </div>
        </div>

        <div className="alert-grid">
          <div className="alert-card">
            <div className="alert-icon">!</div>
            <div>
              <strong>Low Stock</strong>
              <p>
                {lowStockProducts.length === 0
                  ? "All products have sufficient stock."
                  : `${lowStockProducts.length} product(s) need stock attention.`}
              </p>
            </div>
          </div>

          <div className="alert-card">
            <div className="alert-icon">₹</div>
            <div>
              <strong>Pending Payments</strong>
              <p>
                ₹{pendingPayments} is currently
                remaining across recorded sales and
                services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
