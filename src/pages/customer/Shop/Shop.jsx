import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { productsContext } from '../../../context/Products/Products';
import { wishlistContext } from '../../../context/Wishlist/Wishlist';
import ResolvedImage from '../../../components/common/ResolvedImage';
import pnhtImage from '../../../assets/de1.png';

const categoryIcons = ['fa-cube', 'fa-gift', 'fa-star', 'fa-house', 'fa-print'];

const demoImageUrls = {
  astronaut: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=900&q=85',
  couple: 'https://images.unsplash.com/photo-1582561833407-b95380302e9c?auto=format&fit=crop&w=900&q=85',
  dragon: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=85',
  coffee: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=85',
  hero: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85',
  frame: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85',
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const getCategoryName = (category) =>
  typeof category === 'string' ? category : category?.name || '';

const getCategoryId = (category) =>
  typeof category === 'string' ? '' : category?._id || '';

const demoProducts = [
  {
    id: 1,
    title: 'Pocket Astronaut',
    price: 499,
    oldPrice: 699,
    rating: 4.9,
    reviews: 124,
    category: 'figures',
    image: demoImageUrls.astronaut,
    tag: 'Bestseller',
  },
  {
    id: 2,
    title: 'Mini Couple Keepsake',
    price: 799,
    oldPrice: 999,
    rating: 4.8,
    reviews: 87,
    category: 'gifts',
    image: demoImageUrls.couple,
    tag: 'Popular',
  },
  {
    id: 3,
    title: 'Nano Dragon',
    price: 599,
    oldPrice: null,
    rating: 4.9,
    reviews: 63,
    category: 'collectibles',
    image: demoImageUrls.dragon,
    tag: 'New',
  },
  {
    id: 4,
    title: 'Tiny Coffee Companion',
    price: 399,
    oldPrice: 499,
    rating: 4.7,
    reviews: 51,
    category: 'desk',
    image: demoImageUrls.coffee,
    tag: 'Desk Pick',
  },
  {
    id: 5,
    title: 'Mini Hero Figure',
    price: 549,
    oldPrice: 699,
    rating: 4.8,
    reviews: 72,
    category: 'figures',
    image: demoImageUrls.hero,
    tag: 'Trending',
  },
  {
    id: 6,
    title: 'Memory Frame Mini',
    price: 899,
    oldPrice: null,
    rating: 5,
    reviews: 42,
    category: 'gifts',
    image: demoImageUrls.frame,
    tag: 'Gift Pick',
  },
];

export default function Shop() {
  const { data = [] } = useContext(productsContext);
  const { getWishlist, addToWishlist, deleteWishlistItem } = useContext(wishlistContext);
  const { data: catalogCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/categories').then(({ data: response }) => response.data),
  });
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const categories = useMemo(() => [
    { id: 'all', label: 'All Categories', icon: 'fa-cubes' },
    ...catalogCategories.map((category, index) => ({
      ...category,
      id: category._id,
      label: category.name,
      icon: categoryIcons[index % categoryIcons.length],
    })),
  ], [catalogCategories]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const getProductId = (product) => product._id || product.id;

  useEffect(() => {
    let isMounted = true;

    getWishlist().then((items) => {
      if (isMounted) {
        setWishlist(items.map((item) => getProductId(item)));
      }
    }).catch(() => {
      if (isMounted) setWishlist([]);
    });

    return () => {
      isMounted = false;
    };
  }, [getWishlist]);

  useEffect(() => {
    if (requestedCategory && categories.some((category) => category.id === requestedCategory)) {
      setActiveCategory(requestedCategory);
    }
  }, [categories, requestedCategory]);

  /*
   * If your API already returns products, use them.
   * Otherwise the demo products keep the page visually complete.
   */
  const products = data?.length ? data : demoProducts;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      const selectedCategory = categories.find((category) => category.id === activeCategory);
      result = result.filter(
        (product) =>
          getCategoryId(product.category) === activeCategory ||
          getCategoryName(product.category).toLowerCase() === selectedCategory?.name?.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter((product) =>
        product.title?.toLowerCase().includes(query)
      );
    }

    if (sort === 'price-low') {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sort === 'price-high') {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sort === 'rating') {
      result.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return result;
  }, [products, categories, activeCategory, search, sort]);

  const toggleWishlist = async (product) => {
    const id = getProductId(product);
    if (!id) return;

    if (wishlist.includes(id)) {
      const result = await deleteWishlistItem(id);
      if (result === null) return;
      setWishlist((current) => current.filter((item) => item !== id));
      return;
    }

    const result = await addToWishlist(id);
    if (result === null) return;
    setWishlist((current) => [...current, id]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-emerald-200/20 blur-[120px]" />

        <div className="absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-green-200/20 blur-[130px]" />

        <div
          className="absolute left-1/2 top-[620px] h-[500px] w-[1200px] -translate-x-1/2 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
            `,
            backgroundSize: '55px 55px',
            transform:
              'translateX(-50%) perspective(600px) rotateX(65deg)',
          }}
        />

      </div>


      {/* =====================================================
          SHOP HERO
      ====================================================== */}

      <section className="relative">

        <div className="mx-auto max-w-screen-xl px-4 pb-10 pt-5 sm:px-6 sm:pt-8 lg:pb-14">

          <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">

            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <div className="mb-5 flex items-center gap-3">

                <span className="h-px w-8 bg-emerald-600" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  THE POCKETFORM SHOP
                </span>

              </div>

              <h1 className="max-w-2xl text-4xl font-black tracking-[-0.045em] text-slate-900 sm:text-5xl md:text-6xl">

                Tiny things.
                <br />

                <span className="text-emerald-600">
                  Big personality.
                </span>

              </h1>

              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                Discover pocket-size 3D prints made for desks, gifts,
                collections and the little moments worth keeping.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <button
                  onClick={() => {
                    document
                      .getElementById('products')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-1 hover:bg-emerald-600"
                >

                  Explore minis

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <i className="fa-solid fa-arrow-down text-[9px]" />
                  </span>

                </button>

                <Link
                  to="/custom-order"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-xs" />
                  Make yours
                </Link>

              </div>

              {/* mini stats */}

              <div className="mt-8 flex items-center gap-6">

                <div>
                  <p className="text-lg font-black text-slate-900">
                    12.4K+
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    Prints shipped
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div>
                  <p className="text-lg font-black text-slate-900">
                    4.9
                    <i className="fa-solid fa-star ml-1 text-[10px] text-emerald-500" />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    Average rating
                  </p>
                </div>

              </div>

            </motion.div>


            {/* RIGHT VISUAL */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateY: -8 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative hidden h-[390px] md:block"
            >

              {/* large background 3D text */}

              <div className="absolute right-0 top-0 select-none text-[170px] font-black leading-none tracking-[-0.1em] text-slate-900/[0.035]">
                MINI
              </div>


              {/* central stage */}

              <div
                className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10"
                style={{
                  boxShadow:
                    '0 0 100px rgba(16,185,129,.08)',
                }}
              />

              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/10" />


              {/* featured product image */}

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [-3, 2, -3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute left-1/2 top-1/2 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[45px] border border-white/80 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 shadow-[0_35px_70px_rgba(15,23,42,.15)]"
                style={{
                  transform:
                    'translate(-50%, -50%) perspective(700px) rotateX(8deg) rotateY(-12deg)',
                }}
              >

                <img
                  src={pnhtImage}
                  alt="3D printer creating colorful miniature models"
                  className="h-full w-full rounded-[45px] object-cover"
                />

              </motion.div>


              {/* floating category cards */}

              <div className="absolute left-[5%] top-[28%] rotate-[-6deg] rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <i className="fa-solid fa-gift" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-900">
                      Gift minis
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Made to keep
                    </p>
                  </div>

                </div>

              </div>


              <div className="absolute bottom-[18%] right-[3%] rotate-[5deg] rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <i className="fa-solid fa-print" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-900">
                      Made to order
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Printed fresh
                    </p>
                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT AREA
      ====================================================== */}

      <section
        id="products"
        className="relative border-t border-slate-200/60"
      >

        <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-12">


          {/* =================================================
              CATEGORY BAR
          ================================================== */}

          <div className="mb-8">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Browse collection
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  Find your next mini
                </h2>

              </div>

              <p className="hidden text-xs text-slate-400 sm:block">
                {filteredProducts.length} products
              </p>

            </div>


            {/* categories */}

            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">

              {categories.map((category) => (

                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${
                    activeCategory === category.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/15'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >

                  <i className={`fa-solid ${category.icon} text-[10px]`} />

                  {category.label}

                </button>

              ))}

            </div>

          </div>


          {/* =================================================
              SEARCH + SORT
          ================================================== */}

          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">

            <div className="relative flex-1">

              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search miniatures, gifts, collectibles..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />

            </div>


            <div className="flex items-center gap-2">

              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
                Sort
              </span>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-400"
              >

                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* =================================================
              PRODUCT GRID
          ================================================== */}

          {filteredProducts.length > 0 ? (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

              {filteredProducts.map((product, index) => (

                <motion.article
                  key={product.id || index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: '-50px',
                  }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  whileHover={{
                    y: -7,
                  }}
                  className="group relative"
                >

                  <div className="relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/80 shadow-sm transition-all duration-300 group-hover:border-emerald-200 group-hover:shadow-[0_25px_55px_rgba(15,23,42,.10)]">


                    {/* IMAGE */}

                    <div className="relative aspect-square overflow-hidden bg-slate-100">

                      <ResolvedImage
                        src={
                          product.image ||
                            product.imageCover ||
                            product.image_url ||
                            product.thumbnail
                        }
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />


                      {/* image overlay */}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


                      {/* product tag */}

                      {(product.tag || product.isNew) && (

                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold text-emerald-700 shadow-sm backdrop-blur">
                          {product.tag || 'New'}
                        </span>

                      )}


                      {/* wishlist */}

                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all ${
                          wishlist.includes(getProductId(product))
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                            : 'border-white/80 bg-white/85 text-slate-500 hover:bg-white hover:text-emerald-600'
                        }`}
                      >

                        <i
                          className={`${
                              wishlist.includes(getProductId(product))
                              ? 'fa-solid'
                              : 'fa-regular'
                          } fa-heart text-xs`}
                        />

                      </button>


                      {/* hover quick action */}

                      <Link
                        to={`/product/${product.id}`}
                        className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-slate-900/90 py-2.5 text-center text-[10px] font-bold text-white opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-emerald-600"
                      >
                        View details
                      </Link>

                    </div>


                    {/* CONTENT */}

                    <div className="p-4">

                      <div className="mb-2 flex items-center gap-1">

                        <i className="fa-solid fa-star text-[9px] text-emerald-500" />

                        <span className="text-[10px] font-bold text-slate-700">
                          {product.rating || '4.9'}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          ({product.reviews || '24'})
                        </span>

                      </div>


                      <h3 className="line-clamp-2 min-h-[36px] text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-emerald-700">
                        {product.title}
                      </h3>


                      <div className="mt-3 flex items-end justify-between gap-2">

                        <div>

                          <p className="text-lg font-black tracking-tight text-slate-900">
                            ₹{product.price}
                          </p>

                          {product.oldPrice && (

                            <p className="text-[10px] text-slate-400 line-through">
                              ₹{product.oldPrice}
                            </p>

                          )}

                        </div>


                        <div className="flex items-center gap-1 text-[9px] text-slate-400">

                          <i className="fa-solid fa-print text-emerald-500" />

                          Made to order

                        </div>

                      </div>

                    </div>

                  </div>

                </motion.article>

              ))}

            </div>

          ) : (

            /* EMPTY STATE */

            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white/50 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <i className="fa-solid fa-cube text-2xl" />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                No minis found
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                Try another search or explore one of the categories above.
              </p>

              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600"
              >
                Show all minis
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          BOTTOM CUSTOM ORDER CTA
      ====================================================== */}

      <section className="relative mx-auto max-w-screen-xl px-4 pb-14 pt-2 sm:px-6">

        <div className="relative overflow-hidden rounded-[30px] bg-slate-900 px-6 py-10 shadow-[0_30px_70px_rgba(15,23,42,.15)] sm:px-10 lg:px-14">

          {/* background glow */}

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-[90px]" />

          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-[80px]" />


          {/* 3D grid */}

          <div
            className="absolute bottom-[-120px] right-[-50px] h-64 w-[700px] opacity-[0.12]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(52,211,153,.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52,211,153,.7) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform:
                'perspective(400px) rotateX(55deg)',
            }}
          />


          <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <i className="fa-solid fa-wand-magic-sparkles text-xs" />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Can't find it?
                </span>

              </div>

              <h2 className="max-w-xl text-2xl font-black tracking-tight text-white sm:text-3xl">
                Turn your idea into a
                <span className="text-emerald-400"> tiny masterpiece.</span>
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-5 text-slate-400 sm:text-sm">
                Send us your photo, character, object or idea and
                we'll help turn it into a custom 3D print.
              </p>

            </div>


            <Link
              to="/custom-order"
              className="group flex shrink-0 items-center justify-center gap-3 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400"
            >

              Start custom order

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </span>

            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
