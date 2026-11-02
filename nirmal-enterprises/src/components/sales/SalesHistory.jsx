function SalesHistory({
  sales,
  customers,
  onDeleteSale,
  onViewInvoice,
}) {
  const getCustomer = (customerId) => {
    return customers.find(
      (customer) => customer.id === customerId
    );
  };

  return (
    <section className="sales-history-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TRANSACTIONS</p>
          <h3>Sales History</h3>
          <p>
            View recorded sales, payments and invoices.
          </p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="empty-state">
          <h3>No sales recorded yet.</h3>
          <p>
            Create your first sale to see it here.
          </p>
        </div>
      ) : (
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {[...sales].reverse().map((sale) => {
                const customer = getCustomer(
                  sale.customerId
                );

                return (
                  <tr key={sale.id}>
                    <td>
                      <strong>
                        {sale.invoiceNumber}
                      </strong>
                    </td>

                    <td>{sale.saleDate}</td>

                    <td>
                      {customer?.name || "Unknown Customer"}
                    </td>

                    <td>
                      {sale.items.length} product
                      {sale.items.length !== 1
                        ? "s"
                        : ""}
                    </td>

                    <td>
                      ₹{sale.totalAmount}
                    </td>

                    <td>
                      ₹{sale.paidAmount}
                    </td>

                    <td>
                      ₹{sale.remainingAmount}
                    </td>

                    <td>
                      <span
                        className={`payment-badge ${sale.paymentStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span className="sale-type-badge">
                        {sale.saleType || "Offline"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() =>
                            onViewInvoice(sale)
                          }
                        >
                          View Bill
                        </button>

                        <button
                          onClick={() =>
                            onDeleteSale(sale.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SalesHistory;