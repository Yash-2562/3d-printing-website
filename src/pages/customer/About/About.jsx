import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gtyImage from '../../../assets/gty.png';

const values = [
  {
    icon: 'fa-cube',
    title: 'Small by design',
    text: 'Pocket-size prints made to bring personality to desks, shelves and everyday spaces.',
  },
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'Made with care',
    text: 'Every model is selected, prepared and printed with attention to the little details.',
  },
  {
    icon: 'fa-heart',
    title: 'Worth keeping',
    text: 'From thoughtful gifts to personal collectibles, we make prints that feel like yours.',
  },
];

export default function About() {
  return (
    <main className="relative overflow-hidden pb-16 pt-12">
      <section className="mx-auto max-w-screen-xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              About PocketForm
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Tiny prints. Big personality.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              PocketForm makes 3D printed minis for the moments, people and places
              that deserve a little more character.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Explore Shop Minis
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
              <Link
                to="/custom-order"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Create something custom
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-50 shadow-xl shadow-emerald-900/10"
          >
            <img
              src={gtyImage}
              alt="A detailed 3D printed model on a studio table"
              className="h-full min-h-[320px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-emerald-950/5" />
            <p className="absolute bottom-5 left-5 max-w-xs text-sm font-bold text-white drop-shadow-md">
              Thoughtful objects, printed one layer at a time.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white/70">
        <div className="mx-auto grid max-w-screen-xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {values.map((value, index) => (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
            >
              <i className={`fa-solid ${value.icon} text-xl text-emerald-600`} />
              <h2 className="mt-5 text-lg font-bold text-slate-900">{value.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{value.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
