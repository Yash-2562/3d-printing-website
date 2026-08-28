import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { DataTable, Field, Page, Pagination, RowActions, StatusPill } from './AdminPrimitives';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [page, setPage] = useState(1);

  const loadCategories = () => apiClient.get('/admin/categories').then(({ data }) => setCategories(data.data || []));
  useEffect(() => { loadCategories().catch(() => setMessage('Unable to load categories.')); }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const pageRows = categories.slice((page - 1) * 20, page * 20);
  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSuccess(false);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.set('image', imageFile);
      if (editing) await apiClient.post(`/admin/categories/${editing.id}`, data);
      else await apiClient.post('/admin/categories', data);
      setForm({ name: '', slug: '', description: '', image: '' });
      setImageFile(null);
      setOpen(false);
      setEditing(null);
      await loadCategories();
      setIsSuccess(true);
      setMessage(editing ? 'Category updated successfully.' : 'Category added successfully.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save category.');
      setIsSuccess(false);
    }
  };

  return <Page title="Categories" description="Organise products into storefront collections that automatically get their own page." action={<button className="primary-button" onClick={() => { setMessage(''); setIsSuccess(false); setEditing(null); setImageFile(null); setForm({ name: '', slug: '', description: '', image: '' }); setOpen(true); }}><i className="fa-solid fa-plus" /> Add category</button>}>
    {message && <div className={`category-toast ${isSuccess ? 'category-toast-success' : 'category-toast-error'}`} role={isSuccess ? 'status' : 'alert'}><i className={`fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'}`} /><span>{message}</span>{isSuccess && <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMessage(''); }}>View categories</button>}<button type="button" className="category-toast-dismiss" aria-label="Dismiss message" onClick={() => setMessage('')}><i className="fa-solid fa-xmark" /></button></div>}
    <DataTable headers={['ID', 'CATEGORY', 'SLUG', 'DESCRIPTION', 'PRODUCT COUNT', 'STATUS', 'CREATED', 'ACTIONS']}>
      {pageRows.map((category) => <tr key={category.id}><td>{category.id}</td><td><strong>{category.name}</strong></td><td>{category.slug}</td><td>{category.description}</td><td>{category.products}</td><td><StatusPill value={category.status} /></td><td>{new Date(category.created).toLocaleDateString('en-IN')}</td><td><RowActions onEdit={() => { setEditing(category); setImageFile(null); setForm({ name: category.name, slug: category.slug, description: category.description, image: category.image }); setOpen(true); }} onDelete={async () => { if (!window.confirm(`Delete ${category.name}? This action cannot be undone.`)) return; try { await apiClient.delete(`/admin/categories/${category.id}`); await loadCategories(); } catch (error) { setMessage(error.response?.data?.message || 'Unable to delete category.'); } }} /></td></tr>)}
    </DataTable><Pagination currentPage={page} totalItems={categories.length} onPageChange={setPage} />
    {open && <div className="admin-modal-backdrop" role="presentation"><form className="panel admin-modal" onSubmit={submit} encType="multipart/form-data"><div className="panel-heading"><h2>{editing ? 'Edit category' : 'New category'}</h2><button type="button" className="row-action" onClick={() => { setOpen(false); setEditing(null); }} aria-label="Close"><i className="fa-solid fa-xmark" /></button></div><div className="form-grid"><Field label="Name"><input name="name" value={form.name} onChange={update} required /></Field><Field label="Slug"><input name="slug" value={form.slug} onChange={update} placeholder="nano-banana-minis" required /></Field><Field label="Description"><textarea name="description" value={form.description} onChange={update} rows="3" /></Field><Field label="Image URL"><input name="image" value={form.image} onChange={update} placeholder="https://..." /></Field><Field label="Or upload a local image"><input name="imageFile" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0] || null)} /></Field></div><button className="primary-button" type="submit"><i className="fa-solid fa-floppy-disk" /> {editing ? 'Save changes' : 'Save category'}</button></form></div>}
  </Page>;
}