import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import Spinner from '../Spinner/Spinner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CategorySlider() {
  const { data } = useQuery({
    queryKey: ['category'],
    queryFn: getCategories,
    select: (data) => data.data.data,
  });

  function getCategories() {
    return apiClient.get('/categories');
  }

  return (
    <div className="mx-auto my-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h3 className="mb-6 text-3xl font-medium">Popular Categories</h3>
      {data ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="grid auto-cols-[minmax(210px,1fr)] grid-flow-col gap-5 lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-4">
            {data.map((category, index) => {
              const name = category.name || 'Category';
              const image = category.image?.replace(/[?&]text=.*$/, '');
              const hasImage = image && !image.includes('placehold.co');

              return (
                <motion.div
                  key={category._id || name}
                  className="group block min-w-0 overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                  <Link to={`/categories/${category._id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                      {hasImage ? <img width="500" height="300" loading="lazy" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90" src={image} alt={name} /> : <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100"><i className="fa-solid fa-cube absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-emerald-700/15" /></div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-white/10" />
                      <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">{category.slug}</p><h3 className="mt-1 line-clamp-2 break-words text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg">{name}</h3></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
