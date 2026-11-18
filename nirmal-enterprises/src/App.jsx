import { useState, useEffect } from "react";
import api from "./services/api";



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

const defaultInitialProducts = [
  {
    id: "dc5931b2-ba99-4f9d-a3d6-bdc7d8b1db05",
    name: "Kent Grand Plus RO+UV+UF",
    type: "Complete RO",
    category: "Complete RO",
    purchasePrice: 12000,
    sellingPrice: 15500,
    price: 15500,
    currentStock: 8,
    minimumStock: 3,
    images: [{ url: "/coverpage.png" }],
    is_active: true,
  },
  {
    id: "71d2effa-6f8f-4390-856a-f506f84e9d52",
    name: "Aquaguard Marvel RO+UV",
    type: "Complete RO",
    category: "Complete RO",
    purchasePrice: 10500,
    sellingPrice: 13999,
    price: 13999,
    currentStock: 6,
    minimumStock: 3,
    images: [{ url: "/coverpage.png" }],
    is_active: true,
  },
  {
    id: "317faf12-6718-4b41-b966-344b6377278a",
    name: "RO Sediment & Carbon Filter Kit",
    type: "Spare Part",
    category: "Spare Parts",
    purchasePrice: 380,
    sellingPrice: 650,
    price: 650,
    currentStock: 24,
    minimumStock: 10,
    images: [],
    is_active: true,
  },
  {
    id: "c541b90a-548b-42a9-9384-c58c073223f0",
    name: "Vontron RO Membrane 75 GPD",
    type: "Spare Part",
    category: "Spare Parts",
    purchasePrice: 750,
    sellingPrice: 1200,
    price: 1200,
    currentStock: 4,
    minimumStock: 5,
    images: [],
    is_active: true,
  },
];

function App() {
  /* ================================
     SHARED BUSINESS DATA (WITH LOCAL PERSISTENCE)
     ================================ */

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem("nirmal_customers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("nirmal_services");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [serviceCatalog, setServiceCatalog] =
    useState(defaultServiceCatalog);

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("nirmal_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback below
    }
    return defaultInitialProducts;
  });

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem("nirmal_sales");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("nirmal_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("nirmal_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("nirmal_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("nirmal_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("nirmal_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem("nirmal_products", JSON.stringify(products));
    }
  }, [products]);

  // Fetch products from backend API, merging with defaults without overwriting with empty list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.getAll();
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setProducts((currentProducts) => {
            const normalized = response.data.map((item) => {
              const existing = currentProducts.find((p) => p.id === item.id);
              return {
                id: item.id,
                name: item.name,
                type: item.type || (item.category?.toLowerCase().includes("spare") ? "Spare Part" : "Complete RO"),
                category: item.category || "General",
                purchasePrice: Number(item.purchasePrice ?? existing?.purchasePrice ?? Math.round((item.price ?? 0) * 0.7)),
                sellingPrice: Number(item.sellingPrice ?? item.price ?? existing?.sellingPrice ?? 0),
                price: Number(item.price ?? item.sellingPrice ?? 0),
                currentStock: Number(item.currentStock ?? existing?.currentStock ?? 10),
                minimumStock: Number(item.minimumStock ?? existing?.minimumStock ?? 5),
                images: Array.isArray(item.images) ? item.images : (existing?.images || []),
                is_active: item.is_active !== false,
              };
            });
            localStorage.setItem("nirmal_products", JSON.stringify(normalized));
            return normalized;
          });
        }
      } catch (error) {
        console.warn("API products fetch fallback:", error.message);
      }
    };

    fetchProducts();
  }, []);


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