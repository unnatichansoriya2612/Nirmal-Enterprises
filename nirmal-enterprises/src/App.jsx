import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout/Layout";


import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import OnlineOrders from "./pages/OnlineOrders";
import Settings from "./pages/Settings";


import CustomerProducts from "./pages/customer-panel/CustomerProducts";
import CustomerProductDetails from "./pages/customer-panel/CustomerProductDetails";
import CustomerServices from "./pages/customer-panel/CustomerServices";
import RegisterCustomer from "./pages/customer-panel/RegisterCustomer";
import CustomerOrders from "./pages/customer-panel/CustomerOrders";

// Newly added missing imports
import CustomerLayout from "./components/customer-panel/CustomerLayout";
import CustomerHome from "./pages/customer-panel/CustomerHome";
import CustomerCart from "./pages/customer-panel/CustomerCart";
import CustomerCheckout from "./pages/customer-panel/CustomerCheckout";
import CustomerLogin from "./pages/customer-panel/CustomerLogin";
import CustomerSettings from "./pages/customer-panel/CustomerSettings";
import CustomerMessages from "./pages/customer-panel/CustomerMessages";

const defaultServiceCatalog = [
  {
    id: "service-1",
    name: "RO Servicing",
    description:
      "Complete RO water purifier servicing and maintenance.",
    price: 0,
    active: true,
  },
  {
    id: "service-2",
    name: "RO Repair",
    description:
      "Diagnosis and repair of RO purifier problems.",
    price: 0,
    active: true,
  },
  {
    id: "service-3",
    name: "RO Installation",
    description:
      "Professional installation of RO water purifiers.",
    price: 0,
    active: true,
  },
  {
    id: "service-4",
    name: "RO Uninstallation",
    description:
      "Safe removal and uninstallation of RO systems.",
    price: 0,
    active: true,
  },
  {
    id: "service-5",
    name: "Filter Replacement",
    description:
      "Replacement of RO filters and filtration components.",
    price: 0,
    active: true,
  },
  {
    id: "service-6",
    name: "Water Leakage Repair",
    description:
      "Inspection and repair of RO water leakage issues.",
    price: 0,
    active: true,
  },
  {
    id: "service-7",
    name: "No Power / Electrical Issue",
    description:
      "Diagnosis and repair of RO electrical and power problems.",
    price: 0,
    active: true,
  },
  {
    id: "service-8",
    name: "RO Shifting",
    description:
      "Safe shifting and reinstallation of RO systems.",
    price: 0,
    active: true,
  },
  {
    id: "service-9",
    name: "Tap Replacement",
    description:
      "Replacement of damaged or faulty RO taps.",
    price: 0,
    active: true,
  },
  {
    id: "service-10",
    name: "Other Services",
    description:
      "Other RO-related services not covered above.",
    price: 0,
    active: true,
  },
];

function App() {
  /* ================================
     SHARED BUSINESS DATA
     ================================ */

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  const [serviceCatalog, setServiceCatalog] =
    useState(defaultServiceCatalog);

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);

  /* ================================
     CUSTOMER WEBSITE STATE
     ================================ */

  const [cartItems, setCartItems] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: "notification-1",
      type: "system",
      title: "Welcome to Nirmal Enterprises",
      message: "System is initialized and ready to receive customer orders and messages.",
      time: "Just now",
      read: false,
    }
  ]);

  const [customerUser, setCustomerUser] =
    useState(null);

  /* ================================
     CUSTOMER CART COUNT
     ================================ */

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  /* ================================
     SERVICE BOOKING
     ================================ */

  const handleCustomerServiceBooking = (
    booking
  ) => {
    setServices([
      ...services,
      booking,
    ]);
    setNotifications([
      {
        id: "notif-" + Date.now(),
        type: "service",
        title: `New Booking: ${booking.serviceName}`,
        message: `${booking.customerName} scheduled a service for ${booking.scheduledDate}`,
        time: "Just now",
        read: false
      },
      ...notifications
    ]);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* =================================
            CUSTOMER WEBSITE
            ================================= */}

        <Route
          path="/"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerHome
                products={products}
                serviceCatalog={serviceCatalog}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/products"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerProducts
                products={products}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/products/:productId"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerProductDetails
                products={products}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/services"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerServices
                serviceCatalog={serviceCatalog}
                onBookService={
                  handleCustomerServiceBooking
                }
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerCart
                products={products}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerCheckout
                products={products}
                cartItems={cartItems}
                setCartItems={setCartItems}
                orders={orders}
                setOrders={setOrders}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/login"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerLogin
                setCustomerUser={
                  setCustomerUser
                }
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/register"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <RegisterCustomer
                setCustomerUser={
                  setCustomerUser
                }
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerOrders
                orders={orders}
                services={services}
                customerUser={customerUser}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerSettings
                customerUser={customerUser}
                setCustomerUser={setCustomerUser}
              />
            </CustomerLayout>
          }
        />

        <Route
          path="/messages"
          element={
            <CustomerLayout cartCount={cartCount} customerUser={customerUser} setCustomerUser={setCustomerUser}>
              <CustomerMessages
                customerUser={customerUser}
                conversations={conversations}
                setConversations={setConversations}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </CustomerLayout>
          }
        />

        {/* =================================
            ADMIN PANEL
            ================================= */}

        <Route
          path="/admin/*"
          element={
            <Layout>
              <Routes>
                <Route
                  index
                  element={
                    <Home
                      customers={customers}
                      services={services}
                      products={products}
                      sales={sales}
                    />
                  }
                />

                <Route
                  path="dashboard"
                  element={
                    <Dashboard
                      customers={customers}
                      services={services}
                      products={products}
                      sales={sales}
                    />
                  }
                />

                <Route
                  path="customers"
                  element={
                    <Customers
                      customers={customers}
                      setCustomers={setCustomers}
                    />
                  }
                />

                <Route
                  path="services"
                  element={
                    <Services
                      customers={customers}
                      services={services}
                      setServices={setServices}
                      serviceCatalog={
                        serviceCatalog
                      }
                      setServiceCatalog={
                        setServiceCatalog
                      }
                    />
                  }
                />

                <Route
                  path="inventory"
                  element={
                    <Inventory
                      products={products}
                      setProducts={setProducts}
                    />
                  }
                />

                <Route
                  path="sales"
                  element={
                    <Sales
                      customers={customers}
                      products={products}
                      sales={sales}
                      setSales={setSales}
                      setProducts={setProducts}
                    />
                  }
                />

                <Route
                  path="orders"
                  element={
                    <OnlineOrders
                      orders={orders}
                      setOrders={setOrders}
                    />
                  }
                />

                <Route
                  path="messages"
                  element={
                    <Messages 
                      conversations={conversations}
                      setConversations={setConversations}
                      notifications={notifications}
                      setNotifications={setNotifications}
                    />
                  }
                />

                <Route
                  path="notifications"
                  element={
                    <Notifications 
                      notifications={notifications}
                      setNotifications={setNotifications}
                    />
                  }
                />

                <Route
                  path="settings"
                  element={<Settings />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;