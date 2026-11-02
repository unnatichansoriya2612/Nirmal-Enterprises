function ProductList({
  products,
  filteredProducts,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search product, brand or model..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="RO Product">RO Products</option>
        <option value="RO Part">RO Parts</option>
      </select>

      <br />
      <br />

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : filteredProducts.length === 0 ? (
        <p>No matching products found.</p>
      ) : (
        filteredProducts.map((product) => {
          const isLowStock =
            product.currentStock <= product.minimumStock;

          return (
            <div key={product.id}>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width="200"
                />
              )}

              <h3>{product.name}</h3>

              <p>
                Category: {product.category}
              </p>

              {product.brand && (
                <p>
                  Brand: {product.brand}
                </p>
              )}

              {product.model && (
                <p>
                  Model: {product.model}
                </p>
              )}

              {product.description && (
                <p>{product.description}</p>
              )}

              {product.specifications && (
                <p>
                  Specifications:{" "}
                  {product.specifications}
                </p>
              )}

              <p>
                Selling Price: ₹{product.sellingPrice}
              </p>

              <p>
                Available Stock: {product.currentStock}
              </p>

              {isLowStock && (
                <p>⚠️ Low Stock</p>
              )}

              {product.warranty && (
                <p>
                  Warranty: {product.warranty}
                </p>
              )}

              <button
                type="button"
                onClick={() => onEdit(product.id)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>

              <hr />
            </div>
          );
        })
      )}
    </div>
  );
}

export default ProductList;