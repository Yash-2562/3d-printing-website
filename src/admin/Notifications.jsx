import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Page, Pagination, RowActions, StatusPill, Toolbar } from './AdminPrimitives';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]); const [status, setStatus] = useState(''); const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => { apiClient.get('/admin/notifications').then(({ data }) => setNotifications(data.data || [])).catch(() => setError('Unable to load notifications.')); }, []);
  const handleDelete = async (notification) => {
    if (!window.confirm('Delete this notification permanently? This action cannot be undone.')) return;
    try {
      await apiClient.delete(`/admin/notifications/${encodeURIComponent(notification.id)}`);
      setNotifications((current) => current.filter((row) => row.id !== notification.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete notification.');
    }
  };
  const visible = notifications.filter((notification) => !status || notification.status === status);
  const pageRows = visible.slice((page - 1) * 20, page * 20);
  return <Page title="Notifications" description="Email and SMS delivery history for customer events."><Toolbar><select aria-label="Notification status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All statuses</option><option value="PENDING">Pending</option><option value="SENT">Sent</option><option value="FAILED">Failed</option></select></Toolbar>{error && <p className="save-message" role="alert">{error}</p>}<DataTable headers={['NOTIFICATION ID', 'CUSTOMER', 'ORDER / REQUEST', 'TYPE', 'CHANNEL', 'STATUS', 'SENT DATE', 'ERROR', 'ACTIONS']}>{pageRows.map((notification) => <tr key={notification.id}><td>{notification.id}</td><td>{notification.customer}</td><td>{notification.reference}</td><td>{notification.type}</td><td>{notification.channel}</td><td><StatusPill value={notification.status} /></td><td>{notification.date}</td><td>{notification.error}</td><td><RowActions onDelete={() => handleDelete(notification)} /></td></tr>)}</DataTable><Pagination currentPage={page} totalItems={visible.length} onPageChange={setPage} /></Page>;
}