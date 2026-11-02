import { useState } from "react";
import "./CustomerServices.css";
// import { Link } from "react-router-dom"; // No longer need Link since we use a modal

function CustomerServices({ serviceCatalog, onBookService }) {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    preferredDate: ""
  });

  const activeServices = serviceCatalog.filter(
    (service) => service.active
  );

  const openModal = (service) => {
    setSelectedService(service);
    setBookingSuccess(false);
  };

  const closeModal = () => {
    setSelectedService(null);
    setBookingSuccess(false);
    setFormData({ name: "", phone: "", address: "", preferredDate: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const booking = {
      id: "SRV-" + Math.floor(100000 + Math.random() * 900000),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      customerName: formData.name,
      customerPhone: formData.phone,
      serviceDate: formData.preferredDate,
      bookingStatus: "Pending",
      paymentStatus: "Pending",
      totalAmount: selectedService.price,
      paidAmount: 0,
      problem: "Online Booking Request",
      notes: "Address: " + formData.address
    };

    if (onBookService) {
      onBookService(booking);
    }
    
    setBookingSuccess(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 3000);
  };

  return (
    <div className="customer-services-page">
      <section className="customer-services-hero">
        <div className="customer-services-hero-content">
          <p className="customer-services-eyebrow">
            NIRMAL ENTERPRISES
          </p>
          <h1>Professional RO Services</h1>
          <p>
            From installation and servicing to repairs and
            filter replacement, get reliable RO support from
            Nirmal Enterprises.
          </p>
        </div>
      </section>

      <section className="customer-services-content">
        <div className="customer-services-heading">
          <div>
            <p className="customer-services-eyebrow">
              OUR SERVICES
            </p>
            <h2>How can we help you?</h2>
            <p>
              Choose the RO service you need and book a
              service with Nirmal Enterprises.
            </p>
          </div>
        </div>

        {activeServices.length === 0 ? (
          <div className="customer-services-empty">
            <h3>Services currently unavailable</h3>
            <p>Our services will be available here soon.</p>
          </div>
        ) : (
          <div className="customer-services-grid">
            {activeServices.map((service) => (
              <article
                className="customer-service-card"
                key={service.id}
              >
                <div className="customer-service-card-top">
                  <div className="customer-service-icon">+</div>
                  <span className="customer-service-status">Available</span>
                </div>
                
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                
                <div className="customer-service-card-bottom">
                  <div className="customer-service-price">
                    <span>Service price</span>
                    <strong>
                      {Number(service.price) > 0
                        ? `₹${service.price}`
                        : "Price on request"}
                    </strong>
                  </div>
                  
                  <button
                    onClick={() => openModal(service)}
                    className="customer-service-book-button"
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Book Service
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="customer-services-help">
        <div>
          <p className="customer-services-eyebrow">NEED HELP?</p>
          <h2>Not sure which service you need?</h2>
          <p>
            Talk to Nirmal Enterprises and we will help
            you identify the right RO service.
          </p>
        </div>
        <a 
          href="tel:+919999999999" 
          className="customer-services-call-button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '18px' }}>📞</span> Call Now
        </a>
      </section>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="customer-service-modal-overlay" onClick={closeModal}>
          <div className="customer-service-modal" onClick={e => e.stopPropagation()}>
            <div className="customer-service-modal-header">
              <div>
                <h2>Book {selectedService.name}</h2>
                <p>{selectedService.description}</p>
              </div>
              <button className="customer-service-modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="customer-service-modal-body">
              {bookingSuccess ? (
                <div className="customer-service-modal-success">
                  <h3>✅ Booking Confirmed!</h3>
                  <p>Our technician will reach out to you shortly to confirm the exact time.</p>
                </div>
              ) : (
                <form className="checkout-form" style={{ padding: 0, boxShadow: 'none' }} onSubmit={handleSubmit}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Complete Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label>Preferred Date</label>
                    <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required />
                  </div>
                  
                  <button type="submit" className="customer-primary-button" style={{ width: '100%' }}>
                    Confirm Booking
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerServices;