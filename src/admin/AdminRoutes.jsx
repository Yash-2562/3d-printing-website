import './admin.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Categories from './Categories';
import CustomPrintRequests from './CustomPrintRequests';
import Customers from './Customers';
import Inventory from './Inventory';
import NewProduct from './NewProduct';
import ProductEdit from './ProductEdit';
import Notifications from './Notifications';
import Orders from './Orders';
import Payments from './Payments';
import Products from './Products';
import Refunds from './Refunds';
import Settings from './Settings';
import AdminLogin from './AdminLogin';

function AdminProtectedRoute({ children }) {
  return localStorage.getItem('adminAuthToken') ? children : <Navigate to="/admin/login" replace />;
}
AdminProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

export default function AdminRoutes() {
  return <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="products/*" element={<Products />} />
      <Route path="products/new" element={<NewProduct />} />
      <Route path="products/:id/edit" element={<ProductEdit />} />
      <Route path="orders/*" element={<Orders />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="categories" element={<Categories />} />
      <Route path="custom-print-requests" element={<CustomPrintRequests />} />
      <Route path="customers" element={<Customers />} />
      <Route path="payments" element={<Payments />} />
      <Route path="refunds" element={<Refunds />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>;
}
