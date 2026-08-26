import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../App.css';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import Home from '../pages/customer/Home/Home';
import AuthContextProvider from '../context/Auth/Auth';
import ProtectedRoute from '../pages/customer/ProtectedRoute/ProtectedRoute';
import CartContextProvider from '../context/Cart/Cart';
import WishlistContextProvider from '../context/Wishlist/Wishlist';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsContextProvider from '../context/Products/Products';
import RedirectIfAuthenticated from '../components/common/RedirectIfAuthenticated/RedirectIfAuthenticated';
import AdminRoutes from '../admin/AdminRoutes';

const Login = lazy(() => import('../pages/customer/Login/Login'));
const Register = lazy(() => import('../pages/customer/Register/Register'));
const NotFound = lazy(() => import('../pages/customer/NotFound/NotFound'));
const ProductDetails = lazy(() => import('../pages/customer/ProductDetails/ProductDetails'));
const Cart = lazy(() => import('../pages/customer/Cart/Cart'));
const ForgotPassword = lazy(() => import('../pages/customer/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/customer/ResetPassword/ResetPassword'));
const VerifyCode = lazy(() => import('../pages/customer/VerifyCode/VerifyCode'));
const Checkout = lazy(() => import('../pages/customer/Checkout/Checkout'));
const Wishlist = lazy(() => import('../pages/customer/Wishlist/Wishlist'));
const Brands = lazy(() => import('../pages/customer/Brands/Brands'));
const Categories = lazy(() => import('../pages/customer/Categories/Categories'));
const Search = lazy(() => import('../pages/customer/Search/Search'));
const Profile = lazy(() => import('../pages/customer/Profile/Profile'));
const Orders = lazy(() => import('../pages/customer/Orders/Orders'));
const Shop = lazy(() => import('../pages/customer/Shop/Shop'));
const CustomOrder = lazy(() => import('../pages/customer/Shop/Customorder'));

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: '/admin/*',
      element: <AdminRoutes />,
    },
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
        {
          path: 'orders',
          element: (
            <ProtectedRoute>
              <Orders />
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
              <Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
                    Loading...
                  </div>
                }
              >
                <RouterProvider router={router} />
              </Suspense>
            </ProductsContextProvider>
          </QueryClientProvider>
        </WishlistContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
