import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { 
  SearchOutlined, 
  SyncOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { Select, Table, Tag, Input, Button, Space, Spin, message, Badge, Card, Statistic } from 'antd';
import './OrderManagementPage.css';

const { Option } = Select;
const { Search } = Input;

const statusColors = {
  Pending: 'warning',
  Processing: 'processing',
  Shipped: 'geekblue',
  Delivered: 'success',
  Cancelled: 'error'
};

const statusIcons = {
  Pending: <ClockCircleOutlined />,
  Processing: <SyncOutlined spin />,
  Shipped: <TruckOutlined />,
  Delivered: <CheckCircleOutlined />,
  Cancelled: <CloseCircleOutlined />
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Fetch Orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/ad/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data);
      
      // Calculate statistics
      const stats = {
        totalOrders: response.data.length,
        pending: response.data.filter(o => o.orderStatus === 'Pending').length,
        processing: response.data.filter(o => o.orderStatus === 'Processing').length,
        shipped: response.data.filter(o => o.orderStatus === 'Shipped').length,
        delivered: response.data.filter(o => o.orderStatus === 'Delivered').length,
        cancelled: response.data.filter(o => o.orderStatus === 'Cancelled').length
      };
      setStats(stats);

      // Initialize selected status for each order
      const statusMap = {};
      response.data.forEach(order => {
        statusMap[order._id] = order.orderStatus;
      });
      setSelectedStatus(statusMap);
      
    } catch (err) {
      setError('Error fetching orders. Please try again later.');
      console.error('Error fetching orders:', err);
      message.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `http://localhost:5002/api/ad/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      
      setSelectedStatus(prev => ({ ...prev, [orderId]: newStatus }));
      
      message.success(`Order #${orderId.substring(0, 6)} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      message.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Filter Orders Based on Search and Status
  const filteredOrders = orders.filter(order => {
    if (!order) return false;

    const searchTermLower = searchTerm.trim().toLowerCase();
    const orderId = order._id ? order._id.toString().toLowerCase() : '';
    const customerName = order.selectedCustomizations?.Name?.toLowerCase() || '';
    const productName = order.products?.[0]?.name?.toLowerCase() || '';

    const matchesSearch =
      searchTermLower === '' ||
      orderId.includes(searchTermLower) ||
      customerName.includes(searchTermLower) ||
      productName.includes(searchTermLower);

    const matchesStatus = filterStatus === 'All' || order.orderStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span className="order-id">#{id.substring(0, 8)}</span>,
      sorter: (a, b) => a._id.localeCompare(b._id)
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => format(new Date(date), 'PPp'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => (
        <div>
          <div className="customer-name">{record.selectedCustomizations?.Name || 'N/A'}</div>
          <div className="customer-customization">
            {record.selectedCustomizations?.Color && (
              <Tag color="default">{record.selectedCustomizations.Color}</Tag>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Items',
      key: 'items',
      render: (record) => (
        <div>
          {record.products?.map((product, idx) => (
            <div key={idx} className="product-item">
              <span className="product-name">{product.name}</span>
              <span className="product-qty">x{product.quantity}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${(total / 100).toFixed(2)}`,
      sorter: (a, b) => a.total - b.total
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => (
        <Select
          value={selectedStatus[record._id] || record.orderStatus}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
          suffixIcon={statusIcons[selectedStatus[record._id]]}
          loading={loading}
        >
          <Option value="Pending">
            <Tag icon={<ClockCircleOutlined />} color="warning">
              Pending
            </Tag>
          </Option>
          <Option value="Processing">
            <Tag icon={<SyncOutlined spin />} color="processing">
              Processing
            </Tag>
          </Option>
          <Option value="Shipped">
            <Tag icon={<TruckOutlined />} color="geekblue">
              Shipped
            </Tag>
          </Option>
          <Option value="Delivered">
            <Tag icon={<CheckCircleOutlined />} color="success">
              Delivered
            </Tag>
          </Option>
          <Option value="Cancelled">
            <Tag icon={<CloseCircleOutlined />} color="error">
              Cancelled
            </Tag>
          </Option>
        </Select>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Processing', value: 'Processing' },
        { text: 'Shipped', value: 'Shipped' },
        { text: 'Delivered', value: 'Delivered' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => message.info(`Viewing order ${record._id.substring(0, 6)}`)}
          >
            Details
          </Button>
        </Space>
      )
    }
  ];

  if (error) {
    return (
      <div className="error-container">
        <ExclamationCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
        <h2>{error}</h2>
        <Button type="primary" onClick={fetchOrders}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="order-management-container">
      <div className="page-header">
        <h1>Order Management</h1>
        <div className="header-actions">
          <Button 
            type="default" 
            icon={<SyncOutlined />} 
            onClick={fetchOrders}
            loading={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="stats-container">
        <Card>
          <Statistic 
            title="Total Orders" 
            value={stats.totalOrders} 
            prefix={<Badge color="blue" />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Pending" 
            value={stats.pending} 
            prefix={<Badge color="gold" />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Processing" 
            value={stats.processing} 
            prefix={<Badge color="orange" />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Shipped" 
            value={stats.shipped} 
            prefix={<Badge color="geekblue" />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Delivered" 
            value={stats.delivered} 
            prefix={<Badge color="green" />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Cancelled" 
            value={stats.cancelled} 
            prefix={<Badge color="red" />}
          />
        </Card>
      </div>

      <div className="filters-container">
        <Search
          placeholder="Search orders..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 400 }}
        />
        
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200 }}
          size="large"
        >
          <Option value="All">All Statuses</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </div>

      <div className="orders-table-container">
        {isLoading ? (
          <div className="loading-container">
            <Spin size="large" tip="Loading orders..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            scroll={{ x: true }}
            bordered
            loading={loading}
            locale={{
              emptyText: 'No orders found matching your criteria'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;