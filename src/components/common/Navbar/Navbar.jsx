// import logo from '../../../assets/freshcart-logo.svg';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useContext, useEffect } from 'react';
// import { authContext } from '../../../context/Auth/Auth';
// import { initFlowbite } from 'flowbite';
// import { productsContext } from '../../../context/Products/Products';
// import Search from '../../../pages/customer/Search/Search';

// export default function Navbar() {
//   const { userToken, setUserToken } = useContext(authContext);
//   const location = useLocation();

//   const { data, setSearchRes, searchRes } = useContext(productsContext);

//   function logout() {
//     setUserToken(null);
//     localStorage.removeItem('authToken');
//   }

//   const navigate = useNavigate();
//   function handleSearch(e) {
//     if (e.key === 'Enter') {
//       const query = e.target.value;

//       const filteredProducts = data.filter((product) =>
//         product.title.toLowerCase().includes(query.toLowerCase().trim())
//       );

//       setSearchRes(filteredProducts);
//       navigate('/search');
//     }
//   }

//   useEffect(() => {
//     initFlowbite();
//   }, []);

//   const getLinkClass = (path) => {
//     return location.pathname === path
//       ? 'block py-2 px-3 text-white bg-green-700 rounded lg:bg-transparent lg:text-green-700 lg:p-0 lg:dark:text-green-500'
//       : 'block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-green-700 lg:p-0 dark:text-white lg:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700';
//   };

//   return (
//     <>
//       <nav className="bg-white border-gray-200 shadow-md dark:bg-gray-900 fixed top-0 w-full z-50">
//         <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//           <Link
//             to="/"
//             className="flex items-center space-x-3 rtl:space-x-reverse"
//           >
//             <img src={logo} className="h-8" alt="Freshcart Logo" />
//           </Link>
//           <div className="flex lg:order-2">
//             {userToken ? (
//               <>
//                 <button
//                   type="button"
//                   data-collapse-toggle="navbar-search"
//                   aria-controls="navbar-search"
//                   aria-expanded="false"
//                   className="lg:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                     />
//                   </svg>
//                   <span className="sr-only">Search</span>
//                 </button>
//                 <div className="relative hidden lg:block">
//                   <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                     <svg
//                       className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                       />
//                     </svg>
//                     <span className="sr-only">Search icon</span>
//                   </div>
//                   <input
//                     type="text"
//                     onKeyUp={(e) => handleSearch(e)}
//                     id="search-navbar"
//                     className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
//                     placeholder="Search..."
//                   />
//                 </div>
//               </>
//             ) : (
//               ''
//             )}
//             <button
//               data-collapse-toggle="navbar-search"
//               type="button"
//               className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//               aria-controls="navbar-search"
//               aria-expanded="false"
//             >
//               <span className="sr-only">Open main menu</span>
//               <svg
//                 className="w-5 h-5"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 17 14"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M1 1h15M1 7h15M1 13h15"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div
//             className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1"
//             id="navbar-search"
//           >
//             {userToken ? (
//               <div className="relative mt-3 lg:hidden">
//                 <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                   <svg
//                     className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   onKeyUp={(e) => handleSearch(e)}
//                   id="search-navbar"
//                   className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
//                   placeholder="Search..."
//                 />
//               </div>
//             ) : (
//               ''
//             )}
//             <ul
//               className={`flex flex-col p-4 lg:p-0 mt-4 ${
//                 userToken ? '' : 'mr-40'
//               } w-full  font-medium border border-gray-100 rounded-lg bg-gray-50 lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0 lg:bg-white dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700`}
//             >
//               {userToken ? (
//                 <>
//                   {' '}
//                   <li>
//                     <Link
//                       to="/"
//                       className={getLinkClass('/')}
//                       aria-current="page"
//                     >
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-home fa-fw"></i>
//                         <span>Home</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="wishlist" className={getLinkClass('/wishlist')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-heart fa-fw"></i>
//                         <span>Wishlist</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="cart" className={getLinkClass('/cart')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-cart-shopping fa-fw"></i>
//                         <span>Cart</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="brands" className={getLinkClass('/brands')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fa-solid fa-tags" />
//                         <span>Brands</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="categories"
//                       className={getLinkClass('/categories')}
//                     >
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fa-solid fa-list" />
//                         <span>Categories</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="profile" className={getLinkClass('/profile')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-user fa-fw"></i>
//                         <span>Profile</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="login"
//                       onClick={logout}
//                       className={getLinkClass('/login')}
//                     >
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-arrow-right-from-bracket fa-fw"></i>
//                         <span>Logout</span>
//                       </div>
//                     </Link>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li>
//                     <Link to="login" className={getLinkClass('/login')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-sign-in-alt fa-fw"></i>
//                         <span>Login</span>
//                       </div>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="register" className={getLinkClass('/register')}>
//                       <div className="flex lg:flex-col lg:justify-center items-center space-x-1">
//                         <i className="fas fa-user-plus fa-fw"></i>
//                         <span>Register</span>
//                       </div>
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }


import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { authContext } from '../../../context/Auth/Auth';
import { initFlowbite } from 'flowbite';
import { productsContext } from '../../../context/Products/Products';

/**
 * PocketForm Navbar
 * -----------------
 * Same color tokens as before (green-700 accent, white/black/gray-900 base) —
 * layout is rebuilt from scratch around the site's actual product: pocket-size
 * 3D-printed miniatures (the "nano banana" scaling trend, custom mini figures,
 * plastic gift/keepsake objects).
 *
 * Structural idea: a slim two-tier bar.
 *   Tier 1 (thin, dark strip): brand mark + live "print queue" utility icons
 *            (cart / wishlist / account) — mirrors a printer's status strip.
 *   Tier 2 (main bar): search framed as "Find a model to print" + the real
 *            nav links, styled as a horizontal filament/build-plate rail with
 *            a moving indicator instead of per-link background pills.
 */

export default function Navbar() {
  const { userToken, setUserToken } = useContext(authContext);
  const location = useLocation();
  const { data, setSearchRes } = useContext(productsContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  function logout() {
    setUserToken(null);
    localStorage.removeItem('authToken');
  }

  function handleSearch(e) {
    if (e.key === 'Enter') {
      const q = e.target.value;
      const filtered = (data || []).filter((p) =>
        p.title.toLowerCase().includes(q.toLowerCase().trim())
      );

      if (filtered.length === 0) {
        setSearchRes(null);
        navigate('/');
        setMobileOpen(false);
        return;
      }

      setSearchRes(filtered);
      navigate('/search');
      setMobileOpen(false);
    }
  }

  useEffect(() => {
    initFlowbite();
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = userToken
    ? [
        { to: '/', label: 'Home', icon: 'fa-house' },
        { to: 'about', label: 'About', icon: 'fa-circle-info' },
        { to: 'shop', label: 'Shop Minis', icon: 'fa-cubes' },
        { to: 'custom-order', label: 'Custom Order', icon: 'fa-wand-magic-sparkles' },
        { to: 'brands', label: 'Brands', icon: 'fa-tags' },
      ]
    : [];

  return (
    <header className="fixed top-0 w-full z-50 font-sans">
      {/* Tier 1 — thin utility strip */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-screen-xl mx-auto px-4 h-9 flex items-center justify-between text-xs">
          <span className="hidden sm:flex items-center gap-1.5 text-gray-300">
            <i className="fa-solid fa-layer-group text-green-500" />
            Pocket-size prints, shipped in 3–5 days
          </span>
          <div className="flex items-center gap-4 ml-auto">
            {userToken ? (
              <>
                <Link
                  to="wishlist"
                  className="flex items-center gap-1.5 hover:text-green-500 transition-colors"
                >
                  <i className="fa-regular fa-heart" />
                  <span className="hidden md:inline">Wishlist</span>
                </Link>
                <Link
                  to="orders"
                  className="flex items-center gap-1.5 hover:text-green-500 transition-colors"
                >
                  <i className="fa-solid fa-box-open" />
                  <span className="hidden md:inline">Orders</span>
                </Link>
                <Link
                  to="cart"
                  className="flex items-center gap-1.5 hover:text-green-500 transition-colors"
                >
                  <i className="fa-solid fa-cart-shopping" />
                  <span className="hidden md:inline">Cart</span>
                </Link>
                <Link
                  to="profile"
                  className="flex items-center gap-1.5 hover:text-green-500 transition-colors"
                >
                  <i className="fa-solid fa-user" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-green-500 transition-colors"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="login" className="hover:text-green-500 transition-colors">
                  Log in
                </Link>
                <Link
                  to="register"
                  className="text-green-500 hover:text-green-400 transition-colors font-medium"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2 — main bar: brand, search, nav rail */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Brand */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Pocket<span className="text-green-700">Form</span>
              </span>
            </Link>

            {/* Search — framed around the product, not generic */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyUp={handleSearch}
                  placeholder="Find a model to print…"
                  className="block w-full py-2 ps-9 pe-3 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                />
              </div>
            </div>

            {/* Desktop nav rail */}
            {userToken && (
              <ul className="hidden lg:flex items-center gap-1 shrink-0">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive('/' + link.to) || isActive(link.to)
                          ? 'text-green-700'
                          : 'text-gray-600 hover:text-green-700'
                      }`}
                    >
                      <i className={`fa-solid ${link.icon} text-xs`} />
                      {link.label}
                      {(isActive('/' + link.to) || isActive(link.to)) && (
                        <span className="absolute left-3 right-3 -bottom-[1px] h-0.5 bg-green-700 rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                onKeyUp={handleSearch}
                placeholder="Find a model to print…"
                className="block w-full py-2 ps-9 pe-3 text-sm text-gray-900 border border-gray-300 rounded-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {userToken ? (
              <ul className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive('/' + link.to) || isActive(link.to)
                          ? 'bg-green-700 text-white'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      <i className={`fa-solid ${link.icon} text-xs`} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                >
                  Log in
                </Link>
                <Link
                  to="register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}