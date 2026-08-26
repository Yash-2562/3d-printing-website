import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiClient from '../lib/api';

const metricDefinitions = [
  { label: "Today's orders", key: 'todayOrders', icon: 'fa-bag-shopping', tone: 'blue' },
  { label: 'Revenue this month', key: 'monthRevenue', icon: 'fa-indian-rupee-sign', tone: 'green' },
  { label: 'Printing now', key: 'printing', icon: 'fa-print', tone: 'orange' },
  { label: 'Delivered orders', key: 'delivered', icon: 'fa-truck', tone: 'green' },
  { label: 'Custom requests', key: 'customRequests', icon: 'fa-file-arrow-up', tone: 'violet' },
];

const statusTones = { confirmed: 'blue', printing_started: 'orange', printing: 'orange', quality_check: 'blue', shipped: 'green', delivered: 'green', under_review: 'blue', quote_sent: 'violet', new: 'violet' };

function formatCurrency(value) { return `₹${Number(value || 0).toLocaleString('en-IN')}`; }

function chartPath(values) {
  if (!values.length) return 'M0,190 L620,190';
  const maximum = Math.max(...values, 1);
  return values.map((value, index) => {
    const x = values.length === 1 ? 0 : (index * 620) / (values.length - 1);
    const y = 190 - (Number(value) / maximum) * 165;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function toneForStatus(status) { return statusTones[status] || 'blue'; }

function OrderStatusSection({ title, emptyMessage, orders }) {
  return <section className="panel table-panel"><div className="panel-heading"><div><h2>{title}</h2><p className="muted">Orders currently in this stage</p></div></div>{orders.length ? <div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.date}</td><td><strong>{formatCurrency(order.total)}</strong></td><td><span className={`status-pill ${toneForStatus(order.status)}`}>{order.status.replace('_', ' ')}</span></td></tr>)}</tbody></table></div> : <p className="muted">{emptyMessage}</p>}</section>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/summary')
      .then(({ data }) => setSummary(data.data || {}))
      .catch(() => setError('Unable to load dashboard data.'));
  }, []);

  const revenueValues = summary?.revenueByMonth || [];
  const revenuePath = chartPath(revenueValues.map((item) => item.value));
  const areaPath = `${revenuePath} V210 H0 Z`;
  const maximumRevenue = Math.max(...revenueValues.map((item) => item.value), 0);

  return <section className="admin-content">
    <div className="page-heading"><div><p className="eyebrow">ADMIN OVERVIEW</p><h1>Hello, Admin.</h1><p className="muted">Here is what is happening across your print studio today.</p></div><NavLink className="primary-button" to="/admin/products/new"><i className="fa-solid fa-plus" /> Add product</NavLink></div>
    {error && <p className="save-message" role="alert">{error}</p>}
    {!summary ? <p className="muted">Loading dashboard...</p> : <>
      <div className="metric-grid">{metricDefinitions.map((metric) => <article className="metric-card" key={metric.label}><div className={`metric-icon ${metric.tone}`}><i className={`fa-solid ${metric.icon}`} /></div><div><p>{metric.label}</p><strong>{metric.key === 'monthRevenue' ? formatCurrency(summary[metric.key]) : String(summary[metric.key] || 0).padStart(2, '0')}</strong><small>{metric.key === 'customRequests' ? `${summary.requestsForReview || 0} need review` : 'From live store data'}</small></div><i className="fa-solid fa-arrow-up-right-from-square metric-arrow" /></article>)}</div>
      <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p className="muted">Monthly revenue performance</p></div><span className="muted">Last 6 months</span></div><div className="chart"><div className="chart-y"><span>₹{Math.round(maximumRevenue / 1000)}k</span><span>₹{Math.round(maximumRevenue * .75 / 1000)}k</span><span>₹{Math.round(maximumRevenue * .5 / 1000)}k</span><span>₹{Math.round(maximumRevenue * .25 / 1000)}k</span><span>₹0</span></div><div className="chart-area"><div className="grid-lines" /><svg viewBox="0 0 620 210" preserveAspectRatio="none" aria-label="Revenue chart"><path d={revenuePath} fill="none" stroke="#10b981" strokeWidth="3" /><path d={areaPath} fill="url(#fill)" opacity=".2" /><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#10b981" /><stop offset="1" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs></svg><div className="chart-x">{revenueValues.map((item) => <span key={item.label}>{item.label}</span>)}</div></div></div></section><section className="panel request-panel"><div className="panel-heading"><div><h2>Custom print queue</h2><p className="muted">Requests waiting for your review</p></div><NavLink to="/admin/custom-print-requests" className="text-link">View all</NavLink></div>{summary.customQueue.length ? summary.customQueue.map((request) => <div className="request-row" key={request.id}><span className="request-file"><i className="fa-solid fa-file-3d" /></span><div><strong>{request.name || 'Custom print request'}</strong><small>{request.id} · {request.date}</small></div><span className={`status-pill ${toneForStatus(request.status)}`}>{request.status.replace('_', ' ')}</span></div>) : <p className="muted">No requests waiting for review.</p>}</section></div>
      <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent orders</h2><p className="muted">Latest activity from your storefront</p></div><NavLink to="/admin/orders" className="text-link">View all orders <i className="fa-solid fa-arrow-right" /></NavLink></div><div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PRODUCT</th><th>AMOUNT</th><th>STATUS</th><th /></tr></thead><tbody>{summary.recentOrders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small>{order.date}</small></td><td>{order.customer}</td><td>{order.product}</td><td><strong>{formatCurrency(order.total)}</strong></td><td><span className={`status-pill ${toneForStatus(order.status)}`}>{order.status.replace('_', ' ')}</span></td><td><NavLink className="row-action" to="/admin/orders" aria-label={`Open ${order.id}`}><i className="fa-solid fa-arrow-up-right-from-square" /></NavLink></td></tr>)}</tbody></table></div></section>
      <div className="dashboard-grid"><OrderStatusSection title="Printing started" emptyMessage="No orders have started printing." orders={summary.printingOrders || []} /><OrderStatusSection title="Delivered" emptyMessage="No delivered orders yet." orders={summary.deliveredOrders || []} /></div>
    </>}
  </section>;
}
OrderStatusSection.propTypes = { title: PropTypes.string.isRequired, emptyMessage: PropTypes.string.isRequired, orders: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, customer: PropTypes.string.isRequired, total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, status: PropTypes.string.isRequired, date: PropTypes.string.isRequired })).isRequired };