import apiClient from '../../../lib/api';
import Spinner from '../../../components/common/Spinner/Spinner';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Brands() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  function getBrands() {
    return apiClient.get('/brands').then((response) => response.data.data);
  }

  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-lime-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-emerald-900/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-8 bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                The makers behind the magic
              </span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Meet our brands
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore the creative studios and trusted names bringing every
              piece in our collection to life.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <div className="border-l-2 border-emerald-400 pl-4">
              <p className="text-2xl font-bold text-slate-900">{data.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Curated brands
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-600 sm:flex"
            >
              Shop all products
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((brand, index) => {
              const name = brand.name || 'Featured brand';

              return (
                <motion.article
                  key={brand._id || name}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/90 p-3 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/10"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <div className="relative flex aspect-[1.35] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-white to-lime-50">
                    {brand.image ? (
                      <img
                        className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-110"
                        src={brand.image}
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <i className="fa-solid fa-cubes text-5xl text-emerald-700/20" />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 backdrop-blur-sm">
                      Brand {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
                    <h2 className="truncate text-lg font-bold text-slate-900">{name}</h2>
                    <i className="fa-solid fa-arrow-up-right-from-square shrink-0 text-xs text-emerald-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <Link
          to="/shop"
          className="mt-8 flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-emerald-600 sm:hidden"
        >
          Shop all products
          <i className="fa-solid fa-arrow-right text-xs" />
        </Link>
      </div>
    </section>
  );
}
