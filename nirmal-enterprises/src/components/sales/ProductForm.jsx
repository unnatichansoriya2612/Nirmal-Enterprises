function ProductForm({
  editingProductId,
  productName,
  setProductName,
  category,
  setCategory,
  brand,
  setBrand,
  model,
  setModel,
  imageUrl,
  setImageUrl,
  description,
  setDescription,
  specifications,
  setSpecifications,
  purchasePrice,
  setPurchasePrice,
  sellingPrice,
  setSellingPrice,
  currentStock,
  setCurrentStock,
  minimumStock,
  setMinimumStock,
  warranty,
  setWarranty,
  notes,
  setNotes,
  onSave,
  onCancel,
}) {
  return (
    <div>
      <h3>
        {editingProductId === null
          ? "Add New Product"
          : "Edit Product"}
      </h3>

      <label>Product Name</label>

      <input
        type="text"
        placeholder="Example: Kent Grand RO"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <br />
      <br />

      <label>Category</label>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="RO Product">RO Product</option>
        <option value="RO Part">RO Part</option>
      </select>

      <br />
      <br />

      <label>Brand</label>

      <input
        type="text"
        placeholder="Example: Kent"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <br />
      <br />

      <label>Model</label>

      <input
        type="text"
        placeholder="Example: Grand Plus"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <br />
      <br />

      <label>Product Image URL</label>

      <input
        type="text"
        placeholder="Paste product image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <br />
      <br />

      <label>Description</label>

      <textarea
        placeholder="Describe the product..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <label>Specifications</label>

      <textarea
        placeholder="Example: 8L storage, RO + UV + UF..."
        value={specifications}
        onChange={(e) => setSpecifications(e.target.value)}
      />

      <br />
      <br />

      <label>Purchase Price</label>

      <input
        type="number"
        min="0"
        placeholder="Purchase price"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
      />

      <br />
      <br />

      <label>Selling Price</label>

      <input
        type="number"
        min="0"
        placeholder="Selling price"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
      />

      <br />
      <br />

      <label>Current Stock</label>

      <input
        type="number"
        min="0"
        placeholder="Current quantity"
        value={currentStock}
        onChange={(e) => setCurrentStock(e.target.value)}
      />

      <br />
      <br />

      <label>Minimum Stock</label>

      <input
        type="number"
        min="0"
        placeholder="Low stock warning level"
        value={minimumStock}
        onChange={(e) => setMinimumStock(e.target.value)}
      />

      <br />
      <br />

      <label>Warranty</label>

      <input
        type="text"
        placeholder="Example: 1 year"
        value={warranty}
        onChange={(e) => setWarranty(e.target.value)}
      />

      <br />
      <br />

      <label>Notes</label>

      <textarea
        placeholder="Optional notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />
      <br />

      <button onClick={onSave}>
        {editingProductId === null
          ? "Save Product"
          : "Update Product"}
      </button>

      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default ProductForm;