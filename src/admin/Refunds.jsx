import { useEffect, useState } from 'react';
import { DataTable, Field, Page, Pagination, StatusPill } from './AdminPrimitives';
import apiClient from '../lib/api';

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ orderId: '', amount: '', reason: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const loadRefunds = () => {
    setIsLoading(true);
    apiClient.get('/admin/refunds').then(({ data }) => {
      setRefunds(data.data || []);
      setOrders(data.orders || []);
    }).catch(() => setError('Unable to load refunds.')).finally(() => setIsLoading(false));
  };

  useEffect(() => { loadRefunds(); }, []);

  const chooseOrder = (event) => {
    const order = orders.find((item) => item.id === event.target.value);
    setForm((current) => ({ ...current, orderId: event.target.value, amount: order ? String(order.remaining) : '' }));
  };

  const submitRefund = async (event) => {
    event.preventDefault();
    setIsSaving(true); setError(''); setMessage('');
    try {
      const { data } = await apiClient.post('/admin/refunds', { orderId: form.orderId, amount: Number(form.amount), reason: form.reason });
      setMessage(`${data.message} (${data.data.razorpayRefundId})`);
      setForm({ orderId: '', amount: '', reason: '' }); setOpen(false); loadRefunds();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to process refund.'); }
    finally { setIsSaving(false); }
  };

  return <Page title="Refunds" description="Review and process test-mode Razorpay refunds." action={<button className="primary-button" onClick={() => { setOpen(true); setMessage(''); }} disabled={!orders.length}><i className="fa-solid fa-rotate-left" /> Create refund</button>}>
    {message && <p className="save-message" role="status">{message}</p>}
    {error && <p className="save-message" role="alert">{error}</p>}
    {isLoading ? <p className="muted">Loading refunds...</p> : <><DataTable headers={['REFUND ID', 'ORDER ID', 'CUSTOMER', 'REFUND AMOUNT', 'REASON', 'STATUS', 'RAZORPAY REFUND ID', 'DATE']}>
      {refunds.slice((page - 1) * 20, page * 20).map((refund) => <tr key={refund.id}><td><strong>{refund.id}</strong></td><td>{refund.order}</td><td>{refund.customer}</td><td><strong>₹{Number(refund.amount).toLocaleString('en-IN')}</strong></td><td>{refund.reason}</td><td><StatusPill value={refund.status} /></td><td>{refund.razorpay || '-'}</td><td>{refund.date}</td></tr>)}
    </DataTable><Pagination currentPage={page} totalItems={refunds.length} onPageChange={setPage} /></>}
    {!isLoading && !refunds.length && <p className="muted">No refunds have been processed yet.</p>}
    {open && <form className="panel inline-form" onSubmit={submitRefund}><div className="panel-heading"><h2>Refund confirmation</h2><button type="button" className="row-action" onClick={() => setOpen(false)} aria-label="Close"><i className="fa-solid fa-xmark" /></button></div><div className="form-grid"><Field label="Order"><select required value={form.orderId} onChange={chooseOrder}><option value="">Select a successful payment</option>{orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customer} · ₹{Number(order.remaining).toLocaleString('en-IN')} remaining</option>)}</select></Field><Field label="Amount"><input type="number" min="0.01" step="0.01" required value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} /></Field><Field label="Reason"><textarea rows="3" required value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} /></Field></div><button className="primary-button" disabled={isSaving}>{isSaving ? 'Processing...' : 'Confirm refund'}</button></form>}
  </Page>;
}