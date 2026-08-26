import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../../../assets/slider-image-1.jpeg';
import img2 from '../../../assets/slider-image-2.jpeg';
import img3 from '../../../assets/slider-image-3.jpeg';

import { MotionConfig, motion } from 'framer-motion';

const textReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.16,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const headingReveal = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: '0.45em', rotateX: -35 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardReveal = {
  hidden: { opacity: 0, x: 18, scale: 0.97, rotateY: -10 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: -8,
    transition: { duration: 1.2, delay: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
};

const slides = [
  {
    img: img1,
    eyebrow: 'CUSTOM 3D PRINTING',
    title: 'Your imagination, made tangible.',
    description:
      'Turn your ideas, memories and designs into beautifully detailed pocket-size 3D prints.',
    cta: 'Create your print',
    tag: 'From your photo',
  },
  {
    img: img2,
    eyebrow: 'NANO COLLECTION',
    title: 'Tiny objects. Incredible detail.',
    description:
      'Explore miniature 3D creations engineered to look amazing at every angle.',
    cta: 'Explore minis',
    tag: 'Nano scale',
  },
  {
    img: img3,
    eyebrow: 'GIFT COLLECTION',
    title: 'Make something worth keeping.',
    description:
      'Transform special moments into physical keepsakes designed to last.',
    cta: 'Explore gifts',
    tag: 'Made to remember',
  },
];

export default function MainSlider() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const slide = slides[active];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full min-h-[calc(100svh-100px)] scroll-mt-[100px] overflow-hidden bg-[#f5f7f4] py-8 sm:py-12 md:py-16">

        {/* ================= BACKGROUND ================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* soft green glow */}
          <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-emerald-200/30 blur-[120px]" />

          <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-green-100/50 blur-[100px]" />

          {/* 3D perspective grid */}
          <div
            className="absolute -bottom-32 left-1/2 h-[500px] w-[1200px] -translate-x-1/2 opacity-[0.12]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16,185,129,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16,185,129,.45) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform:
                'translateX(-50%) perspective(500px) rotateX(65deg)',
            }}
          />

          {/* decorative circles */}
          <div className="absolute right-[18%] top-20 h-3 w-3 rounded-full bg-emerald-400/60" />
          <div className="absolute right-[12%] top-40 h-2 w-2 rounded-full bg-emerald-500/40" />
          <div className="absolute left-[8%] top-24 h-2 w-2 rounded-full bg-emerald-400/40" />

        </div>

        <div className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6">

          <div className="grid min-h-[540px] items-center gap-8 lg:min-h-[calc(100svh-100px)] lg:grid-cols-[0.85fr_1.15fr] xl:min-h-[590px]">

            {/* =====================================================
                LEFT CONTENT
            ====================================================== */}

            <motion.div
              key={active}
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="relative z-20 max-w-xl"
            >

              {/* eyebrow */}

              <motion.div variants={itemReveal} className="mb-5 flex items-center gap-3">

                <span className="h-[1px] w-8 bg-emerald-600" />

                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-700">
                  {slide.eyebrow}
                </span>

              </motion.div>

              {/* heading */}

              <motion.h1
                variants={headingReveal}
                className="max-w-[620px] text-4xl font-black leading-[0.98] tracking-[-0.04em] text-slate-900 sm:text-5xl md:text-6xl xl:text-[70px]"
                style={{ perspective: 800 }}
              >

                {slide.title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordReveal}
                    className="inline-block origin-bottom"
                  >
                    {word}{' '}
                    {index === 1 && (
                      <br className="hidden sm:block" />
                    )}
                  </motion.span>
                ))}

              </motion.h1>

              {/* description */}

              <motion.p
                variants={itemReveal}
                className="mt-6 max-w-md text-sm leading-6 text-slate-500 sm:text-base"
              >
                {slide.description}
              </motion.p>

              {/* CTA */}

              <motion.div
                variants={itemReveal}
                className="mt-8 flex flex-wrap items-center gap-4"
              >

                <button
                  onClick={() => navigate('/custom-order')}
                  className="group flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-emerald-600/20"
                >

                  {slide.cta}

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>

                </button>

                <button className="text-sm font-semibold text-slate-600 transition hover:text-emerald-600">
                  See how it works
                </button>

              </motion.div>

              {/* stats */}

              <motion.div
                variants={itemReveal}
                className="mt-10 flex items-center gap-7 border-t border-slate-200/80 pt-6"
              >

                <div>
                  <p className="text-xl font-black text-slate-900">
                    12.4K+
                  </p>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Prints shipped
                  </p>
                </div>

                <div className="h-9 w-px bg-slate-200" />

                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-slate-900">
                      4.9
                    </span>

                    <i className="fa-solid fa-star text-xs text-emerald-500" />
                  </div>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Customer rating
                  </p>
                </div>

              </motion.div>

            </motion.div>


            {/* =====================================================
                RIGHT 3D PRODUCT STAGE
            ====================================================== */}

            <div className="relative h-[430px] sm:h-[500px] md:h-[550px]">

              {/* giant background number */}

              <div className="absolute right-0 top-0 select-none text-[150px] font-black leading-none tracking-[-0.08em] text-slate-900/[0.035] sm:text-[220px]">
                3D
              </div>


              {/* rotating decorative ring */}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[48%] top-[48%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 sm:h-[420px] sm:w-[420px]"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[48%] top-[48%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/15 sm:h-[350px] sm:w-[350px]"
              />


              {/* PRODUCT SHADOW */}

              <div className="absolute bottom-[55px] left-[52%] h-16 w-[65%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-3xl" />


              {/* =================================================
                  MAIN 3D IMAGE
              ================================================== */}

              <div
                className="absolute left-[50%] top-[48%] z-10 w-[88%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  perspective: '1200px',
                }}
              >

                <motion.div
                  key={active}
                  variants={cardReveal}
                  initial="hidden"
                  animate="visible"
                  className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/50 shadow-[0_35px_80px_rgba(15,23,42,0.20)]"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >

                  {/* image */}

                  <img
                    src={slide.img}
                    alt={slide.title}
                    width="800"
                    height="600"
                    fetchPriority="high"
                    className="h-[330px] w-full object-cover object-center sm:h-[400px] md:h-[430px]"
                  />

                  {/* cinematic gradient */}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/10" />

                  {/* glass shine */}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />

                </motion.div>

              </div>


              {/* =================================================
                  FLOATING PRODUCT INFO
              ================================================== */}

              <motion.div
                key={`${active}-info`}
                initial={{ opacity: 0, x: 18, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 0.95, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-[18%] z-30 hidden w-44 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_20px_50px_rgba(15,23,42,.14)] backdrop-blur-xl sm:block"
                style={{
                  transform: 'rotate(4deg)',
                }}
              >

                <div className="mb-3 flex items-center justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <i className="fa-solid fa-cube" />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                    LIVE
                  </span>

                </div>

                <p className="text-xs font-bold text-slate-900">
                  {slide.tag}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Precision printed with premium detail.
                </p>

              </motion.div>


              {/* =================================================
                  FLOATING PRINT CARD
              ================================================== */}

              <motion.div
                key={`${active}-print`}
                initial={{ opacity: 0, x: -18, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-[10%] left-0 z-30 w-48 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-[0_25px_60px_rgba(15,23,42,.18)] backdrop-blur-xl sm:w-56 sm:p-4"
                style={{
                  transform: 'rotate(-4deg)',
                }}
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <i className="fa-solid fa-print" />
                  </div>

                  <div>

                    <p className="text-xs font-black text-slate-900">
                      Printing now
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Your next creation
                    </p>

                  </div>

                </div>

                {/* progress */}

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-[72%] rounded-full bg-emerald-500" />

                </div>

                <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                  <span>Layer 728</span>
                  <span>72%</span>
                </div>

              </motion.div>


              {/* =================================================
                  SMALL FLOATING DOT
              ================================================== */}

              <div className="absolute bottom-[22%] right-[10%] z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/80 shadow-xl backdrop-blur-md">

                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />

              </div>


              {/* =================================================
                  SLIDER CONTROLS
              ================================================== */}

              <div className="absolute bottom-2 right-2 z-40 flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl">

                {slides.map((_, index) => (

                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      active === index
                        ? 'w-8 bg-emerald-600'
                        : 'w-1.5 bg-slate-300'
                    }`}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>
    </MotionConfig>
  );
}