import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Field, Page, SearchInput, StatusPill, Toolbar } from './AdminPrimitives';

function stockStatus(item) { if (item.madeToOrder) return 'MADE_TO_ORDER'; if (item.stock === 0) return 'OUT_OF_STOCK'; return item.stock <= item.threshold ? 'LOW_STOCK' : 'IN_STOCK'; }

export default function Inventory() {
  const [query, setQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { apiClient.get('/admin/products').then(({ data }) => setInventory(data.data || [])).catch(() => setError('Unable to load inventory.')); }, []);
  const visible = inventory.filter((item) => `${item.name} ${item.sku}`.toLowerCase().includes(query.toLowerCase()));
  const openEditor = (item) => { setSelected(item); setStock(String(item.stock)); };
  const saveStock = async (event) => { event.preventDefault(); try { await apiClient.put(`/admin/products/${encodeURIComponent(selected.id)}/stock`, { stock: Number(stock) }); setInventory((current) => current.map((item) => item.id === selected.id ? { ...item, stock: Number(stock) } : item)); setSelected(null); } catch { setError('Unable to update stock.'); } };
  return <Page title="Inventory" description="Track stock levels and production availability from the database."><Toolbar><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU..." /></Toolbar>{error && <p className="save-message" role="alert">{error}</p>}<DataTable headers={['PRODUCT', 'SKU', 'MATERIAL', 'CURRENT STOCK', 'THRESHOLD', 'STATUS', 'MADE-TO-ORDER', 'LAST UPDATED', 'ACTIONS']}>{visible.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.sku || '--'}</td><td>{item.material}</td><td><strong>{item.stock}</strong> units</td><td>{item.threshold}</td><td><StatusPill value={stockStatus(item)} /></td><td>{item.madeToOrder ? 'Yes' : 'No'}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '--'}</td><td><button className="row-link" onClick={() => openEditor(item)}>Update</button></td></tr>)}</DataTable>{selected && <form className="panel inline-form" onSubmit={saveStock}><div className="panel-heading"><div><h2>Update stock</h2><p className="muted">{selected.name} · {selected.sku || 'No SKU'}</p></div><button type="button" className="row-action" onClick={() => setSelected(null)} aria-label="Close"><i className="fa-solid fa-xmark" /></button></div><Field label="Current stock"><input type="number" value={stock} onChange={(event) => setStock(event.target.value)} min="0" required /></Field><button className="primary-button" type="submit">Save stock update</button></form>}</Page>;
}