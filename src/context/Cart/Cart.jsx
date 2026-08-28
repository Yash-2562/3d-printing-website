import apiClient from '../../lib/api';
import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { authContext } from '../Auth/Auth';

export const cartContext = createContext(null);

export default function CartContextProvider(props) {
  const { userToken } = useContext(authContext);

  const headers = {
    token: userToken,
  };
  const URL = '/cart';

  function requireAuthentication() {
    if (userToken) return true;
    toast.error('Please log in to add items to your cart.');
    return false;
  }

  function getProducts() {
    const config = {
      method: 'get',
      url: URL,
      headers: headers,
    };

    return apiClient(config)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  function addProduct(id) {
    if (!requireAuthentication()) return Promise.resolve(null);
    const data = { productId: id };

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
        loading: 'Adding product...',
        success: 'Product added successfully!',
        error: 'Error adding product',
      }
    );
  }

  function deleteProduct(id) {
    if (!requireAuthentication()) return Promise.resolve(null);
    let config = {
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
        loading: 'Deleting product...',
        success: 'Product deleted successfully!',
        error: 'Error deleting product',
      }
    );
  }

  function updateProductQuantity(id, quantity) {
    if (!requireAuthentication()) return Promise.resolve(null);
    let data = { count: quantity };

    let config = {
      method: 'put',
      url: `${URL}/${id}`,
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
        loading: 'Updating product quantity...',
        success: 'Product quantity updated successfully!',
        error: 'Error updating product quantity',
      }
    );
  }

  function emptyCart() {
    if (!requireAuthentication()) return Promise.resolve(null);
    let config = {
      method: 'delete',
      url: URL,
      headers: headers,
    };

    return apiClient
      .request(config)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  return (
    <cartContext.Provider
      value={{
        getProducts,
        addProduct,
        deleteProduct,
        updateProductQuantity,
        emptyCart,
      }}
    >
      {props.children}
    </cartContext.Provider>
  );
}
