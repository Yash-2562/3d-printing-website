import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import Spinner from '../Spinner/Spinner';
import { motion } from 'framer-motion';

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

              return (
                <motion.a
                  key={category._id || name}
                  href="#"
                  className="group block min-w-0 overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-emerald-50 p-4">
                    <img
                      width="500"
                      height="300"
                      loading="lazy"
                      className="h-full w-full rounded-md object-contain transition duration-300 group-hover:scale-105"
                      src={category.image}
                      alt={name}
                    />
                  </div>
                  <h3 className="px-4 py-4 text-center text-lg font-semibold tracking-normal text-gray-900">
                    {name}
                  </h3>
                </motion.a>
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
