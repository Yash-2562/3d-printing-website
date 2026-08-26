import { useFormik } from 'formik';
import apiClient from '../../../lib/api';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

export default function Register() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUserToken } = useContext(authContext);
  const navigate = useNavigate();

  function handleRegister(data) {
    setIsLoading(true);

    apiClient
      .post('/auth/signup', data)
      .then((res) => {
        setErr(null);

        toast.success('Account created successfully');

        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);

        setIsLoading(false);

        if (res.data.message === 'success') {
          navigate('/login');
        }
      })
      .catch((err) => {
        toast.error('Please try again');

        setIsLoading(false);

        setErr(
          err.response?.data?.message ||
            'Registration failed. Check your connection and try again.'
        );
      });
  }

  const validate = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),

    email: Yup.string()
      .required('Email is required')
      .email('Email is not valid'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Za-z]/, 'Password must contain at least one letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(
        /[!@#$%^&*(),.?":{}|<>+\-_]/,
        'Password must contain at least one special character'
      )
      .required('Password is required'),

    rePassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(
        /^[6-9][0-9]{9}$/,
        'Enter a valid 10-digit Indian mobile number'
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    onSubmit: handleRegister,
    validationSchema: validate,
  });

  const inputClass =
    'w-full h-[48px] rounded-[12px] border border-white/[0.11] bg-[#11211c] pl-11 pr-4 text-[14px] text-white/80 outline-none transition placeholder:text-white/25 focus:border-emerald-400/40 focus:bg-[#142720]';

  const smallInputClass =
    'w-full h-[48px] rounded-[12px] border border-white/[0.11] bg-[#11211c] pl-11 pr-10 text-[14px] text-white/80 outline-none transition placeholder:text-white/25 focus:border-emerald-400/40 focus:bg-[#142720]';

  return (
    <>
      <Helmet>
        <title>Create Account | PocketForm</title>
      </Helmet>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative min-h-[calc(100svh-100px)] overflow-x-hidden overflow-y-visible bg-[#03100c] text-white">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-[-180px] top-[150px] h-[520px] w-[520px] rounded-full bg-emerald-500/[0.09] blur-[130px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[250px] h-[500px] w-[500px] rounded-full bg-emerald-400/[0.045] blur-[130px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)',
            backgroundSize: '75px 75px',
          }}
        />

        {/* Left floating geometric shape */}
        <div className="pointer-events-none absolute left-[4%] top-[18%] hidden xl:block">
          <div className="relative h-[110px] w-[110px] rotate-[13deg] rounded-[28px] border border-emerald-400/20">
            <div className="absolute left-[17px] top-[17px] h-[76px] w-[76px] rotate-[12deg] rounded-[24px] border border-emerald-400/15" />
          </div>
        </div>

        {/* Right floating geometric shape */}
        <div className="pointer-events-none absolute right-[6%] top-[13%] hidden lg:block">
          <div className="h-[70px] w-[70px] rotate-45 rounded-[18px] border border-white/[0.08] bg-white/[0.015]" />
        </div>

        {/* Main content */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-100px)] max-w-[1280px] items-start px-6 py-8 lg:items-center lg:px-10 lg:py-10">

          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_590px] xl:gap-16">

            {/* =====================================================
                LEFT CONTENT
            ====================================================== */}
            <div className="hidden lg:block">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-[9px] text-[13px] font-medium text-emerald-300">
                <span className="h-[8px] w-[8px] rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
                Made for curious makers
              </div>

              {/* Heading */}
              <h1 className="max-w-[580px] text-[58px] font-bold leading-[1.02] tracking-[-2.5px] xl:text-[64px]">
                Create.
                <span className="block text-[#20d69a]">
                  Print.
                </span>
                <span className="block">
                  Keep it forever.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-[560px] text-[17px] leading-[1.75] text-white/45">
                Join PocketForm and discover small 3D-printed objects,
                personalized gifts and things you didn't know you needed.
              </p>

              {/* ===================================================
                  CSS 3D PRINTER
              ==================================================== */}
              <div className="relative mt-8 h-[255px] w-[500px]">

                {/* Floor glow */}
                <div className="absolute bottom-[13px] left-[25px] h-[22px] w-[420px] rounded-full bg-emerald-400/[0.12] blur-[20px]" />

                {/* Printer body */}
                <div className="absolute bottom-[25px] left-[45px] h-[210px] w-[270px] rounded-[28px] border border-white/[0.14] bg-gradient-to-br from-[#25302d] via-[#18211f] to-[#0d1513] shadow-[0_30px_70px_rgba(0,0,0,.55)]">

                  {/* top */}
                  <div className="absolute left-[18px] right-[18px] top-[15px] h-[42px] rounded-[14px] border border-white/[0.08] bg-[#1c2724]">
                    <div className="absolute left-[25px] top-[9px] h-[22px] w-[170px] rounded-[8px] border border-white/[0.06] bg-[#111a17]" />
                  </div>

                  {/* glass chamber */}
                  <div className="absolute left-[20px] top-[68px] h-[105px] w-[228px] overflow-hidden rounded-[9px] border border-emerald-300/[0.18] bg-[#07130f] shadow-inner">

                    {/* green chamber glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/[0.08] to-transparent" />

                    {/* rails */}
                    <div className="absolute left-[35px] right-[35px] top-[18px] h-[4px] rounded-full bg-[#68736f]/50" />

                    {/* print head */}
                    <div className="absolute left-[105px] top-[18px] h-[34px] w-[30px]">
                      <div className="mx-auto h-[20px] w-[20px] rounded-[5px] bg-[#69736f]" />
                      <div className="mx-auto h-[15px] w-[6px] bg-emerald-300/50" />
                    </div>

                    {/* build plate */}
                    <div className="absolute bottom-[15px] left-[30px] h-[8px] w-[168px] rounded-full bg-[#67716e]/60" />

                    {/* printed object */}
                    <div className="absolute bottom-[22px] left-[96px] h-[43px] w-[47px] rounded-[10px] border border-emerald-300/30 bg-gradient-to-br from-emerald-300/50 to-emerald-600/20 shadow-[0_0_30px_rgba(52,211,153,.25)]">
                      <div className="absolute bottom-0 left-[7px] h-[13px] w-[31px] rounded-b-[8px] bg-emerald-300/20" />
                    </div>
                  </div>

                  {/* base */}
                  <div className="absolute bottom-0 left-0 right-0 h-[30px] rounded-b-[28px] bg-[#111a18]">
                    <div className="absolute right-[20px] top-[5px] h-[18px] w-[42px] rounded-[6px] bg-[#23312d]">
                      <div className="absolute left-[8px] top-[6px] h-[6px] w-[6px] rounded-full bg-emerald-400" />
                      <div className="absolute left-[20px] top-[6px] h-[6px] w-[12px] rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Left printed object */}
                <div className="absolute bottom-[30px] left-0 h-[76px] w-[76px] rotate-[15deg] rounded-[22px] bg-gradient-to-br from-emerald-300/70 via-emerald-400/30 to-emerald-700/20 shadow-[0_20px_40px_rgba(16,185,129,.2)]">
                  <div className="absolute inset-[14px] rotate-[10deg] rounded-[15px] border border-white/10" />
                </div>

                {/* Right wireframe object */}
                <div className="absolute bottom-[52px] left-[345px] h-[92px] w-[92px] rounded-full border-[9px] border-white/[0.10] shadow-[inset_0_0_20px_rgba(255,255,255,.03)]">
                  <div className="absolute left-[15px] top-[20px] h-[48px] w-[48px] rotate-45 border border-emerald-300/20" />
                  <div className="absolute left-[28px] top-[7px] h-[65px] w-[35px] rotate-[25deg] rounded-full border border-white/[0.08]" />
                </div>

              </div>

              {/* Feature cards */}
              <div className="flex gap-4">

                <div className="flex h-[72px] w-[210px] items-center gap-4 rounded-[18px] border border-white/[0.09] bg-white/[0.025] px-5 backdrop-blur-md">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-emerald-400/[0.10] text-emerald-400">
                    <i className="fa-solid fa-cube text-[18px]" />
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-white/80">
                      3D Printed
                    </p>
                    <p className="mt-1 text-[11px] text-white/35">
                      Quality you can trust
                    </p>
                  </div>
                </div>

                <div className="flex h-[72px] w-[210px] items-center gap-4 rounded-[18px] border border-white/[0.09] bg-white/[0.025] px-5 backdrop-blur-md">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-emerald-400/[0.10] text-emerald-400">
                    <i className="fa-solid fa-gift text-[18px]" />
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-white/80">
                      Gift Ready
                    </p>
                    <p className="mt-1 text-[11px] text-white/35">
                      Perfect for every occasion
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* =====================================================
                REGISTER CARD
            ====================================================== */}
            <div className="w-full">

              <div className="mx-auto w-full max-w-[590px] rounded-[28px] border border-white/[0.11] bg-[#071712]/95 px-7 py-7 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl sm:px-9 sm:py-7">

                {/* Header */}
                <div className="mb-6">

                  <p className="mb-1 text-[14px] font-semibold tracking-wide text-emerald-400">
                    START PRINTING
                  </p>

                  <h2 className="text-[31px] font-bold tracking-[-1px] text-white">
                    Create your account
                  </h2>

                  <p className="mt-1 text-[14px] text-white/40">
                    Your little collection of things starts here.
                  </p>

                </div>

                {/* Error */}
                {err && (
                  <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {err}
                  </div>
                )}

                <form
                  method="post"
                  onSubmit={formik.handleSubmit}
                  className="space-y-4"
                >

                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[14px] font-semibold text-white/65"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />

                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    {formik.errors.name && formik.touched.name && (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[14px] font-semibold text-white/65"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />

                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>

                    {formik.errors.email && formik.touched.email && (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-[14px] font-semibold text-white/65"
                    >
                      Phone number
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-white/40">
                        +91
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        inputMode="numeric"
                        maxLength="10"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        placeholder="10 digit mobile number"
                        className={`${inputClass} pl-[60px]`}
                      />
                    </div>

                    {formik.errors.phone && formik.touched.phone && (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>

                  {/* PASSWORDS */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* PASSWORD */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-[14px] font-semibold text-white/65"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          placeholder="Create password"
                          className={smallInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/70"
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

                      {formik.errors.password &&
                        formik.touched.password && (
                          <p className="mt-1 text-xs text-red-400">
                            {formik.errors.password}
                          </p>
                        )}
                    </div>

                    {/* CONFIRM */}
                    <div>
                      <label
                        htmlFor="rePassword"
                        className="mb-2 block text-[14px] font-semibold text-white/65"
                      >
                        Confirm password
                      </label>

                      <div className="relative">
                        <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />

                        <input
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          name="rePassword"
                          id="rePassword"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.rePassword}
                          placeholder="Repeat password"
                          className={smallInputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/70"
                        >
                          <i
                            className={
                              showConfirmPassword
                                ? 'fa-solid fa-eye-slash'
                                : 'fa-solid fa-eye'
                            }
                          />
                        </button>
                      </div>

                      {formik.errors.rePassword &&
                        formik.touched.rePassword && (
                          <p className="mt-1 text-xs text-red-400">
                            {formik.errors.rePassword}
                          </p>
                        )}
                    </div>

                  </div>

                  {/* CREATE ACCOUNT */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group mt-1 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#16c892] text-[14px] font-bold text-[#02110c] shadow-[0_10px_30px_rgba(22,200,146,.16)] transition hover:bg-[#20d9a0] hover:shadow-[0_12px_35px_rgba(22,200,146,.25)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <i className="fa-solid fa-spinner animate-spin" />
                    ) : (
                      <>
                        Create account
                        <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="whitespace-nowrap text-[11px] font-medium text-white/30">
                    ALREADY A MEMBER?
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* SIGN IN */}
                <Link
                  to="/login"
                  className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-white/[0.18] bg-transparent text-[14px] font-semibold text-white/75 transition hover:border-emerald-400/40 hover:bg-white/[0.03] hover:text-white"
                >
                  Sign in to PocketForm
                </Link>

                {/* Disclaimer */}
                <p className="mx-auto mt-4 max-w-[400px] text-center text-[11px] leading-[1.5] text-white/35">
                  By creating an account, you can manage your
                  orders, saved models and PocketForm prints.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}