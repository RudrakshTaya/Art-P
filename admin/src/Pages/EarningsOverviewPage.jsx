import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EarningsOverviewPage.css';

const EarningsOverviewPage = () => {
  const [earnings, setEarnings] = useState(0);

  // Fetch earnings
  const fetchEarnings = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/ad/admin/earnings');
      setEarnings(response.data.totalEarnings);
    } catch (err) {
      console.error('Error fetching earnings', err);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="earnings-overview-page">
      <h1>Earnings Overview</h1>
      <div className="earnings">
        <h3>Total Earnings: ${earnings.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default EarningsOverviewPage;
