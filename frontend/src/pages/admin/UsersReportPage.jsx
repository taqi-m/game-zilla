import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminUsersReportPage() {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersReport = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/reports/users');
        setUsersData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users report:', err);
        setError('Failed to load users report. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsersReport();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const prepareNewUsersChartData = () => {
    if (!usersData?.newUsers) return null;

    const newUsers = usersData.newUsers;
    
    // Sort by date
    const sortedData = [...newUsers].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'New Users',
          data: sortedData.map(item => item.userCount),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'New User Registrations',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'User Count',
        },
      },
    },
  };

  const calculateTotalNewUsers = () => {
    if (!usersData?.newUsers) return 0;
    
    return usersData.newUsers.reduce((sum, day) => sum + (day.userCount || 0), 0);
  };

  const calculateTotalSpent = () => {
    if (!usersData?.topUsersByOrders) return 0;
    
    const total = usersData.topUsersByOrders.reduce(
      (sum, user) => sum + (user.totalSpent || 0), 
      0
    );
    
    return total.toFixed(2);
  };

  const calculateAverageSpentPerUser = () => {
    if (!usersData?.topUsersByOrders || usersData.topUsersByOrders.length === 0) return '0.00';
    
    const totalSpent = usersData.topUsersByOrders.reduce(
      (sum, user) => sum + (user.totalSpent || 0), 
      0
    );
    
    return (totalSpent / usersData.topUsersByOrders.length).toFixed(2);
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
        <h1 className="text-3xl font-bold">Users Report</h1>
        <Link to="/admin/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">New Users</p>
          <p className="text-3xl font-bold">{calculateTotalNewUsers()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">Total Revenue from Top Users</p>
          <p className="text-3xl font-bold">${calculateTotalSpent()}</p>
          <p className="text-sm text-gray-500 mt-1">Top 10 users</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-500">Average Spent per User</p>
          <p className="text-3xl font-bold">${calculateAverageSpentPerUser()}</p>
          <p className="text-sm text-gray-500 mt-1">Top 10 users</p>
        </div>
      </div>

      {/* New Users Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">New User Registrations</h2>
        
        <div className="h-80">
          {usersData && prepareNewUsersChartData() && (
            <Bar options={chartOptions} data={prepareNewUsersChartData()} />
          )}
          
          {(!usersData?.newUsers || usersData.newUsers.length === 0) && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No user registration data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Top Users by Order Count</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.topUsersByOrders?.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${user.totalSpent?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/admin/users`} className="text-primary-600 hover:text-primary-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!usersData?.topUsersByOrders || usersData.topUsersByOrders.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No user data available
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
