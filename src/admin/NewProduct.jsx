import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';
import { Field, FormSection, Page } from './AdminPrimitives';

const initialForm = { name: '', sku: '', category: '', description: '', price: '', material: 'PLA', stock: '0', threshold: '5', madeToOrder: false, status: 'ACTIVE', featured: false };

export default function NewProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const update = (event) => { const { name, value, type, checked } = event.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })); };
  const submit = async (event) => { event.preventDefault(); setIsSaving(true); setMessage(''); try { const data = new FormData(); Object.entries(form).forEach(([key, value]) => data.append(key, value)); if (image) data.append('image', image); await apiClient.post('/admin/products', data); await queryClient.invalidateQueries({ queryKey: ['products'] }); navigate('/admin/products'); } catch (error) { setMessage(error.response?.data?.message || 'Unable to save product.'); } finally { setIsSaving(false); } };
  return <Page title="Add product" description="Create a catalogue item saved directly to the database."><form className="settings-stack" onSubmit={submit}><FormSection title="Basic information"><Field label="Product name"><input name="name" value={form.name} onChange={update} required /></Field><Field label="SKU"><input name="sku" value={form.sku} onChange={update} required /></Field><Field label="Category"><input name="category" value={form.category} onChange={update} placeholder="Home, Collectibles..." required /></Field><Field label="Description"><textarea name="description" value={form.description} onChange={update} rows="4" required /></Field></FormSection><FormSection title="Pricing and printing"><Field label="Price"><input name="price" value={form.price} onChange={update} type="number" min="0" step="0.01" required /></Field><Field label="Material"><input name="material" value={form.material} onChange={update} required /></Field></FormSection><FormSection title="Inventory"><Field label="Stock quantity"><input name="stock" value={form.stock} onChange={update} type="number" min="0" required /></Field><Field label="Low-stock threshold"><input name="threshold" value={form.threshold} onChange={update} type="number" min="0" required /></Field><Field label="Made-to-order"><input name="madeToOrder" checked={form.madeToOrder} onChange={update} type="checkbox" /></Field></FormSection><FormSection title="Media and status"><Field label="Main image"><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0] || null)} required /></Field><Field label="Product status"><select name="status" value={form.status} onChange={update}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></Field><Field label="Featured"><input name="featured" checked={form.featured} onChange={update} type="checkbox" /></Field></FormSection><button className="primary-button" type="submit" disabled={isSaving}><i className="fa-solid fa-floppy-disk" /> {isSaving ? 'Saving...' : 'Save product'}</button>{message && <span className="save-message" role="alert">{message}</span>}</form></Page>;
}