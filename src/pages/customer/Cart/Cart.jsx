// import { useContext, useEffect, useState } from 'react';
// import { cartContext } from '../../../context/Cart/Cart';
// import { Link } from 'react-router-dom';
// import Spinner from '../../../components/common/Spinner/Spinner';

// export default function Cart() {
//   const { getProducts, deleteProduct, updateProductQuantity } =
//     useContext(cartContext);

//   const [data, setData] = useState(null);

//   const handleDeleteProduct = async (id) => {
//     await deleteProduct(id);
//     main();
//   };

//   const handleUpdateProductQuantity = async (id, quantity) => {
//     await updateProductQuantity(id, quantity);
//     main();
//   };

//   async function main() {
//     const data = await getProducts();
//     setData(data);
//   }

//   useEffect(() => {
//     main();
//   }, []);

//   return (
//     <div className="container flex flex-wrap">
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th scope="col" className="px-16 py-3">
//                 <span className="sr-only">Image</span>
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Product
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Qty
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Price
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {data ? (
//               data.products.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="text-center text-xl h-20 font-bold md:text-2xl lg:text-3xl"
//                   >
//                     <i className="fas fa-box-open me-3"></i>
//                     Wow, such empty!
//                   </td>
//                 </tr>
//               ) : (
//                 data.products.map((product) => (
//                   <tr
//                     key={product._id}
//                     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//                   >
//                     <td className="p-4">
//                       <Link to={`/product/${product.product._id}`}>
//                         <img
//                           src={product.product.imageCover}
//                           className="w-16 md:w-32 max-w-full max-h-full rounded-lg"
//                           alt="Apple Watch"
//                         />
//                       </Link>
//                     </td>
//                     <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
//                       <Link
//                         to={`/product/${product.product._id}`}
//                         className="hover:underline"
//                       >
//                         {product.product.title}
//                       </Link>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <button
//                           onClick={() => {
//                             handleUpdateProductQuantity(
//                               product.product._id,
//                               product.count - 1
//                             );
//                           }}
//                           className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
//                           type="button"
//                         >
//                           <span className="sr-only">Quantity button</span>
//                           <svg
//                             className="w-3 h-3"
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 18 2"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M1 1h16"
//                             />
//                           </svg>
//                         </button>
//                         <div>
//                           <input
//                             type="number"
//                             id="first_product"
//                             disabled
//                             className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             placeholder={product.count}
//                             required
//                           />
//                         </div>
//                         <button
//                           onClick={() => {
//                             handleUpdateProductQuantity(
//                               product.product._id,
//                               product.count + 1
//                             );
//                           }}
//                           className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
//                           type="button"
//                         >
//                           <span className="sr-only">Quantity button</span>
//                           <svg
//                             className="w-3 h-3"
//                             aria-hidden="true"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 18 18"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 1v16M1 9h16"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
//                       EGP {product.price * product.count}
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleDeleteProduct(product.product._id)}
//                         className="font-medium text-red-600 dark:text-red-500 hover:underline"
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )
//             ) : (
//               <tr>
//                 <td colSpan="5" className="py-4">
//                   <div>
//                     <Spinner />
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className=" w-full mt-5 h-fit bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//         <div className="px-5 pb-5">
//           <div className="flex items-center justify-between my-5">
//             <h5 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
//               Total Price
//             </h5>
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">
//               EGP {data?.totalCartPrice || 0}
//             </span>
//           </div>
//           <Link
//             to={`/checkout/${data?._id}`}
//             className="text-lg text-white w-full block bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
//           >
//             Place Order
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useContext, useEffect, useState } from 'react';
import { cartContext } from '../../../context/Cart/Cart';
import { Link } from 'react-router-dom';

/**
 * PocketForm Cart page
 * -----------------------
 * Same data flow (getProducts / deleteProduct / updateProductQuantity) —
 * table replaced with a row-card list (consistent with the Wishlist redesign)
 * plus a proper order summary panel:
 *  - Row cards stack cleanly on mobile instead of a horizontally-scrolling
 *    table.
 *  - Quantity stepper shows a small inline spinner on the count while an
 *    update is in flight, and the minus button disables at qty 1.
 *  - Remove plays a fade/collapse before the row actually leaves.
 *  - Order summary becomes a sticky sidebar on desktop (lg:), and sits below
 *    the item list on mobile — no more full-width total box floating alone.
 *  - Skeleton loading rows + redesigned empty state, same language as the
 *    Wishlist page for consistency.
 */

export default function Cart() {
  const { getProducts, deleteProduct, updateProductQuantity } =
    useContext(cartContext);

  const [data, setData] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const [updatingIds, setUpdatingIds] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleDeleteProduct = async (id) => {
    setRemovingIds((prev) => [...prev, id]);
    await deleteProduct(id);
    setTimeout(async () => {
      await main();
      setRemovingIds((prev) => prev.filter((x) => x !== id));
    }, 280);
  };

  const handleUpdateProductQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    setUpdatingIds((prev) => [...prev, id]);
    await updateProductQuantity(id, quantity);
    await main();
    setUpdatingIds((prev) => prev.filter((x) => x !== id));
  };

  async function main() {
    const data = await getProducts();
    setData(data);
  }

  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    if (data) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
  }, [data]);

  const items = data?.products || [];

  return (
    <>
      <style>{`
        @keyframes pf-row-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pf-row-out {
          from { opacity: 1; transform: scale(1); max-height: 220px; }
          to   { opacity: 0; transform: scale(0.97); max-height: 0; margin: 0; padding: 0; }
        }
        @keyframes pf-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .pf-row-enter { opacity: 0; animation: pf-row-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .pf-row-exit { animation: pf-row-out 0.28s ease forwards; overflow: hidden; }
        .pf-skeleton {
          background: linear-gradient(90deg, #e5e7eb 0px, #f3f4f6 40px, #e5e7eb 80px);
          background-size: 600px 100%;
          animation: pf-shimmer 1.4s infinite linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-row-enter, .pf-row-exit, .pf-skeleton { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-green-700 mb-2">
            <i className="fa-solid fa-cart-shopping" />
            Build queue
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your cart
          </h1>
          {data && items.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {items.length} item{items.length !== 1 && 's'} ready to print
            </p>
          )}
        </div>

        {/* loading skeleton */}
        {!data && (
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
            <div className="flex-1 flex flex-col gap-3">
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
                </div>
              ))}
            </div>
            <div className="lg:w-80 shrink-0">
              <div className="pf-skeleton h-48 rounded-xl" />
            </div>
          </div>
        )}

        {/* empty state */}
        {data && items.length === 0 && (
          <div className="max-w-md mx-auto flex flex-col items-center text-center py-16 px-4 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <i className="fa-solid fa-box-open text-2xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5">
              Wow, such empty!
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Your cart's waiting for its first mini. Browse the shop to get
              printing.
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

        {/* items + summary */}
        {data && items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
            {/* item list */}
            <div className="flex-1 w-full flex flex-col gap-3">
              {items.map((item, i) => {
                const isRemoving = removingIds.includes(item.product._id);
                const isUpdating = updatingIds.includes(item.product._id);
                return (
                  <div
                    key={item._id}
                    className={`flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 ${
                      isRemoving ? 'pf-row-exit' : 'pf-row-enter'
                    }`}
                    style={{ animationDelay: visible && !isRemoving ? `${(i % 10) * 60}ms` : '0ms' }}
                  >
                    <Link
                      to={`/product/${item.product._id}`}
                      className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                    >
                      <img
                        src={item.product.imageCover}
                        className="w-full h-full object-contain p-1.5"
                        alt={item.product.title}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="block font-semibold text-sm sm:text-base text-gray-900 hover:text-green-700 transition-colors truncate"
                      >
                        {item.product.title}
                      </Link>
                      <span className="block text-sm sm:text-base font-bold text-gray-900 mt-1">
                        EGP {item.price * item.count}
                      </span>

                      {/* quantity stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleUpdateProductQuantity(item.product._id, item.count - 1)
                          }
                          disabled={item.count <= 1 || isUpdating}
                          className="inline-flex items-center justify-center h-7 w-7 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <i className="fa-solid fa-minus text-[10px]" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {isUpdating ? (
                            <i className="fa-solid fa-circle-notch fa-spin text-xs text-green-700" />
                          ) : (
                            item.count
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateProductQuantity(item.product._id, item.count + 1)
                          }
                          disabled={isUpdating || item.count >= Number(item.product.quantity || 0)}
                          className="inline-flex items-center justify-center h-7 w-7 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <i className="fa-solid fa-plus text-[10px]" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(item.product._id)}
                      aria-label="Remove item"
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <i className="fa-regular fa-trash-can text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* order summary — sticky on desktop */}
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order summary
                </h2>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    EGP {data.totalCartPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Shipping</span>
                  <span className="text-green-700 font-medium">Calculated at checkout</span>
                </div>
                <div className="h-px bg-gray-100 mb-4" />
                <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    EGP {data.totalCartPrice}
                  </span>
                </div>
                <Link
                  to={`/checkout/${data._id}`}
                  className="flex items-center justify-center gap-2 text-white w-full bg-green-700 hover:bg-green-800 font-semibold rounded-lg px-5 py-3 text-center transition-colors duration-200"
                >
                  Place order
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}