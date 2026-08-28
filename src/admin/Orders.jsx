import { useEffect, useState } from 'react';
import {
  ActionMenu,
  DataTable,
  Page,
  Pagination,
  SearchInput,
  StatusPill,
  Toolbar,
} from './AdminPrimitives';
import apiClient from '../lib/api';

export default function Orders() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiClient
      .get('/admin/orders')
      .then(({ data }) => setRows(data.data || []))
      .catch(() => setError('Unable to load orders.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  const visible = rows.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.email}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const orderDate = new Date(order.date);
    const matchesPayment = !paymentFilter || (order.paymentStatus || 'PENDING') === paymentFilter;
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesFromDate = !fromDate || orderDate >= new Date(`${fromDate}T00:00:00`);
    const matchesToDate = !toDate || orderDate <= new Date(`${toDate}T23:59:59`);
    return matchesQuery && matchesPayment && matchesStatus && matchesFromDate && matchesToDate;
  });
  const pageRows = visible.slice((page - 1) * 20, page * 20);

  const updateStatus = async (order, status) => {
    try {
      await apiClient.put(`/admin/orders/${encodeURIComponent(order.id)}`, {
        status,
      });
      setRows((current) =>
        current.map((row) => (row.id === order.id ? { ...row, status } : row)),
      );
    } catch {
      setError('Unable to update order status.');
    }
  };

  return (
    <Page
      title="Orders"
      description="Review payments, fulfilment and delivery progress."
    >
      <Toolbar>
        <SearchInput
          value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          placeholder="Search order ID or customer..."
        />
        <select aria-label="Payment status" value={paymentFilter} onChange={(event) => { setPaymentFilter(event.target.value); setPage(1); }}>
          <option value="">All payment statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESSFUL">Successful</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <select
          aria-label="Order status"
          value={statusFilter}
          onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
        >
          <option value="">All order statuses</option>
          <option value="waiting_confirmation">Waiting for confirmation</option>
          <option value="confirmed">Confirmed</option>
          <option value="printing_started">Printing started</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" aria-label="From date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} />
        <input type="date" aria-label="To date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1); }} />
      </Toolbar>
      {error && (
        <p className="save-message" role="alert">
          {error}
        </p>
      )}
      {isLoading ? (
        <p className="muted">Loading orders...</p>
      ) : (
        <DataTable
          headers={[
            'ORDER ID',
            'CUSTOMER',
            'DATE',
            'ITEM COUNT',
            'AMOUNT',
            'PAYMENT',
            'ORDER STATUS',
            'ACTIONS',
          ]}
        >
          {pageRows.map((order) => (
            <tr key={order.id}>
              <td>
                <div>
                  <button className="row-link" onClick={() => setSelected(order)}>
                    {order.id}
                  </button>
                  {order.customRequestId && <small className="table-subtext">CO · Custom order</small>}
                </div>
              </td>
              <td>
                <strong>{order.customer}</strong>
                <small className="table-subtext">{order.email}</small>
              </td>
              <td>{order.date}</td>
              <td>{order.items}</td>
              <td>
                <strong>₹{Number(order.total).toLocaleString('en-IN')}</strong>
              </td>
              <td>
                <StatusPill value={order.paymentStatus || 'PENDING'} />
              </td>
              <td>
                <StatusPill value={order.status.toUpperCase()} />
              </td>
              <td>
                <ActionMenu
                  label={`Delivery status for ${order.id}`}
                  options={[
                    { value: 'waiting_confirmation', label: 'Waiting for confirmation' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'printing_started', label: 'Printing started' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  onChange={(status) => updateStatus(order, status)}
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <Pagination currentPage={page} totalItems={visible.length} onPageChange={setPage} />
      {selected && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="panel admin-modal" role="dialog" aria-modal="true" aria-labelledby="order-details-title">
            <div className="panel-heading">
            <div>
              <h2 id="order-details-title">Order details: {selected.id}</h2>
              <p className="muted">
                {selected.customer} · {selected.email}
              </p>
            </div>
            <button
              className="row-action"
              onClick={() => setSelected(null)}
              aria-label="Close order details"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <p className="muted">
            Order date: {selected.date} · Items: {selected.items} · Total: ₹
            {Number(selected.total).toLocaleString('en-IN')}
          </p>
          <p className="muted">
            Products: {selected.orderItems || 'Custom order'}
          </p>
          <p className="muted">
            Shipping address: {selected.shippingAddress || 'Not provided'}
          </p>
          {selected.customRequestId && (
            <>
              <p className="muted">
                Custom request: {selected.customRequestId} ·{' '}
                {selected.customPrintType} · {selected.customSize} ·{' '}
                {selected.customMaterial} · {selected.customColor} ·{' '}
                {selected.customQuantity} copies
              </p>
              <p className="muted">
                Customer information:{' '}
                {selected.customNotes || 'No additional information provided.'}
              </p>
            </>
          )}
          </div>
        </div>
      )}
    </Page>
  );
}
