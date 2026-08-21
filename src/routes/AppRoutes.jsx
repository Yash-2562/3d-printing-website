import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../App.css';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import Login from '../pages/customer/Login/Login';
import Register from '../pages/customer/Register/Register';
import NotFound from '../pages/customer/NotFound/NotFound';
import AuthContextProvider from '../context/Auth/Auth';
import Home from '../pages/customer/Home/Home';
import ProtectedRoute from '../pages/customer/ProtectedRoute/ProtectedRoute';
import ProductDetails from '../pages/customer/ProductDetails/ProductDetails';
import Cart from '../pages/customer/Cart/Cart';
import CartContextProvider from '../context/Cart/Cart';
import WishlistContextProvider from '../context/Wishlist/Wishlist';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ForgotPassword from '../pages/customer/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/customer/ResetPassword/ResetPassword';
import VerifyCode from '../pages/customer/VerifyCode/VerifyCode';
import Checkout from '../pages/customer/Checkout/Checkout';
import Wishlist from '../pages/customer/Wishlist/Wishlist';
import Brands from '../pages/customer/Brands/Brands';
import Categories from '../pages/customer/Categories/Categories';
import ProductsContextProvider from '../context/Products/Products';
import Search from '../pages/customer/Search/Search';
import RedirectIfAuthenticated from '../components/common/RedirectIfAuthenticated/RedirectIfAuthenticated';
import Profile from '../pages/customer/Profile/Profile';
import Shop from '../pages/customer/Shop/Shop';
import CustomOrder from '../pages/customer/Shop/Customorder';

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: '',
      element: <CustomerLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: 'login',
          element: (
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          ),
        },
        {
          path: 'register',
          element: (
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          ),
        },
        {
          path: 'forgotPassword',
          element: <ForgotPassword />,
        },
        { path: 'forgotPassword/verifyCode', element: <VerifyCode /> },
        {
          path: 'forgotPassword/verifyCode/resetPassword',
          element: <ResetPassword />,
        },
        {
          path: 'product/:id',
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: '/checkout/:id',
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: 'cart',
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: 'wishlist',
          element: (
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          ),
        },
        {
          path: 'brands',
          element: (
            <ProtectedRoute>
              <Brands />
            </ProtectedRoute>
          ),
        },
        {
          path: 'categories',
          element: (
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          ),
        },
        {
          path: 'shop',
          element: (
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          ),
        },
        {
          path: 'custom-order',
          element: (
            <ProtectedRoute>
              <CustomOrder />
            </ProtectedRoute>
          ),
        },
        {
          path: 'search',
          element: (
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <WishlistContextProvider>
          <QueryClientProvider client={queryClient}>
            <ProductsContextProvider>
              <Toaster />
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              <RouterProvider router={router} />
            </ProductsContextProvider>
          </QueryClientProvider>
        </WishlistContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
