import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function CustomerOrders({ orders, services = [], customerUser }) {
  const [activeTab, setActiveTab] = useState("orders");

  if (!customerUser) {
    return <Navigate to="/login" />;
  }

  // Filter based on mobile/phone or name as a fallback since there's no real DB ID yet
  const userPhone = customerUser.mobile || customerUser.phone;
  const userName = customerUser.name;

  const myOrders = orders.filter(
    order => (userPhone && order.customerPhone === userPhone) || (userName && order.customerName === userName)
  );

  const myServices = services.filter(
    service => (userPhone && service.customerPhone === userPhone) || (userName && service.customerName === userName)
  );

  return (
    <div className="customer-orders-page" style={{ width: 'min(1000px, calc(100% - 40px))', margin: '40px auto 80px' }}>
      <p className="customer-eyebrow">
        CUSTOMER ACCOUNT
      </p>

      <h1 style={{ marginBottom: '30px' }}>My History</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab("orders")}
          style={{ 
            background: 'none', border: 'none', fontSize: '16px', fontWeight: activeTab === 'orders' ? '700' : '500',
            color: activeTab === 'orders' ? '#245b63' : '#526b6d', cursor: 'pointer', padding: '10px 0'
          }}
        >
          Product Orders
        </button>
        <button 
          onClick={() => setActiveTab("services")}
          style={{ 
            background: 'none', border: 'none', fontSize: '16px', fontWeight: activeTab === 'services' ? '700' : '500',
            color: activeTab === 'services' ? '#245b63' : '#526b6d', cursor: 'pointer', padding: '10px 0'
          }}
        >
          Service Bookings
        </button>
      </div>

      {activeTab === "orders" && (
        <>
          {myOrders.length === 0 ? (
            <div className="customer-empty-products" style={{ background: '#fff', padding: '60px 20px', borderRadius: '16px' }}>
              <h2>No product orders yet</h2>
              <p style={{ marginBottom: '20px' }}>Your online orders will appear here after you place an order.</p>
              <Link to="/products" className="customer-primary-button">Shop Products</Link>
            </div>
          ) : (
            <div className="customer-orders-list">
              {myOrders.slice().reverse().map((order) => (
                <article className="customer-order-card" key={order.id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div className="customer-order-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <strong style={{ fontSize: '18px', display: 'block', color: '#1f2933' }}>{order.id}</strong>
                      <span style={{ fontSize: '13px', color: '#526b6d' }}>{order.date}</span>
                    </div>
                    <span className="customer-order-status" style={{ background: '#f0f6f5', color: '#245b63', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', height: 'fit-content' }}>
                      {order.status}
                    </span>
                  </div>

                  <div className="customer-order-items">
                    {order.items?.map((item, index) => (
                      <div className="customer-order-item" key={`${order.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px' }}>
                        <span>{item.name || item.productName} × {item.quantity}</span>
                        <strong>₹{Number(item.price || item.sellingPrice || 0) * item.quantity}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="customer-order-total" style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px', textAlign: 'right', fontWeight: '700', fontSize: '16px' }}>
                    Total Paid: ₹{order.totalAmount}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "services" && (
        <>
          {myServices.length === 0 ? (
            <div className="customer-empty-products" style={{ background: '#fff', padding: '60px 20px', borderRadius: '16px' }}>
              <h2>No service bookings yet</h2>
              <p style={{ marginBottom: '20px' }}>Your service requests will appear here after you book a service.</p>
              <Link to="/services" className="customer-primary-button">Book a Service</Link>
            </div>
          ) : (
            <div className="customer-orders-list">
              {myServices.slice().reverse().map((service) => (
                <article className="customer-order-card" key={service.id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div className="customer-order-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <strong style={{ fontSize: '18px', display: 'block', color: '#1f2933' }}>{service.serviceName}</strong>
                      <span style={{ fontSize: '13px', color: '#526b6d' }}>Booking ID: {service.id}</span>
                    </div>
                    <span className="customer-order-status" style={{ background: '#f5f0e6', color: '#8a6d2b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', height: 'fit-content' }}>
                      {service.status}
                    </span>
                  </div>

                  <div className="customer-order-items" style={{ fontSize: '15px', color: '#1f2933' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Scheduled for:</strong> {service.scheduledDate || service.date}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Service Address:</strong> {service.address}</div>
                  </div>

                  <div className="customer-order-total" style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px', textAlign: 'right', fontWeight: '700', fontSize: '16px' }}>
                    Estimated Price: {Number(service.price) > 0 ? `₹${service.price}` : "Upon inspection"}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerOrders;