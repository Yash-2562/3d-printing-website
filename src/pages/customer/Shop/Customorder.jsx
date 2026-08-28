// import { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import apiClient from '../../../lib/api';
import loImage from '../../../assets/lo.png';

// const printTypes = [
//   {
//     id: 'mini',
//     title: 'Pocket Mini',
//     description: 'Small detailed keepsakes',
//     icon: 'fa-cube',
//   },
//   {
//     id: 'figure',
//     title: 'Mini Figure',
//     description: 'Turn a person into a figure',
//     icon: 'fa-user',
//   },
//   {
//     id: 'gift',
//     title: '3D Gift',
//     description: 'Something made to remember',
//     icon: 'fa-gift',
//   },
//   {
//     id: 'model',
//     title: 'Custom Model',
//     description: 'Objects, characters & ideas',
//     icon: 'fa-cubes',
//   },
// ];

// const sizes = [
//   {
//     id: 'small',
//     title: 'Pocket',
//     size: '5–7 cm',
//     price: 'From ₹499',
//   },
//   {
//     id: 'medium',
//     title: 'Standard',
//     size: '8–12 cm',
//     price: 'From ₹799',
//   },
//   {
//     id: 'large',
//     title: 'Display',
//     size: '13–20 cm',
//     price: 'From ₹1,299',
//   },
// ];

// export default function CustomOrder() {
//   const fileInputRef = useRef(null);

//   const [selectedType, setSelectedType] = useState('mini');
//   const [selectedSize, setSelectedSize] = useState('small');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [dragActive, setDragActive] = useState(false);
//   const [material, setMaterial] = useState('PLA');
//   const [color, setColor] = useState('White');
//   const [quantity, setQuantity] = useState(1);
//   const [notes, setNotes] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState('');

//   const handleFile = (file) => {
//     if (!file) return;

//     setUploadedFile({
//       file,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       preview: file.type.startsWith('image/')
//         ? URL.createObjectURL(file)
//         : null,
//     });
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragActive(false);

//     const file = e.dataTransfer.files?.[0];

//     if (file) {
//       handleFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitError('');
//     const formData = new FormData();
//     formData.append('printType', selectedType);
//     formData.append('size', selectedSize);
//     formData.append('material', material);
//     formData.append('color', color);
//     formData.append('quantity', quantity);
//     formData.append('notes', notes);
//     if (uploadedFile?.file) formData.append('file', uploadedFile.file);
//     try {
//       await apiClient.post('/custom-requests', formData);
//       setSubmitted(true);
//       setTimeout(() => setSubmitted(false), 4000);
//     } catch (error) {
//       setSubmitError(error.response?.data?.message || 'Unable to create custom order.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-transparent">

//       {/* =========================================================
//           BACKGROUND
//       ========================================================== */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">

//         <div className="absolute -left-40 top-24 h-[450px] w-[450px] rounded-full bg-emerald-200/20 blur-[130px]" />

//         <div className="absolute -right-40 top-[38%] h-[520px] w-[520px] rounded-full bg-green-200/20 blur-[140px]" />

//         <div className="absolute left-[45%] bottom-[-180px] h-[450px] w-[450px] rounded-full bg-emerald-100/20 blur-[120px]" />

//         {/* perspective grid */}

//         <div
//           className="absolute -bottom-64 left-1/2 h-[600px] w-[1400px] -translate-x-1/2 opacity-[0.07]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(16,185,129,.55) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(16,185,129,.55) 1px, transparent 1px)
//             `,
//             backgroundSize: '55px 55px',
//             transform:
//               'translateX(-50%) perspective(650px) rotateX(65deg)',
//           }}
//         />

//         {/* floating objects */}

//         <div
//           className="absolute left-[4%] top-[25%] hidden h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/[0.07] bg-white/50 text-emerald-700/[0.08] lg:flex"
//           style={{
//             transform:
//               'perspective(500px) rotateX(20deg) rotateY(-25deg) rotateZ(-10deg)',
//           }}
//         >
//           <i className="fa-solid fa-cube text-4xl" />
//         </div>

//         <div
//           className="absolute right-[4%] top-[32%] hidden h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-500/[0.06] bg-white/50 text-emerald-700/[0.07] lg:flex"
//           style={{
//             transform:
//               'perspective(500px) rotateX(15deg) rotateY(20deg) rotateZ(8deg)',
//           }}
//         >
//           <i className="fa-solid fa-gift text-5xl" />
//         </div>

//       </div>


//       {/* =========================================================
//           PAGE
//       ========================================================== */}

//       <div className="relative z-10 mx-auto max-w-screen-xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">

//         {/* =====================================================
//             HERO
//         ====================================================== */}

//         <section className="mb-10">

//           <motion.div
//             initial={{ opacity: 0, y: 22 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//               duration: 0.75,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//             className="max-w-3xl"
//           >

//             <div className="mb-5 flex items-center gap-3">

//               <span className="h-px w-9 bg-emerald-600" />

//               <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
//                 CUSTOM 3D STUDIO
//               </span>

//             </div>

//             <h1 className="text-4xl font-black tracking-[-0.045em] text-slate-900 sm:text-5xl md:text-6xl">

//               Your idea.
//               <br />

//               <span className="text-emerald-600">
//                 Made tangible.
//               </span>

//             </h1>

//             <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//               Upload a photo, model or simply tell us what you&apos;re
//               imagining. We&apos;ll turn it into a pocket-size 3D print
//               designed specially for you.
//             </p>

//           </motion.div>


//           {/* process */}

//           <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:gap-5">

//             {[
//               ['01', 'Upload', 'Your idea'],
//               ['02', 'Customize', 'Your print'],
//               ['03', 'Create', 'We print it'],
//             ].map(([number, title, description]) => (

//               <div
//                 key={number}
//                 className="flex items-center gap-2 sm:gap-3"
//               >

//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 sm:h-9 sm:w-9">
//                   {number}
//                 </div>

//                 <div>
//                   <p className="text-[10px] font-bold text-slate-800 sm:text-xs">
//                     {title}
//                   </p>

//                   <p className="text-[9px] text-slate-400 sm:text-[10px]">
//                     {description}
//                   </p>
//                 </div>

//               </div>

//             ))}

//           </div>

//         </section>


//         {/* =====================================================
//             MAIN STUDIO
//         ====================================================== */}

//         <form onSubmit={handleSubmit}>

//           <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">


//             {/* =================================================
//                 LEFT — CREATION FORM
//             ================================================== */}

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               className="space-y-6"
//             >


//               {/* ===============================================
//                   UPLOAD
//               ================================================ */}

//               <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

//                 <div className="mb-5">

//                   <div className="flex items-center gap-3">

//                     <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
//                       <i className="fa-solid fa-cloud-arrow-up text-sm" />
//                     </span>

//                     <div>
//                       <h2 className="text-sm font-black text-slate-900">
//                         Upload your idea
//                       </h2>

//                       <p className="mt-0.5 text-[10px] text-slate-400">
//                         Photo, 3D model or reference image
//                       </p>
//                     </div>

//                   </div>

//                 </div>


//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                     setDragActive(true);
//                   }}
//                   onDragLeave={() => setDragActive(false)}
//                   onDrop={handleDrop}
//                   className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all sm:p-10 ${
//                     dragActive
//                       ? 'border-emerald-500 bg-emerald-50'
//                       : 'border-slate-200 bg-slate-50/60 hover:border-emerald-300 hover:bg-emerald-50/40'
//                   }`}
//                 >

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*,.stl,.obj,.3mf,.glb,.gltf"
//                     className="hidden"
//                     onChange={(e) => handleFile(e.target.files?.[0])}
//                   />


//                   {uploadedFile ? (

//                     <div className="flex flex-col items-center">

//                       {uploadedFile.preview ? (

//                         <div className="mb-4 h-24 w-24 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg">
//                           <img
//                             src={uploadedFile.preview}
//                             alt="Uploaded preview"
//                             className="h-full w-full object-cover"
//                           />
//                         </div>

//                       ) : (

//                         <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
//                           <i className="fa-solid fa-cube text-3xl" />
//                         </div>

//                       )}

//                       <p className="max-w-full truncate px-4 text-sm font-bold text-slate-800">
//                         {uploadedFile.name}
//                       </p>

//                       <p className="mt-1 text-[10px] text-emerald-600">
//                         File ready • Click to replace
//                       </p>

//                     </div>

//                   ) : (

//                     <>

//                       <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md transition-transform duration-300 group-hover:-translate-y-1">

//                         <i className="fa-solid fa-arrow-up-from-bracket text-xl" />

//                       </div>

//                       <p className="text-sm font-bold text-slate-800">
//                         Drop your file here
//                       </p>

//                       <p className="mt-1 text-xs text-slate-400">
//                         or click to browse your device
//                       </p>

//                       <div className="mt-4 flex flex-wrap justify-center gap-2">

//                         {['JPG', 'PNG', 'STL', 'OBJ', '3MF'].map((type) => (

//                           <span
//                             key={type}
//                             className="rounded-md bg-white px-2 py-1 text-[8px] font-bold text-slate-400 shadow-sm"
//                           >
//                             {type}
//                           </span>

//                         ))}

//                       </div>

//                     </>

//                   )}

//                 </div>

//               </div>


//               {/* ===============================================
//                   PRINT TYPE
//               ================================================ */}

//               <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

//                 <div className="mb-5">

//                   <h2 className="text-sm font-black text-slate-900">
//                     What are we making?
//                   </h2>

//                   <p className="mt-1 text-[10px] text-slate-400">
//                     Choose the closest match
//                   </p>

//                 </div>


//                 <div className="grid grid-cols-2 gap-3">

//                   {printTypes.map((type) => {

//                     const active = selectedType === type.id;

//                     return (
//                       <button
//                         key={type.id}
//                         type="button"
//                         onClick={() => setSelectedType(type.id)}
//                         className={`group rounded-2xl border-2 p-4 text-left transition-all ${
//                           active
//                             ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
//                             : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
//                         }`}
//                       >

//                         <div
//                           className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
//                             active
//                               ? 'bg-emerald-600 text-white'
//                               : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
//                           }`}
//                         >
//                           <i className={`fa-solid ${type.icon} text-sm`} />
//                         </div>

//                         <p className="text-xs font-bold text-slate-900">
//                           {type.title}
//                         </p>

//                         <p className="mt-1 text-[9px] leading-4 text-slate-400">
//                           {type.description}
//                         </p>

//                       </button>
//                     );
//                   })}

//                 </div>

//               </div>


//               {/* ===============================================
//                   SIZE
//               ================================================ */}

//               <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

//                 <div className="mb-5">

//                   <h2 className="text-sm font-black text-slate-900">
//                     Choose your size
//                   </h2>

//                   <p className="mt-1 text-[10px] text-slate-400">
//                     Bigger prints reveal more detail
//                   </p>

//                 </div>


//                 <div className="grid grid-cols-3 gap-3">

//                   {sizes.map((size) => {

//                     const active = selectedSize === size.id;

//                     return (
//                       <button
//                         key={size.id}
//                         type="button"
//                         onClick={() => setSelectedSize(size.id)}
//                         className={`relative rounded-2xl border-2 p-4 text-center transition-all ${
//                           active
//                             ? 'border-emerald-500 bg-emerald-50 shadow-sm'
//                             : 'border-slate-200 bg-white hover:border-emerald-200'
//                         }`}
//                       >

//                         {active && (
//                           <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
//                             <i className="fa-solid fa-check text-[7px]" />
//                           </span>
//                         )}

//                         <div
//                           className={`mx-auto mb-3 flex items-end justify-center ${
//                             size.id === 'small'
//                               ? 'h-9 w-7'
//                               : size.id === 'medium'
//                               ? 'h-12 w-9'
//                               : 'h-14 w-11'
//                           } rounded-lg border-2 ${
//                             active
//                               ? 'border-emerald-500 bg-emerald-100'
//                               : 'border-slate-300 bg-slate-100'
//                           }`}
//                         />

//                         <p className="text-xs font-bold text-slate-800">
//                           {size.title}
//                         </p>

//                         <p className="mt-1 text-[9px] text-slate-400">
//                           {size.size}
//                         </p>

//                         <p className="mt-2 text-[9px] font-bold text-emerald-600">
//                           {size.price}
//                         </p>

//                       </button>
//                     );
//                   })}

//                 </div>

//               </div>


//               {/* ===============================================
//                   DETAILS
//               ================================================ */}

//               <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

//                 <div className="mb-5">

//                   <h2 className="text-sm font-black text-slate-900">
//                     Make it yours
//                   </h2>

//                   <p className="mt-1 text-[10px] text-slate-400">
//                     Tell us how you want your print finished
//                   </p>

//                 </div>


//                 <div className="grid gap-5 sm:grid-cols-2">

//                   <div>

//                     <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Material
//                     </label>

//                     <select
//                       value={material}
//                       onChange={(e) => setMaterial(e.target.value)}
//                       className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
//                     >
//                       <option>PLA</option>
//                       <option>Resin</option>
//                       <option>Silk PLA</option>
//                       <option>Matte PLA</option>
//                     </select>

//                   </div>


//                   <div>

//                     <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Colour
//                     </label>

//                     <select
//                       value={color}
//                       onChange={(e) => setColor(e.target.value)}
//                       className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
//                     >
//                       <option>White</option>
//                       <option>Black</option>
//                       <option>Green</option>
//                       <option>Blue</option>
//                       <option>Red</option>
//                       <option>Custom colour</option>
//                     </select>

//                   </div>

//                 </div>


//                 <div className="mt-5">

//                   <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Quantity
//                   </label>

//                   <div className="flex w-fit items-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white">

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setQuantity((value) => Math.max(1, value - 1))
//                       }
//                       className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
//                     >
//                       <i className="fa-solid fa-minus text-[9px]" />
//                     </button>

//                     <span className="flex h-10 w-12 items-center justify-center border-x-2 border-slate-200 text-sm font-bold text-slate-800">
//                       {quantity}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setQuantity((value) => value + 1)
//                       }
//                       className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
//                     >
//                       <i className="fa-solid fa-plus text-[9px]" />
//                     </button>

//                   </div>

//                 </div>


//                 <div className="mt-5">

//                   <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Anything we should know?
//                   </label>

//                   <textarea
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     rows={4}
//                     placeholder="Tell us about your idea, preferred pose, colours, details..."
//                     className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
//                   />

//                 </div>

//               </div>

//             </motion.div>


//             {/* =================================================
//                 RIGHT — 3D PREVIEW / SUMMARY
//             ================================================== */}

//             <motion.aside
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{
//                 duration: 0.8,
//                 delay: 0.1,
//               }}
//               className="lg:sticky lg:top-[125px] lg:self-start"
//             >

//               <div className="overflow-hidden rounded-[30px] border-2 border-slate-200/85 bg-white/80 shadow-[0_25px_70px_rgba(15,23,42,.10)] backdrop-blur-md">


//                 {/* ===========================================
//                     3D PREVIEW
//                 ============================================ */}

//                 <div className="relative h-[330px] overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/60 to-white sm:h-[390px]">

//                   {/* perspective rings */}

//                   <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

//                   <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/10" />


//                   {/* floor */}

//                   <div
//                     className="absolute bottom-[-100px] left-1/2 h-64 w-[600px] -translate-x-1/2 opacity-[0.12]"
//                     style={{
//                       backgroundImage: `
//                         linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
//                         linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
//                       `,
//                       backgroundSize: '35px 35px',
//                       transform:
//                         'translateX(-50%) perspective(400px) rotateX(65deg)',
//                     }}
//                   />


//                   {/* 3D object */}

//                   <motion.div
//                     animate={{
//                       y: [0, -10, 0],
//                       rotateY: [-12, 12, -12],
//                       rotateX: [4, 8, 4],
//                     }}
//                     transition={{
//                       duration: 7,
//                       repeat: Infinity,
//                       ease: 'easeInOut',
//                     }}
//                     className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[38px] border border-white/80 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 shadow-[0_30px_60px_rgba(15,23,42,.15)] sm:h-48 sm:w-48"
//                     style={{
//                       transformStyle: 'preserve-3d',
//                     }}
//                   >

//                     <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-500 shadow-[0_25px_40px_rgba(16,185,129,.25)] sm:h-28 sm:w-28">

//                       <i
//                         className={`fa-solid ${
//                           printTypes.find(
//                             (item) => item.id === selectedType
//                           )?.icon || 'fa-cube'
//                         } text-4xl text-white/90`}
//                       />

//                     </div>

//                   </motion.div>


//                   {/* preview label */}

//                   <div className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[9px] font-bold text-emerald-700 shadow-sm backdrop-blur-md">
//                     3D PREVIEW
//                   </div>


//                   {/* status */}

//                   <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[9px] font-bold text-slate-600 shadow-sm backdrop-blur-md">

//                     <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

//                     Ready to create

//                   </div>

//                 </div>


//                 {/* ===========================================
//                     SUMMARY
//                 ============================================ */}

//                 <div className="p-5 sm:p-7">

//                   <div className="mb-6">

//                     <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">
//                       Your creation
//                     </p>

//                     <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
//                       Custom {printTypes.find(
//                         (item) => item.id === selectedType
//                       )?.title}
//                     </h2>

//                   </div>


//                   {/* details */}

//                   <div className="space-y-3">

//                     <div className="flex items-center justify-between">

//                       <span className="text-xs text-slate-400">
//                         Size
//                       </span>

//                       <span className="text-xs font-bold text-slate-700">
//                         {
//                           sizes.find(
//                             (item) => item.id === selectedSize
//                           )?.title
//                         }
//                       </span>

//                     </div>

//                     <div className="flex items-center justify-between">

//                       <span className="text-xs text-slate-400">
//                         Material
//                       </span>

//                       <span className="text-xs font-bold text-slate-700">
//                         {material}
//                       </span>

//                     </div>

//                     <div className="flex items-center justify-between">

//                       <span className="text-xs text-slate-400">
//                         Colour
//                       </span>

//                       <span className="text-xs font-bold text-slate-700">
//                         {color}
//                       </span>

//                     </div>

//                     <div className="flex items-center justify-between">

//                       <span className="text-xs text-slate-400">
//                         Quantity
//                       </span>

//                       <span className="text-xs font-bold text-slate-700">
//                         × {quantity}
//                       </span>

//                     </div>

//                   </div>


//                   {/* estimate */}

//                   <div className="my-6 border-t border-slate-100 pt-5">

//                     <div className="flex items-end justify-between">

//                       <div>

//                         <p className="text-[9px] uppercase tracking-wider text-slate-400">
//                           Estimated starting price
//                         </p>

//                         <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
//                           ₹
//                           {selectedSize === 'small'
//                             ? 499 * quantity
//                             : selectedSize === 'medium'
//                             ? 799 * quantity
//                             : 1299 * quantity}
//                         </p>

//                       </div>

//                       <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-600">
//                         Final quote after review
//                       </span>

//                     </div>

//                   </div>


//                   {/* submit */}

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-black text-white shadow-xl shadow-slate-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-emerald-600/20"
//                   >

//                     {isSubmitting ? 'Sending...' : 'Send custom request'}

//                     <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
//                       <i className="fa-solid fa-arrow-right text-[10px]" />
//                     </span>

//                   </button>

//                   {submitError && <p className="mt-3 text-center text-xs text-red-600" role="alert">{submitError}</p>}


//                   <p className="mt-3 text-center text-[9px] leading-4 text-slate-400">
//                     No payment required yet. We&apos;ll review your idea
//                     and confirm the final price before printing.
//                   </p>

//                 </div>

//               </div>


//               {/* trust points */}

//               <div className="mt-4 grid grid-cols-3 gap-2">

//                 <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

//                   <i className="fa-solid fa-print text-sm text-emerald-500" />

//                   <p className="mt-2 text-[9px] font-bold text-slate-600">
//                     Precision
//                   </p>

//                 </div>

//                 <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

//                   <i className="fa-solid fa-box text-sm text-emerald-500" />

//                   <p className="mt-2 text-[9px] font-bold text-slate-600">
//                     Safe shipping
//                   </p>

//                 </div>

//                 <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

//                   <i className="fa-solid fa-headset text-sm text-emerald-500" />

//                   <p className="mt-2 text-[9px] font-bold text-slate-600">
//                     Human review
//                   </p>

//                 </div>

//               </div>

//             </motion.aside>

//           </div>


//           {/* =====================================================
//               BOTTOM MESSAGE
//           ====================================================== */}

//           {submitted && (

//             <motion.div
//               initial={{ opacity: 0, y: 20, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,.15)]"
//             >

//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">

//                 <i className="fa-solid fa-check" />

//               </div>

//               <div>

//                 <p className="text-sm font-bold text-slate-900">
//                   Request received!
//                 </p>

//                 <p className="mt-1 text-[10px] text-slate-400">
//                   We&apos;ll review your creation details.
//                 </p>

//               </div>

//             </motion.div>

//           )}

//       </form>

//     </div>

//     </div>
//   );
// }

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../../lib/api';

const printTypes = [
  {
    id: 'mini',
    title: 'Pocket Mini',
    description: 'Small detailed keepsakes',
    icon: 'fa-cube',
  },
  {
    id: 'figure',
    title: 'Mini Figure',
    description: 'Turn a person into a figure',
    icon: 'fa-user',
  },
  {
    id: 'gift',
    title: '3D Gift',
    description: 'Something made to remember',
    icon: 'fa-gift',
  },
  {
    id: 'model',
    title: 'Custom Model',
    description: 'Objects, characters & ideas',
    icon: 'fa-cubes',
  },
];

const sizes = [
  {
    id: 'small',
    title: 'Pocket',
    size: '5–7 cm',
    price: 'From ₹499',
  },
  {
    id: 'medium',
    title: 'Standard',
    size: '8–12 cm',
    price: 'From ₹799',
  },
  {
    id: 'large',
    title: 'Display',
    size: '13–20 cm',
    price: 'From ₹1,299',
  },
];

export default function CustomOrder() {
  const fileInputRef = useRef(null);

  const [selectedType, setSelectedType] = useState('mini');
  const [selectedSize, setSelectedSize] = useState('small');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [material, setMaterial] = useState('PLA');
  const [color, setColor] = useState('White');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fake-3D preview controls. The uploaded 2D image is shown instantly
  // as a perspective card; no upload/AI processing is required.
  const [previewRotation, setPreviewRotation] = useState(0);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const previewDragRef = useRef({
    active: false,
    startX: 0,
    startRotation: 0,
  });

  const handleFile = (file) => {
    if (!file) return;

    // Image previews are generated locally, so the right-side preview updates
    // immediately without waiting for the backend.
    setPreviewRotation(0);
    setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null,
    });
  };

  const handlePreviewPointerDown = (e) => {
    if (!uploadedFile) return;

    e.currentTarget.setPointerCapture?.(e.pointerId);
    previewDragRef.current = {
      active: true,
      startX: e.clientX,
      startRotation: previewRotation,
    };
    setIsDraggingPreview(true);
  };

  const handlePreviewPointerMove = (e) => {
    if (!previewDragRef.current.active) return;

    const delta = e.clientX - previewDragRef.current.startX;
    const nextRotation = previewDragRef.current.startRotation + delta * 0.35;

    setPreviewRotation(Math.max(-32, Math.min(32, nextRotation)));
  };

  const handlePreviewPointerUp = (e) => {
    previewDragRef.current.active = false;
    setIsDraggingPreview(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    const formData = new FormData();
    formData.append('printType', selectedType);
    formData.append('size', selectedSize);
    formData.append('material', material);
    formData.append('color', color);
    formData.append('quantity', quantity);
    formData.append('notes', notes);
    if (uploadedFile?.file) formData.append('file', uploadedFile.file);
    try {
      await apiClient.post('/custom-requests', formData);
      if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to create custom order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-24 h-[450px] w-[450px] rounded-full bg-emerald-200/20 blur-[130px]" />

        <div className="absolute -right-40 top-[38%] h-[520px] w-[520px] rounded-full bg-green-200/20 blur-[140px]" />

        <div className="absolute left-[45%] bottom-[-180px] h-[450px] w-[450px] rounded-full bg-emerald-100/20 blur-[120px]" />

        {/* perspective grid */}

        <div
          className="absolute -bottom-64 left-1/2 h-[600px] w-[1400px] -translate-x-1/2 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,.55) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,.55) 1px, transparent 1px)
            `,
            backgroundSize: '55px 55px',
            transform:
              'translateX(-50%) perspective(650px) rotateX(65deg)',
          }}
        />

        {/* floating objects */}

        <div
          className="absolute left-[4%] top-[25%] hidden h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/[0.07] bg-white/50 text-emerald-700/[0.08] lg:flex"
          style={{
            transform:
              'perspective(500px) rotateX(20deg) rotateY(-25deg) rotateZ(-10deg)',
          }}
        >
          <i className="fa-solid fa-cube text-4xl" />
        </div>

        <div
          className="absolute right-[4%] top-[32%] hidden h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-500/[0.06] bg-white/50 text-emerald-700/[0.07] lg:flex"
          style={{
            transform:
              'perspective(500px) rotateX(15deg) rotateY(20deg) rotateZ(8deg)',
          }}
        >
          <i className="fa-solid fa-gift text-5xl" />
        </div>

      </div>


      {/* =========================================================
          PAGE
      ========================================================== */}

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="mb-10">

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-3xl"
          >

            <div className="mb-5 flex items-center gap-3">

              <span className="h-px w-9 bg-emerald-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                CUSTOM 3D STUDIO
              </span>

            </div>

            <h1 className="text-4xl font-black tracking-[-0.045em] text-slate-900 sm:text-5xl md:text-6xl">

              Your idea.
              <br />

              <span className="text-emerald-600">
                Made tangible.
              </span>

            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Upload a photo, model or simply tell us what you&apos;re
              imagining. We&apos;ll turn it into a pocket-size 3D print
              designed specially for you.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative hidden overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10 sm:block"
          >
            <img
              src={loImage}
              alt="3D printer creating a custom model"
              className="h-64 w-full object-cover lg:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-5 text-sm font-bold text-white">From sketch to something real.</p>
          </motion.div>
          </div>


          {/* process */}

          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:gap-5">

            {[
              ['01', 'Upload', 'Your idea'],
              ['02', 'Customize', 'Your print'],
              ['03', 'Create', 'We print it'],
            ].map(([number, title, description]) => (

              <div
                key={number}
                className="flex items-center gap-2 sm:gap-3"
              >

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 sm:h-9 sm:w-9">
                  {number}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-800 sm:text-xs">
                    {title}
                  </p>

                  <p className="text-[9px] text-slate-400 sm:text-[10px]">
                    {description}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </section>


        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-900 shadow-sm">
          <i className="fa-solid fa-clipboard-check mt-0.5 text-emerald-600" />
          <p><strong>Every custom order is reviewed before processing.</strong> We&apos;ll check your model, selected options, and notes, then confirm the final quote before printing.</p>
        </div>


        {/* =====================================================
            MAIN STUDIO
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">


            {/* =================================================
                LEFT — CREATION FORM
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >


              {/* ===============================================
                  UPLOAD
              ================================================ */}

              <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

                <div className="mb-5">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <i className="fa-solid fa-cloud-arrow-up text-sm" />
                    </span>

                    <div>
                      <h2 className="text-sm font-black text-slate-900">
                        Upload your idea
                      </h2>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Photo, 3D model or reference image
                      </p>
                    </div>

                  </div>

                </div>


                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all sm:p-10 ${
                    dragActive
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50/60 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.stl,.obj,.3mf,.glb,.gltf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />


                  {uploadedFile ? (

                    <div className="flex flex-col items-center">

                      {uploadedFile.preview ? (

                        <div className="mb-4 h-24 w-24 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg">
                          <img
                            src={uploadedFile.preview}
                            alt="Uploaded preview"
                            className="h-full w-full object-cover"
                          />
                        </div>

                      ) : (

                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                          <i className="fa-solid fa-cube text-3xl" />
                        </div>

                      )}

                      <p className="max-w-full truncate px-4 text-sm font-bold text-slate-800">
                        {uploadedFile.name}
                      </p>

                      <p className="mt-1 text-[10px] text-emerald-600">
                        File ready • Click to replace
                      </p>

                    </div>

                  ) : (

                    <>

                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md transition-transform duration-300 group-hover:-translate-y-1">

                        <i className="fa-solid fa-arrow-up-from-bracket text-xl" />

                      </div>

                      <p className="text-sm font-bold text-slate-800">
                        Drop your file here
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        or click to browse your device
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center gap-2">

                        {['JPG', 'PNG', 'STL', 'OBJ', '3MF'].map((type) => (

                          <span
                            key={type}
                            className="rounded-md bg-white px-2 py-1 text-[8px] font-bold text-slate-400 shadow-sm"
                          >
                            {type}
                          </span>

                        ))}

                      </div>

                    </>

                  )}

                </div>

              </div>


              {/* ===============================================
                  PRINT TYPE
              ================================================ */}

              <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

                <div className="mb-5">

                  <h2 className="text-sm font-black text-slate-900">
                    What are we making?
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Choose the closest match
                  </p>

                </div>


                <div className="grid grid-cols-2 gap-3">

                  {printTypes.map((type) => {

                    const active = selectedType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`group rounded-2xl border-2 p-4 text-left transition-all ${
                          active
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
                        }`}
                      >

                        <div
                          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                            active
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                          }`}
                        >
                          <i className={`fa-solid ${type.icon} text-sm`} />
                        </div>

                        <p className="text-xs font-bold text-slate-900">
                          {type.title}
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-400">
                          {type.description}
                        </p>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* ===============================================
                  SIZE
              ================================================ */}

              <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

                <div className="mb-5">

                  <h2 className="text-sm font-black text-slate-900">
                    Choose your size
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Bigger prints reveal more detail
                  </p>

                </div>


                <div className="grid grid-cols-3 gap-3">

                  {sizes.map((size) => {

                    const active = selectedSize === size.id;

                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        className={`relative rounded-2xl border-2 p-4 text-center transition-all ${
                          active
                            ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-emerald-200'
                        }`}
                      >

                        {active && (
                          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <i className="fa-solid fa-check text-[7px]" />
                          </span>
                        )}

                        <div
                          className={`mx-auto mb-3 flex items-end justify-center ${
                            size.id === 'small'
                              ? 'h-9 w-7'
                              : size.id === 'medium'
                              ? 'h-12 w-9'
                              : 'h-14 w-11'
                          } rounded-lg border-2 ${
                            active
                              ? 'border-emerald-500 bg-emerald-100'
                              : 'border-slate-300 bg-slate-100'
                          }`}
                        />

                        <p className="text-xs font-bold text-slate-800">
                          {size.title}
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          {size.size}
                        </p>

                        <p className="mt-2 text-[9px] font-bold text-emerald-600">
                          {size.price}
                        </p>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* ===============================================
                  DETAILS
              ================================================ */}

              <div className="rounded-[26px] border-2 border-slate-200/85 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-7">

                <div className="mb-5">

                  <h2 className="text-sm font-black text-slate-900">
                    Make it yours
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Tell us how you want your print finished
                  </p>

                </div>


                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Material
                    </label>

                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option>PLA</option>
                      <option>Resin</option>
                      <option>Silk PLA</option>
                      <option>Matte PLA</option>
                    </select>

                  </div>


                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Colour
                    </label>

                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option>White</option>
                      <option>Black</option>
                      <option>Green</option>
                      <option>Blue</option>
                      <option>Red</option>
                      <option>Custom colour</option>
                    </select>

                  </div>

                </div>


                <div className="mt-5">

                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Quantity
                  </label>

                  <div className="flex w-fit items-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-minus text-[9px]" />
                    </button>

                    <span className="flex h-10 w-12 items-center justify-center border-x-2 border-slate-200 text-sm font-bold text-slate-800">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) => value + 1)
                      }
                      className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-plus text-[9px]" />
                    </button>

                  </div>

                </div>


                <div className="mt-5">

                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Anything we should know?
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your idea, preferred pose, colours, details..."
                    className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

              </div>

            </motion.div>


            {/* =================================================
                RIGHT — 3D PREVIEW / SUMMARY
            ================================================== */}

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
              className="lg:sticky lg:top-[125px] lg:self-start"
            >

              <div className="overflow-hidden rounded-[30px] border-2 border-slate-200/85 bg-white/80 shadow-[0_25px_70px_rgba(15,23,42,.10)] backdrop-blur-md">


                {/* ===========================================
                    3D PREVIEW
                ============================================ */}

                <div className="relative h-[330px] overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/60 to-white sm:h-[390px]">

                  {/* perspective rings */}

                  <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

                  <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/10" />


                  {/* floor */}

                  <div
                    className="absolute bottom-[-100px] left-1/2 h-64 w-[600px] -translate-x-1/2 opacity-[0.12]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
                      `,
                      backgroundSize: '35px 35px',
                      transform:
                        'translateX(-50%) perspective(400px) rotateX(65deg)',
                    }}
                  />


                  {/* =====================================================
                      FAKE 3D IMAGE PREVIEW

                      For an uploaded JPG/PNG/WebP, we do not wait for the
                      backend. The browser already has the local object URL,
                      so the exact uploaded photo appears here immediately.
                      It is presented as a 3D card using CSS perspective,
                      depth layers, shadow and a small floating animation.
                  ====================================================== */}
                  {uploadedFile ? (
                    <div
                      className={`absolute inset-0 flex items-center justify-center [touch-action:none] ${
                        isDraggingPreview ? 'cursor-grabbing' : 'cursor-grab'
                      }`}
                      onPointerDown={handlePreviewPointerDown}
                      onPointerMove={handlePreviewPointerMove}
                      onPointerUp={handlePreviewPointerUp}
                      onPointerCancel={handlePreviewPointerUp}
                    >
                      <motion.div
                        animate={{
                          y: isDraggingPreview ? 0 : [0, -8, 0],
                          rotateY: previewRotation,
                          rotateX: 3,
                        }}
                        transition={
                          isDraggingPreview
                            ? { duration: 0 }
                            : {
                                y: {
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                },
                                rotateY: { duration: 0.12, ease: 'linear' },
                              }
                        }
                        className="relative h-[245px] w-[175px] sm:h-[285px] sm:w-[205px]"
                        style={{
                          transformStyle: 'preserve-3d',
                          perspective: '1200px',
                        }}
                      >
                        {/* Back/depth layer */}
                        <div
                          className="absolute inset-0 translate-x-3 translate-y-2 rounded-[28px] bg-slate-400/80 shadow-[0_25px_45px_rgba(15,23,42,.20)]"
                          style={{ transform: 'translateZ(-14px)' }}
                        />

                        {/* Right-side thickness */}
                        <div
                          className="absolute right-[-12px] top-3 h-[calc(100%-12px)] w-4 rounded-r-[10px] bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500"
                          style={{ transform: 'translateZ(-4px)' }}
                        />

                        {/* Uploaded image or a 3D-file placeholder */}
                        <div
                          className="relative h-full w-full overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_30px_70px_rgba(15,23,42,.25)]"
                          style={{ transform: 'translateZ(14px)' }}
                        >
                          {uploadedFile.preview ? (
                            <img
                              src={uploadedFile.preview}
                              alt="3D preview of uploaded idea"
                              className="h-full w-full object-cover"
                              draggable="false"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-slate-100 px-5 text-center">
                              <span className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-500 text-white shadow-[0_20px_35px_rgba(16,185,129,.25)]">
                                <i className="fa-solid fa-cube text-4xl" />
                              </span>
                              <span className="max-w-full truncate text-xs font-bold text-slate-700">
                                {uploadedFile.name}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-emerald-600">
                                3D model ready for review
                              </span>
                            </div>
                          )}

                          {/* Soft glass highlight */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-emerald-900/10" />
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotateY: [-12, 12, -12],
                        rotateX: [4, 8, 4],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[38px] border border-white/80 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 shadow-[0_30px_60px_rgba(15,23,42,.15)] sm:h-48 sm:w-48"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-500 shadow-[0_25px_40px_rgba(16,185,129,.25)] sm:h-28 sm:w-28">
                        <i
                          className={`fa-solid ${
                            printTypes.find(
                              (item) => item.id === selectedType
                            )?.icon || 'fa-cube'
                          } text-4xl text-white/90`}
                        />
                      </div>
                    </motion.div>
                  )}


                  {/* preview label */}

                  <div className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[9px] font-bold text-emerald-700 shadow-sm backdrop-blur-md">
                    3D PREVIEW
                  </div>


                  {/* status */}

                  <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[9px] font-bold text-slate-600 shadow-sm backdrop-blur-md">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    Ready to create

                  </div>

                  {uploadedFile && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-[9px] font-bold text-slate-500 shadow-sm backdrop-blur-md">
                      <i className="fa-solid fa-arrows-left-right mr-2 text-emerald-500" />
                      {isDraggingPreview ? 'Rotate preview' : 'Drag to rotate'}
                    </div>
                  )}

                </div>


                {/* ===========================================
                    SUMMARY
                ============================================ */}

                <div className="p-5 sm:p-7">

                  <div className="mb-6">

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                      Your creation
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                      Custom {printTypes.find(
                        (item) => item.id === selectedType
                      )?.title}
                    </h2>

                  </div>


                  {/* details */}

                  <div className="space-y-3">

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-400">
                        Size
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {
                          sizes.find(
                            (item) => item.id === selectedSize
                          )?.title
                        }
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-400">
                        Material
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {material}
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-400">
                        Colour
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {color}
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-400">
                        Quantity
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        × {quantity}
                      </span>

                    </div>

                  </div>


                  {/* estimate */}

                  <div className="my-6 border-t border-slate-100 pt-5">

                    <div className="flex items-end justify-between">

                      <div>

                        <p className="text-[9px] uppercase tracking-wider text-slate-400">
                          Estimated starting price
                        </p>

                        <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                          ₹
                          {selectedSize === 'small'
                            ? 499 * quantity
                            : selectedSize === 'medium'
                            ? 799 * quantity
                            : 1299 * quantity}
                        </p>

                      </div>

                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-600">
                        Final quote after review
                      </span>

                    </div>

                  </div>


                  {/* submit */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-black text-white shadow-xl shadow-slate-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-emerald-600/20"
                  >

                    {isSubmitting ? 'Sending...' : 'Send custom request'}

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                      <i className="fa-solid fa-arrow-right text-[10px]" />
                    </span>

                  </button>

                  {submitError && <p className="mt-3 text-center text-xs text-red-600" role="alert">{submitError}</p>}


                  <p className="mt-3 text-center text-[9px] leading-4 text-slate-400">
                    No payment required yet. We&apos;ll review your idea
                    and confirm the final price before printing.
                  </p>

                  <p className="mt-3 border-t border-slate-100 pt-3 text-center text-[9px] leading-4 text-slate-400">
                    Disclaimer: The preview is an illustrative representation. Final printability, dimensions, colours, and pricing are confirmed after our review.
                  </p>

                </div>

              </div>


              {/* trust points */}

              <div className="mt-4 grid grid-cols-3 gap-2">

                <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

                  <i className="fa-solid fa-print text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Precision
                  </p>

                </div>

                <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

                  <i className="fa-solid fa-box text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Safe shipping
                  </p>

                </div>

                <div className="rounded-xl border-2 border-slate-200/75 bg-white/60 p-3 text-center">

                  <i className="fa-solid fa-headset text-sm text-emerald-500" />

                  <p className="mt-2 text-[9px] font-bold text-slate-600">
                    Human review
                  </p>

                </div>

              </div>

            </motion.aside>

          </div>


          {/* =====================================================
              BOTTOM MESSAGE
          ====================================================== */}

          {submitted && (

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,.15)]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">

                <i className="fa-solid fa-check" />

              </div>

              <div>

                <p className="text-sm font-bold text-slate-900">
                  Request received!
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  We&apos;ll review your creation details.
                </p>

              </div>

            </motion.div>

          )}

      </form>

    </div>

    </div>
  );
}