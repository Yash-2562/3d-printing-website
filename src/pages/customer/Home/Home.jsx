import CategorySlider from '../../../components/common/CategorySlider/CategorySlider';
import Products from '../../../components/common/Products/Products';
import MainSlider from '../../../components/common/MainSlider/MainSlider';
import { motion } from 'framer-motion';

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden pb-16"
    >
      <motion.section
        variants={sectionReveal}
        className="relative"
      >
        <MainSlider />
      </motion.section>
      <motion.section
        variants={sectionReveal}
        transition={{ delay: 0.12 }}
        className="site-section relative mt-8 pt-8"
      >
        <CategorySlider />
      </motion.section>
      <motion.section
        variants={sectionReveal}
        transition={{ delay: 0.2 }}
        className="site-section relative mt-8 pt-8"
      >
        <Products />
      </motion.section>
    </motion.div>
  );
}
