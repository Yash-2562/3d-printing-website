import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { cartContext } from '../../../context/Cart/Cart';
import { productsContext } from '../../../context/Products/Products';
import ResolvedImage from '../ResolvedImage';

export default function ProductItem({ product, isWished, handleWishlist }) {
  const { addProduct } = useContext(cartContext);
  const { renderStars } = useContext(productsContext);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  function onWishlistClick() {
    setIsWishlistAnimating(true);
    window.setTimeout(() => setIsWishlistAnimating(false), 550);
    handleWishlist(product._id);
  }

  return (
    <div className="w-full min-w-0">

      <div className="group relative">

        {/* CARD */}
        <div className="
          relative overflow-hidden
          rounded-2xl
          bg-white
          border border-gray-100
          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
        ">

          {/* IMAGE AREA */}
          <div className="
            relative
            h-[230px]
            overflow-hidden
            bg-[#f7f7f5]
          ">

            <Link to={`product/${product._id}`}>

              <ResolvedImage
                src={product.imageCover}
                alt={product.title}
                width="400"
                height="400"
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-contain
                  p-6
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-110
                "
              />

            </Link>


            {/* NEW BADGE */}
            <span className="
              absolute
              left-4
              top-4
              rounded-full
              bg-white
              px-3
              py-1
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-gray-700
              shadow-sm
            ">
              New
            </span>


            {/* WISHLIST */}
            <button
              type="button"
              aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={onWishlistClick}
              className={`
                absolute
                right-4
                top-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
                transition-all
                duration-300
                hover:scale-110
                ${isWishlistAnimating ? 'wishlist-pop' : ''}
              `}
            >
              {isWished ? (
                <i className="fas fa-heart text-green-500"></i>
              ) : (
                <i className="far fa-heart text-gray-700"></i>
              )}
            </button>


            {/* QUICK ACTION */}
            <Link
              to={`product/${product._id}`}
              className="
                absolute
                bottom-4
                left-1/2
                -translate-x-1/2
                translate-y-14
                rounded-full
                bg-gray-900
                px-5
                py-2
                text-xs
                font-semibold
                text-white
                opacity-0
                transition-all
                duration-300
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              Quick View
            </Link>

          </div>


          {/* CONTENT */}
          <div className="p-5">

            {/* CATEGORY */}
            <p className="
              mb-1
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-green-600
            ">
              Featured
            </p>


            {/* TITLE */}
            <Link to={`product/${product._id}`}>
              <h3 className="
                mb-3
                truncate
                text-[17px]
                font-semibold
                text-gray-900
                transition-colors
                duration-300
                group-hover:text-green-600
              ">
                {product.title}
              </h3>
            </Link>


            {/* RATING */}
            <div className="mb-4 flex items-center gap-2">

              <div className="flex items-center gap-0.5">
                {renderStars(Math.round(product.ratingsAverage))}
              </div>

              <span className="
                text-xs
                font-medium
                text-gray-500
              ">
                ({product.ratingsAverage})
              </span>

            </div>


            {/* BOTTOM */}
            <div className="
              flex
              items-center
              justify-between
              border-t
              border-gray-100
              pt-4
            ">

              {/* PRICE */}
              <div>
                <p className="text-[11px] text-gray-400">
                  Price
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-gray-900
                ">
                 {product.price}
                </p>
              </div>


              {/* ADD BUTTON */}
              <button
                onClick={() => addProduct(product._id)}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  bg-green-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-green-700
                  hover:shadow-lg
                  active:scale-95
                "
              >
                <i className="fas fa-plus text-xs"></i>
                Add
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
