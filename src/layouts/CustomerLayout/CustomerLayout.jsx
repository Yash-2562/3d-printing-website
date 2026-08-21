import Navbar from '../../components/common/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../../components/common/Footer/Footer';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MainLayout() {
  const { pathname, search } = useLocation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="site-shell relative flex min-h-screen flex-col overflow-hidden bg-[#f7faf8]"
    >

      {/* =========================================================
          GLOBAL 3D PRINTING BACKGROUND
          Light theme — visible but never distracting
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* =====================================================
            SOFT AMBIENT LIGHT
        ====================================================== */}

        <div className="absolute -left-48 top-[18%] h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[130px]" />

        <div className="absolute -right-48 top-[48%] h-[550px] w-[550px] rounded-full bg-green-200/20 blur-[140px]" />

        <div className="absolute left-[40%] bottom-[-200px] h-[450px] w-[450px] rounded-full bg-emerald-100/25 blur-[120px]" />


        {/* =====================================================
            VERY LIGHT 3D GRID
        ====================================================== */}

        <div
          className="absolute -bottom-[280px] left-1/2 h-[700px] w-[1500px] -translate-x-1/2 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,.45) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,.45) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform:
              'translateX(-50%) perspective(700px) rotateX(64deg)',
          }}
        />


        {/* =====================================================
            SUBTLE BACKGROUND GRID
        ====================================================== */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,.8) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />


        {/* =====================================================
            FLOATING 3D GIFT / PRODUCT OBJECTS
        ====================================================== */}

        {/* Cube */}

        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-10, -4, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[3%] top-[22%] hidden h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/[0.07] bg-white/40 text-emerald-700/[0.08] shadow-[0_20px_50px_rgba(16,185,129,.05)] backdrop-blur-[1px] lg:flex"
          style={{
            transform:
              'perspective(500px) rotateX(20deg) rotateY(-20deg) rotateZ(-10deg)',
          }}
        >
          <i className="fa-solid fa-cube text-4xl" />
        </motion.div>


        {/* Gift */}

        <motion.div
          animate={{
            y: [0, 14, 0],
            rotate: [8, 13, 8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-[4%] top-[34%] hidden h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-500/[0.06] bg-white/40 text-emerald-700/[0.07] shadow-[0_20px_50px_rgba(16,185,129,.04)] lg:flex"
          style={{
            transform:
              'perspective(500px) rotateX(15deg) rotateY(18deg) rotateZ(8deg)',
          }}
        >
          <i className="fa-solid fa-gift text-5xl" />
        </motion.div>


        {/* Miniature cubes */}

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[24%] right-[13%] hidden h-16 w-16 items-center justify-center rounded-xl border border-emerald-500/[0.06] bg-white/40 text-emerald-700/[0.06] lg:flex"
        >
          <i className="fa-solid fa-cubes text-3xl" />
        </motion.div>


        {/* Custom print / magic */}

        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[15%] left-[12%] hidden h-14 w-14 items-center justify-center rounded-full border border-emerald-500/[0.05] bg-white/40 text-emerald-700/[0.06] lg:flex"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-xl" />
        </motion.div>


        {/* =====================================================
            SMALL FLOATING PARTICLES
        ====================================================== */}

        <div className="absolute left-[16%] top-[16%] h-1.5 w-1.5 rounded-full bg-emerald-500/20" />

        <div className="absolute left-[28%] top-[38%] h-1 w-1 rounded-full bg-emerald-500/15" />

        <div className="absolute right-[26%] top-[20%] h-1.5 w-1.5 rounded-full bg-emerald-500/20" />

        <div className="absolute right-[18%] bottom-[35%] h-1 w-1 rounded-full bg-emerald-500/15" />

        <div className="absolute left-[42%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-emerald-500/15" />

      </div>


      {/* =========================================================
          OFFLINE MESSAGE
      ========================================================== */}

      {isOffline && (
        <p className="fixed bottom-5 right-5 z-[100] w-fit rounded-lg bg-red-500 p-2 text-center font-bold text-white shadow-lg">
          You are offline
        </p>
      )}


      {/* =========================================================
          NAVBAR
      ========================================================== */}

      <Navbar />


      {/* =========================================================
          PAGE CONTENT
      ========================================================== */}

      <main className="relative z-10 mt-[100px] flex flex-grow">

        <div className="w-full">
          <Outlet />
        </div>

      </main>


      {/* =========================================================
          FOOTER
      ========================================================== */}

      <div className="relative z-10">
        <Footer />
      </div>

    </motion.div>
  );
}