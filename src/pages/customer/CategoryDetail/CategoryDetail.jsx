import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../../../lib/api';

export default function CategoryDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => apiClient.get(`/categories/${encodeURIComponent(id)}`).then(({ data: response }) => response.data),
  });

  if (isLoading) return <main className="container mx-auto px-4 py-24 text-center text-gray-500">Loading collection...</main>;
  if (isError || !data) return <main className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-bold">Category not found</h1><Link className="mt-4 inline-block text-green-700" to="/categories">Back to categories</Link></main>;

  return <main className="container mx-auto px-4 pb-16 pt-20"><Link className="text-sm font-semibold text-green-700" to="/categories">← All categories</Link><section className="mt-6 grid gap-8 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-[280px_1fr] md:p-10"><img className="h-56 w-full rounded-xl object-cover" src={data.image} alt={data.name} /><div className="py-2"><p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">Print collection</p><h1 className="mt-2 text-4xl font-bold text-gray-900">{data.name}</h1><p className="mt-4 text-gray-600">{data.description}</p></div></section><section className="mt-12"><h2 className="text-2xl font-bold text-gray-900">{data.products.length ? 'Products in this collection' : 'Coming soon'}</h2>{data.products.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{data.products.map((product) => <article className="overflow-hidden rounded-xl bg-white shadow-sm" key={product._id}><Link to={`/product/${product._id}`}><img className="h-52 w-full object-contain bg-gray-50 p-4" src={product.imageCover} alt={product.title} /></Link><div className="p-4"><h3 className="font-semibold text-gray-900">{product.title}</h3><p className="mt-2 font-bold text-green-700">₹{Number(product.price).toLocaleString('en-IN')}</p></div></article>)}</div> : <p className="mt-3 text-gray-500">New prints will appear here as products are added to this category.</p>}</section></main>;
}