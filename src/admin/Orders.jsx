import { useEffect, useState } from 'react';
import {
  ActionMenu,
  DataTable,
  Page,
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/admin/orders')
      .then(({ data }) => setRows(data.data || []))
      .catch(() => setError('Unable to load orders.'))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = rows.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.email}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (!statusFilter || order.status === statusFilter);
  });

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
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search order ID or customer..."
        />
        <select aria-label="Payment status" disabled>
          <option>Payment status</option>
        </select>
        <select
          aria-label="Order status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All order statuses</option>
          <option value="waiting_confirmation">Waiting for confirmation</option>
          <option value="confirmed">Confirmed</option>
          <option value="printing_started">Printing started</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" aria-label="From date" disabled />
        <input type="date" aria-label="To date" disabled />
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
          {visible.map((order) => (
            <tr key={order.id}>
              <td>
                <button className="row-link" onClick={() => setSelected(order)}>
                  {order.id}
                </button>
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
      {selected && (
        <div className="panel inline-form">
          <div className="panel-heading">
            <div>
              <h2>Order details: {selected.id}</h2>
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
      )}
    </Page>
  );
}
