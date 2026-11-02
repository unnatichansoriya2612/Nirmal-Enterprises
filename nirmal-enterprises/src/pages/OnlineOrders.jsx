import { useState } from "react";
import api from "../services/api";

function OnlineOrders({ orders, setOrders }) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    return (
      statusFilter === "All" ||
      order.status === statusFilter
    );
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, { status: newStatus });
    } catch (err) {
      console.warn("Backend order sync fallback:", err.message);
    }

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">ONLINE SALES</p>
          <h2>Online Orders</h2>
          <p>
            Manage orders placed through the Nirmal Enterprises customer
            website.
          </p>
        </div>

        <div className="page-heading-action">
          <span className="order-count">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      <section className="orders-toolbar">
        <div className="filter-group">
          <label>Order Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="empty-state large-empty-state">
          <div className="empty-state-icon">▤</div>
          <h3>No online orders yet</h3>
          <p>
            Orders placed by customers will appear here after the customer
            website and backend are connected.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No matching orders</h3>
          <p>Try changing the order status filter.</p>
        </div>
      ) : (
        <section className="orders-list">
          {filteredOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-number">
                    {order.id || order.orderNumber}
                  </span>
                  <strong>{order.customerName}</strong>
                </div>

                <span
                  className={`order-status-badge ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div>
                  <span>Order Date</span>
                  <strong>{order.date}</strong>
                </div>

                <div>
                  <span>Items</span>
                  <strong>{Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + item.quantity, 0) : order.items} item(s)</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>₹{order.totalAmount || order.total}</strong>
                </div>

                <div>
                  <span>Payment</span>
                  <strong>{order.paymentStatus}</strong>
                </div>
              </div>

              <div className="order-card-footer">
                <label>Update Status</label>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default OnlineOrders;