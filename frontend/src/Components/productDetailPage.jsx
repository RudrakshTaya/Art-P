import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useCart } from "../Context/cartContext"
import { useAuth } from "../Components/useAuth"
import { Star, StarHalf, Heart, Share2, Truck, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react"
import './productDetailPage.css'

function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/products/${productId}`)
        setProduct(response.data)
        const relatedResponse = await axios.get(`http://localhost:5002/api/products/type/${response.data.type}`)
        setRelatedProducts(relatedResponse.data.filter((p) => p._id !== productId).slice(0, 4))
      } catch (error) {
        console.error("Error fetching product details:", error)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  const handleAddToCart = async () => {
    if (!userId) {
      alert("You need to be logged in to add items to the cart.")
      navigate("/signin")
      return
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color before adding to cart.")
      return
    }

    setProcessing(true)
    try {
      await addToCart(product, quantity, selectedSize, selectedColor)
      alert("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("An error occurred while adding to cart. Please try again later.")
    } finally {
      setProcessing(false)
    }
  }

  const handleBuyNow = async () => {
    if (!userId) {
      alert("You need to be logged in to complete the purchase.")
      navigate("/signin")
      return
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color before proceeding to checkout.")
      return
    }

    setProcessing(true)
    try {
      const token = localStorage.getItem("token")
      const orderResponse = await axios.post(
        "http://localhost:5002/api/placeorder",
        {
          products: [{ productId: product._id, quantity, size: selectedSize, color: selectedColor }],
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const orderData = orderResponse.data
      if (orderData.message === "Order placed successfully") {
        initiateRazorpay(orderData)
      } else {
        alert(`Failed to create order: ${orderData.message}`)
      }
    } catch (error) {
      console.error("Error during order creation:", error)
      alert("An error occurred while creating the order. Please try again later.")
    } finally {
      setProcessing(false)
    }
  }

  const initiateRazorpay = (orderData) => {
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_lnw8y27v4NY3zx",
        amount: orderData.total * 100,
        currency: "INR",
        order_id: orderData.razorpayOrderId,
        name: "Your Company Name",
        description: "Product Purchase",
        image: "https://your-logo-url.com",
        handler: (response) => {
          alert("Payment successful!")
          navigate("/confirmation")
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
        notes: {
          address: "Customer address",
        },
        theme: {
          color: "#3399cc",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } else {
      console.error("Razorpay SDK is not loaded or initialized.")
      alert("Failed to load Razorpay. Please try again later.")
    }
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1))
  }

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star" fill="currentColor" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="star" fill="currentColor" />)
    }

    return stars
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement actual wishlist functionality
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .then(() => {
          console.log("Thanks for sharing!")
        })
        .catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Share this product: " + window.location.href)
    }
  }

  if (loading) {
    return <p className="loading">Loading product details...</p>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!product) {
    return <div className="not-found">Product not found.</div>
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/category">Category</Link> &gt; {product.name}
      </div>
      <div className="product-content">
        <div className="image-gallery">
          <img
            className="main-image"
            src={product.images[currentImageIndex]?.url || "/placeholder.svg"}
            alt={`${product.name} ${currentImageIndex + 1}`}
          />
          <div className="image-nav">
            <button onClick={handlePrevImage} aria-label="Previous image">
              <ArrowLeft />
            </button>
            <button onClick={handleNextImage} aria-label="Next image">
              <ArrowRight />
            </button>
          </div>
          <div className="thumbnails">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url || "/placeholder.svg"}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={index === currentImageIndex ? "active" : ""}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price?.toFixed(2)}</p>
          <div className="product-rating">
            <div className="stars">{renderStarRating(product.ratings.averageRating)}</div>
            <span className="rating-count">({product.ratings.reviewCount} reviews)</span>
          </div>

          <div className="product-options">
            <div className="size-selection">
              <h3>Size:</h3>
              <div className="size-buttons">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? "selected" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="color-selection">
              <h3>Color:</h3>
              <div className="color-buttons">
                {["Red", "Blue", "Green", "Black"].map((color) => (
                  <button
                    key={color}
                    className={selectedColor === color ? "selected" : ""}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quantity-selection">
            <h3>Quantity:</h3>
            <div className="quantity-input">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart} disabled={processing}>
              {processing ? "Processing..." : "Add to Cart"}
            </button>
            <button className="buy-now" onClick={handleBuyNow} disabled={processing}>
              {processing ? "Processing..." : "Buy Now"}
            </button>
          </div>

          <div className="additional-actions">
            <button className={`wishlist ${isWishlisted ? "active" : ""}`} onClick={toggleWishlist}>
              <Heart /> {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button className="share" onClick={shareProduct}>
              <Share2 /> Share
            </button>
          </div>

          <div className="product-meta">
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
          
          </div>

          <div className="product-features">
            <div className="feature">
              <Truck />
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <ShieldCheck />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-description">
        <h2>Product Description</h2>
        <p>
          {showFullDescription ? product.description : `${product.description?.substring(0, 200)}...`}
          {product.description?.length > 200 && (
            <button className="show-more" onClick={toggleDescription}>
              {showFullDescription ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
      </div>

      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-list">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="related-product">
              <img src={relatedProduct.images[0]?.url || "/placeholder.svg"} alt={relatedProduct.name} />
              <h3>{relatedProduct.name}</h3>
              <p className="price">${relatedProduct.price?.toFixed(2)}</p>
              <Link to={`/product/${relatedProduct._id}`} className="view-product">
                View Product
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

