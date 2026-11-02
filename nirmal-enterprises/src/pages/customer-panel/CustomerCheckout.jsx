import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../../services/api";
import "./CustomerCart.css"; // Reuse cart styles

function CustomerCheckout({ cartItems, setCartItems, orders, setOrders, notifications, setNotifications }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price ?? item.sellingPrice ?? 0) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.pincode}`;

    const newOrderFallback = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: fullAddress,
      totalAmount: subtotal,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price ?? item.sellingPrice,
        quantity: item.quantity
      })),
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      paymentStatus: "Pending",
      type: "Online"
    };

    try {
      const validItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const res = await api.orders.create({
        order_type: "online",
        items: validItems,
        notes: `Customer: ${formData.name}, Phone: ${formData.phone}`,
        shipping_address: fullAddress,
      });

      const savedOrder = res?.data || newOrderFallback;
      setOrders([savedOrder, ...orders]);
      setCartItems([]);
      setOrderPlaced(true);
    } catch (err) {
      console.warn("Backend order creation fallback:", err.message);
      setOrders([newOrderFallback, ...orders]);
      setCartItems([]);
      setOrderPlaced(true);
    } finally {
      setLoading(false);
    }

    if (notifications && setNotifications) {
      setNotifications([
        {
          id: "notif-" + Date.now(),
          type: "order",
          title: `New Online Order Placed`,
          message: `${formData.name} placed an order for ₹${subtotal.toFixed(2)}.`,
          time: "Just now",
          read: false
        },
        ...notifications
      ]);
    }
  };

  if (orderPlaced) {
    return (
      <div className="customer-checkout-page success-message">
        <h1>🎉 Order Placed Successfully!</h1>
        <p>Thank you for shopping with Nirmal Enterprises. We have received your order.</p>
        <Link to="/products" className="customer-primary-button" style={{ marginTop: '20px', display: 'inline-block' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" />;
  }

  return (
    <div className="customer-checkout-page">
      <h1>Checkout</h1>
      
      <form className="checkout-grid" onSubmit={handlePlaceOrder}>
        <div className="checkout-form">
          <h2>Shipping Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: '100%' }}>
              <label>Full Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>PIN Code</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.sellingPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total to Pay</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <button type="submit" className="customer-primary-button checkout-btn">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerCheckout;
