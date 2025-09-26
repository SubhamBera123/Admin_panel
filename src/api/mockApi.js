// Mock API layer for E-commerce Admin Panel
// This simulates a real API with localStorage persistence
// Replace these functions with real API calls when integrating with backend

import data from '../data/data.json';

// Simulate network latency
const delay = (ms = Math.random() * 300 + 200) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize localStorage with sample data on first run
export const initializeData = () => {
  if (!localStorage.getItem('admin_products')) {
    localStorage.setItem('admin_products', JSON.stringify(data.products));
  }
  if (!localStorage.getItem('admin_orders')) {
    localStorage.setItem('admin_orders', JSON.stringify(data.orders));
  }
  if (!localStorage.getItem('admin_customers')) {
    localStorage.setItem('admin_customers', JSON.stringify(data.customers));
  }
  if (!localStorage.getItem('admin_analytics')) {
    localStorage.setItem('admin_analytics', JSON.stringify(data.analytics));
  }
};

// Generic localStorage helpers
const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// PRODUCTS API
export const getProducts = async (filters = {}) => {
  await delay();
  let products = getFromStorage('admin_products');
  
  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    products = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.category && filters.category !== 'all') {
    products = products.filter(product => product.category === filters.category);
  }
  
  if (filters.status && filters.status !== 'all') {
    products = products.filter(product => product.status === filters.status);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    products.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }
  
  return { success: true, data: products };
};

export const addProduct = async (product) => {
  await delay();
  const products = getFromStorage('admin_products');
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  saveToStorage('admin_products', products);
  
  return { success: true, data: newProduct };
};

export const updateProduct = async (id, updates) => {
  await delay();
  const products = getFromStorage('admin_products');
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return { success: false, error: 'Product not found' };
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveToStorage('admin_products', products);
  
  return { success: true, data: products[index] };
};

export const deleteProduct = async (id) => {
  await delay();
  const products = getFromStorage('admin_products');
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (products.length === filteredProducts.length) {
    return { success: false, error: 'Product not found' };
  }
  
  saveToStorage('admin_products', filteredProducts);
  
  return { success: true };
};

// ORDERS API
export const getOrders = async (filters = {}) => {
  await delay();
  let orders = getFromStorage('admin_orders');
  
  // Apply filters
  if (filters.status && filters.status !== 'all') {
    orders = orders.filter(order => order.status === filters.status);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    orders = orders.filter(order => 
      order.id.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort by order date (newest first)
  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
  return { success: true, data: orders };
};

export const updateOrderStatus = async (id, status) => {
  await delay();
  const orders = getFromStorage('admin_orders');
  const index = orders.findIndex(o => o.id === id);
  
  if (index === -1) {
    return { success: false, error: 'Order not found' };
  }
  
  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  if (status === 'delivered') {
    orders[index].deliveryDate = new Date().toISOString();
  }
  
  saveToStorage('admin_orders', orders);
  
  return { success: true, data: orders[index] };
};

// CUSTOMERS API
export const getCustomers = async (filters = {}) => {
  await delay();
  let customers = getFromStorage('admin_customers');
  
  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    customers = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.status && filters.status !== 'all') {
    customers = customers.filter(customer => customer.status === filters.status);
  }
  
  // Sort by join date (newest first)
  customers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
  
  return { success: true, data: customers };
};

// ANALYTICS API
export const getAnalytics = async () => {
  await delay();
  const analytics = getFromStorage('admin_analytics');
  const products = getFromStorage('admin_products');
  const orders = getFromStorage('admin_orders');
  const customers = getFromStorage('admin_customers');
  
  // Calculate real-time KPIs
  const totalRevenue = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
    
  const totalOrders = orders.filter(order => order.status !== 'cancelled').length;
  const activeCustomers = customers.filter(customer => customer.status === 'active').length;
  const conversionRate = customers.length > 0 ? (totalOrders / customers.length * 100) : 0;
  
  return {
    success: true,
    data: {
      ...analytics,
      kpis: {
        totalRevenue,
        totalOrders,
        activeCustomers,
        conversionRate: Math.round(conversionRate * 100) / 100
      }
    }
  };
};

// UTILITY FUNCTIONS
export const resetData = () => {
  localStorage.removeItem('admin_products');
  localStorage.removeItem('admin_orders');
  localStorage.removeItem('admin_customers');
  localStorage.removeItem('admin_analytics');
  initializeData();
};

export const exportData = () => {
  return {
    products: getFromStorage('admin_products'),
    orders: getFromStorage('admin_orders'),
    customers: getFromStorage('admin_customers'),
    analytics: getFromStorage('admin_analytics'),
    exportDate: new Date().toISOString()
  };
};

// Initialize data on module load
initializeData();