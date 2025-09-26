import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCustomers } from '@/api/mockApi';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Eye, 
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  UserPlus,
  Filter
} from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Customers' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, selectedStatus]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result = await getCustomers({
        search: searchTerm,
        status: selectedStatus
      });
      setCustomers(result.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch customers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="glass">
            Total: {customers.length} customers
          </Badge>
          <Button className="bg-gradient-primary hover:opacity-90 hover-scale">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <Card key={customer.id} className="glass-card hover-scale hover-glow group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                  {customer.status}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="line-clamp-1">{customer.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-accent/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    <span className="font-bold text-lg">{customer.totalOrders}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-success/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="font-bold text-lg">${customer.totalSpent.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full hover-scale"
                onClick={() => openCustomerDetail(customer)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Customer profiles will appear here once they sign up.'}
            </p>
            {!searchTerm && selectedStatus === 'all' && (
              <Button className="bg-gradient-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Your First Customer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Customer Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg glass">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback className="bg-gradient-primary text-white text-lg">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-muted-foreground">{selectedCustomer.email}</p>
                  <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{selectedCustomer.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Join Date</p>
                      <p className="font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer ID</p>
                      <p className="font-medium">#{selectedCustomer.id}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Purchase Summary */}
              <Card className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Purchase Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-bold">{selectedCustomer.totalOrders}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-success/10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-success" />
                        <span className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                  
                  {selectedCustomer.totalOrders > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/20">
                      <p className="text-sm">
                        <span className="font-medium">Average Order Value: </span>
                        <span className="text-success font-bold">
                          ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Tier */}
              <Card className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Customer Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-primary/10">
                    <div>
                      <p className="font-medium">
                        {selectedCustomer.totalSpent >= 500 ? 'VIP Customer' : 
                         selectedCustomer.totalSpent >= 200 ? 'Premium Customer' : 
                         'Regular Customer'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Based on total purchase amount
                      </p>
                    </div>
                    <Badge className="bg-gradient-primary">
                      {selectedCustomer.totalSpent >= 500 ? '⭐ VIP' : 
                       selectedCustomer.totalSpent >= 200 ? '💎 Premium' : 
                       '👤 Regular'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}