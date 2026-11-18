function InvoicePreview({
  sale,
  customer,
  onClose,
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-modal">
        <div className="invoice-actions">
          <button
            className="primary-button"
            onClick={handlePrint}
          >
            Print / Save PDF
          </button>

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="invoice-document">
          <div className="invoice-header">
            <div>
              <p className="eyebrow">
                NIRMAL ENTERPRISES
              </p>

              <h2>Sales Invoice</h2>

              <p>
                RO Service & Water Purifier Solutions
              </p>
              <p style={{ fontSize: '12px', color: '#526b6d', margin: '4px 0 0' }}>
                Phone / WhatsApp: +91 9329688963
              </p>
            </div>

            <div className="invoice-number">
              <span>Invoice Number</span>
              <strong>{sale.invoiceNumber}</strong>

              <span>Date</span>
              <strong>{sale.saleDate}</strong>
            </div>
          </div>

          <div className="invoice-customer">
            <div>
              <span>Customer</span>

              <strong>
                {customer?.name || "Unknown Customer"}
              </strong>

              {customer?.mobile && (
                <p>Mobile: {customer.mobile}</p>
              )}

              {customer?.address && (
                <p>Address: {customer.address}</p>
              )}
            </div>

            <div>
              <span>Sale Type</span>

              <strong>
                {sale.saleType || "Offline"}
              </strong>
            </div>
          </div>

          <div className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {sale.items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <div className="invoice-product">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                          />
                        )}

                        <span>{item.productName}</span>
                      </div>
                    </td>

                    <td>{item.quantity}</td>

                    <td>
                      ₹{item.sellingPrice}
                    </td>

                    <td>
                      ₹
                      {item.sellingPrice *
                        item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="invoice-summary">
            <div>
              <span>Total Amount</span>
              <strong>
                ₹{sale.totalAmount}
              </strong>
            </div>

            <div>
              <span>Paid Amount</span>
              <strong>
                ₹{sale.paidAmount}
              </strong>
            </div>

            <div>
              <span>Remaining</span>
              <strong>
                ₹{sale.remainingAmount}
              </strong>
            </div>

            <div>
              <span>Payment Status</span>
              <strong>
                {sale.paymentStatus}
              </strong>
            </div>
          </div>

          <div className="invoice-footer">
            <p>
              Thank you for choosing Nirmal Enterprises. Call / WhatsApp: +91 9329688963
            </p>

            <p>
              This is a computer-generated invoice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;