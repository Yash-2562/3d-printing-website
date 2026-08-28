import { NavLink, useNavigate } from 'react-router-dom';

const navigation = [
  { label: 'Overview', path: '/admin', icon: 'fa-chart-pie' },
  { label: 'Products', path: '/admin/products', icon: 'fa-cube' },
  { label: 'Categories', path: '/admin/categories', icon: 'fa-layer-group' },
  { label: 'Orders', path: '/admin/orders', icon: 'fa-box' },
  { label: 'Inventory', path: '/admin/inventory', icon: 'fa-layer-group' },
  { label: 'Custom requests', path: '/admin/custom-print-requests', icon: 'fa-wand-magic-sparkles' },
  { label: 'Customers', path: '/admin/customers', icon: 'fa-users' },
  { label: 'Payments', path: '/admin/payments', icon: 'fa-credit-card' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand"><span className="brand-mark"><i className="fa-solid fa-cube" /></span><span>printforge<small>ADMIN CONTROL</small></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navigation.map((item) => <NavLink key={item.path} to={item.path} end={item.path === '/admin'} className={({ isActive }) => isActive ? 'admin-nav active' : 'admin-nav'}><i className={`fa-solid ${item.icon}`} /><span>{item.label}</span>{item.label === 'Custom requests' && <b>5</b>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><NavLink to="/admin/notifications" className="admin-nav"><i className="fa-regular fa-bell" /><span>Notifications</span><b>3</b></NavLink><NavLink to="/admin/settings" className="admin-nav"><i className="fa-solid fa-gear" /><span>Settings</span></NavLink><button className="admin-nav logout-button" type="button" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket" /><span>Log out</span></button><a className="store-link" href="/"><i className="fa-solid fa-arrow-up-right-from-square" /> View storefront</a></div>
    </aside>
  );
}