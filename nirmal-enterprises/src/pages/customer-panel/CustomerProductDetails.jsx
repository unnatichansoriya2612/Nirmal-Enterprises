import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function CustomerProductDetails({ products, cartItems, setCartItems }) {
  const { productId } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) {
    return (
      <div className="customer-product-not-found">
        <p className="customer-eyebrow">
          PRODUCT
        </p>

        <h1>Product not found</h1>

        <p>
          The product you're looking for is not
          available.
        </p>

        <Link
          to="/products"
          className="customer-primary-button"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const stock = Number(product.currentStock ?? product.stock ?? 10);
  const displayPrice = product.price ?? product.sellingPrice ?? 0;

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isAvailable = stock > 0;

  const handleAddToCart = () => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { 
        ...product, 
        sellingPrice: displayPrice,
        price: displayPrice,
        quantity 
      }]);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="customer-product-details-page">
      <Link
        to="/products"
        className="customer-back-link"
      >
        ← Back to Products
      </Link>

      <section className="customer-product-details">
        <div className="customer-product-gallery">
          {product.images &&
          product.images.length > 0 ? (
            <div className="customer-product-main-image">
              <img
                src={product.images[0]}
                alt={product.name}
              />
            </div>
          ) : (
            <div className="customer-product-main-image customer-product-no-image">
              <span>Product Image</span>
            </div>
          )}

          {product.images &&
            product.images.length > 1 && (
              <div className="customer-product-thumbnails">
                {product.images.map(
                  (image, index) => (
                    <div
                      className="customer-product-thumbnail"
                      key={index}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        <div className="customer-product-details-info">
          <span className="customer-product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <strong className="customer-product-price">
            ₹{product.sellingPrice}
          </strong>

          {product.description && (
            <p className="customer-product-description">
              {product.description}
            </p>
          )}

          <div className="customer-product-availability">
            <span
              className={
                isAvailable
                  ? "available"
                  : "unavailable"
              }
            >
              {isAvailable
                ? `${stock} available`
                : "Currently unavailable"}
            </span>
          </div>

          {isAvailable && (
            <div className="customer-product-purchase">
              <div className="customer-quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= stock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="customer-primary-button customer-add-cart-button"
                onClick={handleAddToCart}
                style={{ backgroundColor: added ? '#2b8a3e' : '' }}
              >
                {added ? "Added!" : "Add to Cart"}
              </button>
            </div>
          )}

          {!isAvailable && (
            <button
              type="button"
              className="customer-primary-button"
              disabled
            >
              Out of Stock
            </button>
          )}

          <div className="customer-product-information">
            <h2>Product Information</h2>

            <div className="customer-product-information-row">
              <span>Category</span>
              <strong>
                {product.category || "Not specified"}
              </strong>
            </div>

            <div className="customer-product-information-row">
              <span>Availability</span>
              <strong>
                {isAvailable
                  ? "In Stock"
                  : "Out of Stock"}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerProductDetails;