import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAnalytics, getProducts, getOrders } from '@/api/mockApi';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Target,
  Package,
  AlertTriangle 
} from 'lucide-react';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsResult, productsResult, ordersResult] = await Promise.all([
          getAnalytics(),
          getProducts(),
          getOrders()
        ]);
        
        setAnalytics(analyticsResult.data);
        setProducts(productsResult.data);
        setOrders(ordersResult.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Chart data
  const revenueChartData = {
    labels: analytics?.revenue?.daily?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Revenue',
        data: analytics?.revenue?.daily?.map(d => d.value) || [],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: analytics?.orders?.daily?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Orders',
        data: analytics?.orders?.daily?.map(d => d.value) || [],
        backgroundColor: 'hsl(var(--primary) / 0.8)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
      },
    ],
  };

  const categoriesChartData = {
    labels: analytics?.categories?.map(c => c.name) || [],
    datasets: [
      {
        data: analytics?.categories?.map(c => c.value) || [],
        backgroundColor: analytics?.categories?.map(c => c.color) || [],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your e-commerce admin panel</p>
        </div>
        <Badge variant="secondary" className="glass">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $<CountUp end={kpis.totalRevenue || 0} duration={2} decimals={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={kpis.totalOrders || 0} duration={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={kpis.activeCustomers || 0} duration={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              +5.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={kpis.conversionRate || 0} duration={2} decimals={1} />%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut 
                data={categoriesChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outOfStockProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Out of Stock ({outOfStockProducts.length})</span>
                </div>
                {outOfStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                    <span className="text-sm">{product.name}</span>
                    <Badge variant="destructive">0 units</Badge>
                  </div>
                ))}
              </div>
            )}
            
            {lowStockProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Low Stock ({lowStockProducts.length})</span>
                </div>
                {lowStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
                    <span className="text-sm">{product.name}</span>
                    <div className="text-right">
                      <Badge variant="outline" className="text-warning">{product.stock} units</Badge>
                      <Progress 
                        value={(product.stock / 50) * 100} 
                        className="w-16 h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>All products are well stocked!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}