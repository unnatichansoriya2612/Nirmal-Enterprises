import { useState } from "react";

function Inventory({ products, setProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("Complete RO");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [productImages, setProductImages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const resetForm = () => {
    setProductName("");
    setProductType("Complete RO");
    setCategory("");
    setPurchasePrice("");
    setSellingPrice("");
    setCurrentStock("");
    setMinimumStock("");
    setProductImages([]);
    setEditingProductId(null);
    setShowForm(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const imageData = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setProductImages((previousImages) => [
      ...previousImages,
      ...imageData,
    ]);

    event.target.value = "";
  };

  const handleRemoveImage = (imageId) => {
    setProductImages((previousImages) =>
      previousImages.filter(
        (image) => image.id !== imageId
      )
    );
  };

  const handleSaveProduct = () => {
    if (productName.trim() === "") {
      alert("Please enter product name.");
      return;
    }

    if (category.trim() === "") {
      alert("Please enter product category.");
      return;
    }

    if (purchasePrice === "" || Number(purchasePrice) < 0) {
      alert("Please enter a valid purchase price.");
      return;
    }

    if (sellingPrice === "" || Number(sellingPrice) < 0) {
      alert("Please enter a valid selling price.");
      return;
    }

    if (currentStock === "" || Number(currentStock) < 0) {
      alert("Please enter a valid current stock.");
      return;
    }

    if (minimumStock === "" || Number(minimumStock) < 0) {
      alert("Please enter a valid minimum stock.");
      return;
    }

    if (productImages.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    const productData = {
      name: productName.trim(),
      type: productType,
      category: category.trim(),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      currentStock: Number(currentStock),
      minimumStock: Number(minimumStock),
      images: productImages,
    };

    if (editingProductId === null) {
      const newProduct = {
        id: crypto.randomUUID(),
        ...productData,
      };

      setProducts([...products, newProduct]);
    } else {
      const updatedProducts = products.map((product) =>
        product.id === editingProductId
          ? {
              ...product,
              ...productData,
            }
          : product
      );

      setProducts(updatedProducts);
    }

    resetForm();
  };

  const handleEditProduct = (product) => {
    setProductName(product.name);
    setProductType(product.type);
    setCategory(product.category);
    setPurchasePrice(product.purchasePrice);
    setSellingPrice(product.sellingPrice);
    setCurrentStock(product.currentStock);
    setMinimumStock(product.minimumStock);

    setProductImages(product.images || []);

    setEditingProductId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setProducts(
      products.filter((product) => product.id !== id)
    );
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesType =
      typeFilter === "All" ||
      product.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const lowStockProducts = products.filter(
    (product) =>
      product.currentStock <= product.minimumStock
  );

  return (
    <div className="inventory-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BUSINESS</p>
          <h2>Inventory</h2>
          <p>
            Manage complete RO systems and spare parts
            available for sale.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>

      <div className="inventory-summary">
        <div className="summary-card">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="summary-card">
          <span>Complete RO</span>
          <strong>
            {
              products.filter(
                (product) =>
                  product.type === "Complete RO"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Spare Parts</span>
          <strong>
            {
              products.filter(
                (product) =>
                  product.type === "Spare Part"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card warning">
          <span>Low Stock</span>
          <strong>{lowStockProducts.length}</strong>
        </div>
      </div>

      {showForm && (
        <section className="form-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PRODUCT</p>
              <h3>
                {editingProductId === null
                  ? "Add New Product"
                  : "Edit Product"}
              </h3>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="e.g. Kent Grand RO"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Product Type</label>

              <select
                value={productType}
                onChange={(e) =>
                  setProductType(e.target.value)
                }
              >
                <option value="Complete RO">
                  Complete RO
                </option>

                <option value="Spare Part">
                  Spare Part
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                placeholder="e.g. RO + UV + UF"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Purchase Price</label>

              <input
                type="number"
                min="0"
                placeholder="₹ 0"
                value={purchasePrice}
                onChange={(e) =>
                  setPurchasePrice(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Selling Price</label>

              <input
                type="number"
                min="0"
                placeholder="₹ 0"
                value={sellingPrice}
                onChange={(e) =>
                  setSellingPrice(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Current Stock</label>

              <input
                type="number"
                min="0"
                placeholder="0"
                value={currentStock}
                onChange={(e) =>
                  setCurrentStock(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Minimum Stock</label>

              <input
                type="number"
                min="0"
                placeholder="0"
                value={minimumStock}
                onChange={(e) =>
                  setMinimumStock(e.target.value)
                }
              />
            </div>
          </div>

          <div className="product-images-section">
            <div className="product-images-heading">
              <div>
                <label>Product Images</label>

                <p>
                  Upload multiple images of this product.
                </p>
              </div>

              <label className="image-upload-button">
                + Add Images

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {productImages.length > 0 && (
              <div className="product-image-preview-grid">
                {productImages.map((image) => (
                  <div
                    className="product-image-preview"
                    key={image.id}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(image.id)
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {productImages.length === 0 && (
              <div className="image-upload-empty">
                <span>📷</span>
                <p>
                  No product images added yet.
                </p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              onClick={handleSaveProduct}
            >
              {editingProductId === null
                ? "Save Product"
                : "Update Product"}
            </button>

            <button
              className="secondary-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="inventory-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PRODUCT CATALOG</p>
            <h3>Products</h3>
          </div>
        </div>

        <div className="inventory-filters">
          <input
            type="text"
            placeholder="Search product or category..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">
              All Products
            </option>

            <option value="Complete RO">
              Complete RO
            </option>

            <option value="Spare Part">
              Spare Parts
            </option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No products added yet.</h3>

            <p>
              Add your first RO machine or spare part
              to start managing inventory.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No matching products found.</h3>

            <p>
              Try changing your search or product
              type filter.
            </p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredProducts.map((product) => {
              const isLowStock =
                product.currentStock <=
                product.minimumStock;

              return (
                <div
                  className="inventory-card"
                  key={product.id}
                >
                  <div className="inventory-card-top">
                    <div>
                      {product.images?.length > 0 && (
                        <img
                          className="inventory-product-image"
                          src={product.images[0].url}
                          alt={product.name}
                        />
                      )}

                      <span className="product-type">
                        {product.type}
                      </span>

                      <h3>{product.name}</h3>

                      <p>{product.category}</p>
                    </div>

                    <span
                      className={
                        isLowStock
                          ? "stock-badge low"
                          : "stock-badge"
                      }
                    >
                      {isLowStock
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>

                  <div className="inventory-details">
                    <div>
                      <span>Selling Price</span>

                      <strong>
                        ₹{product.sellingPrice}
                      </strong>
                    </div>

                    <div>
                      <span>Current Stock</span>

                      <strong>
                        {product.currentStock}
                      </strong>
                    </div>

                    <div>
                      <span>Minimum Stock</span>

                      <strong>
                        {product.minimumStock}
                      </strong>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() =>
                        handleEditProduct(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProduct(product.id)
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
    </div>
  );
}

export default Inventory;