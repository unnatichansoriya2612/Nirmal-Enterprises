function Dashboard({
  customers,
  services,
  products,
  sales,
}) {
  const totalSales = sales.reduce(
    (total, sale) =>
      total + Number(sale.totalAmount || 0),
    0
  );

  const totalCollected = sales.reduce(
    (total, sale) =>
      total + Number(sale.paidAmount || 0),
    0
  );

  const pendingSales = sales.reduce(
    (total, sale) =>
      total +
      Number(sale.remainingAmount || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.currentStock <= product.minimumStock
  );

  const servicePaymentsPending = services.reduce(
    (total, service) =>
      total +
      Number(
        service.totalAmount -
          service.paidAmount || 0
      ),
    0
  );

  const totalPending =
    pendingSales + servicePaymentsPending;

  return (
    <div className="dashboard-page">
      <section className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="eyebrow">BUSINESS OVERVIEW</p>

          <h2>Dashboard</h2>

          <p>
            A quick overview of your Nirmal
            Enterprises business activity.
          </p>
        </div>
        
        <button 
          className="primary-button" 
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '18px' }}>📄</span> Print Report
        </button>
      </section>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>Customers</span>
          <strong>{customers.length}</strong>
          <small>Total registered customers</small>
        </div>

        <div className="stat-card">
          <span>Services</span>
          <strong>{services.length}</strong>
          <small>Total service records</small>
        </div>

        <div className="stat-card">
          <span>Products</span>
          <strong>{products.length}</strong>
          <small>Products & spare parts</small>
        </div>

        <div className="stat-card">
          <span>Total Sales</span>
          <strong>₹{totalSales}</strong>
          <small>{sales.length} sales recorded</small>
        </div>

        <div className="stat-card">
          <span>Collected</span>
          <strong>₹{totalCollected}</strong>
          <small>Amount received from sales</small>
        </div>

        <div className="stat-card warning">
          <span>Pending Payments</span>
          <strong>₹{totalPending}</strong>
          <small>Sales + service dues</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">INVENTORY</p>
              <h3>Stock Status</h3>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="empty-message">
              No products have been added yet.
            </p>
          ) : lowStockProducts.length === 0 ? (
            <p className="success-message">
              ✓ All products are currently above
              minimum stock level.
            </p>
          ) : (
            <div className="stock-list">
              {lowStockProducts.map((product) => (
                <div
                  className="stock-row"
                  key={product.id}
                >
                  <div>
                    <strong>{product.name}</strong>

                    <span>
                      Minimum: {product.minimumStock}
                    </span>
                  </div>

                  <strong>
                    {product.currentStock} left
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SALES</p>
              <h3>Recent Sales</h3>
            </div>
          </div>

          {sales.length === 0 ? (
            <p className="empty-message">
              No sales recorded yet.
            </p>
          ) : (
            <div className="recent-list">
              {sales
                .slice(-5)
                .reverse()
                .map((sale) => (
                  <div
                    className="recent-row"
                    key={sale.id}
                  >
                    <div>
                      <strong>
                        {sale.invoiceNumber ||
                          "Sale"}
                      </strong>

                      <span>
                        {sale.saleDate}
                      </span>
                    </div>

                    <strong>
                      ₹{sale.totalAmount}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
