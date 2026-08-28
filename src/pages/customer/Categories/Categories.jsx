// import { useEffect } from 'react';
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
import apiClient from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [visible, setVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  async function getCategories() {
    return apiClient
      .get('/categories')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  useEffect(() => {
    if (data) {
      const timer = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(timer);
    }
  }, [data]);

  return (
    <>
      <style>{`
        @keyframes pf-fade-up {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pf-line {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes pf-grid {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pf-shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }

        .pf-category-card {
          opacity: 0;
          animation: pf-fade-up 0.7s cubic-bezier(.22,1,.36,1) forwards;
        }

        .pf-heading-line {
          transform: scaleX(0);
          animation: pf-line 0.8s cubic-bezier(.22,1,.36,1) .2s forwards;
        }

        .pf-grid-pattern {
          background-image:
            linear-gradient(rgba(16, 185, 129, .055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, .055) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .pf-skeleton {
          background: linear-gradient(
            90deg,
            #e5e7eb 0px,
            #f5f5f5 80px,
            #e5e7eb 160px
          );
          background-size: 600px 100%;
          animation: pf-shimmer 1.4s infinite linear;
        }

        @media (prefers-reduced-motion: reduce) {
          .pf-category-card,
          .pf-heading-line,
          .pf-skeleton {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-transparent">

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-20">

          {/* ================= HEADER ================= */}
          <section className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">

            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-700">
                Print Collections
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Find something
              <span className="block text-emerald-700">
                worth printing.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-7 text-slate-500">
              From tiny nano-banana minis and collectible figures
              to thoughtful gifts, desk essentials and completely
              custom creations.
            </p>

            <div className="flex justify-center mt-6">
              <div className="h-1 w-16 rounded-full bg-emerald-700 pf-heading-line" />
            </div>

          </section>


          {/* ================= GRID ================= */}
          <section>

            {isLoading || !data ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
                    <div className="pf-skeleton h-[360px] w-full" />

                    <div className="p-5">
                      <div className="pf-skeleton h-5 w-2/3 rounded mb-3" />
                      <div className="pf-skeleton h-3 w-full rounded" />
                    </div>
                  </div>
                ))}

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

                {data.map((category, i) => (

                  <div
                    key={category._id}
                    className="pf-category-card"
                    style={{
                      animationDelay: visible
                        ? `${i * 90}ms`
                        : '0ms',
                    }}
                  >

                    {(() => {
                      const image = category.image?.replace(/[?&]text=.*$/, '');
                      const hasImage = image && !image.includes('placehold.co');
                      return (

                    <Link
                      to={`/categories/${category._id}`}
                      className="
                        group
                        relative
                        block
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        border
                        border-slate-200/80
                        shadow-[0_5px_25px_rgba(15,23,42,0.06)]
                        hover:shadow-[0_18px_45px_rgba(15,23,42,0.13)]
                        hover:-translate-y-1
                        transition-all
                        duration-500
                      "
                    >

                      {/* IMAGE */}
                      <div className="relative h-[330px] overflow-hidden bg-emerald-50">

                        {hasImage ? (

                          <img
                            src={image}
                            alt={category.name}
                            loading="lazy"
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-700
                              ease-out
                              group-hover:scale-110
                            "
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />

                        ) : (

                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
                            <i className="fa-solid fa-cube text-6xl text-emerald-700/20" />
                          </div>

                        )}

                        {/* IMAGE TINT */}
                        <div className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/85
                          via-black/15
                          to-transparent
                          opacity-90
                        " />

                        {/* TOP NUMBER */}
                        <div className="
                          absolute
                          top-4
                          left-4
                          flex
                          items-center
                          justify-center
                          w-9
                          h-9
                          rounded-full
                          bg-white/90
                          backdrop-blur-sm
                          text-xs
                          font-black
                          text-slate-900
                          shadow-sm
                        ">
                          {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* HOVER ARROW */}
                        <div className="
                          absolute
                          top-4
                          right-4
                          flex
                          items-center
                          justify-center
                          w-10
                          h-10
                          rounded-full
                          bg-white
                          text-slate-900
                          opacity-0
                          translate-x-3
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          transition-all
                          duration-300
                          shadow-lg
                        ">
                          <i className="fa-solid fa-arrow-up-right text-xs" />
                        </div>


                        {/* CATEGORY TEXT */}
                        <div className="
                          absolute
                          left-5
                          right-5
                          bottom-5
                        ">

                          <span className="
                            block
                            mb-2
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-emerald-300
                          ">
                            {category.slug}
                          </span>

                          <h2 className="
                            text-xl
                            sm:text-2xl
                            font-black
                            leading-tight
                            break-words
                            line-clamp-2
                            text-white
                            drop-shadow-lg
                          ">
                            {category.name}
                          </h2>

                        </div>

                      </div>


                      {/* CARD FOOTER */}
                      <div className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-4
                        bg-white
                      ">

                        <span className="
                          text-xs
                          font-semibold
                          text-slate-500
                          group-hover:text-emerald-700
                          transition-colors
                          duration-300
                        ">
                          Explore collection
                        </span>

                        <span className="
                          flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          rounded-full
                          bg-slate-100
                          text-slate-500
                          group-hover:bg-emerald-700
                          group-hover:text-white
                          transition-all
                          duration-300
                        ">
                          <i className="
                            fa-solid
                            fa-arrow-right
                            text-[10px]
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          " />
                        </span>

                      </div>

                    </Link>
                      );
                    })()}

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* ================= BOTTOM CTA ================= */}
          <section className="mt-14 sm:mt-16">

            <div className="
              relative
              overflow-hidden
              rounded-3xl
              bg-slate-950
              px-6
              py-10
              sm:px-10
              sm:py-12
              text-center
            ">

              {/* Decorative grid */}
              <div className="
                absolute
                inset-0
                opacity-10
                pf-grid-pattern
              " />

              <div className="
                absolute
                -top-24
                -right-24
                w-64
                h-64
                rounded-full
                bg-emerald-500/20
                blur-3xl
              " />

              <div className="relative">

                <div className="
                  mx-auto
                  mb-4
                  flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  rounded-2xl
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                ">
                  <i className="fa-solid fa-wand-magic-sparkles text-emerald-400" />
                </div>

                <h2 className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-white
                ">
                  Have something else in mind?
                </h2>

                <p className="
                  mt-2
                  max-w-xl
                  mx-auto
                  text-sm
                  sm:text-base
                  text-slate-400
                ">
                  Turn your idea into a physical object.
                  Send us your design and we'll handle the print.
                </p>

                <Link
                  to="/custom-order"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-6
                    px-5
                    py-3
                    rounded-full
                    bg-emerald-600
                    hover:bg-emerald-500
                    text-white
                    text-sm
                    font-bold
                    shadow-lg
                    shadow-emerald-900/30
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                  "
                >
                  Start a custom order
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>

              </div>

            </div>

          </section>

        </div>
      </main>
    </>
  );
}