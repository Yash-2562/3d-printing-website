// import { useContext, useEffect, useState } from 'react';
// import { wishlistContext } from '../../../context/Wishlist/Wishlist';
// import Spinner from '../../../components/common/Spinner/Spinner';
// import { cartContext } from '../../../context/Cart/Cart';
// import { Link } from 'react-router-dom';

// export default function Wishlist() {
//   const { getWishlist, deleteWishlistItem } = useContext(wishlistContext);
//   const { addProduct } = useContext(cartContext);
//   const [wishlistProducts, setWishlistProducts] = useState(null);

//   async function fetchGetWishlist() {
//     const products = await getWishlist();
//     setWishlistProducts(products);
//   }

//   async function fetchDeleteProduct(id) {
//     await deleteWishlistItem(id);
//     fetchGetWishlist();
//   }

//   useEffect(() => {
//     fetchGetWishlist();
//   }, []);

//   return (
//     <>
//       <div className="container flex flex-wrap">
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
//           <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//               <tr>
//                 <th scope="col" className="px-16 py-3">
//                   <span className="sr-only">Image</span>
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Product
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Price
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {wishlistProducts ? (
//                 wishlistProducts.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="text-center text-xl h-20 font-bold md:text-2xl lg:text-3xl"
//                     >
//                       <i className="fas fa-box-open me-3"></i>
//                       Wow, such empty!
//                     </td>
//                   </tr>
//                 ) : (
//                   wishlistProducts?.map((product) => (
//                     <tr
//                       key={product._id}
//                       className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//                     >
//                       <td className="p-4">
//                         <Link to={`/product/${product._id}`}>
//                           <img
//                             src={product.imageCover}
//                             className="w-16 md:w-32 max-w-full max-h-full rounded-lg"
//                             alt={product.title}
//                           />
//                         </Link>
//                       </td>

//                       <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
//                         <Link
//                           to={`/product/${product._id}`}
//                           className="hover:underline"
//                         >
//                           {product.title}
//                         </Link>
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
//                         EGP {product.price}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col space-y-3">
//                           <button
//                             href="#"
//                             onClick={() => addProduct(product._id)}
//                             className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//                           >
//                             <i className="fas fa-cart-plus me-2"></i>
//                             <span className="hidden md:inline">
//                               Add to cart
//                             </span>
//                           </button>

//                           <button
//                             onClick={() => fetchDeleteProduct(product._id)}
//                             className="font-medium text-red-600 dark:text-red-500 hover:underline"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="py-4">
//                     <div>
//                       <Spinner />
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }


import { useContext, useEffect, useState } from 'react';
import { wishlistContext } from '../../../context/Wishlist/Wishlist';
import { cartContext } from '../../../context/Cart/Cart';
import { Link } from 'react-router-dom';
import ResolvedImage from '../../../components/common/ResolvedImage';

/**
 * PocketForm Wishlist page
 * ---------------------------
 * Same data flow (getWishlist / deleteWishlistItem / addProduct) — the old
 * <table> layout is gone (tables force horizontal scroll on phones). Rebuilt as:
 *  - A row-card list: thumbnail + title/price on the left, actions on the
 *    right — stacks cleanly on mobile instead of scrolling sideways.
 *  - Skeleton loading rows instead of a spinner.
 *  - Staggered fade+rise entrance per row.
 *  - "Remove" plays a quick fade/collapse animation before the item leaves
 *    the list, instead of popping out instantly.
 *  - "Add to cart" gets inline loading → added feedback, consistent with
 *    the product cards elsewhere on the site.
 *  - Redesigned empty state with icon + CTA back to shopping, instead of a
 *    single line of text in a table cell.
 */

export default function Wishlist() {
  const { getWishlist, deleteWishlistItem } = useContext(wishlistContext);
  const { addProduct } = useContext(cartContext);
  const [wishlistProducts, setWishlistProducts] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const [cartState, setCartState] = useState({}); // { [id]: 'loading' | 'added' }
  const [visible, setVisible] = useState(false);

  async function fetchGetWishlist() {
    const products = await getWishlist();
    setWishlistProducts(products);
  }

  async function fetchDeleteProduct(id) {
    // play the collapse animation first, then actually remove
    setRemovingIds((prev) => [...prev, id]);
    await deleteWishlistItem(id);
    setTimeout(async () => {
      await fetchGetWishlist();
      setRemovingIds((prev) => prev.filter((x) => x !== id));
    }, 280);
  }

  async function handleAddToCart(id) {
    if (cartState[id]) return;
    setCartState((prev) => ({ ...prev, [id]: 'loading' }));
    const result = await addProduct(id);
    if (result === null) {
      setCartState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setCartState((prev) => ({ ...prev, [id]: 'added' }));
    setTimeout(() => {
      setCartState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 1500);
  }

  useEffect(() => {
    fetchGetWishlist();
  }, []);

  useEffect(() => {
    if (wishlistProducts) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
  }, [wishlistProducts]);

  return (
    <>
      <style>{`
        @keyframes pf-row-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pf-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .pf-row-enter { opacity: 0; animation: pf-row-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .pf-row-exit { animation: pf-row-out 0.28s ease forwards; }
        @keyframes pf-row-out {
          from { opacity: 1; transform: scale(1); max-height: 200px; }
          to   { opacity: 0; transform: scale(0.97); max-height: 0; margin: 0; padding: 0; }
        }
        .pf-skeleton {
          background: linear-gradient(90deg, #e5e7eb 0px, #f3f4f6 40px, #e5e7eb 80px);
          background-size: 600px 100%;
          animation: pf-shimmer 1.4s infinite linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-row-enter, .pf-row-exit, .pf-skeleton { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        {/* header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-green-700 mb-2">
            <i className="fa-solid fa-heart" />
            Saved for later
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your wishlist
          </h1>
          {wishlistProducts && wishlistProducts.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {wishlistProducts.length} mini{wishlistProducts.length !== 1 && 's'} waiting to be printed
            </p>
          )}
        </div>

        {/* loading skeleton */}
        {!wishlistProducts && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-3 sm:p-4"
              >
                <div className="pf-skeleton w-16 h-16 sm:w-24 sm:h-24 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="pf-skeleton h-4 w-1/2 rounded" />
                  <div className="pf-skeleton h-3 w-1/4 rounded" />
                </div>
                <div className="pf-skeleton h-9 w-24 rounded-lg hidden sm:block" />
              </div>
            ))}
          </div>
        )}

        {/* empty state */}
        {wishlistProducts && wishlistProducts.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 px-4 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <i className="fa-solid fa-box-open text-2xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5">
              Wow, such empty!
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Nothing saved yet. Browse the shop and tap the heart on any
              mini you'd like to print later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
            >
              Browse products
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
        )}

        {/* list */}
        {wishlistProducts && wishlistProducts.length > 0 && (
          <div className="flex flex-col gap-3">
            {wishlistProducts.map((product, i) => {
              const isRemoving = removingIds.includes(product._id);
              const state = cartState[product._id];
              return (
                <div
                  key={product._id}
                  className={`flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 ${
                    isRemoving ? 'pf-row-exit' : 'pf-row-enter'
                  }`}
                  style={{ animationDelay: visible && !isRemoving ? `${(i % 10) * 60}ms` : '0ms' }}
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                  >
                    <ResolvedImage
                      src={product.imageCover}
                      className="w-full h-full object-contain p-1.5"
                      alt={product.title}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${product._id}`}
                      className="block font-semibold text-sm sm:text-base text-gray-900 hover:text-green-700 transition-colors truncate"
                    >
                      {product.title}
                    </Link>
                    <span className="block text-sm sm:text-base font-bold text-gray-900 mt-1">
                      EGP {product.price}
                    </span>
                    {/* remove sits inline on mobile, moves to the actions column on sm+ */}
                    <button
                      onClick={() => fetchDeleteProduct(product._id)}
                      className="sm:hidden mt-1 text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={!!state}
                      className={`inline-flex items-center justify-center gap-1.5 text-white font-medium rounded-lg text-sm px-4 py-2.5 min-w-[130px] transition-colors duration-200 ${
                        state === 'added'
                          ? 'bg-green-600'
                          : 'bg-green-700 hover:bg-green-800'
                      }`}
                    >
                      {state === 'loading' && (
                        <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                      )}
                      {state === 'added' && (
                        <i className="fa-solid fa-check text-xs" />
                      )}
                      {!state && <i className="fa-solid fa-cart-plus text-xs" />}
                      {state === 'loading'
                        ? 'Adding…'
                        : state === 'added'
                        ? 'Added'
                        : 'Add to cart'}
                    </button>
                    <button
                      onClick={() => fetchDeleteProduct(product._id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  {/* mobile add-to-cart: icon-only, keeps row compact */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={!!state}
                    aria-label="Add to cart"
                    className={`sm:hidden shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors duration-200 ${
                      state === 'added' ? 'bg-green-600' : 'bg-green-700'
                    }`}
                  >
                    {state === 'loading' && (
                      <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                    )}
                    {state === 'added' && <i className="fa-solid fa-check text-xs" />}
                    {!state && <i className="fa-solid fa-cart-plus text-xs" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
