// import { Link } from 'react-router-dom';
// import logo from '../../../assets/freshcart-logo.svg';
// import { useContext } from 'react';
// import { authContext } from '../../../context/Auth/Auth';

// export default function Footer() {
//   const { userToken } = useContext(authContext);

//   return (
//     <>
//       <footer className="bg-white border border-t-1 mt-6 dark:bg-gray-900">
//         <div className=" p-6 mx-auto">
//           <div className="lg:flex">
//             <div className="w-full -mx-6 lg:w-2/5">
//               <div className="px-6">
//                 <a href="#">
//                   <img className="w-auto h-7" src={logo} alt="Site Logo" />
//                 </a>
//                 <div className="max-w-sm mt-2 text-gray-500 dark:text-gray-400">
//                   Discover More, Spend Less - Shop the Best at Your Fingertips!
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 lg:mt-0 lg:flex-1">
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
//                 <div>
//                   <h3 className="text-gray-700 uppercase dark:text-white">
//                     Other Sites
//                   </h3>
//                   <a
//                     href="https://mohamedemary.github.io/route-frontend/assignments/10-daniels/index.html"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                   >
//                     Daniels
//                   </a>
//                   <a
//                     href="https://mohamedemary.github.io/route-frontend/assignments/07-devFolio/index.html"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                   >
//                     Devfolio
//                   </a>
//                   <a
//                     href="https://game-over-ivory.vercel.app/"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                   >
//                     Game Over
//                   </a>
//                   <a
//                     href="https://todo-app-wine-tau.vercel.app/"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                   >
//                     Todo App
//                   </a>
//                 </div>
//                 <div>
//                   <h3 className="text-gray-700 uppercase dark:text-white">
//                     Jump to
//                   </h3>
//                   {userToken ? (
//                     <>
//                       <Link
//                         to="/"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fa-fw  fas fa-home"></i> Home
//                       </Link>
//                       <Link
//                         to="/wishlist"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fa-fw  fas fa-heart"></i> Wishlist
//                       </Link>
//                       <Link
//                         to="/cart"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fa-fw  fas fa-shopping-cart"></i> Cart
//                       </Link>
//                       <Link
//                         to="/brands"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fa-fw  fas fas fa-tags"></i> Brands
//                       </Link>
//                       <Link
//                         to="/categories"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fa-fw  fas fa-list"></i> Categories
//                       </Link>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         to="login"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fas fa-sign-in-alt"></i> Login
//                       </Link>
//                       <Link
//                         to="register"
//                         className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
//                       >
//                         <i className="fas fa-user-plus fa-fw"></i> Register
//                       </Link>
//                     </>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-gray-700 uppercase dark:text-white">
//                     Contact
//                   </h3>
//                   <span className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
//                     <a href="mailto:mohamed.ahmed.emary@gmail.com">
//                       mohamed.ahmed.emary@gmail.com
//                     </a>
//                   </span>
//                   <span className="block space-x-2 mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
//                     <a
//                       href="https://linkedin.com/in/mohamedemary"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <i className="fa-lg fa-fw  fab fa-linkedin"></i>
//                     </a>
//                     <a
//                       href="https://github.com/mohamedemary"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <i className="fa-lg fa-fw  fab fa-github"></i>
//                     </a>
//                     <a
//                       href="mailto:mohamed.ahmed.emary@gmail.com"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <i className="fa-lg fa-fw  far fa-envelope"></i>
//                     </a>
//                     <a
//                       href="https://leetcode.com/Spark71"
//                       className="inline"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <svg
//                         className="inline text-sm"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="14"
//                         height="14"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           fill="currentColor"
//                           d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
//                         />
//                       </svg>
//                     </a>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <hr className="h-px my-4 bg-gray-200 border-none dark:bg-gray-700" />
//           <div>
//             <div className="text-center text-gray-500 dark:text-gray-400">
//               &quot;It does not matter how slowly you go as long as you do not
//               stop.&quot; - <span className="italic text-md">Confucius</span>
//             </div>
//           </div>
//           <div>
//             <div className="text-center italic py-3 text-gray-500 dark:text-gray-400">
//               Made with love and passion by Mohamed Emary
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }
// import { Link } from 'react-router-dom';
// import logo from '../../../assets/freshcart-logo.svg';
// import { useContext, useState } from 'react';
// import { authContext } from '../../../context/Auth/Auth';

/**
 * PocketForm Footer
 * -------------------
 * Same real content (contact links, dev portfolio links, nav shortcuts) —
 * rebuilt visually to match the rest of the site:
 *  - Dark (gray-900/black) footer instead of white, green accent — mirrors
 *    the navbar's tier-1 strip so the site feels bookended.
 *  - Newsletter-style "Get print drops" input (front-end only, no backend
 *    wired — hook up to your API when ready).
 *  - Icon-first social row with hover-lift instead of plain inline icons.
 *  - "Back to top" pill button, bottom-right, appears as a small utility.
 *  - Mobile-first: single column on phones, 2 cols on sm, full row on md+.
 */

// export default function Footer() {
//   const { userToken } = useContext(authContext);
//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);

//   function handleSubscribe(e) {
//     e.preventDefault();
//     if (!email) return;
//     setSubscribed(true);
//     setEmail('');
//   }

//   function scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   return (
//     <footer className="relative bg-gray-900 text-gray-300 mt-10">
//       {/* thin green top border, echoes the navbar's active-link underline */}
//       <div className="h-0.5 bg-green-700" />

//       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
//         {/* Top: brand + newsletter */}
//         <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between border-b border-gray-800 pb-8 sm:pb-10">
//           <div className="max-w-sm">
//             <Link to="/" className="inline-flex items-center gap-2">
//               {/* <img className="h-7 w-auto" src={logo} alt="PocketForm" /> */}
//               <span className="text-2xl font-bold tracking-tight text-white">
//                 Pocket<span className="text-green-500">Form</span>
//               </span>
//             </Link>
//             <p className="mt-3 text-sm text-gray-400 leading-relaxed">
//               Pocket-size 3D prints for gifts, keepsakes, and nano-banana
//               scale minis — designed and shipped with care.
//             </p>
//           </div>

//           <div className="w-full md:w-auto md:min-w-[320px]">
//             <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-2">
//               Get print drops
//             </h3>
//             <p className="text-xs text-gray-400 mb-3">
//               New minis and studio restocks, straight to your inbox.
//             </p>
//             {subscribed ? (
//               <p className="text-sm text-green-500 flex items-center gap-2">
//                 <i className="fa-solid fa-circle-check" />
//                 You're on the list.
//               </p>
//             ) : (
//               <form
//                 onSubmit={handleSubscribe}
//                 className="flex flex-col xs:flex-row gap-2 sm:flex-row"
//               >
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@email.com"
//                   className="w-full sm:flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-shadow"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full sm:w-auto shrink-0 px-4 py-2.5 text-sm font-semibold rounded-lg bg-green-700 hover:bg-green-600 text-white transition-colors"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Middle: link columns */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8 sm:py-10">
//           <div>
//             <h3 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
//               More by the maker
//             </h3>
//             <nav className="flex flex-col gap-2">
//               <a
//                 href="https://mohamedemary.github.io/route-frontend/assignments/10-daniels/index.html"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//               >
//                 Daniels
//               </a>
//               <a
//                 href="https://mohamedemary.github.io/route-frontend/assignments/07-devFolio/index.html"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//               >
//                 Devfolio
//               </a>
//               <a
//                 href="https://game-over-ivory.vercel.app/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//               >
//                 Game Over
//               </a>
//               <a
//                 href="https://todo-app-wine-tau.vercel.app/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//               >
//                 Todo App
//               </a>
//             </nav>
//           </div>

//           <div>
//             <h3 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
//               Jump to
//             </h3>
//             <nav className="flex flex-col gap-2">
//               {userToken ? (
//                 <>
//                   <Link
//                     to="/"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-house fa-fw text-xs" /> Home
//                   </Link>
//                   <Link
//                     to="/wishlist"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-heart fa-fw text-xs" /> Wishlist
//                   </Link>
//                   <Link
//                     to="/cart"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-cart-shopping fa-fw text-xs" /> Cart
//                   </Link>
//                   <Link
//                     to="/brands"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-tags fa-fw text-xs" /> Studios
//                   </Link>
//                   <Link
//                     to="/categories"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-list fa-fw text-xs" /> Categories
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="login"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-sign-in-alt fa-fw text-xs" /> Login
//                   </Link>
//                   <Link
//                     to="register"
//                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors w-fit"
//                   >
//                     <i className="fa-solid fa-user-plus fa-fw text-xs" /> Register
//                   </Link>
//                 </>
//               )}
//             </nav>
//           </div>

//           <div>
//             <h3 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
//               Contact
//             </h3>
//             <a
//               href="mailto:mohamed.ahmed.emary@gmail.com"
//               className="block text-sm text-gray-400 hover:text-green-500 transition-colors w-fit break-all"
//             >
//               mohamed.ahmed.emary@gmail.com
//             </a>

//             <div className="flex items-center gap-3 mt-4">
//               <a
//                 href="https://linkedin.com/in/mohamedemary"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="LinkedIn"
//                 className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-green-700 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 <i className="fa-brands fa-linkedin fa-fw" />
//               </a>
//               <a
//                 href="https://github.com/mohamedemary"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="GitHub"
//                 className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-green-700 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 <i className="fa-brands fa-github fa-fw" />
//               </a>
//               <a
//                 href="mailto:mohamed.ahmed.emary@gmail.com"
//                 aria-label="Email"
//                 className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-green-700 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 <i className="fa-regular fa-envelope fa-fw" />
//               </a>
//               <a
//                 href="https://leetcode.com/Spark71"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="LeetCode"
//                 className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-green-700 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 <svg
//                   width="15"
//                   height="15"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
//                   />
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom: quote + credit */}
//         {/* <div className="border-t border-gray-800 pt-6 flex flex-col items-center gap-2 text-center">
//           <p className="text-xs sm:text-sm text-gray-500 max-w-md">
//             "It does not matter how slowly you go as long as you do not
//             stop." <span className="italic text-gray-400">— Confucius</span>
//           </p>
//           <p className="text-xs italic text-gray-600">
//             Made with love and passion by Mohamed Emary
//           </p>
//         </div> */}
//       </div>

//       {/* back to top */}
//       <button
//         onClick={scrollToTop}
//         aria-label="Back to top"
//         className="hidden sm:flex absolute -top-5 right-6 items-center justify-center w-10 h-10 rounded-full bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-black/30 transition-colors duration-200"
//       >
//         <i className="fa-solid fa-arrow-up text-sm" />
//       </button>
//     </footer>
//   );
// }

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';

export default function Footer() {
  const { userToken } = useContext(authContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="relative mt-10 overflow-hidden bg-[#07100d] text-gray-300">

      {/* =========================================================
          BACKGROUND / 3D PRINTING ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* green ambient glow */}

        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.07] blur-[110px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-green-400/[0.06] blur-[120px]" />

        {/* perspective floor grid */}

        <div
          className="absolute -bottom-64 left-1/2 h-[650px] w-[1500px] -translate-x-1/2 opacity-[0.11]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(52,211,153,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52,211,153,.5) 1px, transparent 1px)
            `,
            backgroundSize: '55px 55px',
            transform:
              'translateX(-50%) perspective(650px) rotateX(64deg)',
          }}
        />

        {/* subtle vertical grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
          }}
        />


        {/* =====================================================
            FLOATING 3D GIFT / PRODUCT OBJECTS
        ====================================================== */}

        {/* cube */}

        <div
          className="absolute left-[4%] top-[18%] hidden h-20 w-20 rotate-[-12deg] items-center justify-center rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.035] text-emerald-300/[0.12] shadow-[0_20px_60px_rgba(16,185,129,.08)] md:flex"
          style={{
            transform: 'perspective(500px) rotateX(18deg) rotateY(-22deg) rotateZ(-12deg)',
          }}
        >
          <i className="fa-solid fa-cube text-4xl" />
        </div>


        {/* gift */}

        <div
          className="absolute right-[6%] top-[14%] hidden h-24 w-24 items-center justify-center rounded-[28px] border border-white/[0.06] bg-white/[0.025] text-white/[0.08] md:flex"
          style={{
            transform: 'perspective(500px) rotateX(14deg) rotateY(20deg) rotateZ(8deg)',
          }}
        >
          <i className="fa-solid fa-gift text-5xl" />
        </div>


        {/* miniature */}

        <div
          className="absolute right-[20%] bottom-[12%] hidden h-16 w-16 items-center justify-center rounded-xl border border-emerald-300/[0.07] bg-emerald-300/[0.025] text-emerald-300/[0.08] lg:flex"
          style={{
            transform: 'perspective(400px) rotateX(25deg) rotateY(-25deg)',
          }}
        >
          <i className="fa-solid fa-cubes text-3xl" />
        </div>


        {/* star / custom object */}

        <div
          className="absolute left-[23%] bottom-[16%] hidden h-14 w-14 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.02] text-white/[0.07] lg:flex"
          style={{
            transform: 'perspective(400px) rotateX(20deg) rotateY(20deg)',
          }}
        >
          <i className="fa-solid fa-wand-magic-sparkles text-xl" />
        </div>


        {/* floating dots */}

        <div className="absolute left-[14%] top-[12%] h-1.5 w-1.5 rounded-full bg-emerald-400/40" />
        <div className="absolute left-[31%] top-[28%] h-1 w-1 rounded-full bg-emerald-300/30" />
        <div className="absolute right-[28%] top-[35%] h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
        <div className="absolute right-[12%] bottom-[30%] h-1 w-1 rounded-full bg-emerald-300/30" />

      </div>


      {/* =========================================================
          TOP GREEN EDGE
      ========================================================== */}

      <div className="relative h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />


      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-14">


        {/* =====================================================
            BRAND + NEWSLETTER CTA
        ====================================================== */}

        <div className="relative mb-10 overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_25px_80px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-8 lg:p-10">

          {/* inner glow */}

          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-emerald-500/[0.07] blur-[80px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* brand */}

            <div className="max-w-lg">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">

                  <i className="fa-solid fa-cube text-lg" />

                </span>

                <span className="text-2xl font-black tracking-tight text-white">
                  Pocket<span className="text-emerald-400">Form</span>
                </span>

              </Link>


              <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
                Pocket-size 3D prints for gifts, keepsakes, and
                nano-banana scale minis — designed and shipped with care.
              </p>


              {/* mini feature chips */}

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-gray-400">
                  <i className="fa-solid fa-cube text-emerald-500" />
                  3D Printed
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-gray-400">
                  <i className="fa-solid fa-gift text-emerald-500" />
                  Gift Ready
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-gray-400">
                  <i className="fa-solid fa-truck-fast text-emerald-500" />
                  Ships in 3–5 days
                </span>

              </div>

            </div>


            {/* newsletter */}

            <div className="w-full lg:max-w-[430px]">

              <div className="mb-3 flex items-center gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <i className="fa-solid fa-bell text-xs" />
                </span>

                <h3 className="text-sm font-bold text-white">
                  Get print drops
                </h3>

              </div>

              <p className="mb-4 text-xs leading-5 text-gray-500">
                New minis, gift collections and studio restocks,
                straight to your inbox.
              </p>


              {subscribed ? (

                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <i className="fa-solid fa-check text-xs" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      You&apos;re on the list.
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                      We&apos;ll keep the good stuff coming.
                    </p>
                  </div>

                </div>

              ) : (

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2 sm:flex-row"
                >

                  <div className="relative flex-1">

                    <i className="fa-regular fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                    />

                  </div>

                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500"
                  >

                    Subscribe

                    <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />

                  </button>

                </form>

              )}

            </div>

          </div>

        </div>


        {/* =====================================================
            LINK AREA
        ====================================================== */}

        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.07] pb-10 sm:grid-cols-2 md:grid-cols-3">


          {/* =================================================
              BRAND NOTE
          ================================================== */}

          <div>

            <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">

              <span className="h-px w-5 bg-emerald-500" />

              Made to Keep

            </h3>

            <p className="max-w-xs text-sm leading-6 text-gray-500">
              Small prints, lasting memories, and a little more joy in every detail.
            </p>

          </div>


          {/* =================================================
              JUMP TO
          ================================================== */}

          <div>

            <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">

              <span className="h-px w-5 bg-emerald-500" />

              Explore

            </h3>

            <nav className="flex flex-col gap-2.5">

              {userToken ? (

                <>

                  <Link
                    to="/"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-house fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Home
                  </Link>

                  <Link
                    to="/wishlist"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-heart fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Wishlist
                  </Link>

                  <Link
                    to="/cart"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-cart-shopping fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Cart
                  </Link>

                  <Link
                    to="/brands"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-tags fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Brands
                  </Link>

                </>

              ) : (

                <>

                  <Link
                    to="login"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-sign-in-alt fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Login
                  </Link>

                  <Link
                    to="register"
                    className="group flex w-fit items-center gap-3 text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    <i className="fa-solid fa-user-plus fa-fw text-[11px] text-gray-700 transition-colors group-hover:text-emerald-500" />
                    Register
                  </Link>

                </>

              )}

            </nav>

          </div>


          {/* =================================================
              CONTACT
          ================================================== */}

          <div>

            <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">

              <span className="h-px w-5 bg-emerald-500" />

              Contact

            </h3>


            <p className="mb-4 text-sm text-gray-500">
              hello@pocketform.com
            </p>


            {/* social buttons */}

            <div className="mt-5 flex items-center gap-2">

              <span
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <i className="fa-brands fa-linkedin fa-fw text-sm" />
              </span>

              <span
                aria-label="GitHub"
                title="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <i className="fa-brands fa-github fa-fw text-sm" />
              </span>

              <span
                aria-label="Email"
                title="Email"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <i className="fa-regular fa-envelope fa-fw text-sm" />
              </span>

              <span
                aria-label="LeetCode"
                title="LeetCode"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
                  />
                </svg>

              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM BRAND STRIP
        ====================================================== */}

        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <i className="fa-solid fa-cube text-xs" />
            </div>

            <div>

              <p className="text-xs font-semibold text-gray-400">
                Made for tiny things.
              </p>

              <p className="text-[10px] text-gray-600">
                Built with precision at every layer.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-4 text-[10px] text-gray-600">

            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Printing live
            </span>

            <span className="h-3 w-px bg-white/[0.08]" />

            <span>
              © {new Date().getFullYear()} PocketForm
            </span>

          </div>

        </div>

      </div>


      {/* =========================================================
          BACK TO TOP
      ========================================================== */}

      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group absolute right-5 top-5 hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0b1814] text-emerald-400 shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:text-white sm:flex"
      >

        <i className="fa-solid fa-arrow-up text-xs transition-transform duration-300 group-hover:-translate-y-0.5" />

      </button>

    </footer>
  );
}