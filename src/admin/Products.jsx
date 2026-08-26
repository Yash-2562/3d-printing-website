import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Page, RowActions, SearchInput, StatusPill, Toolbar } from './AdminPrimitives';

export default function Products() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  useEffect(() => { apiClient.get('/admin/products').then(({ data }) => setProducts(data.data || [])).catch(() => setProducts([])); }, []);
  const visible = products.filter((item) => `${item.name} ${item.id}`.toLowerCase().includes(query.toLowerCase()));
  return <Page title="Products" description="Manage your catalogue, pricing, media and availability." action={<a className="primary-button" href="/admin/products/new"><i className="fa-solid fa-plus" /> Add product</a>}><Toolbar><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU..." /><select aria-label="Product status"><option>All statuses</option><option>Active</option><option>Inactive</option></select><select aria-label="Product category"><option>All categories</option><option>Desk accessories</option><option>Customized gifts</option></select></Toolbar><DataTable headers={['PRODUCT', 'SKU', 'CATEGORY', 'MATERIAL', 'PRICE', 'STOCK', 'STATUS', 'FEATURED', 'CREATED', 'ACTIONS']}>{visible.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.id}</td><td>{item.category}</td><td>--</td><td><strong>₹{item.price.toLocaleString('en-IN')}</strong></td><td>{item.stock}</td><td><StatusPill value={item.status} /></td><td>{item.featured ? 'Yes' : 'No'}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '--'}</td><td><RowActions editPath={`/admin/products/${item.id}/edit`} onDelete={() => window.confirm(`Delete ${item.name}?`)} /></td></tr>)}</DataTable></Page>;
}