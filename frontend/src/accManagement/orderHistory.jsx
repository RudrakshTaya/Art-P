"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle, Package, Download, RefreshCw, XCircle, Star, Calendar, Filter, Search, Clock } from "lucide-react"
import { format } from "date-fns"
import jsPDF from "jspdf"
import "jspdf-autotable"
import './orderHistory.css'
const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(6)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/account/order", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(response.data.orders)
      } catch (error) {
        console.error("Failed to fetch orders", error)
        setError("Could not fetch orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF()
    // Add company logo/header
    doc.setFontSize(20)
    doc.setTextColor(44, 62, 80)
    doc.text("YourStore", 20, 20)
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice #${order._id.substring(0, 8)}`, 20, 30)
    doc.text(`Date: ${format(new Date(order.createdAt), "MMM d, yyyy")}`, 20, 40)
    doc.text(`Status: ${order.orderStatus}`, 20, 50)
    
    // Add order details
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text("Order Details", 20, 65)
    
    doc.autoTable({
      startY: 70,
      head: [["Product", "Quantity", "Unit Price", "Total"]],
      body: order.products.map((p) => [
        p.name, 
        p.quantity, 
        `$${p.price.toFixed(2)}`, 
        `$${(p.price * p.quantity).toFixed(2)}`
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [44, 62, 80] }
    })
    
    // Add summary
    const finalY = doc.autoTable.previous.finalY + 10
    doc.setFontSize(12)
    doc.text(`Subtotal: $${order.total.toFixed(2)}`, 140, finalY)
    doc.text(`Tax: $${(order.total * 0.08).toFixed(2)}`, 140, finalY + 10)
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(`Total: $${(order.total * 1.08).toFixed(2)}`, 140, finalY + 20)
    
    // Add footer
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text("Thank you for shopping with us!", 20, finalY + 35)
    
    doc.save(`Invoice_${order._id.substring(0, 8)}.pdf`)
  }

  const handleReorder = async (order) => {
    try {
      await axios.post(
        "http://localhost:5002/api/reorder",
        { orderId: order._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      // Show confirmation toast instead of alert
      showToast("Order placed successfully!")
    } catch (error) {
      showToast("Failed to reorder. Try again later.", "error")
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.post(
          `http://localhost:5002/api/cancel-order/${orderId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        showToast("Order canceled successfully")
        setOrders((prev) => prev.map(order => 
          order._id === orderId ? {...order, orderStatus: "Cancelled"} : order
        ))
      } catch (error) {
        showToast("Failed to cancel order", "error")
      }
    }
  }

  // Toast notification implementation (simple version)
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div")
    toast.className = `orderh__toast ${type === "error" ? "orderh__toast-error" : "orderh__toast-success"}`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.classList.add("orderh__toast-visible")
      setTimeout(() => {
        toast.classList.remove("orderh__toast-visible")
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 2500)
    }, 100)
  }

  const filteredOrders = orders
    .filter(
      (order) =>
        (filterStatus ? order.orderStatus.toLowerCase() === filterStatus.toLowerCase() : true) &&
        (searchTerm ? 
          order.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) 
        : true),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === "total") {
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total
      }
      return 0
    })

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Calculate estimated delivery date (for demo)
  const getEstimatedDelivery = (orderDate, status) => {
    if (status === "Delivered") return null
    if (status === "Cancelled") return null
    
    const date = new Date(orderDate)
    date.setDate(date.getDate() + (status === "Shipped" ? 3 : 7))
    return format(date, "MMM d, yyyy")
  }

  if (loading) {
    return (
      <div className="orderh__loading-container">
        <Loader2 className="orderh__spinner" size={48} />
        <p className="orderh__loading-text">Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="orderh__container">
      <div className="orderh__header">
        <h1 className="orderh__title">My Order History</h1>
        <p className="orderh__subtitle">Track, manage and reorder your previous purchases</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="orderh__error"
        >
          <AlertCircle size={20} />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="orderh__filters">
        <div className="orderh__search-wrapper">
          <Search size={18} className="orderh__search-icon" />
          <input
            type="text"
            placeholder="Search by product or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="orderh__search-input"
          />
        </div>
        
        <div className="orderh__filter-options">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="orderh__select"
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="orderh__select"
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} 
            className="orderh__sort-btn"
            aria-label={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
          >
            <Filter className={`orderh__sort-icon ${sortOrder === "asc" ? "orderh__rotate" : ""}`} />
            {sortOrder === "asc" ? "Oldest first" : "Newest first"}
          </button>
        </div>
      </div>

      <div className="orderh__summary">
        <div className="orderh__stats">
          <div className="orderh__stat">
            <span className="orderh__stat-value">{orders.length}</span>
            <span className="orderh__stat-label">Total Orders</span>
          </div>
          <div className="orderh__stat">
            <span className="orderh__stat-value">
              {orders.filter(o => o.orderStatus === "Delivered").length}
            </span>
            <span className="orderh__stat-label">Delivered</span>
          </div>
          <div className="orderh__stat">
            <span className="orderh__stat-value">
              {orders.filter(o => o.orderStatus === "Pending" || o.orderStatus === "Shipped").length}
            </span>
            <span className="orderh__stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {currentOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="orderh__list"
          >
            {currentOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="orderh__card"
              >
                <div className="orderh__card-header">
                  <div className="orderh__order-info">
                    <div className="orderh__order-id">
                      Order #{order._id.substring(0, 8)}
                    </div>
                    <div className="orderh__order-date">
                      <Calendar size={14} />
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className={`orderh__status orderh__status-${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </div>
                </div>
                
                <div className="orderh__card-content">
                  <div className="orderh__products">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="orderh__product">
                        <div className="orderh__product-placeholder"></div>
                        <div className="orderh__product-details">
                          <div className="orderh__product-name">{product.name}</div>
                          <div className="orderh__product-meta">
                            Qty: {product.quantity} × ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.products.length > 2 && (
                      <div className="orderh__more-products">
                        +{order.products.length - 2} more items
                      </div>
                    )}
                  </div>
                  
                  <div className="orderh__card-footer">
                    <div className="orderh__order-total">
                      <span>Total:</span> 
                      <span className="orderh__price">${order.total.toFixed(2)}</span>
                    </div>
                    
                    {(order.orderStatus === "Pending" || order.orderStatus === "Shipped") && (
                      <div className="orderh__delivery-estimate">
                        <Clock size={14} />
                        Est. delivery: {getEstimatedDelivery(order.createdAt, order.orderStatus)}
                      </div>
                    )}
                    
                    <div className="orderh__actions">
                      <button 
                        className="orderh__action-btn orderh__btn-details"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailModalOpen(true)
                        }}
                      >
                        View Details
                      </button>
                      
                      <div className="orderh__dropdown">
                        <button className="orderh__dropdown-btn">More Actions</button>
                        <div className="orderh__dropdown-content">
                          <button onClick={() => handleDownloadInvoice(order)}>
                            <Download size={14} /> Download Invoice
                          </button>
                          
                          {order.orderStatus === "Delivered" && (
                            <button>
                              <Star size={14} /> Write Review
                            </button>
                          )}
                          
                          {order.orderStatus === "Pending" && (
                            <button onClick={() => handleCancelOrder(order._id)}>
                              <XCircle size={14} /> Cancel Order
                            </button>
                          )}
                          
                          <button onClick={() => handleReorder(order)}>
                            <RefreshCw size={14} /> Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="orderh__empty"
          >
            <Package className="orderh__empty-icon" />
            <h3>No orders found</h3>
            <p>We couldn't find any orders matching your criteria</p>
            <button 
              className="orderh__shop-btn"
              onClick={() => {
                setFilterStatus("")
                setSearchTerm("")
              }}
            >
              {orders.length > 0 ? "Clear filters" : "Start shopping"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredOrders.length > ordersPerPage && (
        <div className="orderh__pagination">
          <button 
            className="orderh__page-btn"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="orderh__page-numbers">
            {Array.from({ length: totalPages }, (_, i) => {
              // Show first page, last page, and pages around current page
              if (
                i === 0 || 
                i === totalPages - 1 || 
                (i >= currentPage - 2 && i <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`orderh__page-number ${currentPage === i + 1 ? "orderh__active" : ""}`}
                  >
                    {i + 1}
                  </button>
                )
              } else if (
                i === currentPage - 3 || 
                i === currentPage + 2
              ) {
                return <span key={i} className="orderh__ellipsis">...</span>
              }
              return null
            })}
          </div>
          
          <button 
            className="orderh__page-btn"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {isDetailModalOpen && (
        <div className="orderh__modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <motion.div 
            className="orderh__modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="orderh__modal-header">
              <h2>Order Details</h2>
              <button 
                className="orderh__modal-close"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {selectedOrder && (
              <div className="orderh__modal-content">
                <div className="orderh__detail-section">
                  <h3>Order Information</h3>
                  <div className="orderh__detail-grid">
                    <div className="orderh__detail-item">
                      <span className="orderh__detail-label">Order ID</span>
                      <span className="orderh__detail-value">{selectedOrder._id}</span>
                    </div>
                    <div className="orderh__detail-item">
                      <span className="orderh__detail-label">Order Date</span>
                      <span className="orderh__detail-value">
                        {format(new Date(selectedOrder.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="orderh__detail-item">
                      <span className="orderh__detail-label">Status</span>
                      <span className={`orderh__detail-status orderh__status-${selectedOrder.orderStatus.toLowerCase()}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="orderh__detail-item">
                      <span className="orderh__detail-label">Total</span>
                      <span className="orderh__detail-value orderh__detail-price">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="orderh__detail-section">
                  <h3>Products</h3>
                  <div className="orderh__products-table">
                    <div className="orderh__table-header">
                      <div className="orderh__th orderh__product-col">Product</div>
                      <div className="orderh__th orderh__quantity-col">Quantity</div>
                      <div className="orderh__th orderh__price-col">Price</div>
                      <div className="orderh__th orderh__total-col">Total</div>
                    </div>
                    
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="orderh__table-row">
                        <div className="orderh__td orderh__product-col">
                          <div className="orderh__product-cell">
                            <div className="orderh__product-img-placeholder"></div>
                            <div className="orderh__product-text">
                              <div className="orderh__product-title">{product.name}</div>
                              {product.variant && (
                                <div className="orderh__product-variant">{product.variant}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="orderh__td orderh__quantity-col">{product.quantity}</div>
                        <div className="orderh__td orderh__price-col">${product.price.toFixed(2)}</div>
                        <div className="orderh__td orderh__total-col">${(product.price * product.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    
                    <div className="orderh__table-footer">
                      <div className="orderh__footer-row">
                        <div className="orderh__footer-label">Subtotal</div>
                        <div className="orderh__footer-value">${selectedOrder.total.toFixed(2)}</div>
                      </div>
                      <div className="orderh__footer-row">
                        <div className="orderh__footer-label">Shipping</div>
                        <div className="orderh__footer-value">$0.00</div>
                      </div>
                      <div className="orderh__footer-row orderh__footer-total">
                        <div className="orderh__footer-label">Total</div>
                        <div className="orderh__footer-value">${selectedOrder.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="orderh__modal-actions">
                  <button 
                    className="orderh__modal-btn orderh__btn-invoice"
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                  >
                    <Download size={16} /> Download Invoice
                  </button>
                  
                  {selectedOrder.orderStatus === "Pending" && (
                    <button 
                      className="orderh__modal-btn orderh__btn-cancel"
                      onClick={() => {
                        handleCancelOrder(selectedOrder._id)
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}
                  
                  <button 
                    className="orderh__modal-btn orderh__btn-reorder"
                    onClick={() => {
                      handleReorder(selectedOrder)
                      setIsDetailModalOpen(false)
                    }}
                  >
                    <RefreshCw size={16} /> Reorder
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory