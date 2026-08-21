// import img1 from '../../../assets/slider-image-1.jpeg';
// import img2 from '../../../assets/slider-image-2.jpeg';
// import img3 from '../../../assets/slider-image-3.jpeg';

// import Slider from 'react-slick';

// export default function MainSlider() {
//   var settings = {
//     dots: false,
//     infinite: true,
//     arrows: false,
//     speed: 500,
//     autoplay: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div className="container mt-7">
//       <div className="flex">
//         <div className="md:w-3/4 w-full my-0">
//           <Slider {...settings}>
//             <img
//               className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
//               src={img1}
//             />
//             <img
//               className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
//               src={img2}
//             />
//             <img
//               className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
//               src={img3}
//             />
//           </Slider>
//         </div>
//         <div className="md:w-1/4 md:block hidden">
//           <div className="h-1/2">
//             <img
//               className="w-full h-[200px] object-cover md:rounded-tr-lg"
//               src={img2}
//             />
//           </div>
//           <div className="h-1/2">
//             <img
//               className="w-full h-[200px] object-cover md:rounded-br-lg"
//               src={img3}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import img1 from '../../../assets/slider-image-1.jpeg';
import img2 from '../../../assets/slider-image-2.jpeg';
import img3 from '../../../assets/slider-image-3.jpeg';

import Slider from 'react-slick';

/**
 * PocketForm hero slider
 * -----------------------
 * Same 3 images / react-slick engine as before. Redesign adds:
 *  - A dark gradient scrim + headline/CTA copy overlaid on the active slide,
 *    so the slider reads as a hero, not a bare carousel.
 *  - Custom pill-style dot indicators (react-slick's dots re-skinned) instead
 *    of default dots — track progress like a print job.
 *  - A floating "stat card" badge (rating / prints shipped) that overlaps the
 *    bottom-left corner of the main image — the standout element.
 *  - Side thumbnails get a hover zoom + label chip instead of sitting static.
 *  - A small "LIVE PRINTING" pulse badge top-right for atmosphere.
 */

const slides = [
  {
    img: img1,
    eyebrow: 'New drop',
    title: 'Pocket-size prints, made from your photo',
    cta: 'Start a custom order',
  },
  {
    img: img2,
    eyebrow: 'Nano Banana scale',
    title: 'Miniatures that fit in your palm',
    cta: 'Shop nano minis',
  },
  {
    img: img3,
    eyebrow: 'Gifting',
    title: 'Turn any keepsake into a 3D print',
    cta: 'Browse gift picks',
  },
];

export default function MainSlider() {
  const [active, setActive] = useState(0);

  var settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setActive(next),
  };

  return (
    <div className="container mt-7">
      <div className="flex gap-3">
        {/* Main slide column */}
        <div className="md:w-3/4 w-full relative mb-10 sm:mb-6 md:mb-0">
          <Slider {...settings}>
            {slides.map((slide, i) => (
              <div key={i} className="relative">
                <img
                  className="w-full h-[240px] sm:h-[320px] md:h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
                  src={slide.img}
                  alt={slide.title}
                />
              </div>
            ))}
          </Slider>

          {/* gradient scrim so text stays legible over any photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent rounded-lg md:rounded-l-lg md:rounded-r-none" />

          {/* live badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500" />
            </span>
            <span className="hidden sm:inline">Printing live now</span>
            <span className="sm:hidden">Live</span>
          </div>

          {/* overlay copy + CTA, keyed so it re-animates per slide */}
          <div
            key={active}
            className="absolute left-0 bottom-0 p-4 sm:p-6 md:p-8 max-w-[85%] sm:max-w-md animate-[pf-slide-in_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          >
            <span className="inline-block text-green-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1.5 sm:mb-2">
              {slides[active].eyebrow}
            </span>
            <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold leading-tight mb-3 sm:mb-4">
              {slides[active].title}
            </h2>
            <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors duration-200 shadow-lg shadow-green-900/30">
              {slides[active].cta}
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>

          {/* custom dot / progress indicators */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-green-500' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* floating stat card — the standout element, now visible on every breakpoint */}
          <div className="flex absolute -bottom-6 sm:-bottom-5 left-3 sm:left-6 items-center gap-2 sm:gap-3 bg-white rounded-xl shadow-xl shadow-black/10 px-3 sm:px-4 py-2 sm:py-3 border border-gray-100">
            <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-100 text-green-700 shrink-0">
              <i className="fa-solid fa-cube text-xs sm:text-sm" />
            </div>
            <div className="leading-tight">
              <p className="text-xs sm:text-sm font-bold text-gray-900">12,400+</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">minis printed &amp; shipped</p>
            </div>
          </div>
        </div>

        {/* Side thumbnails */}
        <div className="md:w-1/4 md:flex hidden flex-col gap-3">
          <div className="relative h-1/2 rounded-tr-lg overflow-hidden group cursor-pointer">
            <img
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              src={img2}
              alt="Nano Banana scale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-white text-xs font-semibold px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              Nano Banana
            </span>
          </div>
          <div className="relative h-1/2 rounded-br-lg overflow-hidden group cursor-pointer">
            <img
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              src={img3}
              alt="Gift picks"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-white text-xs font-semibold px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              Gift picks
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pf-slide-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[pf-slide-in_0\\.6s_cubic-bezier\\(0\\.22\\,1\\,0\\.36\\,1\\)_forwards\\] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}