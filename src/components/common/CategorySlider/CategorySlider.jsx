// import { useQuery } from '@tanstack/react-query';
// import apiClient from '../../../lib/api';
// import Spinner from '../Spinner/Spinner';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';

// export default function CategorySlider() {
//   const { data } = useQuery({
//     queryKey: ['category'],
//     queryFn: getCategories,
//     select: (data) => data.data.data,
//   });

//   function getCategories() {
//     return apiClient.get('/categories');
//   }

//   return (
//     <div className="mx-auto my-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//       <h3 className="mb-6 text-3xl font-medium">Popular Categories</h3>
//       {data ? (
//         <div className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
//           <div className="grid auto-cols-[minmax(210px,1fr)] grid-flow-col gap-5 lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-4">
//             {data.map((category, index) => {
//               const name = category.name || 'Category';
//               const image = category.image?.replace(/[?&]text=.*$/, '');
//               const hasImage = image && !image.includes('placehold.co');

//               return (
//                 <motion.div
//                   key={category._id || name}
//                   className="group block min-w-0 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100"
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, amount: 0.2 }}
//                   transition={{ duration: 0.5, delay: index * 0.07 }}
//                 >
//                   <Link to={`/shop?category=${category._id}#products`}>
//                     <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
//                       {hasImage ? <img width="500" height="300" loading="lazy" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" src={image} alt={name} /> : <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100"><i className="fa-solid fa-cube absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-emerald-700/15" /></div>}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-emerald-900/10" />
//                       <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">{category.slug}</p><h3 className="mt-1 line-clamp-2 break-words text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg">{name}</h3></div>
//                     </div>
//                   </Link>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//         <Spinner />
//       )}
//     </div>
//   );
// }


import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import Spinner from '../Spinner/Spinner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ResolvedImage from '../ResolvedImage';

export default function CategorySlider() {
  const { data, isLoading } = useQuery({
    queryKey: ['category'],
    queryFn: getCategories,
    select: (data) => data.data.data,
  });

  function getCategories() {
    return apiClient.get('/categories');
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute right-[-120px] bottom-0 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-7 bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Explore Collection
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover unique 3D printed creations made for your space,
              collection, and special moments.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600 sm:flex"
          >
            View all
            <i className="fa-solid fa-arrow-right text-xs" />
          </Link>

        </div>

        {/* Categories */}
        <div className="-mx-4 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          <div className="grid auto-cols-[285px] grid-flow-col gap-5 sm:auto-cols-[310px] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-4">

            {data?.map((category, index) => {

              const name = category.name || 'Category';

              const image = category.image?.replace(
                /[?&]text=.*$/,
                ''
              );

              const hasImage =
                image && !image.includes('placehold.co');

              const number = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={category._id || name}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >

                  <Link
                    to={`/shop?category=${category._id}#products`}
                    className="group relative block overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_15px_40px_rgba(15,23,42,0.10)]"
                  >

                    {/* Image */}
                    <div className="relative aspect-[0.82] overflow-hidden">

                      {hasImage ? (
                        <ResolvedImage
                          src={image}
                          alt={name}
                          width="600"
                          height="730"
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                          <i className="fa-solid fa-cube text-7xl text-emerald-500/20" />
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-emerald-500/0 transition duration-500 group-hover:bg-emerald-500/10" />

                      {/* Number */}
                      <div className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 px-3 text-xs font-bold text-white backdrop-blur-md">
                        {number}
                      </div>

                      {/* Arrow */}
                      {/* <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <i className="fa-solid fa-arrow-up-right text-xs" />
                      </div> */}

                      {/* Bottom content */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">

                        {/* <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                          {category.slug || 'Collection'}
                        </p> */}

                        <div className="flex items-end justify-between gap-3">

                          <h3 className="max-w-[85%] text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                            {name}
                          </h3>

                          <span className="translate-x-2 text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white">
                            →
                          </span>

                        </div>

                        <div className="mt-4 h-[2px] w-8 bg-emerald-400 transition-all duration-500 group-hover:w-16" />

                      </div>

                    </div>

                  </Link>

                </motion.div>
              );
            })}

          </div>
        </div>

        {/* Mobile view all */}
        <Link
          to={'/shop'}
          className={'mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm sm:hidden'}
        >
          View all categories
          <i className="fa-solid fa-arrow-right text-xs" />
        </Link>

      </div>
    </section>
  );
}
