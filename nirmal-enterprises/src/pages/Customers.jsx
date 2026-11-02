import { useState } from "react";

function Customers({ customers, setCustomers }) {
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteCustomer = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedCustomers = customers.filter(
      (customer) => customer.id !== id
    );

    setCustomers(updatedCustomers);
  };

  const handleEditCustomer = (id) => {
    const customer = customers.find(
      (customer) => customer.id === id
    );

    if (!customer) {
      return;
    }

    setCustomerName(customer.name);
    setMobileNumber(customer.mobile);
    setAddress(customer.address);

    setEditingId(id);
    setShowForm(true);
  };

  const handleSaveCustomer = () => {
    if (customerName.trim() === "") {
      alert("Please enter customer name.");
      return;
    }

    if (mobileNumber.trim() === "") {
      alert("Please enter mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (address.trim() === "") {
      alert("Please enter customer address.");
      return;
    }

    if (editingId === null) {
      const newCustomer = {
        id: crypto.randomUUID(),
        name: customerName.trim(),
        mobile: mobileNumber.trim(),
        address: address.trim(),
      };

      setCustomers([...customers, newCustomer]);
    } else {
      const updatedCustomers = customers.map((customer) => {
        if (customer.id === editingId) {
          return {
            ...customer,
            name: customerName.trim(),
            mobile: mobileNumber.trim(),
            address: address.trim(),
          };
        }

        return customer;
      });

      setCustomers(updatedCustomers);
    }

    resetForm();
  };

  const resetForm = () => {
    setCustomerName("");
    setMobileNumber("");
    setAddress("");
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Customers</h1>

      <p>Manage Nirmal Enterprises customers here.</p>

      <button onClick={() => setShowForm(true)}>
        Add Customer
      </button>

      {showForm && (
        <div>
          <h2>
            {editingId === null
              ? "Add New Customer"
              : "Edit Customer"}
          </h2>

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="customer-form-actions">
            <button
              className="customer-save-button"
              onClick={handleSaveCustomer}
            >
              {editingId === null
                ? "Save Customer"
                : "Update Customer"}
            </button>

            <button
              className="customer-cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2>Customer List</h2>

      <input
        type="text"
        placeholder="Search customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {customers.length === 0 ? (
        <p>No customers added yet.</p>
      ) : (
        customers.map((customer) => {
          const search = searchTerm.toLowerCase();

          const matchesSearch =
            customer.name.toLowerCase().includes(search) ||
            customer.mobile.includes(search) ||
            customer.address.toLowerCase().includes(search);

          if (!matchesSearch) {
            return null;
          }

          return (
            <div key={customer.id}>
              <h3>{customer.name}</h3>

              <p>Mobile: {customer.mobile}</p>

              <p>Address: {customer.address}</p>

              <button
                onClick={() => handleEditCustomer(customer.id)}
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteCustomer(customer.id)}
              >
                Delete
              </button>
            </div>
          );
        })
      )}

      {customers.length > 0 &&
        !customers.some((customer) => {
          const search = searchTerm.toLowerCase();

          return (
            customer.name.toLowerCase().includes(search) ||
            customer.mobile.includes(search) ||
            customer.address.toLowerCase().includes(search)
          );
        }) && <p>No matching customers found.</p>}
    </div>
  );
}

export default Customers;