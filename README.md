
# E-commerce Admin Panel
## URL

Live website url :- http://admin-panel159.netlify.app

Repo url :-https://github.com/SubhamBera123/Admin_panel


## Project Purpose
This project is a full-featured e-commerce admin panel designed to manage products, orders, customers, and analytics for an online store. It provides a modern, responsive UI and comprehensive CRUD operations for efficient business management.

## Approach
The project was approached by first outlining the core requirements for an admin dashboard, including product, order, customer, and analytics management. The UI was designed using glassmorphism and gradients for a modern look. Development was done in a modular fashion, with reusable components and hooks for state and theme management. Features were implemented incrementally, with regular testing and refinement.

## Time Taken
- Total development time: **6 hours**

## Tech Stack Used
- **React 18** (with TypeScript)
- **Vite** (for fast development/build)
- **Tailwind CSS** (for styling)
- **shadcn/ui** (UI components)
- **Lucide React** (icons)
- **Chart.js** & **react-chartjs-2** (charts)
- **TanStack Query** (data fetching/caching)
- **React Router** (routing)
- **localStorage** (data persistence)

## Features
![Admin Panel](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop)

## ✨ Features

### 🎨 Modern Design
- **Glassmorphism UI** with backdrop blur effects
- **Gradient accents** and smooth micro-interactions
- **Dark/Light theme** toggle with smooth transitions
- **Responsive design** that works on all devices
- **Animated KPIs** with count-up animations

### 📊 Dashboard & Analytics
- Real-time KPI tracking (Revenue, Orders, Customers, Conversion)
- Interactive charts (Line, Bar, Doughnut) using Chart.js
- Revenue and order trends visualization
- Category performance breakdown
- Stock level alerts and notifications

### 🛍️ Product Management
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Grid and list view** toggle
- **Advanced filtering** by category, status, and search
- **Quick inline editing** for price and stock
- **Image upload support** with preview
- **Stock level indicators** and alerts

### 📦 Order Management
- Order status tracking (Pending, Shipped, Delivered, Cancelled)
- **Status update workflow** with confirmation
- **Detailed order views** with customer information
- Order timeline and delivery tracking
- **Advanced filtering** and search capabilities

### 👥 Customer Management
- Customer profile management with avatars
- Purchase history and statistics
- **Customer tier classification** (Regular, Premium, VIP)
- Contact information and address management
- Activity tracking and engagement metrics

### ⚙️ Settings & Configuration
- **Theme management** with live preview
- **Notification preferences** for different events
- **Business settings** (store info, currency, tax rates)
- **Security settings** with 2FA toggle
- **Data management** (export/import/reset)

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🗄️ Data Management

### Sample Data
The application comes with comprehensive sample data including:
- **Products**: 6 sample products across different categories
- **Orders**: Sample orders with different statuses
- **Customers**: Customer profiles with purchase history
- **Analytics**: Revenue and order trend data

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation

### UI & Styling
- **Tailwind CSS** for responsive design
- **shadcn/ui** components for consistent UI
- **Lucide React** for beautiful icons
- **Custom design system** with semantic tokens

### Charts & Visualization
- **Chart.js** with **react-chartjs-2** for interactive charts
- **CountUp** animations for KPI numbers
- **Custom progress components** for stock levels

### State & Data
- **TanStack Query** for data fetching and caching
- **localStorage** for data persistence
- **Mock API layer** for development


## 🎯 Key Features Implementation

### Real-time Updates
- **Optimistic UI updates** for instant feedback
- **Toast notifications** for all actions
- **Loading states** with skeleton components

### Advanced Filtering
- **Multi-field search** across products, orders, customers
- **Category and status filtering** with persistent state
- **Sorting capabilities** by different fields

### Data Visualization
- **Interactive charts** with hover effects and tooltips
- **Real-time KPI calculations** from live data
- **Trend analysis** with percentage changes

### Responsive Design
- **Mobile-first approach** with collapsible sidebar
- **Grid/List view toggles** for different screen sizes
- **Touch-friendly interactions** for mobile devices


## 📈 Performance & Best Practices

- **Code splitting** with React Router
- **Lazy loading** for charts and heavy components
- **Optimized bundle size** with Vite
- **TypeScript** for type safety and better development experience
- **ESLint** configuration for code quality

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
- **Netlify**: Drag and drop the `dist` folder
