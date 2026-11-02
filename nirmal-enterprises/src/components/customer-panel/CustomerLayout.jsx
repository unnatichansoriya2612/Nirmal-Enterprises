import CustomerHeader from "./CustomerHeader";
import "../../pages/customer-panel/CustomerHome.css";

function CustomerLayout({ children, cartCount, customerUser, setCustomerUser }) {
  return (
    <div className="customer-site">
      <CustomerHeader 
        cartCount={cartCount} 
        customerUser={customerUser} 
        setCustomerUser={setCustomerUser} 
      />

      <main className="customer-main">
        {children}
      </main>
    </div>
  );
}

export default CustomerLayout;