// import { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { authContext } from '../../../context/Auth/Auth';

// export default function Profile() {
//   const { setUserToken } = useContext(authContext);

//   function logout() {
//     setUserToken(null);
//     localStorage.removeItem('authToken');
//   }

//   return (
//     <section className="container mx-auto px-4 py-10">
//       <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//         <div className="flex items-center gap-3">
//           <i className="fas fa-user-circle text-3xl text-green-600" aria-hidden="true"></i>
//           <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
//         </div>
//         <p className="mt-4 text-gray-600">Manage your Freshcart account.</p>
//         <Link
//           to="/login"
//           onClick={logout}
//           className="mt-6 inline-flex rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
//         >
//           Log out
//         </Link>
//       </div>
//     </section>
//   );
// }

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';
import apiClient from '../../../lib/api';

/**
 * PocketForm Profile page
 * --------------------------
 * The old page showed no user info at all (no name, no email) — just a
 * static "Your Profile" heading and a logout button. Rebuilt to:
 *  - Decode the JWT (userToken) to pull the account's email, then display
 *    only the part before the "@" as the greeting/display name, per request.
 *    ASSUMPTION: the email lives in the token payload as `email` — that's
 *    the standard shape for this course's e-commerce API. If your token is
 *    shaped differently, point me at the right field/context and I'll swap
 *    the one decode line below.
 *  - An avatar circle using the first letter of that name.
 *  - Quick-link tiles to Orders/Wishlist/Cart/Categories so Profile acts as
 *    an account hub, not a dead end.
 *  - Logout as a clearly separated, less prominent action at the bottom.
 * Mobile-first: single column on phones, cards widen into a grid at sm/md.
 */

export default function Profile() {
  const { setUserToken } = useContext(authContext);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/profile').then(({ data }) => {
      setProfile(data.data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  function updateField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function saveProfile(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    apiClient.put('/profile', profile).then(({ data }) => {
      setProfile(data.data);
      setMessage(data.message);
    }).catch((error) => {
      setMessage(error.response?.data?.message || 'Unable to update profile');
    }).finally(() => setIsSaving(false));
  }

  function logout() {
    setUserToken(null);
    localStorage.removeItem('authToken');
  }

  const displayName = profile.name || 'Your profile';
  const quickLinks = [
    { to: '/orders', label: 'Orders', icon: 'fa-box-open' },
    { to: '/wishlist', label: 'Wishlist', icon: 'fa-heart' },
    { to: '/cart', label: 'Cart', icon: 'fa-cart-shopping' },
    { to: '/categories', label: 'Categories', icon: 'fa-list' },
  ];

  return (
    <section className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
      {/* header */}
      <div className="mb-6 text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-green-700 mb-2">
          <i className="fa-solid fa-user" />
          Account
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Your profile
        </h1>
      </div>

      {/* identity card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-green-100 text-green-700 text-xl sm:text-2xl font-bold uppercase">
            {displayName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {displayName}
            </h2>
            {profile.email && (
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            )}
          </div>
        </div>

        <form onSubmit={saveProfile} className="mt-6 border-t border-gray-100 pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Personal details</h2>
          {isLoading ? <p className="text-sm text-gray-500">Loading profile...</p> : (
            <>
              <input name="name" value={profile.name} onChange={updateField} required minLength="3" placeholder="Full name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none" />
              <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-green-600">
                <span className="border-r border-gray-200 px-3 text-sm text-gray-500">+91</span>
                <input name="phone" value={profile.phone} onChange={updateField} required pattern="[6-9][0-9]{9}" inputMode="numeric" maxLength="10" placeholder="10-digit mobile number" className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
              <textarea name="address" value={profile.address || ''} onChange={updateField} rows="3" placeholder="Delivery address" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none" />
              <button type="submit" disabled={isSaving} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60">
                {isSaving ? 'Saving...' : 'Update profile'}
              </button>
              {message && <p className="text-sm text-green-700">{message}</p>}
            </>
          )}
        </form>

        {/* quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="group flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors duration-200"
            >
              <i
                className={`fa-solid ${link.icon} text-green-700 group-hover:scale-110 transition-transform duration-200`}
              />
              <span className="text-xs font-medium text-gray-700">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* logout — separated, lower emphasis */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/login"
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
          Log out
        </Link>
      </div>
    </section>
  );
}