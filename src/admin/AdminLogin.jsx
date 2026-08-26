import apiClient from '../lib/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Page } from './AdminPrimitives';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/auth/admin-signin', {
        username: form.username,
        password: form.password,
      });
      const token = response.data?.token;

      if (!token) {
        throw new Error('The login response did not include a token.');
      }

      localStorage.setItem('adminAuthToken', token);
      navigate('/admin', { replace: true });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to sign in. Check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page eyebrow="PRINTFORGE ADMIN" title="Welcome back" description="Sign in to manage your PrintForge workspace.">
      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <Field label="Username">
          <input name="username" type="text" value={form.username} onChange={updateField} required autoComplete="username" placeholder="3D-admin" />
        </Field>
        <Field label="Password">
          <div className="password-field">
            <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} required autoComplete="current-password" />
            <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>
        </Field>
        <label className="check-row"><input name="remember" type="checkbox" checked={form.remember} onChange={updateField} /> Remember me</label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'} <i className="fa-solid fa-arrow-right" /></button>
        {status && <p className="save-message" role="status">{status}</p>}
      </form>
    </Page>
  );
}