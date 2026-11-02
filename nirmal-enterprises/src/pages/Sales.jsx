import { useState } from "react";

import ProductForm from "../components/sales/ProductForm";
import ProductList from "../components/sales/ProductList";
import SaleForm from "../components/sales/SaleForm";
import SalesHistory from "../components/sales/SalesHistory";
import InvoicePreview from "../components/sales/InvoicePreview";

function Sales({
  customers,
  products,
  sales,
  setSales,
  setProducts,
}) {
  const [showProductForm, setShowProductForm] =
    useState(false);

  const [productName, setProductName] =
    useState("");
  const [category, setCategory] =
    useState("RO Product");
  const [brand, setBrand] =
    useState("");
  const [model, setModel] =
    useState("");
  const [imageUrl, setImageUrl] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [specifications, setSpecifications] =
    useState("");
  const [purchasePrice, setPurchasePrice] =
    useState("");
  const [sellingPrice, setSellingPrice] =
    useState("");
  const [currentStock, setCurrentStock] =
    useState("");
  const [minimumStock, setMinimumStock] =
    useState("");
  const [warranty, setWarranty] =
    useState("");
  const [notes, setNotes] =
    useState("");

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showSaleForm, setShowSaleForm] =
    useState(false);

  const [saleCustomerId, setSaleCustomerId] =
    useState("");
  const [saleItems, setSaleItems] =
    useState([]);
  const [salePaidAmount, setSalePaidAmount] =
    useState("");
  const [salePaymentStatus, setSalePaymentStatus] =
    useState("Unpaid");

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const resetProductForm = () => {
    setProductName("");
    setCategory("RO Product");
    setBrand("");
    setModel("");
    setImageUrl("");
    setDescription("");
    setSpecifications("");
    setPurchasePrice("");
    setSellingPrice("");
    setCurrentStock("");
    setMinimumStock("");
    setWarranty("");
    setNotes("");
    setEditingProductId(null);
    setShowProductForm(false);
  };

  const handleSaveProduct = () => {
    if (productName.trim() === "") {
      alert("Please enter product name.");
      return;
    }

    if (sellingPrice === "") {
      alert("Please enter selling price.");
      return;
    }

    if (currentStock === "") {
      alert("Please enter current stock.");
      return;
    }

    if (minimumStock === "") {
      alert("Please enter minimum stock.");
      return;
    }

    const purchase = Number(purchasePrice || 0);
    const selling = Number(sellingPrice);
    const stock = Number(currentStock);
    const minimum = Number(minimumStock);

    if (purchase < 0) {
      alert("Purchase price cannot be negative.");
      return;
    }

    if (selling < 0) {
      alert("Selling price cannot be negative.");
      return;
    }

    if (stock < 0) {
      alert("Current stock cannot be negative.");
      return;
    }

    if (minimum < 0) {
      alert("Minimum stock cannot be negative.");
      return;
    }

    const productData = {
      name: productName.trim(),
      category,
      brand: brand.trim(),
      model: model.trim(),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      specifications: specifications.trim(),
      purchasePrice: purchase,
      sellingPrice: selling,
      currentStock: stock,
      minimumStock: minimum,
      warranty: warranty.trim(),
      notes: notes.trim(),
    };

    if (editingProductId === null) {
      const newProduct = {
        id: crypto.randomUUID(),
        ...productData,
      };

      setProducts([
        ...products,
        newProduct,
      ]);
    } else {
      const updatedProducts =
        products.map((product) => {
          if (
            product.id === editingProductId
          ) {
            return {
              ...product,
              ...productData,
            };
          }

          return product;
        });

      setProducts(updatedProducts);
    }

    resetProductForm();
  };

  const handleEditProduct = (id) => {
    const product = products.find(
      (product) => product.id === id
    );

    if (!product) {
      return;
    }

    setProductName(product.name);
    setCategory(product.category);
    setBrand(product.brand);
    setModel(product.model);
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setSpecifications(
      String(product.specifications || "")
    );
    setPurchasePrice(
      String(product.purchasePrice)
    );
    setSellingPrice(
      String(product.sellingPrice)
    );
    setCurrentStock(
      String(product.currentStock)
    );
    setMinimumStock(
      String(product.minimumStock)
    );
    setWarranty(product.warranty);
    setNotes(product.notes);

    setEditingProductId(id);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    const updatedProducts =
      products.filter(
        (product) => product.id !== id
      );

    setProducts(updatedProducts);
  };

  const filteredProducts =
    products.filter((product) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search) ||
        product.brand
          .toLowerCase()
          .includes(search) ||
        product.model
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const resetSaleForm = () => {
    setSaleCustomerId("");
    setSaleItems([]);
    setSalePaidAmount("");
    setSalePaymentStatus("Unpaid");
    setShowSaleForm(false);
  };

  const handleAddProductToSale = (
    productId
  ) => {
    if (productId === "") {
      return;
    }

    const product = products.find(
      (product) =>
        product.id === productId
    );

    if (!product) {
      return;
    }

    if (product.currentStock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const existingItem =
      saleItems.find(
        (item) =>
          item.productId === productId
      );

    if (existingItem) {
      alert(
        "This product is already added to the sale."
      );
      return;
    }

    const saleItem = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: 1,
      sellingPrice: product.sellingPrice,
    };

    setSaleItems([
      ...saleItems,
      saleItem,
    ]);
  };

  const handleSaleQuantityChange = (
    productId,
    quantity
  ) => {
    const newQuantity =
      Number(quantity);

    if (newQuantity <= 0) {
      alert(
        "Quantity must be greater than 0."
      );
      return;
    }

    const product = products.find(
      (product) =>
        product.id === productId
    );

    if (!product) {
      return;
    }

    if (
      newQuantity >
      product.currentStock
    ) {
      alert(
        `Only ${product.currentStock} unit(s) available in stock.`
      );
      return;
    }

    const updatedItems =
      saleItems.map((item) => {
        if (
          item.productId === productId
        ) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      });

    setSaleItems(updatedItems);
  };

  const handleRemoveSaleItem = (
    productId
  ) => {
    const updatedItems =
      saleItems.filter(
        (item) =>
          item.productId !== productId
      );

    setSaleItems(updatedItems);
  };

  const saleTotal =
    saleItems.reduce(
      (total, item) =>
        total +
        item.sellingPrice *
          item.quantity,
      0
    );

  const generateInvoiceNumber = () => {
    const currentYear =
      new Date().getFullYear();

    const yearPrefix =
      `NE-${currentYear}-`;

    const existingNumbers =
      sales
        .filter(
          (sale) =>
            sale.invoiceNumber &&
            sale.invoiceNumber.startsWith(
              yearPrefix
            )
        )
        .map((sale) =>
          Number(
            sale.invoiceNumber.replace(
              yearPrefix,
              ""
            )
          )
        )
        .filter(
          (number) =>
            !Number.isNaN(number)
        );

    const highestNumber =
      existingNumbers.length > 0
        ? Math.max(...existingNumbers)
        : 0;

    const nextNumber =
      highestNumber + 1;

    return `${yearPrefix}${String(
      nextNumber
    ).padStart(4, "0")}`;
  };

  const handleSaveSale = () => {
    if (saleCustomerId === "") {
      alert(
        "Please select a customer."
      );
      return;
    }

    if (saleItems.length === 0) {
      alert(
        "Please add at least one product."
      );
      return;
    }

    const paid = Number(
      salePaidAmount || 0
    );

    if (paid < 0) {
      alert(
        "Paid amount cannot be negative."
      );
      return;
    }

    if (paid > saleTotal) {
      alert(
        "Paid amount cannot be greater than total amount."
      );
      return;
    }

    if (
      salePaymentStatus === "Paid" &&
      paid !== saleTotal
    ) {
      alert(
        "For a Paid sale, paid amount must equal total amount."
      );
      return;
    }

    if (
      salePaymentStatus === "Unpaid" &&
      paid !== 0
    ) {
      alert(
        "For an Unpaid sale, paid amount must be ₹0."
      );
      return;
    }

    if (
      salePaymentStatus === "Partial" &&
      (paid === 0 ||
        paid === saleTotal)
    ) {
      alert(
        "For a Partial payment, paid amount must be greater than ₹0 and less than the total amount."
      );
      return;
    }

    for (const item of saleItems) {
      const product = products.find(
        (product) =>
          product.id === item.productId
      );

      if (!product) {
        alert(
          `Product "${item.productName}" no longer exists.`
        );
        return;
      }

      if (
        item.quantity >
        product.currentStock
      ) {
        alert(
          `Not enough stock for "${product.name}".`
        );
        return;
      }
    }

    const saleData = {
      id: crypto.randomUUID(),

      invoiceNumber:
        generateInvoiceNumber(),

      saleDate: new Date()
        .toISOString()
        .split("T")[0],

      customerId:
        saleCustomerId,

      items: saleItems,

      totalAmount:
        saleTotal,

      paidAmount:
        paid,

      remainingAmount:
        saleTotal - paid,

      paymentStatus:
        salePaymentStatus,
    };

    setSales([
      ...sales,
      saleData,
    ]);

    const updatedProducts =
      products.map((product) => {
        const soldItem =
          saleItems.find(
            (item) =>
              item.productId ===
              product.id
          );

        if (!soldItem) {
          return product;
        }

        return {
          ...product,
          currentStock:
            product.currentStock -
            soldItem.quantity,
        };
      });

    setProducts(updatedProducts);

    const customer =
      customers.find(
        (customer) =>
          customer.id ===
          saleCustomerId
      );

    setSelectedInvoice({
      sale: saleData,
      customer: customer,
    });

    resetSaleForm();
  };

  const handleDeleteSale = (
    saleId
  ) => {
    const confirmDelete =
      window.confirm(
        "Deleting this sale will also restore the sold products to inventory. Continue?"
      );

    if (!confirmDelete) {
      return;
    }

    const sale = sales.find(
      (sale) =>
        sale.id === saleId
    );

    if (!sale) {
      return;
    }

    const restoredProducts =
      products.map((product) => {
        const soldItem =
          sale.items.find(
            (item) =>
              item.productId ===
              product.id
          );

        if (!soldItem) {
          return product;
        }

        return {
          ...product,
          currentStock:
            product.currentStock +
            soldItem.quantity,
        };
      });

    setProducts(
      restoredProducts
    );

    const updatedSales =
      sales.filter(
        (sale) =>
          sale.id !== saleId
      );

    setSales(updatedSales);

    if (
      selectedInvoice &&
      selectedInvoice.sale.id === saleId
    ) {
      setSelectedInvoice(null);
    }
  };

  const handleViewInvoice = (
    sale,
    customer
  ) => {
    setSelectedInvoice({
      sale,
      customer,
    });
  };

  return (
    <div>
      <h1>Sales</h1>

      <p>
        Manage products and sales for
        Nirmal Enterprises.
      </p>

      {selectedInvoice && (
        <InvoicePreview
          sale={
            selectedInvoice.sale
          }
          customer={
            selectedInvoice.customer
          }
          onClose={() =>
            setSelectedInvoice(null)
          }
        />
      )}

      <section>
        <h2>
          Product Catalogue
        </h2>

        <button
          onClick={() =>
            setShowProductForm(true)
          }
        >
          Add Product
        </button>

        {showProductForm && (
          <ProductForm
            editingProductId={
              editingProductId
            }
            productName={
              productName
            }
            setProductName={
              setProductName
            }
            category={category}
            setCategory={
              setCategory
            }
            brand={brand}
            setBrand={setBrand}
            model={model}
            setModel={setModel}
            imageUrl={imageUrl}
            setImageUrl={
              setImageUrl
            }
            description={
              description
            }
            setDescription={
              setDescription
            }
            specifications={
              specifications
            }
            setSpecifications={
              setSpecifications
            }
            purchasePrice={
              purchasePrice
            }
            setPurchasePrice={
              setPurchasePrice
            }
            sellingPrice={
              sellingPrice
            }
            setSellingPrice={
              setSellingPrice
            }
            currentStock={
              currentStock
            }
            setCurrentStock={
              setCurrentStock
            }
            minimumStock={
              minimumStock
            }
            setMinimumStock={
              setMinimumStock
            }
            warranty={warranty}
            setWarranty={
              setWarranty
            }
            notes={notes}
            setNotes={setNotes}
            onSave={
              handleSaveProduct
            }
            onCancel={
              resetProductForm
            }
          />
        )}

        <br />
        <br />

        <ProductList
          products={products}
          filteredProducts={
            filteredProducts
          }
          searchTerm={
            searchTerm
          }
          setSearchTerm={
            setSearchTerm
          }
          categoryFilter={
            categoryFilter
          }
          setCategoryFilter={
            setCategoryFilter
          }
          onEdit={
            handleEditProduct
          }
          onDelete={
            handleDeleteProduct
          }
        />
      </section>

      <section>
        <h2>
          Sales Transactions
        </h2>

        <button
          onClick={() =>
            setShowSaleForm(true)
          }
          disabled={
            customers.length === 0 ||
            products.length === 0
          }
        >
          New Sale
        </button>

        {customers.length === 0 && (
          <p>
            Add a customer before
            creating a sale.
          </p>
        )}

        {products.length === 0 && (
          <p>
            Add a product before
            creating a sale.
          </p>
        )}

        {showSaleForm && (
          <SaleForm
            customers={customers}
            products={products}
            saleCustomerId={
              saleCustomerId
            }
            setSaleCustomerId={
              setSaleCustomerId
            }
            saleItems={
              saleItems
            }
            salePaidAmount={
              salePaidAmount
            }
            setSalePaidAmount={
              setSalePaidAmount
            }
            salePaymentStatus={
              salePaymentStatus
            }
            setSalePaymentStatus={
              setSalePaymentStatus
            }
            saleTotal={
              saleTotal
            }
            onAddProduct={
              handleAddProductToSale
            }
            onQuantityChange={
              handleSaleQuantityChange
            }
            onRemoveItem={
              handleRemoveSaleItem
            }
            onSave={
              handleSaveSale
            }
            onCancel={
              resetSaleForm
            }
          />
        )}
      </section>

      <SalesHistory
        sales={sales}
        customers={customers}
        onDeleteSale={
          handleDeleteSale
        }
        onViewInvoice={
          handleViewInvoice
        }
      />
    </div>
  );
}

export default Sales;
