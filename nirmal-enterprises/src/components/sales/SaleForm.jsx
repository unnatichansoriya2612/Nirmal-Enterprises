function SaleForm({
  customers,
  products,
  saleCustomerId,
  setSaleCustomerId,
  saleItems,
  salePaidAmount,
  setSalePaidAmount,
  salePaymentStatus,
  setSalePaymentStatus,
  saleTotal,
  onAddProduct,
  onQuantityChange,
  onRemoveItem,
  onSave,
  onCancel,
}) {
  return (
    <section className="form-card sale-form-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OFFLINE SALE</p>
          <h3>Create New Sale</h3>
          <p>
            Record a customer purchase and automatically update inventory.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Customer</label>

          <select
            value={saleCustomerId}
            onChange={(e) => setSaleCustomerId(e.target.value)}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name} - {customer.mobile}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Add Product</label>

          <select
            value=""
            onChange={(e) => {
              if (e.target.value !== "") {
                onAddProduct(e.target.value);
              }
            }}
          >
            <option value="">Select product to add</option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                disabled={product.currentStock <= 0}
              >
                {product.name} - ₹{product.sellingPrice} (
                {product.currentStock} in stock)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sale-items-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">ITEMS</p>
            <h3>Sale Items</h3>
          </div>
        </div>

        {saleItems.length === 0 ? (
          <div className="empty-state">
            <h3>No products added</h3>
            <p>
              Select a product above to add it to this sale.
            </p>
          </div>
        ) : (
          <div className="sale-items-list">
            {saleItems.map((item) => (
              <div
                className="sale-item-card"
                key={item.productId}
              >
                <div className="sale-item-image">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                    />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                <div className="sale-item-info">
                  <strong>{item.productName}</strong>

                  <span>
                    ₹{item.sellingPrice} per unit
                  </span>

                  <small>
                    Available stock: {item.availableStock}
                  </small>
                </div>

                <div className="sale-item-quantity">
                  <label>Quantity</label>

                  <input
                    type="number"
                    min="1"
                    max={item.availableStock}
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange(
                        item.productId,
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="sale-item-total">
                  <span>Total</span>

                  <strong>
                    ₹{item.sellingPrice * item.quantity}
                  </strong>
                </div>

                <button
                  type="button"
                  className="remove-item-button"
                  onClick={() =>
                    onRemoveItem(item.productId)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sale-payment-section">
        <div className="sale-total-box">
          <span>Sale Total</span>
          <strong>₹{saleTotal}</strong>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Payment Status</label>

            <select
              value={salePaymentStatus}
              onChange={(e) =>
                setSalePaymentStatus(e.target.value)
              }
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Paid Amount</label>

            <input
              type="number"
              min="0"
              max={saleTotal}
              placeholder="₹ 0"
              value={salePaidAmount}
              onChange={(e) =>
                setSalePaidAmount(e.target.value)
              }
            />
          </div>
        </div>

        <div className="sale-payment-summary">
          <div>
            <span>Total</span>
            <strong>₹{saleTotal}</strong>
          </div>

          <div>
            <span>Paid</span>
            <strong>
              ₹{Number(salePaidAmount || 0)}
            </strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>
              ₹
              {Math.max(
                saleTotal -
                  Number(salePaidAmount || 0),
                0
              )}
            </strong>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="primary-button"
          onClick={onSave}
        >
          Save Sale
        </button>

        <button
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}

export default SaleForm;