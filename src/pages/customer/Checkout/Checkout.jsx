import { useFormik } from 'formik';
import apiClient from '../../../lib/api';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cartContext } from '../../../context/Cart/Cart';
import { authContext } from '../../../context/Auth/Auth';
import { toast } from 'react-hot-toast';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  const script = existingScript || document.createElement('script');

  return new Promise((resolve, reject) => {
    script.addEventListener('load', () => window.Razorpay ? resolve() : reject(new Error('Razorpay Checkout could not be loaded.')), { once: true });
    script.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout. Check your network connection and try again.')), { once: true });
    if (!existingScript) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { emptyCart } = useContext(cartContext);
  const { userToken } = useContext(authContext);

  useEffect(() => {
    if (!payment && !error) return undefined;

    const redirectTimer = window.setTimeout(() => navigate('/orders'), 10000);
    return () => window.clearTimeout(redirectTimer);
  }, [error, navigate, payment]);

  const buttonProps = {
    type: 'submit',
    className:
      'sm:w-36 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 select-none',
  };

  function handleCheckout(data) {
    if (!userToken) {
      toast.error('Please log in to place an order.');
      return;
    }
    setIsLoading(true);
    setError('');

    const config = {
      method: 'post',
      url: `/orders/checkout-session/${id}`,
      headers: {
        token: userToken,
      },
      data: data,
    };

    apiClient.request(config).then(async (response) => {
      const session = response.data;
      if (!session.payment?.keyId || !session.payment?.razorpayOrderId) {
        throw new Error(session.message || 'Unable to create checkout session. Please try again.');
      }
      await loadRazorpay();
      const checkout = new window.Razorpay({
        key: session.payment.keyId,
        amount: session.payment.amount,
        currency: session.payment.currency,
        name: 'PrintForge Studio',
        description: 'PrintForge test-mode purchase',
        order_id: session.payment.razorpayOrderId,
        prefill: { contact: formik.values.phone },
        theme: { color: '#15803d' },
        handler: async (result) => {
          try {
            const verification = await apiClient.post('/orders/payment-verify', { orderId: session.orderId, ...result });
            await emptyCart();
            setPayment(verification.data.payment);
          } catch (requestError) {
            setError(requestError.response?.data?.message || 'Payment verification failed. Please contact support.');
          } finally {
            setIsLoading(false);
          }
        },
        modal: { ondismiss: () => setIsLoading(false) },
      });
      checkout.on('payment.failed', () => { setError('Razorpay payment failed. Your order remains pending.'); setIsLoading(false); });
      checkout.open();
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to start payment. Please try again.');
      setIsLoading(false);
    });
  }

  const validate = Yup.object({
    city: Yup.string()
      .required('Address is required')
      .min(3, 'Address must be at least 3 characters'),

    details: Yup.string(),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(
        /^[6-9][0-9]{9}$/,
        'Enter a valid 10-digit Indian mobile number'
      ),
  });

  const formik = useFormik({
    initialValues: {
      city: '',
      details: '',
      phone: '',
    },
    onSubmit: handleCheckout,
    validationSchema: validate,
  });

  return (
    <>
      <Helmet>
        <title>Checkout</title>
      </Helmet>

      <div className="container">
        {payment && (
          <div className="mx-auto mb-8 max-w-md rounded-xl border border-green-200 bg-green-50 p-5 text-green-900 shadow-sm" role="status">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check mt-1 text-xl text-green-700" />
              <div>
                <h1 className="text-lg font-bold">Payment successful</h1>
                <p className="mt-1 text-sm">Your order is confirmed in test mode. The admin payment ledger has been updated.</p>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between gap-4"><dt>Gateway</dt><dd className="font-semibold">Razorpay test mode</dd></div>
                  <div className="flex justify-between gap-4"><dt>Order ID</dt><dd className="font-mono">{payment.razorpayOrderId}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Payment ID</dt><dd className="font-mono">{payment.razorpayPaymentId}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        )}
        <form
          method="post"
          className="max-w-md mx-auto"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl text-gray-500 mb-5 font-bold">Checkout</h1>
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="details"
              id="details"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.details}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="details"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Details
            </label>
            {formik.errors.details && formik.touched.details && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.details}
              </span>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="city"
              id="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="city"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Address*
            </label>
            {formik.errors.city && formik.touched.city && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.city}
              </span>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              name="phone"
              id="phone"
              inputMode="numeric"
              maxLength="10"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone Number (+91)*
            </label>
            {formik.errors.phone && formik.touched.phone && (
              <span className="text-red-600 font-light text-sm">
                {formik.errors.phone}
              </span>
            )}
          </div>
          {isLoading ? (
            <button {...buttonProps} disabled>
              <i className="fa-solid fa-spinner animate-spin"></i>
            </button>
          ) : (
            <button {...buttonProps}>Checkout</button>
          )}
        </form>
      </div>
    </>
  );
}
