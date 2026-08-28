import { useContext, useEffect, useState } from 'react';
import ProductItem from '../ProductItem/ProductItem';
import Spinner from '../Spinner/Spinner';
import { wishlistContext } from '../../../context/Wishlist/Wishlist';
import { productsContext } from '../../../context/Products/Products';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Products() {
  const { data } = useContext(productsContext);

  const { getWishlist, addToWishlist, deleteWishlistItem } =
    useContext(wishlistContext);

  const [wishlistIds, setWishlistIds] = useState(null);

  async function handleWishlist(id) {
    if (wishlistIds?.indexOf(id) !== -1) {
      await deleteWishlistItem(id);
    } else {
      await addToWishlist(id);
    }
    main();
  }

  async function main() {
    const wishlistItems = await getWishlist();
    const ids = wishlistItems.map((item) => item._id);
    setWishlistIds(ids);
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h3 className="text-3xl font-bold text-gray-900">Our Products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Explore our latest collection
          </p>
        </div>

        {data ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {data.slice(0, 10).map((product, index) => (
              <motion.div
                key={product._id}
                className={index >= 4 ? 'hidden lg:block' : index >= 2 ? 'hidden sm:block' : ''}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.07 }}
              >
                <ProductItem
                  product={product}
                  isWished={wishlistIds?.indexOf(product._id) !== -1}
                  handleWishlist={handleWishlist}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full py-20">
            <Spinner />
          </div>
        )}

        {data && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/shop#products"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              More Products
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
