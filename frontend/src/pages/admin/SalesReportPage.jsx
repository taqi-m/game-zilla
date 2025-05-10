import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalesReportPage() {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/reports/sales');
        setSalesData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sales report:', err);
        setError('Failed to load sales report. Please try again later.');
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const prepareChartData = () => {
    if (!salesData?.dailySales) return null;

    const dailySales = salesData.dailySales;
    
    // Sort by date
    const sortedSales = [...dailySales].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedSales.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Revenue ($)',
          data: sortedSales.map(item => item.revenue),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Orders',
          data: sortedSales.map(item => item.orderCount),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Daily Sales and Orders',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Order Count',
        },
      },
    },
  };

  const calculateTotalRevenue = () => {
    if (!salesData?.dailySales) return 0;
    
    return salesData.dailySales.reduce((sum, day) => sum + (day.revenue || 0), 0).toFixed(2);
  };

  const calculateTotalOrders = () => {
    if (!salesData?.dailySales) return 0;
    
    return salesData.dailySales.reduce((sum, day) => sum + (day.orderCount || 0), 0);
  };

  const calculateAverageOrderValue = () => {
    const totalRevenue = salesData?.dailySales?.reduce((sum, day) => sum + (day.revenue || 0), 0) || 0;
    const totalOrders = salesData?.dailySales?.reduce((sum, day) => sum + (day.orderCount || 0), 0) || 0;
    
    if (totalOrders === 0) return '0.00';
    
    return (totalRevenue / totalOrders).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Report</h1>
        <Link to="/admin/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold">${calculateTotalRevenue()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">{calculateTotalOrders()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">Average Order Value</p>
          <p className="text-3xl font-bold">${calculateAverageOrderValue()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Trend</h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${selectedPeriod === '7days' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedPeriod('7days')}
            >
              7 Days
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${selectedPeriod === '30days' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedPeriod('30days')}
            >
              30 Days
            </button>
          </div>
        </div>
        
        <div className="h-80">
          {salesData && prepareChartData() && (
            <Line options={chartOptions} data={prepareChartData()} />
          )}
        </div>
      </div>

      {/* Top selling games */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Top Selling Games</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData?.topGames?.map((game, index) => (
                <tr key={game.game_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.totalQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${game.totalRevenue?.toFixed(2)}
                  </td>
                </tr>
              ))}
              
              {(!salesData?.topGames || salesData.topGames.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
