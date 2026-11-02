import { useState } from "react";



function Services({
  customers,
  services,
  setServices,
  serviceCatalog,
  setServiceCatalog,
}) {
  const [activeSection, setActiveSection] = useState("catalog");

  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [editingCatalogId, setEditingCatalogId] = useState(null);

  const [catalogName, setCatalogName] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");
  const [catalogPrice, setCatalogPrice] = useState("");
  const [catalogActive, setCatalogActive] = useState(true);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [problem, setProblem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [bookingStatus, setBookingStatus] = useState("Pending");
  const [notes, setNotes] = useState("");

  const [catalogSearch, setCatalogSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const resetCatalogForm = () => {
    setCatalogName("");
    setCatalogDescription("");
    setCatalogPrice("");
    setCatalogActive(true);
    setEditingCatalogId(null);
    setShowCatalogForm(false);
  };

  const handleSaveCatalogService = () => {
    if (catalogName.trim() === "") {
      alert("Please enter service name.");
      return;
    }

    if (catalogDescription.trim() === "") {
      alert("Please enter service description.");
      return;
    }

    if (catalogPrice.trim() === "") {
      alert("Please enter service price.");
      return;
    }

    const price = Number(catalogPrice);

    if (price < 0) {
      alert("Service price cannot be negative.");
      return;
    }

    const serviceData = {
      name: catalogName.trim(),
      description: catalogDescription.trim(),
      price,
      active: catalogActive,
    };

    if (editingCatalogId === null) {
      const newService = {
        id: crypto.randomUUID(),
        ...serviceData,
      };

      setServiceCatalog([...serviceCatalog, newService]);
    } else {
      const updatedCatalog = serviceCatalog.map((service) =>
        service.id === editingCatalogId
          ? {
              ...service,
              ...serviceData,
            }
          : service
      );

      setServiceCatalog(updatedCatalog);
    }

    resetCatalogForm();
  };

  const handleEditCatalogService = (id) => {
    const service = serviceCatalog.find(
      (item) => item.id === id
    );

    if (!service) {
      return;
    }

    setCatalogName(service.name);
    setCatalogDescription(service.description);
    setCatalogPrice(String(service.price));
    setCatalogActive(service.active);
    setEditingCatalogId(id);
    setShowCatalogForm(true);
  };

  const handleDeleteCatalogService = (id) => {
    const service = serviceCatalog.find(
      (item) => item.id === id
    );

    if (!service) {
      return;
    }

    const usedByBooking = services.some(
      (booking) => booking.serviceId === id
    );

    if (usedByBooking) {
      alert(
        "This service cannot be deleted because it is already used in a service booking. You can edit it or mark it inactive instead."
      );
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) {
      return;
    }

    setServiceCatalog(
      serviceCatalog.filter((item) => item.id !== id)
    );
  };

  const resetBookingForm = () => {
    setCustomerId("");
    setServiceId("");
    setServiceDate("");
    setProblem("");
    setTotalAmount("");
    setPaidAmount("");
    setPaymentStatus("Unpaid");
    setBookingStatus("Pending");
    setNotes("");
    setEditingBookingId(null);
    setShowBookingForm(false);
  };

  const handleServiceSelection = (id) => {
    setServiceId(id);

    const selectedService = serviceCatalog.find(
      (service) => service.id === id
    );

    if (selectedService) {
      setTotalAmount(String(selectedService.price));
    }
  };

  const handleSaveBooking = () => {
    if (customers.length === 0) {
      alert("Please add a customer first.");
      return;
    }

    if (customerId === "") {
      alert("Please select a customer.");
      return;
    }

    if (serviceId === "") {
      alert("Please select a service.");
      return;
    }

    if (serviceDate === "") {
      alert("Please select service date.");
      return;
    }

    if (problem.trim() === "") {
      alert("Please enter the problem or service details.");
      return;
    }

    if (totalAmount.trim() === "") {
      alert("Please enter total amount.");
      return;
    }

    const total = Number(totalAmount);
    const paid = Number(paidAmount || 0);

    if (total < 0) {
      alert("Total amount cannot be negative.");
      return;
    }

    if (paid < 0) {
      alert("Paid amount cannot be negative.");
      return;
    }

    if (paid > total) {
      alert("Paid amount cannot be greater than total amount.");
      return;
    }

    if (paymentStatus === "Paid" && paid !== total) {
      alert(
        "For a Paid service, paid amount must equal total amount."
      );
      return;
    }

    if (paymentStatus === "Unpaid" && paid !== 0) {
      alert(
        "For an Unpaid service, paid amount must be ₹0."
      );
      return;
    }

    if (
      paymentStatus === "Partial" &&
      (paid === 0 || paid === total)
    ) {
      alert(
        "For a Partial payment, paid amount must be greater than ₹0 and less than the total amount."
      );
      return;
    }

    const selectedService = serviceCatalog.find(
      (service) => service.id === serviceId
    );

    if (!selectedService) {
      alert("Selected service was not found.");
      return;
    }

    const bookingData = {
      customerId,
      serviceId,
      serviceName: selectedService.name,
      serviceDate,
      problem: problem.trim(),
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: total - paid,
      paymentStatus,
      bookingStatus,
      notes: notes.trim(),
    };

    if (editingBookingId === null) {
      const newBooking = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...bookingData,
      };

      setServices([...services, newBooking]);
    } else {
      const updatedServices = services.map((booking) =>
        booking.id === editingBookingId
          ? {
              ...booking,
              ...bookingData,
            }
          : booking
      );

      setServices(updatedServices);
    }

    resetBookingForm();
  };

  const handleEditBooking = (id) => {
    const booking = services.find(
      (item) => item.id === id
    );

    if (!booking) {
      return;
    }

    setCustomerId(booking.customerId);
    setServiceId(booking.serviceId || "");
    setServiceDate(booking.serviceDate);
    setProblem(booking.problem);
    setTotalAmount(String(booking.totalAmount));
    setPaidAmount(String(booking.paidAmount));
    setPaymentStatus(booking.paymentStatus);
    setBookingStatus(booking.bookingStatus || "Pending");
    setNotes(booking.notes || "");

    setEditingBookingId(id);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service booking?"
    );

    if (!confirmDelete) {
      return;
    }

    setServices(
      services.filter((booking) => booking.id !== id)
    );
  };

  const getCustomer = (id) => {
    return customers.find(
      (customer) => customer.id === id
    );
  };

  const filteredCatalog = serviceCatalog.filter(
    (service) => {
      const search = catalogSearch.toLowerCase();

      return (
        service.name.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search)
      );
    }
  );

  const filteredBookings = services.filter(
    (booking) => {
      const customer = getCustomer(
        booking.customerId
      );

      const search = bookingSearch.toLowerCase();

      const matchesSearch =
        customer?.name
          .toLowerCase()
          .includes(search) ||
        customer?.mobile.includes(search) ||
        booking.serviceName
          ?.toLowerCase()
          .includes(search);

      const matchesPayment =
        paymentFilter === "All" ||
        booking.paymentStatus === paymentFilter;

      const matchesBookingStatus =
        bookingStatusFilter === "All" ||
        booking.bookingStatus ===
          bookingStatusFilter;

      const matchesService =
        serviceFilter === "All" ||
        booking.serviceId === serviceFilter;

      return (
        matchesSearch &&
        matchesPayment &&
        matchesBookingStatus &&
        matchesService
      );
    }
  );

  return (
    <div className="services-page">
      <section className="page-introduction">
        <div>
          <p className="eyebrow">SERVICES</p>
          <h2>Services</h2>
          <p>
            Manage your service catalog and customer
            service bookings.
          </p>
        </div>
      </section>

      <div className="service-section-tabs">
        <button
          className={
            activeSection === "catalog"
              ? "active"
              : ""
          }
          onClick={() => setActiveSection("catalog")}
        >
          Service Catalog
        </button>

        <button
          className={
            activeSection === "bookings"
              ? "active"
              : ""
          }
          onClick={() => setActiveSection("bookings")}
        >
          Service Bookings
        </button>
      </div>

      {activeSection === "catalog" && (
        <section className="service-catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                SERVICES OFFERED
              </p>
              <h3>Service Catalog</h3>
              <p>
                Manage the services customers can
                request from Nirmal Enterprises.
              </p>
            </div>

            <button
              onClick={() => {
                resetCatalogForm();
                setShowCatalogForm(true);
              }}
            >
              Add Service
            </button>
          </div>

          {showCatalogForm && (
            <div className="form-panel">
              <h3>
                {editingCatalogId === null
                  ? "Add New Service"
                  : "Edit Service"}
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label>Service Name</label>
                  <input
                    type="text"
                    placeholder="Example: RO Servicing"
                    value={catalogName}
                    onChange={(e) =>
                      setCatalogName(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter service price"
                    value={catalogPrice}
                    onChange={(e) =>
                      setCatalogPrice(e.target.value)
                    }
                  />
                </div>

                <div className="form-field full-width">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe this service"
                    value={catalogDescription}
                    onChange={(e) =>
                      setCatalogDescription(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Availability</label>
                  <select
                    value={
                      catalogActive
                        ? "Active"
                        : "Inactive"
                    }
                    onChange={(e) =>
                      setCatalogActive(
                        e.target.value === "Active"
                      )
                    }
                  >
                    <option value="Active">
                      Active
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  onClick={handleSaveCatalogService}
                >
                  {editingCatalogId === null
                    ? "Save Service"
                    : "Update Service"}
                </button>

                <button
                  onClick={resetCatalogForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="list-toolbar">
            <input
              type="text"
              placeholder="Search services..."
              value={catalogSearch}
              onChange={(e) =>
                setCatalogSearch(e.target.value)
              }
            />
          </div>

          {serviceCatalog.length === 0 ? (
            <p className="empty-message">
              No services have been added yet.
            </p>
          ) : filteredCatalog.length === 0 ? (
            <p className="empty-message">
              No matching services found.
            </p>
          ) : (
            <div className="service-catalog-grid">
              {filteredCatalog.map((service) => (
                <div
                  className="service-catalog-card"
                  key={service.id}
                >
                  <div className="service-card-header">
                    <div>
                      <h3>{service.name}</h3>
                      <span
                        className={
                          service.active
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {service.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <strong>
                      ₹{service.price}
                    </strong>
                  </div>

                  <p>{service.description}</p>

                  <div className="card-actions">
                    <button
                      onClick={() =>
                        handleEditCatalogService(
                          service.id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteCatalogService(
                          service.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "bookings" && (
        <section className="service-bookings-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                CUSTOMER REQUESTS
              </p>
              <h3>Service Bookings</h3>
              <p>
                Record and manage customer service
                requests.
              </p>
            </div>

            <button
              onClick={() => {
                resetBookingForm();
                setShowBookingForm(true);
              }}
              disabled={customers.length === 0}
            >
              Add Booking
            </button>
          </div>

          {customers.length === 0 && (
            <p className="info-message">
              Add a customer first before creating a
              service booking.
            </p>
          )}

          {showBookingForm && (
            <div className="form-panel">
              <h3>
                {editingBookingId === null
                  ? "Add Service Booking"
                  : "Edit Service Booking"}
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label>Customer</label>
                  <select
                    value={customerId}
                    onChange={(e) =>
                      setCustomerId(e.target.value)
                    }
                  >
                    <option value="">
                      Select Customer
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name} -{" "}
                        {customer.mobile}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Service</label>
                  <select
                    value={serviceId}
                    onChange={(e) =>
                      handleServiceSelection(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Service
                    </option>

                    {serviceCatalog
                      .filter(
                        (service) =>
                          service.active ||
                          service.id === serviceId
                      )
                      .map((service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Service Date</label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) =>
                      setServiceDate(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Booking Status</label>
                  <select
                    value={bookingStatus}
                    onChange={(e) =>
                      setBookingStatus(e.target.value)
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Confirmed">
                      Confirmed
                    </option>
                    <option value="Assigned">
                      Assigned
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="form-field full-width">
                  <label>Problem / Service Details</label>
                  <textarea
                    placeholder="Example: Water leakage from purifier"
                    value={problem}
                    onChange={(e) =>
                      setProblem(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter total amount"
                    value={totalAmount}
                    onChange={(e) =>
                      setTotalAmount(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) =>
                      setPaymentStatus(e.target.value)
                    }
                  >
                    <option value="Paid">
                      Paid
                    </option>
                    <option value="Partial">
                      Partial
                    </option>
                    <option value="Unpaid">
                      Unpaid
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Paid Amount</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter paid amount"
                    value={paidAmount}
                    onChange={(e) =>
                      setPaidAmount(e.target.value)
                    }
                  />
                </div>

                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea
                    placeholder="Optional notes"
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button onClick={handleSaveBooking}>
                  {editingBookingId === null
                    ? "Save Booking"
                    : "Update Booking"}
                </button>

                <button
                  onClick={resetBookingForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="list-toolbar booking-toolbar">
            <input
              type="text"
              placeholder="Search customer, mobile or service..."
              value={bookingSearch}
              onChange={(e) =>
                setBookingSearch(e.target.value)
              }
            />

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
            >
              <option value="All">
                All Payments
              </option>
              <option value="Paid">Paid</option>
              <option value="Partial">
                Partial
              </option>
              <option value="Unpaid">
                Unpaid
              </option>
            </select>

            <select
              value={bookingStatusFilter}
              onChange={(e) =>
                setBookingStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Booking Status
              </option>
              <option value="Pending">
                Pending
              </option>
              <option value="Confirmed">
                Confirmed
              </option>
              <option value="Assigned">
                Assigned
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) =>
                setServiceFilter(e.target.value)
              }
            >
              <option value="All">
                All Services
              </option>

              {serviceCatalog.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {services.length === 0 ? (
            <p className="empty-message">
              No service bookings added yet.
            </p>
          ) : filteredBookings.length === 0 ? (
            <p className="empty-message">
              No matching service bookings found.
            </p>
          ) : (
            <div className="service-booking-list">
              {filteredBookings.map((booking) => {
                const customer = getCustomer(
                  booking.customerId
                ) || {
                  name: booking.customerName || "Customer not found",
                  mobile: booking.customerPhone || "—"
                };

                const remainingAmount =
                  booking.totalAmount -
                  booking.paidAmount;

                return (
                  <div
                    className="service-booking-card"
                    key={booking.id}
                  >
                    <div className="booking-card-header">
                      <div>
                        <p className="eyebrow">
                          SERVICE BOOKING
                        </p>
                        <h3>
                          {booking.serviceName}
                        </h3>
                      </div>

                      <span className="booking-status">
                        {booking.bookingStatus ||
                          "Pending"}
                      </span>
                    </div>

                    <div className="booking-details-grid">
                      <div>
                        <span>Customer</span>
                        <strong>
                          {customer.name}
                        </strong>
                      </div>

                      <div>
                        <span>Mobile</span>
                        <strong>
                          {customer.mobile}
                        </strong>
                      </div>

                      <div>
                        <span>Service Date</span>
                        <strong>
                          {booking.serviceDate}
                        </strong>
                      </div>

                      <div>
                        <span>Total</span>
                        <strong>
                          ₹{booking.totalAmount}
                        </strong>
                      </div>

                      <div>
                        <span>Paid</span>
                        <strong>
                          ₹{booking.paidAmount}
                        </strong>
                      </div>

                      <div>
                        <span>Remaining</span>
                        <strong>
                          ₹{remainingAmount}
                        </strong>
                      </div>

                      <div>
                        <span>Payment</span>
                        <strong>
                          {booking.paymentStatus}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-description">
                      <span>
                        Problem / Service Details
                      </span>
                      <p>{booking.problem}</p>
                    </div>

                    {booking.notes && (
                      <div className="booking-description">
                        <span>Notes</span>
                        <p>{booking.notes}</p>
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        onClick={() =>
                          handleEditBooking(
                            booking.id
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteBooking(
                            booking.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Services;