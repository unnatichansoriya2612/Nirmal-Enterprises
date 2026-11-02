import { useState } from "react";
import { Link } from "react-router-dom";

function CustomerProducts({ products }) {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      search === "" ||
      product.name.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.description
        ?.toLowerCase()
        .includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="customer-products-page">
      <section className="customer-page-hero">
        <div>
          <p className="customer-eyebrow">
            NIRMAL ENTERPRISES
          </p>

          <h1>RO Products & Spare Parts</h1>

          <p>
            Explore water purifiers, genuine RO spare
            parts and accessories for your water
            purification system.
          </p>
        </div>
      </section>

      <section className="customer-products-content">
        <div className="customer-products-toolbar">
          <div className="customer-category-list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "customer-category-button active"
                    : "customer-category-button"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="customer-product-search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {products.length === 0 ? (
          <div className="customer-empty-products">
            <h2>Products coming soon</h2>

            <p>
              Nirmal Enterprises products will appear
              here once they are added to the catalogue.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="customer-empty-products">
            <h2>No products found</h2>

            <p>
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="customer-product-grid">
            {filteredProducts.map((product) => (
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

                  {product.description && (
                    <p>{product.description}</p>
                  )}

                  <strong>
                    ₹{product.sellingPrice}
                  </strong>

                  <span className="customer-view-product">
                    View Product →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerProducts;