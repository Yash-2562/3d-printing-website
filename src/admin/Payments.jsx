import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Page, SearchInput, StatusPill, Toolbar } from './AdminPrimitives';

export default function Payments() {
  const [payments, setPayments] = useState([]); const [query, setQuery] = useState(''); const [error, setError] = useState('');
  useEffect(() => { apiClient.get('/admin/payments').then(({ data }) => setPayments(data.data || [])).catch(() => setError('Unable to load payments.')); }, []);
  const visible = payments.filter((payment) => `${payment.id} ${payment.order} ${payment.customer}`.toLowerCase().includes(query.toLowerCase()));
  return <Page title="Payments" description="Dummy Razorpay transactions and gateway references."><Toolbar><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search payment or order ID..." /></Toolbar>{error && <p className="save-message" role="alert">{error}</p>}<DataTable headers={['PAYMENT ID', 'ORDER ID', 'CUSTOMER', 'AMOUNT', 'METHOD', 'STATUS', 'RAZORPAY ORDER ID', 'RAZORPAY PAYMENT ID', 'DATE']}>{visible.map((payment) => <tr key={payment.id}><td><strong>{payment.id}</strong></td><td>{payment.order}</td><td>{payment.customer}</td><td><strong>₹{Number(payment.amount).toLocaleString('en-IN')}</strong></td><td>{payment.method}</td><td><StatusPill value={payment.status} /></td><td>{payment.razorpayOrder}</td><td>{payment.razorpayPayment || '-'}</td><td>{payment.date}</td></tr>)}</DataTable></Page>;
}