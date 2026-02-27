import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getDashboardStats, getActivities } from '../services/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getActivities(10),
      ]);
      setStats(statsData.data);
      setActivities(activitiesData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  const monthlyRevenueData = stats?.monthlyRevenue?.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
  })) || [];

  const dealsByStageData = stats?.dealsByStage?.map((item) => ({
    stage: item._id,
    count: item.count,
    value: item.totalValue,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Deals"
          value={stats?.totalDeals || 0}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${stats?.pipelineValue?.toLocaleString() || 0}`}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          {monthlyRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No revenue data available</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Deals by Stage</h3>
          {dealsByStageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsByStageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No deal data available</p>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user?.name} • {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </Card>

      {/* Conversion Rate */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Deal Conversion Rate</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.conversionRate || 0}%</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Win rate from closed deals</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
