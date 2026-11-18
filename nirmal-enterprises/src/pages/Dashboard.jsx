import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard({
  customers = [],
  services = [],
  products = [],
  sales = [],
}) {
  // Self-resilient product state: uses prop, falls back to localStorage cache
  const [localProducts, setLocalProducts] = useState(() => {
    if (Array.isArray(products) && products.length > 0) return products;
    try {
      const saved = localStorage.getItem("nirmal_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not read nirmal_products from cache", e);
    }
    return [];
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync with prop whenever parent passes non-empty products
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  // Self-fetch function: Dashboard can fetch directly from API independently
  const refreshProducts = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.products.getAll();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const normalized = res.data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category || "Complete RO",
          type: item.type || (item.category?.toLowerCase().includes("spare") ? "Spare Part" : "Complete RO"),
          sellingPrice: Number(item.price ?? item.sellingPrice ?? 0),
          purchasePrice: Number(item.purchasePrice ?? Math.round((item.price ?? 0) * 0.7)),
          currentStock: Number(item.currentStock ?? 10),
          minimumStock: Number(item.minimumStock ?? 5),
          is_active: item.is_active !== false,
        }));
        setLocalProducts(normalized);
        localStorage.setItem("nirmal_products", JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn("Dashboard self-fetch fallback:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // If products are missing or empty on mount, fetch directly
  useEffect(() => {
    if (localProducts.length === 0) {
      refreshProducts();
    }
  }, []);

  // Safe active lists (never drops to 0 due to an empty prop)
  const activeProducts =
    Array.isArray(products) && products.length > 0
      ? products
      : localProducts;

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

  const lowStockProducts = activeProducts.filter(
    (product) =>
      Number(product.currentStock || 0) <= Number(product.minimumStock || 0)
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
      <section className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p className="eyebrow">BUSINESS OVERVIEW</p>

          <h2>Dashboard</h2>

          <p>
            A quick overview of your Nirmal
            Enterprises business activity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={refreshProducts}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{isRefreshing ? "⏳" : "🔄"}</span>
            {isRefreshing ? "Syncing..." : "Sync Products"}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '18px' }}>📄</span> Print Report
          </button>
        </div>
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
          <strong>{activeProducts.length}</strong>
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

          {activeProducts.length === 0 ? (
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
                      Minimum: {product.minimumStock ?? 0}
                    </span>
                  </div>

                  <strong>
                    {product.currentStock ?? 0} left
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
