// import { useFormik } from 'formik';
// import apiClient from '../../../lib/api';
// import * as Yup from 'yup';
// import { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authContext } from '../../../context/Auth/Auth';
// import { Helmet } from 'react-helmet';

// export default function Login() {
//   const [err, setErr] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { setUserToken } = useContext(authContext);

//   const buttonProps = {
//     type: 'submit',
//     className:
//       'sm:w-36 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
//   };

//   const loginData = { email: 'test@gmail.com', password: 'Yash@9898' };

//   const navigate = useNavigate();

//   function handleLogin(data) {
//     setIsLoading(true);
//     apiClient
//       .post('/auth/signin', data)
//       .then((data) => {
//         setUserToken(data.data.token);
//         localStorage.setItem('authToken', data.data.token);
//         setErr(null);
//         setIsLoading(false);
//         if (data.data.message === 'success') {
//           navigate('/');
//         }
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         setErr(
//           err.response?.data?.message ||
//             'Unable to sign in. Check your connection and try again.'
//         );
//       });
//   }

//   const validate = Yup.object({
//     email: Yup.string()
//       .required('Email is required')
//       .email('Email is not valid'),

//     password: Yup.string().required('Password is required'),
//   });

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     onSubmit: handleLogin,
//     validationSchema: validate,
//   });

//   return (
//     <>
//       <Helmet>
//         <title>Login</title>
//       </Helmet>

//       <div className="container">
//         <form
//           method="post"
//           className="max-w-md mx-auto md:mt-12 mt-0"
//           onSubmit={formik.handleSubmit}
//         >
//           <h1 className="text-2xl text-gray-500 mb-5 font-bold">Login Now</h1>
//           {err && <div className="bg-red-300 py-1 mb-4 font-light">{err}</div>}
//           <div className="relative z-0 w-full mb-5 group">
//             <input
//               type="email"
//               name="email"
//               id="email"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
//               placeholder=" "
//             />
//             <label
//               htmlFor="email"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Email address
//             </label>
//             {formik.errors.email && formik.touched.email && (
//               <span className="text-red-600 font-light text-sm">
//                 {formik.errors.email}
//               </span>
//             )}
//           </div>
//           <div className="relative z-0 w-full group">
//             <input
//               type="password"
//               name="password"
//               id="password"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
//               placeholder=" "
//             />
//             <label
//               htmlFor="password"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Password
//             </label>
//             {formik.errors.password && formik.touched.password && (
//               <span className="text-red-600 font-light text-sm">
//                 {formik.errors.password}
//               </span>
//             )}
//           </div>
//           <Link
//             to="/forgotPassword"
//             className="text-green-800 text-sm underline block my-3"
//           >
//             Forgot password?
//           </Link>
//           <div className="flex space-x-2">
//             {isLoading ? (
//               <button {...buttonProps} disabled>
//                 <i className="fa-solid fa-spinner animate-spin"></i>
//               </button>
//             ) : (
//               <button {...buttonProps}>Login</button>
//             )}

//             {isLoading ? (
//               <button
//                 type="button"
//                 onClick={() => handleLogin(loginData)}
//                 className={buttonProps.className}
//               >
//                 <i className="fa-solid fa-spinner animate-spin"></i>
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => handleLogin(loginData)}
//                 className={buttonProps.className}
//               >
//                 Demo Login
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
import { useFormik } from 'formik';
import apiClient from '../../../lib/api';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';
import { Helmet } from 'react-helmet';

export default function Login() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUserToken } = useContext(authContext);
  const navigate = useNavigate();

  const loginData = {
    email: 'test@gmail.com',
    password: 'Yash@9898',
  };

  function handleLogin(data) {
    setIsLoading(true);

    apiClient
      .post('/auth/signin', data)
      .then((res) => {
        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);

        setErr(null);
        setIsLoading(false);

        if (res.data.message === 'success') {
          navigate('/');
        }
      })
      .catch((err) => {
        setIsLoading(false);

        setErr(
          err.response?.data?.message ||
            'Unable to sign in. Check your connection and try again.'
        );
      });
  }

  const validate = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Email is not valid'),

    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handleLogin,
    validationSchema: validate,
  });

  return (
    <>
      <Helmet>
        <title>Login | PocketForm</title>
      </Helmet>

     <section className="relative h-[calc(100vh-82px)] min-h-0 overflow-hidden bg-[#06110e] text-white">

        {/* Background glow */}
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />

        {/* Decorative 3D shapes */}
        <div className="pointer-events-none absolute left-[7%] top-[15%] hidden lg:block">
          <div className="relative h-36 w-36 rotate-12 rounded-[32px] border border-emerald-300/20 bg-emerald-300/[0.04] shadow-[0_0_70px_rgba(16,185,129,.12)] backdrop-blur-sm">
            <div className="absolute inset-7 rotate-12 rounded-2xl border border-emerald-300/20" />
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl border border-emerald-300/30 bg-emerald-300/5" />
          </div>
        </div>

        <div className="pointer-events-none absolute right-[8%] top-[18%] hidden lg:block">
          <div className="h-20 w-20 rotate-[28deg] rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-md" />
        </div>

        <div className="pointer-events-none absolute bottom-[14%] left-[13%] hidden lg:block">
          <div className="h-16 w-16 rotate-45 rounded-xl border border-emerald-400/20 bg-emerald-400/5" />
        </div>

       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 py-5 lg:px-10">

          <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_500px]">

            {/* LEFT SIDE */}
            <div className="hidden lg:block">

              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                Your next print starts here
              </div>

              <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Bring your
                <span className="block text-emerald-400">
                  ideas to life.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">
                Sign in to explore your saved models, track orders and
                discover tiny things worth printing.
              </p>

              {/* 3D object */}
              <div className="relative mt-14 h-52 w-72">

                <div className="absolute bottom-3 left-8 h-28 w-28 rotate-12 rounded-[28px] border border-emerald-300/30 bg-gradient-to-br from-emerald-300/20 to-emerald-900/10 shadow-[0_25px_80px_rgba(16,185,129,.2)] backdrop-blur-xl">
                  <div className="absolute inset-5 rounded-2xl border border-white/10" />
                  <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-lg bg-emerald-300/20" />
                </div>

                <div className="absolute bottom-2 left-32 h-24 w-24 -rotate-12 rounded-[25px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl" />

                <div className="absolute bottom-0 left-0 h-1 w-64 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent blur-sm" />
              </div>

              <div className="mt-2 flex gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                  3D Printed
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                  Gift Ready
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                  Ships Fast
                </div>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div className="w-full">

              <div className="rounded-[30px] border border-white/10 bg-[#0b1915]/90 p-7 shadow-[0_30px_100px_rgba(0,0,0,.4)] backdrop-blur-2xl sm:p-9">

                {/* Mobile brand */}
                <div className="mb-8 lg:hidden">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#06110e]">
                      <i className="fa-solid fa-cube text-lg" />
                    </div>

                    <span className="text-xl font-bold">
                      Pocket<span className="text-emerald-400">Form</span>
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="mb-2 text-sm font-medium text-emerald-400">
                    WELCOME BACK
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Sign in to your account
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    Continue where your next print begins.
                  </p>
                </div>

                {err && (
                  <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {err}
                  </div>
                )}

                <form
                  method="post"
                  onSubmit={formik.handleSubmit}
                  className="space-y-5"
                >

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-white/60"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />

                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-emerald-400/5"
                      />
                    </div>

                    {formik.errors.email && formik.touched.email && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-white/60"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgotPassword"
                        className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />

                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-emerald-400/5"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/70"
                      >
                        <i
                          className={
                            showPassword
                              ? 'fa-solid fa-eye-slash'
                              : 'fa-solid fa-eye'
                          }
                        />
                      </button>
                    </div>

                    {formik.errors.password && formik.touched.password && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  {/* Login */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-[#04100d] shadow-[0_12px_35px_rgba(16,185,129,.18)] transition hover:bg-emerald-400 hover:shadow-[0_15px_45px_rgba(16,185,129,.28)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <i className="fa-solid fa-spinner animate-spin text-base" />
                    ) : (
                      <>
                        Sign in
                        <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Demo */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleLogin(loginData)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-semibold text-white/70 transition hover:border-emerald-400/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles mr-2 text-emerald-400" />
                    Try Demo Account
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-white/25">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <p className="text-center text-sm text-white/40">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Create one
                  </Link>
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}