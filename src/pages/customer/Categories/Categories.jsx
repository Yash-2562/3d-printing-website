// import { useEffect } from 'react';
// import axios from 'axios';
// import Spinner from '../../../components/common/Spinner/Spinner';
// import { useQuery } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';

// export default function Categories() {
//   // Queries
//   const { data } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   });

//   async function getCategories() {
//     return axios
//       .get('https://ecommerce.routemisr.com/api/v1/categories')
//       .then((response) => response.data.data)
//       .catch((error) => {
//         throw error;
//       });
//   }

//   async function main() {
//     await getCategories();
//   }

//   useEffect(() => {
//     main();
//   }, []);

//   return (
//     <>
//       <div className="container flex flex-wrap items-center">
//         <h3 className="text-3xl font-medium mb-5 w-full">Our Categories</h3>
//         {data ? (
//           data.map((category) => (
//             <div
//               className="w-full lg:md:w-1/4 md:w-1/3 sm:w-1/2 p-3"
//               key={category._id}
//             >
//               <div className="relative bg-white mx-auto hover:shadow-green-300 transition-shadow shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
//                 <img
//                   className="rounded-t-lg sm:object-cover object-contain object-top w-full h-80"
//                   src={category.image}
//                   alt={category.title}
//                 />
//                 <div className="px-5 py-2">
//                   <h3 className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-xl tracking-tight dark:text-white">
//                     {category.name}
//                   </h3>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="w-full">
//             <Spinner />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

/**
 * PocketForm Categories page
 * ---------------------------
 * Same data source / query shape as before. Redesign focuses on:
 *  - A "build plate" style header instead of a plain <h3>.
 *  - Skeleton loading cards (pulse) instead of a spinner — feels less like
 *    a blocking wait and more like tiles printing in.
 *  - Staggered entrance animation: cards fade + rise in one after another,
 *    like layers finishing on a print bed.
 *  - Hover: image scales slightly, a dark gradient rises from the bottom,
 *    and an "Explore" pill + arrow slides into view — no layout shift.
 *  - A thin animated "layer line" accent under the heading.
 * No new dependencies — pure CSS keyframes + Tailwind utility classes.
 */

export default function Categories() {
  const [visible, setVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  async function getCategories() {
    return axios
      .get('https://ecommerce.routemisr.com/api/v1/categories')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  useEffect(() => {
    // trigger stagger once data is ready
    if (data) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
  }, [data]);

  return (
    <>
      <style>{`
        @keyframes pf-rise {
          from { opacity: 0; transform: translateY(22px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pf-line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pf-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .pf-card-enter {
          opacity: 0;
          animation: pf-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .pf-heading-line {
          animation: pf-line-grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
          transform: scaleX(0);
        }
        .pf-skeleton {
          background: linear-gradient(90deg, #e5e7eb 0px, #f3f4f6 40px, #e5e7eb 80px);
          background-size: 600px 100%;
          animation: pf-shimmer 1.4s infinite linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-card-enter, .pf-heading-line, .pf-skeleton {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <div className="mb-8 max-w-2xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-green-700 mb-2">
            <i className="fa-solid fa-layer-group" />
            Print Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Browse categories
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            From nano-banana scale keepsakes to custom desk minis — pick a
            collection to see what's printable.
          </p>
          <div className="h-0.5 w-24 bg-green-700 rounded-full mt-4 pf-heading-line" />
        </div>

        {/* Grid */}
        <div className="flex flex-wrap items-stretch -m-3">
          {isLoading || !data
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-3"
                  key={i}
                >
                  <div className="rounded-lg overflow-hidden shadow-md bg-white">
                    <div className="pf-skeleton h-80 w-full" />
                    <div className="px-5 py-4">
                      <div className="pf-skeleton h-4 w-2/3 rounded" />
                    </div>
                  </div>
                </div>
              ))
            : data.map((category, i) => (
                <div
                  className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-3 pf-card-enter"
                  key={category._id}
                  style={{ animationDelay: visible ? `${(i % 8) * 70}ms` : '0ms' }}
                >
                  <Link
                    to={`/categories/${category._id}`}
                    className="group relative block bg-white mx-auto rounded-lg max-w-sm overflow-hidden shadow-md hover:shadow-xl hover:shadow-green-900/10 transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="relative overflow-hidden h-80">
                      <img
                        className="sm:object-cover object-contain object-top w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
                        src={category.image}
                        alt={category.title}
                        loading="lazy"
                      />

                      {/* gradient overlay + CTA that rises on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 pb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-green-700/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                          Explore
                          <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>

                      {/* corner accent */}
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_0_4px_rgba(21,128,61,0.25)]" />
                    </div>

                    <div className="px-5 py-3">
                      <h3 className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-lg tracking-tight dark:text-white group-hover:text-green-700 transition-colors duration-200">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}