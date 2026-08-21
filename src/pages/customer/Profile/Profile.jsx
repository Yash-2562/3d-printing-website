import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';

export default function Profile() {
  const { setUserToken } = useContext(authContext);

  function logout() {
    setUserToken(null);
    localStorage.removeItem('authToken');
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <i className="fas fa-user-circle text-3xl text-green-600" aria-hidden="true"></i>
          <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
        </div>
        <p className="mt-4 text-gray-600">Manage your Freshcart account.</p>
        <Link
          to="/login"
          onClick={logout}
          className="mt-6 inline-flex rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
        >
          Log out
        </Link>
      </div>
    </section>
  );
}