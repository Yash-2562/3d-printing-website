import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { ActionMenu, DataTable, Page, SearchInput, StatusPill, Toolbar } from './AdminPrimitives';

export default function Customers() {
  const [query, setQuery] = useState(''); const [rows, setRows] = useState([]); const [error, setError] = useState('');
  useEffect(() => { apiClient.get('/admin/customers').then(({ data }) => setRows(data.data || [])).catch(() => setError('Unable to load customers.')); }, []);
  const visible = rows.filter((customer) => `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(query.toLowerCase()));
  const handleAction = async (customer, action) => {
    if (action === 'delete') {
      if (!window.confirm(`Delete the account for ${customer.name}? This also removes their orders and saved items.`)) return;
      try {
        await apiClient.delete(`/admin/customers/${encodeURIComponent(customer.id)}`);
        setRows((current) => current.filter((row) => row.id !== customer.id));
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to delete customer.');
      }
    }
    if (action === 'active' || action === 'inactive') setRows((current) => current.map((row) => row.id === customer.id ? { ...row, status: action.toUpperCase() } : row));
  };
  return <Page title="Customers" description="Customer profiles, order history and account status."><Toolbar><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, email or ID..." /><select aria-label="Account status"><option>All account statuses</option><option>Active</option><option>Inactive</option></select></Toolbar>{error && <p className="save-message" role="alert">{error}</p>}<DataTable headers={['CUSTOMER ID', 'CUSTOMER', 'CONTACT', 'REGISTRATION DATE', 'ORDERS', 'TOTAL SPENT', 'STATUS', 'ACTIONS']}>{visible.map((customer) => <tr key={customer.id}><td>{customer.id}</td><td><strong>{customer.name}</strong></td><td>{customer.email}<small>{customer.phone}</small></td><td>{customer.joined}</td><td>{customer.orders}</td><td><strong>₹{customer.spent.toLocaleString('en-IN')}</strong></td><td><StatusPill value={customer.status} /></td><td><ActionMenu label={`Actions for ${customer.name}`} options={[{ value: 'active', label: 'Set active' }, { value: 'inactive', label: 'Set inactive' }, { value: 'delete', label: 'Delete account' }]} onChange={(action) => handleAction(customer, action)} /></td></tr>)}</DataTable></Page>;
}