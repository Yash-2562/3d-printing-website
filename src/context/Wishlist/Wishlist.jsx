import apiClient from '../../lib/api';
import { createContext, useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { authContext } from '../Auth/Auth';

export const wishlistContext = createContext(null);

export default function WishlistContextProvider(props) {
  const { userToken } = useContext(authContext);

  const headers = {
    token: userToken,
  };
  const URL = '/wishlist';

  function requireAuthentication() {
    if (userToken) return true;
    toast.error('Please log in to use your wishlist.');
    return false;
  }

  function addToWishlist(id) {
    if (!requireAuthentication()) return Promise.resolve(null);
    const data = {
      productId: id,
    };

    const config = {
      method: 'post',
      url: URL,
      headers: headers,
      data: data,
    };
    return toast.promise(
      apiClient(config)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        }),
      {
        loading: 'Adding product to wishlist...',
        success: 'Product added successfully!',
        error: 'Error adding product',
      }
    );
  }

  function deleteWishlistItem(id) {
    if (!requireAuthentication()) return Promise.resolve(null);
    const config = {
      method: 'delete',
      url: `${URL}/${id}`,
      headers: headers,
    };

    return toast.promise(
      apiClient(config)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        }),
      {
        loading: 'Removing product from wishlist...',
        success: 'Product removed successfully!',
        error: 'Error removing product',
      }
    );
  }

  const getWishlist = useCallback(() => {
    if (!userToken) return Promise.resolve([]);
    let config = {
      method: 'get',
      url: URL,
      headers: { token: userToken },
    };

    return apiClient(config)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }, [userToken]);

  return (
    <wishlistContext.Provider
      value={{ addToWishlist, getWishlist, deleteWishlistItem }}
    >
      {props.children}
    </wishlistContext.Provider>
  );
}
