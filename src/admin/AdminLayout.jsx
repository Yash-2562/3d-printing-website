import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === '/admin'
    ? 'Overview'
    : location.pathname.split('/').filter(Boolean).pop().replaceAll('-', ' ');

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-topbar"><button className="mobile-menu" aria-label="Open menu"><i className="fa-solid fa-bars" /></button><div className="breadcrumbs">Admin <span>/</span> <strong>{currentPage}</strong></div><div className="topbar-actions"><button className="icon-button" aria-label="Notifications" onClick={() => navigate('/admin/notifications')}><i className="fa-regular fa-bell" /><em /></button><div className="admin-user"><span>AD</span><div><strong>Admin</strong><small>Administrator</small></div><i className="fa-solid fa-chevron-down" /></div></div></header>
        <Outlet />
      </main>
    </div>
  );
}
