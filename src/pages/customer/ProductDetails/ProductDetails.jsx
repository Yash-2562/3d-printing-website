// import apiClient from '../../../lib/api';
// import { useContext, useEffect, useState } from 'react';
// import Slider from 'react-slick/lib/slider.js';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { useParams } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { cartContext } from '../../../context/Cart/Cart.jsx';
// import { productsContext } from '../../../context/Products/Products.jsx';
// import { wishlistContext } from '../../../context/Wishlist/Wishlist.jsx';

// export default function ProductDetails() {
//   const { addProduct } = useContext(cartContext);
//   const { renderStars } = useContext(productsContext);
//   const [ProdDetails, setProdDetails] = useState([]);

//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     autoplay: true,
//     autoplaySpeed: 1500,
//     pauseOnHover: true,
//   };

//   const { id } = useParams();

//   const { addToWishlist } = useContext(wishlistContext);

//   useEffect(() => {
//     apiClient
//       .get(`/products/${id}`)
//       .then((response) => {
//         setProdDetails(response.data.data);
//       })
//       .catch((error) => {
//         throw error;
//       });
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>{ProdDetails.title}</title>
//       </Helmet>

//       <div className="container dark:bg-gray-800">
//         <div className="flex flex-col md:flex-row md:space-x-8">
//           <div className="w-full md:w-1/3 mb-8 md:mb-0">
//             <div className="rounded-lg mb-7 dark:bg-gray-700">
//               <Slider {...settings}>
//                 {ProdDetails.images
//                   ? ProdDetails.images.map((img, index) => (
//                       <div key={index} className="w-full h-[460px]">
//                         <img
//                           className="w-full h-full object-contain rounded-lg"
//                           src={img}
//                           alt={`Product image ${index + 1}`}
//                         />
//                       </div>
//                     ))
//                   : ''}
//               </Slider>
//             </div>
//             <div className="flex mt-4 space-x-4">
//               <button
//                 onClick={() => addProduct(ProdDetails.id)}
//                 className="w-1/2 bg-green-700 hover:bg-green-800 dark:bg-green-600 text-white py-2 px-4 rounded-lg font-bold dark:hover:bg-green-700"
//               >
//                 Add to cart
//               </button>
//               <button className="w-1/2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
//                 onClick={() => addToWishlist(ProdDetails.id)}
//               >
//                 Add to Wishlist
//               </button>
//             </div>
//           </div>

//           <div className="w-full md:w-2/3">
//             <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
//               {ProdDetails.title}
//             </h2>

//             <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
//               Product Description:
//             </span>
//             <p className="text-lg text-gray-600 dark:text-gray-300 mb-5">
//               {ProdDetails.description}
//             </p>

//             <div className="mb-4">
//               <div className="flex justify-between my-4">
//                 <div className="text-xl font-bold text-gray-800 dark:text-white">
//                   Rating
//                 </div>
//                 <div className="flex items-center">
//                   <span className="flex">
//                     {renderStars(Math.round(ProdDetails.ratingsAverage)).map(
//                       (star, index) => (
//                         <span key={index} className="transform scale-150">
//                           {star}
//                         </span>
//                       )
//                     )}
//                   </span>
//                   <span className="bg-gray-100 text-gray-800 text-xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
//                     {ProdDetails.ratingsAverage}
//                   </span>
//                 </div>
//               </div>

//               <div className="my-5 flex justify-between text-gray-900 dark:text-white">
//                 <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
//                   Price
//                 </div>
//                 <div className="text-xl font-bold">EGP {ProdDetails.price}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import apiClient from '../../../lib/api';
import { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick/lib/slider.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cartContext } from '../../../context/Cart/Cart.jsx';
import { productsContext } from '../../../context/Products/Products.jsx';
import { wishlistContext } from '../../../context/Wishlist/Wishlist.jsx';
import { motion } from 'framer-motion';
import ResolvedImage from '../../../components/common/ResolvedImage.jsx';

export default function ProductDetails() {
  const { addProduct } = useContext(cartContext);
  const { renderStars } = useContext(productsContext);
  const { addToWishlist, getWishlist, deleteWishlistItem } = useContext(wishlistContext);

  const [ProdDetails, setProdDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);

  const { id } = useParams();

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    beforeChange: (_, next) => setActiveImage(next),
  };

  useEffect(() => {
    apiClient
      .get(`/products/${id}`)
      .then((response) => {
        setProdDetails(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    getWishlist()
      .then((wishlist) => {
        if (!isMounted) return;
        setIsWishlisted(wishlist.some((product) => String(product.id || product._id) === String(id)));
      })
      .catch(() => {
        if (isMounted) setIsWishlisted(false);
      });

    return () => {
      isMounted = false;
    };
  }, [getWishlist, id]);

  const handleWishlistToggle = async () => {
    if (!ProdDetails.id || isWishlistUpdating) return;
    setIsWishlistUpdating(true);
    try {
      if (isWishlisted) {
        const result = await deleteWishlistItem(ProdDetails.id);
        if (result === null) return;
        setIsWishlisted(false);
      } else {
        const result = await addToWishlist(ProdDetails.id);
        if (result === null) return;
        setIsWishlisted(true);
      }
    } finally {
      setIsWishlistUpdating(false);
    }
  };

  const images = ProdDetails.imageCover ? [ProdDetails.imageCover] : ProdDetails.images || [];
  const maxQuantity = Math.max(0, Number(ProdDetails.quantity || 0));

  const increaseQuantity = () => {
    setQuantity((value) => Math.min(maxQuantity || 1, value + 1));
  };

  const decreaseQuantity = () => {
    setQuantity((value) => Math.max(1, value - 1));
  };

  const handleAddToCart = () => {
    if (maxQuantity < 1) return;
    for (let i = 0; i < quantity; i++) {
      addProduct(ProdDetails.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {ProdDetails.title
            ? `${ProdDetails.title} | PocketForm`
            : 'Product | PocketForm'}
        </title>
      </Helmet>

      <main className="relative min-h-screen overflow-hidden bg-transparent">

        {/* =====================================================
            GLOBAL PRODUCT PAGE BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* ambient green light */}

          <div className="absolute -left-48 top-20 h-[480px] w-[480px] rounded-full bg-emerald-200/20 blur-[130px]" />

          <div className="absolute -right-48 top-[35%] h-[550px] w-[550px] rounded-full bg-green-200/20 blur-[140px]" />

          <div className="absolute left-[40%] bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-100/20 blur-[120px]" />

          {/* perspective grid */}

          <div
            className="absolute -bottom-64 left-1/2 h-[600px] w-[1400px] -translate-x-1/2 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
              `,
              backgroundSize: '55px 55px',
              transform:
                'translateX(-50%) perspective(650px) rotateX(65deg)',
            }}
          />

          {/* floating cube */}

          <div
            className="absolute left-[3%] top-[25%] hidden h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/[0.06] bg-white/40 text-emerald-700/[0.07] lg:flex"
            style={{
              transform:
                'perspective(500px) rotateX(20deg) rotateY(-25deg) rotateZ(-10deg)',
            }}
          >
            <i className="fa-solid fa-cube text-4xl" />
          </div>

          {/* floating gift */}

          <div
            className="absolute right-[4%] top-[32%] hidden h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-500/[0.06] bg-white/40 text-emerald-700/[0.06] lg:flex"
            style={{
              transform:
                'perspective(500px) rotateX(15deg) rotateY(20deg) rotateZ(8deg)',
            }}
          >
            <i className="fa-solid fa-gift text-5xl" />
          </div>

        </div>


        {/* =====================================================
            PRODUCT CONTENT
        ====================================================== */}

        <div className="relative z-10 mx-auto max-w-screen-xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">

          {/* breadcrumb */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 flex items-center gap-2 text-[10px] font-medium text-slate-400"
          >
            <span>Home</span>

            <i className="fa-solid fa-chevron-right text-[7px]" />

            <span>Shop</span>

            <i className="fa-solid fa-chevron-right text-[7px]" />

            <span className="font-semibold text-emerald-600">
              {ProdDetails.title || 'Product'}
            </span>
          </motion.div>


          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">


            {/* =================================================
                LEFT — PRODUCT STAGE
            ================================================== */}

            <motion.section
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >

              <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/70 p-3 shadow-[0_30px_80px_rgba(15,23,42,.09)] backdrop-blur-md sm:p-4">

                {/* =================================================
                    3D STAGE
                ================================================== */}

                <div className="relative h-[430px] overflow-hidden rounded-[26px] bg-gradient-to-br from-slate-50 via-emerald-50/60 to-white sm:h-[510px]">

                  {/* stage glow */}

                  <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-[70px]" />


                  {/* large ring */}

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 35,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 sm:h-[390px] sm:w-[390px]"
                  />


                  {/* dashed ring */}

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 28,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/10 sm:h-[320px] sm:w-[320px]"
                  />


                  {/* perspective floor */}

                  <div
                    className="absolute bottom-[-90px] left-1/2 h-60 w-[650px] -translate-x-1/2 opacity-[0.11]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
                      `,
                      backgroundSize: '35px 35px',
                      transform:
                        'translateX(-50%) perspective(400px) rotateX(65deg)',
                    }}
                  />


                  {/* product image */}

                  <div className="absolute inset-5 flex items-center justify-center">

                    <Slider {...settings}>

                      {images.length > 0 ? (

                        images.map((img, index) => (

                          <div
                            key={index}
                            className="flex h-[390px] items-center justify-center sm:h-[470px]"
                          >

                            <motion.div
                              initial={{
                                opacity: 0,
                                scale: 0.94,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                duration: 0.7,
                              }}
                              className="h-full w-full object-contain drop-shadow-[0_35px_35px_rgba(15,23,42,.16)]"
                            >
                              <ResolvedImage
                                src={img}
                                alt={`${ProdDetails.title || 'Product'} image ${
                                  index + 1
                                }`}
                                className="h-full w-full object-contain"
                              />
                            </motion.div>

                          </div>

                        ))

                      ) : (

                        <div className="flex h-[390px] items-center justify-center sm:h-[470px]">

                          <div className="flex h-40 w-40 items-center justify-center rounded-[40px] bg-emerald-500 shadow-[0_30px_60px_rgba(16,185,129,.25)]">

                            <i className="fa-solid fa-cube text-6xl text-white/90" />

                          </div>

                        </div>

                      )}

                    </Slider>

                  </div>


                  {/* top left label */}

                  <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-bold text-emerald-700 shadow-sm backdrop-blur-md">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    3D PRINTED

                  </div>


                  {/* top right */}

                  <div className="absolute right-5 top-5 z-20 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-bold text-slate-500 shadow-sm backdrop-blur-md">

                    Made to order

                  </div>


                  {/* floating detail card */}

                  <motion.div
                    animate={{
                      y: [0, -7, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute bottom-5 left-5 z-20 hidden rounded-2xl border border-white/80 bg-white/80 p-3 shadow-xl backdrop-blur-xl sm:block"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <i className="fa-solid fa-print text-sm" />
                      </div>

                      <div>

                        <p className="text-[10px] font-bold text-slate-900">
                          Precision printed
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Freshly made for you
                        </p>

                      </div>

                    </div>

                  </motion.div>


                  {/* rating floating card */}

                  <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2.5 shadow-xl backdrop-blur-xl">

                    <i className="fa-solid fa-star text-xs text-amber-400" />

                    <div>

                      <p className="text-xs font-black text-slate-900">
                        {ProdDetails.ratingsAverage || '4.8'}
                      </p>

                      <p className="text-[8px] text-slate-400">
                        Customer rating
                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    THUMBNAILS
                ================================================== */}

                {images.length > 1 && (

                  <div className="mt-3 flex gap-3 overflow-x-auto px-1 pb-1">

                    {images.map((img, index) => (

                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-all ${
                          activeImage === index
                            ? 'border-emerald-500 shadow-md'
                            : 'border-transparent hover:border-emerald-200'
                        }`}
                      >

                        <ResolvedImage
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-contain"
                        />

                      </button>

                    ))}

                  </div>

                )}

              </div>


              {/* product guarantees */}

              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">

                <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-3 text-center backdrop-blur-md">

                  <i className="fa-solid fa-cube text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Premium detail
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-3 text-center backdrop-blur-md">

                  <i className="fa-solid fa-box text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Safe packaging
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-3 text-center backdrop-blur-md">

                  <i className="fa-solid fa-truck-fast text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Ships in 3–5 days
                  </p>

                </div>

              </div>

            </motion.section>


            {/* =================================================
                RIGHT — PRODUCT INFORMATION
            ================================================== */}

            <motion.section
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:sticky lg:top-[120px] lg:self-start"
            >

              <div className="rounded-[30px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_25px_70px_rgba(15,23,42,.08)] backdrop-blur-md sm:p-8">


                {/* product type */}

                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    PocketForm Mini
                  </span>

                  <span className="text-[10px] font-medium text-slate-400">
                    #PF-{ProdDetails.id || '---'}
                  </span>

                </div>


                {/* title */}

                <h1 className="text-3xl font-black leading-tight tracking-[-0.035em] text-slate-900 sm:text-4xl">

                  {ProdDetails.title || 'Loading product...'}

                </h1>


                {/* rating */}

                <div className="mt-5 flex flex-wrap items-center gap-3">

                  <div className="flex items-center gap-1">

                    {ProdDetails.ratingsAverage
                      ? renderStars(
                          Math.round(ProdDetails.ratingsAverage)
                        ).map((star, index) => (

                          <span
                            key={index}
                            className="text-sm"
                          >
                            {star}
                          </span>

                        ))
                      : (
                        <div className="flex gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className="fa-solid fa-star text-xs"
                            />
                          ))}
                        </div>
                      )}

                  </div>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {ProdDetails.ratingsAverage || '4.8'}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    Loved by print collectors
                  </span>

                </div>


                {/* divider */}

                <div className="my-6 h-px bg-slate-100" />


                {/* description */}

                <div>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                    About this print
                  </p>

                  <p className="text-sm leading-6 text-slate-500">
                    {ProdDetails.description ||
                      'A carefully crafted 3D printed collectible, made to order with attention to detail.'}
                  </p>

                </div>


                {/* price */}

                <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    Your price
                  </p>

                  <div className="mt-1 flex items-end justify-between">

                    <div className="flex items-baseline gap-2">

                      <span className="text-3xl font-black tracking-tight text-slate-900">
                        ₹{ProdDetails.price || '0'}
                      </span>

                    </div>

                    <span className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-700">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                      Made to order

                    </span>

                  </div>

                </div>


                {/* quantity */}

                <div className="mt-6">

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="flex h-11 w-11 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <i className="fa-solid fa-minus text-[9px]" />
                    </button>

                    <span className="flex h-11 w-12 items-center justify-center border-x border-slate-200 text-sm font-bold text-slate-800">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= maxQuantity}
                      className="flex h-11 w-11 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <i className="fa-solid fa-plus text-[9px]" />
                    </button>

                  </div>

                </div>


                {/* actions */}

                <div className="mt-6 flex gap-3">

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={maxQuantity < 1}
                    className="group flex flex-1 items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-xl shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500"
                  >

                    <i className="fa-solid fa-cart-shopping text-xs" />

                    Add to cart

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
                      <i className="fa-solid fa-arrow-right text-[8px]" />
                    </span>

                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    disabled={isWishlistUpdating}
                    className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border transition-all disabled:cursor-wait disabled:opacity-60 ${
                      isWishlisted
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >

                    <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart`} />

                  </button>

                </div>


                {/* delivery info */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2">

                      <i className="fa-solid fa-truck-fast text-xs text-emerald-500" />

                      <span className="text-[10px] font-bold text-slate-700">
                        Ships in 3–5 days
                      </span>

                    </div>

                    <p className="mt-1 pl-5 text-[9px] text-slate-400">
                      Carefully packed
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2">

                      <i className="fa-solid fa-shield-halved text-xs text-emerald-500" />

                      <span className="text-[10px] font-bold text-slate-700">
                        Print quality
                      </span>

                    </div>

                    <p className="mt-1 pl-5 text-[9px] text-slate-400">
                      Made with care
                    </p>

                  </div>

                </div>


                {/* small reassurance */}

                <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[9px] text-slate-400">

                  <i className="fa-solid fa-circle-check text-emerald-500" />

                  Every PocketForm print is made to order.

                </div>

              </div>

            </motion.section>

          </div>


          {/* =====================================================
              PRODUCT DESCRIPTION SECTION
          ====================================================== */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-10 overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/65 p-6 shadow-sm backdrop-blur-md sm:p-8"
          >

            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-center">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Made for you
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  Small enough to hold.
                  <br />
                  Detailed enough to keep.
                </h2>

              </div>

              <p className="text-sm leading-7 text-slate-500">
                {ProdDetails.description ||
                  'Every model is printed to order and carefully prepared before it reaches you. From tiny collectibles to meaningful gifts, PocketForm turns digital designs into physical objects you can actually hold.'}
              </p>

            </div>

          </motion.section>

        </div>

      </main>
    </>
  );
}
