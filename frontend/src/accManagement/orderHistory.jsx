import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@mui/material";
import { Button } from "@mui/material";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/orders/user-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="order-card">
            <CardHeader>
              <CardTitle>Order ID: {order._id}</CardTitle>
              <CardDescription>
                Placed on: {format(new Date(order.createdAt), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="order-details">
                <h3>Products:</h3>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index} className="product-item">
                      <p><strong>Product:</strong> {product.productId.name}</p>
                      <p><strong>Quantity:</strong> {product.quantity}</p>
                      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
              </div>
              <Button variant="outlined" color="primary" className="order-details-button">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
