import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../lib/api';
import { Field, FormSection, Page } from './AdminPrimitives';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiClient.get(`/products/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        const product = data.data;
        setForm({
          name: product.title,
          sku: product.sku || '',
          category: product.category?.name || '',
          description: product.description || '',
          price: product.price,
          material: product.material || 'PLA',
          stock: product.quantity || 0,
          threshold: product.low_stock_threshold || 5,
          madeToOrder: Boolean(product.made_to_order),
          status: product.status || 'ACTIVE',
          featured: Boolean(product.featured),
          imageCover: product.imageCover,
        });
      })
      .catch(() => setMessage('Unable to load product.'));
  }, [id]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      await apiClient.post(`/admin/products/${encodeURIComponent(id)}/edit`, data);
      navigate('/admin/products');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update product.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) return <Page title="Edit product" description="Loading product details...">{message && <p className="save-message" role="alert">{message}</p>}</Page>;

  return <Page title="Edit product" description="Update catalogue details, pricing and availability."><form className="settings-stack" onSubmit={submit} encType="multipart/form-data"><FormSection title="Basic information"><Field label="Product name"><input name="name" value={form.name} onChange={update} required /></Field><Field label="SKU"><input name="sku" value={form.sku} onChange={update} required /></Field><Field label="Category"><input name="category" value={form.category} onChange={update} required /></Field><Field label="Description"><textarea name="description" value={form.description} onChange={update} rows="4" required /></Field></FormSection><FormSection title="Pricing and printing"><Field label="Price"><input name="price" value={form.price} onChange={update} type="number" min="0" step="0.01" required /></Field><Field label="Material"><input name="material" value={form.material} onChange={update} required /></Field></FormSection><FormSection title="Inventory"><Field label="Stock quantity"><input name="stock" value={form.stock} onChange={update} type="number" min="0" required /></Field><Field label="Low-stock threshold"><input name="threshold" value={form.threshold} onChange={update} type="number" min="0" required /></Field><Field label="Made-to-order"><input name="madeToOrder" checked={form.madeToOrder} onChange={update} type="checkbox" /></Field></FormSection><FormSection title="Media and status"><Field label="Current image"><img src={form.imageCover} alt={form.name} className="h-24 w-24 rounded-lg object-contain" /></Field><Field label="Replace image"><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0] || null)} /></Field><Field label="Product status"><select name="status" value={form.status} onChange={update}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></Field><Field label="Featured"><input name="featured" checked={form.featured} onChange={update} type="checkbox" /></Field></FormSection><button className="primary-button" type="submit" disabled={isSaving}><i className="fa-solid fa-floppy-disk" /> {isSaving ? 'Saving...' : 'Save changes'}</button>{message && <span className="save-message" role="alert">{message}</span>}</form></Page>;
}
