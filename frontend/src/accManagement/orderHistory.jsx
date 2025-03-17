"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle, Package, Download, RefreshCw, XCircle, Star, Calendar, Filter } from "lucide-react"
import { format } from "date-fns"
import jsPDF from "jspdf"
import "jspdf-autotable"
import './orderHistory.css'

import {
 
  Box,
  
} from "@mui/material"


const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(5)
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
    doc.text(`Invoice for Order: ${order._id}`, 20, 20)
    doc.autoTable({
      head: [["Product", "Quantity", "Price"]],
      body: order.products.map((p) => [p.name, p.quantity, `$${p.price.toFixed(2)}`]),
    })
    doc.text(`Total: $${order.total.toFixed(2)}`, 20, doc.autoTable.previous.finalY + 10)
    doc.save(`Invoice_${order._id}.pdf`)
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
      alert("Order placed again successfully!")
    } catch (error) {
      alert("Failed to reorder. Try again later.")
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:5002/api/cancel-order/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert("Order canceled successfully!")
      setOrders((prev) => prev.filter((order) => order._id !== orderId))
    } catch (error) {
      alert("Failed to cancel order.")
    }
  }

  const filteredOrders = orders
    .filter(
      (order) =>
        (filterStatus ? order.orderStatus.toLowerCase() === filterStatus.toLowerCase() : true) &&
        (searchTerm ? order.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) : true),
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader2 className="animate-spin" size={48} />
      </Box>
    )
  }

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">Order History</h1>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
          role="alert"
        >
          <AlertCircle size={24} />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-dropdown">
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
          <option value="date">Sort by Date</option>
          <option value="total">Sort by Total</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="sort-order-btn">
          <Filter className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {currentOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="order-cards-container"
          >
            {currentOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="order-card">
                  <div className="order-card-header">
                    <h3>{order.products[0].name}</h3>
                    <span className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                  </div>
                  <div className="order-card-content">
                    <p className="order-date">
                      <Calendar size={16} />
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </p>
                    <p className="order-total">
                      <span>Total:</span> ${order.total.toFixed(2)}
                    </p>
                    <div className="order-actions">
                      <button onClick={() => handleDownloadInvoice(order)}>
                        <Download size={16} /> Invoice
                      </button>
                      {order.orderStatus === "Delivered" && (
                        <button>
                          <Star size={16} /> Review
                        </button>
                      )}
                      {order.orderStatus === "Pending" && (
                        <button onClick={() => handleCancelOrder(order._id)}>
                          <XCircle size={16} /> Cancel
                        </button>
                      )}
                      <button onClick={() => handleReorder(order)}>
                        <RefreshCw size={16} /> Reorder
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailModalOpen(true)
                        }}
                      >
                        View Details
                      </button>
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
            className="no-orders"
          >
            <Package className="no-orders-icon" />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search term.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredOrders.length > ordersPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {isDetailModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            {selectedOrder && (
              <div className="order-details">
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Date:</strong> {format(new Date(selectedOrder.createdAt), "MMM d, yyyy")}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.orderStatus}
                </p>
                <h4>Products:</h4>
                <ul>
                  {selectedOrder.products.map((product, index) => (
                    <li key={index}>
                      {product.name} - Quantity: {product.quantity} - ${product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                </p>
              </div>
            )}
            <button onClick={() => setIsDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory

