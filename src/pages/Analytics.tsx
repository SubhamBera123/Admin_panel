import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAnalytics } from '@/api/mockApi';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from 'lucide-react';
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
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

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

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('7d');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const result = await getAnalytics();
      setAnalytics(result.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Date', 'Revenue', 'Orders'],
      ...analytics.revenue.daily.map((item, index) => [
        item.date,
        item.value,
        analytics.orders.daily[index]?.value || 0
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Success',
      description: 'Analytics data exported successfully'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Chart configurations
  const revenueChartData = {
    labels: analytics.revenue.daily.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue ($)',
        data: analytics.revenue.daily.map(d => d.value),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--primary-foreground))',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const ordersChartData = {
    labels: analytics.orders.daily.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders',
        data: analytics.orders.daily.map(d => d.value),
        backgroundColor: 'hsl(var(--primary) / 0.8)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const categoriesChartData = {
    labels: analytics.categories.map(c => c.name),
    datasets: [
      {
        data: analytics.categories.map(c => c.value),
        backgroundColor: analytics.categories.map(c => c.color),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
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
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  };

  // Calculate trends
  const revenueData = analytics.revenue.daily;
  const currentRevenue = revenueData[revenueData.length - 1]?.value || 0;
  const previousRevenue = revenueData[revenueData.length - 2]?.value || 0;
  const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : '0';

  const ordersData = analytics.orders.daily;
  const currentOrders = ordersData[ordersData.length - 1]?.value || 0;
  const previousOrders = ordersData[ordersData.length - 2]?.value || 0;
  const ordersTrend = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-40 glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchAnalytics} className="hover-scale">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={exportData} className="bg-gradient-primary hover-scale">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${analytics.kpis.totalRevenue.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {parseFloat(revenueTrend) >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-xs ${parseFloat(revenueTrend) >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(parseFloat(revenueTrend))}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.kpis.totalOrders}</p>
                <div className="flex items-center gap-1 mt-1">
                  {parseFloat(ordersTrend) >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-xs ${parseFloat(ordersTrend) >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(parseFloat(ordersTrend))}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-info rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{analytics.kpis.activeCustomers}</p>
                <p className="text-xs text-success mt-1">+5.1% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.kpis.conversionRate}%</p>
                <p className="text-xs text-success mt-1">+2.3% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Average Daily Revenue</p>
                <p className="font-bold">
                  ${(analytics.revenue.daily.reduce((sum, d) => sum + d.value, 0) / analytics.revenue.daily.length).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Day</p>
                <p className="font-bold">
                  ${Math.max(...analytics.revenue.daily.map(d => d.value)).toFixed(2)}
                </p>
              </div>
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
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Average Daily Orders</p>
                <p className="font-bold">
                  {Math.round(analytics.orders.daily.reduce((sum, d) => sum + d.value, 0) / analytics.orders.daily.length)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Day</p>
                <p className="font-bold">
                  {Math.max(...analytics.orders.daily.map(d => d.value))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={categoriesChartData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg glass">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{category.value}%</p>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 ? 'Top performer' : 
                       index === analytics.categories.length - 1 ? 'Needs attention' : 
                       'Good performance'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <h3 className="font-bold text-lg text-success">Strong Growth</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Revenue is trending upward with consistent daily improvements
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <h3 className="font-bold text-lg text-primary">Balanced Portfolio</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Electronics leads sales but all categories are performing well
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <h3 className="font-bold text-lg text-warning">Optimization Opportunity</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Conversion rate can be improved with targeted campaigns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}