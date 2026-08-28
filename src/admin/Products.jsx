import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Page, Pagination, RowActions, SearchInput, StatusPill, Toolbar } from './AdminPrimitives';

export default function Products() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    Promise.all([apiClient.get('/admin/products'), apiClient.get('/admin/categories')])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data.data || []);
        setCategories(categoryResponse.data.data || []);
      })
      .catch(() => setMessage('Unable to load products or categories.'));
  }, []);
  const visible = products.filter((item) => {
    const matchesQuery = `${item.name} ${item.sku || ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'ALL' || item.status === status;
    const matchesCategory = category === 'ALL' || item.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });
  const pageRows = visible.slice((page - 1) * 20, page * 20);
  const deleteProduct = async (item) => {
    if (!window.confirm(`Delete ${item.name}? This action cannot be undone.`)) return;
    try {
      await apiClient.delete(`/admin/products/${encodeURIComponent(item.id)}`);
      setProducts((current) => current.filter((product) => product.id !== item.id));
      setMessage('Product deleted successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete product.');
    }
  };
  return <Page title="Products" description="Manage your catalogue, pricing, media and availability." action={<a className="primary-button" href="/admin/products/new"><i className="fa-solid fa-plus" /> Add product</a>}>
    {message && <p className="save-message" role="alert">{message}</p>}
    <Toolbar><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU..." /><select aria-label="Product status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select><select aria-label="Product category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="ALL">All categories</option>{categories.map((item) => <option key={item.id || item._id} value={item.name}>{item.name}</option>)}</select></Toolbar>
    <DataTable headers={['PRODUCT', 'SKU', 'CATEGORY', 'MATERIAL', 'PRICE', 'STOCK', 'STATUS', 'FEATURED', 'CREATED', 'ACTIONS']}>{pageRows.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.sku || item.id}</td><td>{item.category}</td><td>{item.material || '--'}</td><td><strong>₹{item.price.toLocaleString('en-IN')}</strong></td><td>{item.stock}</td><td><StatusPill value={item.status} /></td><td>{item.featured ? 'Yes' : 'No'}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '--'}</td><td><RowActions editPath={`/admin/products/${item.id}/edit`} onDelete={() => deleteProduct(item)} /></td></tr>)}</DataTable><Pagination currentPage={page} totalItems={visible.length} onPageChange={setPage} />
  </Page>;
}