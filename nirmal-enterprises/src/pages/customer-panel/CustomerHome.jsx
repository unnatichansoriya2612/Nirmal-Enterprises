import { Link } from "react-router-dom";

function CustomerHome({ products, serviceCatalog }) {
  const activeServices = serviceCatalog.filter(
    (service) => service.active
  );

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="customer-home">
      <section className="customer-hero">
        <div className="customer-hero-content">
          <p className="customer-eyebrow">
            NIRMAL ENTERPRISES
          </p>

          <h1>
            Pure water.
            <br />
            Better living.
          </h1>

          <p>
            RO water purifier sales, genuine spare parts,
            installation, repair and professional service.
          </p>

          <div className="customer-hero-actions">
            <Link
              to="/products"
              className="customer-primary-button"
            >
              Shop Products
            </Link>

            <Link
              to="/services"
              className="customer-secondary-button"
            >
              Book a Service
            </Link>
          </div>
        </div>

        <div className="customer-hero-visual">
          <div className="hero-video-container" style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
              controls
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: '#000' }}
              poster="/coverpage.png"
            >
              <source src="/introductionvideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className="customer-services-section">
        <div className="customer-section-heading">
          <div>
            <p className="customer-eyebrow">
              OUR SERVICES
            </p>

            <h2>RO services you can rely on</h2>

            <p>
              Professional support for installation,
              maintenance, repairs and replacement.
            </p>
          </div>

          <Link to="/services">
            View all services →
          </Link>
        </div>

        <div className="customer-service-grid">
          {activeServices.slice(0, 6).map((service) => (
            <Link
              to="/services"
              className="customer-service-card"
              key={service.id}
            >
              <div className="customer-service-icon">
                +
              </div>

              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <span>
                Book service →
              </span>
            </Link>
          ))}
        </div>

        {activeServices.length === 0 && (
          <p className="customer-empty-message">
            Services will be available soon.
          </p>
        )}
      </section>

      <section className="customer-products-section">
        <div className="customer-section-heading">
          <div>
            <p className="customer-eyebrow">
              PRODUCTS
            </p>

            <h2>RO products & spare parts</h2>

            <p>
              Browse water purifiers and genuine RO
              components for your system.
            </p>
          </div>

          <Link to="/products">
            View all products →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="customer-empty-products">
            <h3>Products coming soon</h3>

            <p>
              Nirmal Enterprises products will appear
              here once they are added to the catalogue.
            </p>
          </div>
        ) : (
          <div className="customer-product-grid">
            {featuredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                className="customer-product-card"
                key={product.id}
              >
                <div className="customer-product-image">
                  {product.images &&
                    product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                    />
                  ) : (
                    <span>Product</span>
                  )}
                </div>

                <div className="customer-product-info">
                  <span>{product.category}</span>

                  <h3>{product.name}</h3>

                  <strong>
                    ₹{product.sellingPrice}
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="customer-call-section">
        <div>
          <p className="customer-eyebrow">
            NEED HELP?
          </p>

          <h2>Talk to Nirmal Enterprises</h2>

          <p>
            Have a question about a purifier, spare part
            or service? We're here to help.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="tel:+919999999999"
            className="customer-call-button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '18px' }}>📞</span> Call Now
          </a>

          <a
            href="https://wa.me/919999999999?text=Hello%20Nirmal%20Enterprises,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noreferrer"
            className="customer-call-button"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', borderColor: '#25D366', color: '#fff' }}
          >
            <span style={{ fontSize: '18px' }}>💬</span> WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default CustomerHome;