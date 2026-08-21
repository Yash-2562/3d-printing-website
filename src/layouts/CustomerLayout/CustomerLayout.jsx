import Navbar from '../../components/common/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/common/Footer/Footer';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MainLayout() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
      className="site-shell flex min-h-screen flex-col"
    >
      {isOffline && (
        <p className="w-fit font-bold bg-red-500 rounded-lg text-white text-center p-2 fixed bottom-5 right-5 z-10">
          You are offline
        </p>
      )}
      <Navbar />
      <main className="flex flex-grow mt-[100px]">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
