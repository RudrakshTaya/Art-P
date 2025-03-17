"use client"

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Context/cartContext";
import { useAuth } from "../Components/useAuth";
import { useWishlist } from "../Context/wishlistContext";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import "./productDetailPage.css";

// Constants
const API_BASE_URL = "http://localhost:5002/api";

// Utility Functions
const calculateFinalPrice = (price, discount) => {
  if (discount && discount.percentage && new Date(discount.expiresAt) > new Date()) {
    return price * (1 - discount.percentage / 100);
  }
  return price;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const getStockStatus = (stock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock < 5) return `Low Stock: Only ${stock} left`;
  return "In Stock";
};

const getStockStatusClass = (stock) => {
  if (stock <= 0) return "out-of-stock";
  if (stock < 5) return "low-stock";
  return "in-stock";
};

// Subcomponents
const ImageGallery = ({ images, currentImageIndex, setCurrentImageIndex }) => (
  <div className="image-gallery">
    <div className="main-image-container">
      <img
        className="main-image"
        src={images[currentImageIndex]?.url || "/placeholder.svg"}
        alt={images[currentImageIndex]?.altText || "Product Image"}
      />
      {images.length > 1 && (
        <div className="image-nav">
          <button
            className="nav-button prev"
            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
          >
            <ArrowLeft />
          </button>
          <button
            className="nav-button next"
            onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
    {images.length > 1 && (
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={image.url || `img-${index}`}
            src={image.url || "/placeholder.svg"}
            alt={image.altText || `Thumbnail ${index + 1}`}
            className={index === currentImageIndex ? "active" : ""}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    )}
  </div>
);



// Main Component
function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userId } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist: checkIfInWishlist } = useWishlist();
  const isInWishlist = useMemo(() => checkIfInWishlist(product?._id), [product, checkIfInWishlist]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        setProduct(response.data);

        if (response.data.customizationOptions?.length > 0) {
          const initialCustomizations = {};
          response.data.customizationOptions.forEach((option) => {
            if (option.defaultValue) {
              initialCustomizations[option.optionName] = option.defaultValue;
            }
          });
          setSelectedCustomizations(initialCustomizations);
        }

        const relatedResponse = await axios.get(`${API_BASE_URL}/products/type/${response.data.category}`);
        setRelatedProducts(relatedResponse.data.filter((p) => p._id !== productId).slice(0, 4));
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleCustomizationChange = useCallback((optionName, value) => {
    setSelectedCustomizations((prev) => ({ ...prev, [optionName]: value }));
  }, []);

  const handleAddToCart = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!userId) {
        alert("You need to be logged in to add items to the cart.");
        navigate("/signin");
        return;
      }

      setProcessing(true);
      try {
        await addToCart(product, quantity);
        alert("Added to cart successfully!");
        navigate("/cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to cart. Please try again later.");
      } finally {
        setProcessing(false);
      }
    },
    [userId, product, quantity, addToCart, navigate]
  );
const handleBuyNow = useCallback(() => {
  if (!product.stock || product.stock <= 0) {
    alert("Sorry, this product is out of stock.");
    return;
  }

  if (product?.customizationOptions?.some((opt) => opt.required && !selectedCustomizations[opt.optionName])) {
    alert("Please select all required customizations before proceeding to checkout.");
    return;
  }

  handleAddToCart(); // Ensure this updates cart state correctly

  setTimeout(() => { // Delay navigation slightly to ensure cart updates
    navigate("/checkout", {
      state: {
        
        userId
      }
    });
  }, 100); // Adjust delay if necessary

}, [product, selectedCustomizations,  userId, handleAddToCart, navigate]);


  const handleAddToWishlist = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!userId) {
        alert("You need to be logged in to add items to your wishlist.");
        navigate("/signin");
        return;
      }

      setProcessing(true);
      try {
        if (isInWishlist) {
          await removeFromWishlist(product._id);
          alert("Removed from wishlist");
        } else {
          await addToWishlist(product);
          alert("Added to wishlist");
        }
      } catch (error) {
        console.error("Error managing wishlist:", error);
        alert("An error occurred while managing your wishlist. Please try again later.");
      } finally {
        setProcessing(false);
      }
    },
    [userId, isInWishlist, product, addToWishlist, removeFromWishlist, navigate]
  );

  const shareProduct = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [product]);

  if (loading) return <div className="loading-container">Loading product details...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!product) return <div className="not-found-container">Product not found.</div>;

  return (
    <div className="product-detail-container">
      <div className="product-content">
        <ImageGallery
          images={product.images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-meta">
            {product.brand && <span className="product-brand">By {product.brand}</span>}
            <div className="product-ratings">
              {product.ratings && (
                <>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        fill={i < Math.round(product.ratings.averageRating) ? "#FFD700" : "none"}
                        stroke="#FFD700"
                      />
                    ))}
                  </div>
                  <span className="rating-value">{product.ratings.averageRating.toFixed(1)}</span>
                  <span className="review-count">({product.ratings.reviewCount} reviews)</span>
                </>
              )}
            </div>
          </div>
          <div className="product-pricing">
            {product.discount && product.discount.percentage && new Date(product.discount.expiresAt) > new Date() ? (
              <>
                <p className="original-price">₹{product.price?.toFixed(2)}</p>
                <p className="sale-price">₹{calculateFinalPrice(product.price, product.discount).toFixed(2)}</p>
                <p className="discount-info">
                  Save {product.discount.percentage}% until {formatDate(product.discount.expiresAt)}
                </p>
              </>
            ) : (
              <p className="product-price">₹{product.price?.toFixed(2)}</p>
            )}
          </div>
          <p className={`product-stock ${getStockStatusClass(product.stock)}`}>
            {getStockStatus(product.stock)}
          </p>
          <div className="description-preview">
            <p>
              {showFullDescription
                ? product.description
                : `${product.description.substring(0, 150)}${product.description.length > 150 ? "..." : ""}`}
            </p>
            {product.description.length > 150 && (
              <button className="show-more" onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          {product?.customizationOptions?.length > 0 && (
            <div className="customization-options">
              <h3>Customization Options</h3>
              {product.customizationOptions.map((option, index) => (
                <div key={`${option.optionName}-${index}`} className="customization-option">
                  <label>
                    {option.optionName} {option.required && <span className="required">*</span>}
                  </label>
                  {option.optionType === "text" && (
                    <input
                      type="text"
                      placeholder={`Enter ${option.optionName}`}
                      value={selectedCustomizations[option.optionName] || ""}
                      onChange={(e) => handleCustomizationChange(option.optionName, e.target.value)}
                      className="customization-input"
                    />
                  )}
                  {option.optionType === "select" && option.values?.length > 0 && (
                    <select
                      value={selectedCustomizations[option.optionName] || ""}
                      onChange={(e) => handleCustomizationChange(option.optionName, e.target.value)}
                      className="customization-select"
                    >
                      <option value="">Select {option.optionName}</option>
                      {option.values.map((value, idx) => (
                        <option key={`${value}-${idx}`} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}
                  {option.optionType === "image" && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCustomizationChange(option.optionName, e.target.files?.[0])}
                      className="customization-file"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="quantity-selection">
            <h3>Quantity:</h3>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={product.stock <= 0}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, Number(e.target.value))))}
                min="1"
                max={product.stock || 1}
                disabled={product.stock <= 0}
              />
              <button
                onClick={() => setQuantity((prev) => Math.min(product.stock || 1, prev + 1))}
                disabled={product.stock <= 0}
              >
                +
              </button>
            </div>
          </div>
          <div className="product-actions">
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || processing}
            >
              Add to Cart
            </button>
            <button
              className="buy-now-button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Buy Now
            </button>
            <button className={`wishlist-button ${isInWishlist ? "active" : ""}`} onClick={handleAddToWishlist}>
              <Heart fill={isInWishlist ? "#ff4d4d" : "none"} />
            </button>
            <button className="share-button" onClick={shareProduct}>
              <Share2 />
            </button>
          </div>

          <div className="product-benefits">
            <div className="benefit">
              <Truck className="benefit-icon" />
              <span>Free Delivery on orders over ₹1000</span>
            </div>
            <div className="benefit">
              <Shield className="benefit-icon" />
              <span>1 Year Warranty</span>
            </div>
            <div className="benefit">
              <Clock className="benefit-icon" />
              <span>Easy 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-tabs">
        <div className="tabs">
          <button 
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button 
          className={activeTab === "specifications" ? "active" : ""}
          onClick={() => setActiveTab("specifications")}
        >
          Specifications
        </button>
        <button 
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({product.ratings?.reviewCount || 0})
        </button>
        <button 
          className={activeTab === "shipping" ? "active" : ""}
          onClick={() => setActiveTab("shipping")}
        >
          Shipping & Returns
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "description" && (
          <div className="description-tab">
            <h3>Product Description</h3>
            <p>{product.description}</p>
            {product.attributes && (
              <div className="attributes">
                <h4>Features</h4>
                <ul>
                  {product.attributes.split(',').map((attribute, index) => (
                    <li key={index}>{attribute.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="specifications-tab">
            <h3>Product Specifications</h3>
            <table className="specs-table">
              <tbody>
                {product.brand && (
                  <tr>
                    <th>Brand</th>
                    <td>{product.brand}</td>
                  </tr>
                )}
                <tr>
                  <th>Category</th>
                  <td>{product.category}</td>
                </tr>
                {product.attributes && (
                  <tr>
                    <th>Type</th>
                    <td>{product.attributes}</td>
                  </tr>
                )}
                {product.isCustomizable && (
                  <tr>
                    <th>Customization</th>
                    <td>Available</td>
                  </tr>
                )}
                <tr>
                  <th>SKU</th>
                  <td>{product._id.substring(product._id.length - 8)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-tab">
            <h3>Customer Reviews</h3>
            {product.ratings?.reviewCount > 0 ? (
              <div className="review-summary">
                <div className="average-rating">
                  <h4>{product.ratings.averageRating.toFixed(1)}</h4>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < Math.round(product.ratings.averageRating) ? "#FFD700" : "none"} stroke="#FFD700" />
                    ))}
                  </div>
                  <p>Based on {product.ratings.reviewCount} reviews</p>
                </div>
                <div className="review-list">
                  {/* This would be populated with actual reviews from an API call */}
                  <p>Reviews would be displayed here</p>
                </div>
              </div>
            ) : (
              <div className="no-reviews">
                <p>This product has no reviews yet. Be the first to review!</p>
                <button className="write-review-button">Write a Review</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="shipping-tab">
            <h3>Shipping Information</h3>
            <div className="shipping-info">
              <h4>Delivery</h4>
              <p>Standard delivery: 3-5 business days</p>
              <p>Express delivery: 1-2 business days (additional charges apply)</p>
              <p>Free shipping on orders above ₹1000</p>
              
              <h4>Returns & Exchanges</h4>
              <p>We offer a 30-day return policy for most items.</p>
              <p>Items must be returned in original packaging and unused condition.</p>
              <p>Custom orders may not be eligible for return unless defective.</p>
              
              <h4>Warranty</h4>
              <p>This product comes with a 1-year manufacturer warranty against defects.</p>
            </div>
          </div>
        )}
      </div>
    </div>

    {relatedProducts.length > 0 && (
      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="product-carousel">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="related-product-card">
              <Link to={`/products/${relatedProduct._id}`}>
                <div className="product-image">
                  <img 
                    src={relatedProduct.images[0]?.url || "/placeholder.svg"} 
                    alt={relatedProduct.images[0]?.altText || relatedProduct.name} 
                  />
                </div>
                <div className="product-info">
                  <h3>{relatedProduct.name}</h3>
                  <p className="price">₹{relatedProduct.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Recently viewed section would be populated by maintaining view history in localStorage or context */}
    <div className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="product-carousel">
        {/* Content would be populated dynamically */}
        <p>You have no recently viewed items</p>
      </div>
    </div>
  </div>
)
}

export default ProductDetail