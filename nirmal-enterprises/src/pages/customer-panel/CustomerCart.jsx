import { Link } from "react-router-dom";
import "./CustomerCart.css";

function CustomerCart({ cartItems, setCartItems }) {
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price ?? item.sellingPrice ?? 0) * item.quantity,
    0
  );

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  if (cartItems.length === 0) {
    return (
      <div className="customer-cart-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Your cart is empty</h2>
        <p style={{ marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="customer-primary-button">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="customer-cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} />
                ) : (
                  <span>Img</span>
                )}
              </div>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <div className="cart-item-price">₹{item.price ?? item.sellingPrice ?? 0}</div>
              </div>
              <div className="cart-item-actions">
                <div className="customer-quantity-control" style={{ margin: 0, scale: '0.9' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="customer-primary-button checkout-btn" style={{ display: 'block', textAlign: 'center' }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerCart;
