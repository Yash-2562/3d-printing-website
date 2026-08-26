import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createPortal } from 'react-dom';
import apiClient from '../../../lib/api';

const formatStatus = (status) => {
  const normalizedStatus = String(status || 'waiting_confirmation').toLowerCase();
  return normalizedStatus.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const statusClasses = {
  waiting_confirmation: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  printing_started: 'bg-orange-100 text-orange-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const customStatusClasses = {
  waiting_confirmation: 'bg-amber-100 text-amber-800',
  new: 'bg-amber-100 text-amber-800',
  under_review: 'bg-amber-100 text-amber-800',
  quote_sent: 'bg-blue-100 text-blue-800',
  printing: 'bg-purple-100 text-purple-800',
  quality_check: 'bg-teal-100 text-teal-800',
  ready: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersSectionRef = useRef(null);
  const pageSize = 5;

  useEffect(() => {
    apiClient.get('/orders')
      .then(({ data }) => setOrders(data.data || []))
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  useEffect(() => {
    if (currentPage > 1) ordersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  useEffect(() => {
    if (!previewOrder) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewOrder(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [previewOrder]);

  useEffect(() => {
    if (!previewOrder?.customFileUrl) {
      setPreviewSource(null);
      return undefined;
    }
    let objectUrl;
    apiClient.get(previewOrder.customFileUrl, { responseType: 'blob' }).then(({ data }) => {
      objectUrl = URL.createObjectURL(data);
      setPreviewSource(objectUrl);
    }).catch(() => setPreviewSource(null));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [previewOrder]);

  return (
    <>
      <Helmet><title>Orders</title></Helmet>
      <section ref={ordersSectionRef} className="container mx-auto max-w-3xl scroll-mt-32 px-4 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Your orders</h1>
          <p className="mt-2 text-gray-600">Track your recent PocketForm purchases.</p>
        </div>

        {isLoading && <p className="text-gray-500">Loading orders...</p>}
        {!isLoading && orders.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <i className="fa-solid fa-box-open text-3xl text-green-700" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-600">Your completed purchases will appear here.</p>
            <Link to="/shop" className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">Start shopping</Link>
          </div>
        )}
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <article key={order._id || order.id} className={`rounded-xl border bg-white p-5 shadow-sm ${order.customRequestId ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-gray-900">Order {order._id || order.id}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${order.customRequestId ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {order.customRequestId ? 'Custom order' : 'Shop order'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{order.createdAt || order.date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClasses[String(order.status || 'waiting_confirmation').toLowerCase()] || statusClasses.waiting_confirmation}`}>{formatStatus(order.status)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <span className="text-gray-600">{order.items} item{Number(order.items) === 1 ? '' : 's'}</span>
                <strong className="text-gray-900">₹{Number(order.total).toLocaleString('en-IN')}</strong>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                <span><i className="fa-solid fa-credit-card mr-1" />Payment: {formatStatus(order.paymentStatus || 'pending')}</span>
                {Number(order.refundedAmount) > 0 && <span><i className="fa-solid fa-rotate-left mr-1" />Refunded: ₹{Number(order.refundedAmount).toLocaleString('en-IN')}</span>}
              </div>
              <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900" onClick={() => order.customRequestId ? setPreviewOrder(order) : setExpandedOrder((current) => current === (order._id || order.id) ? null : (order._id || order.id))} aria-expanded={order.customRequestId ? previewOrder === order : expandedOrder === (order._id || order.id)}>
                <i className={`fa-solid ${order.customRequestId ? 'fa-arrow-up-right-from-square' : expandedOrder === (order._id || order.id) ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                {order.customRequestId ? 'View full details' : expandedOrder === (order._id || order.id) ? 'Hide details' : 'View details'}
              </button>
              {expandedOrder === (order._id || order.id) && (
                <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.customRequestId ? 'Custom print brief' : 'Items in this order'}</h3>
                    {order.customRequestId ? (
                      <>
                        {order.customFileUrl && <button type="button" onClick={() => setPreviewOrder(order)} className="mt-3 flex w-full items-center gap-3 rounded-lg border border-emerald-200 bg-white p-3 text-left hover:border-emerald-500 hover:bg-emerald-50">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><i className={`fa-solid ${order.customFileType?.startsWith('image/') ? 'fa-image' : 'fa-cube'}`} /></span>
                          <span className="min-w-0 flex-1"><strong className="block truncate text-gray-900">{order.customFileName || 'Uploaded model'}</strong><small className="text-gray-500">{order.customFileType?.startsWith('image/') ? 'Open image preview' : 'Open uploaded 3D model'}</small></span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-emerald-700" />
                        </button>}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <p>Request: <strong>{order.customRequestId}</strong></p>
                          <p>Type: <strong>{order.customPrintType || 'Custom model'}</strong></p>
                          <p>Size: <strong>{order.customSize || 'Not specified'}</strong></p>
                          <p>Material and color: <strong>{order.customMaterial || 'Not specified'} · {order.customColor || 'Not specified'}</strong></p>
                          <p>Quantity: <strong>{order.customQuantity || order.items} copies</strong></p>
                          <p>Quality status: <span className={`rounded-full px-2 py-1 text-xs font-semibold ${customStatusClasses[String(order.customStatus || 'new').toLowerCase()] || customStatusClasses.new}`}>{formatStatus(order.customStatus || 'new')}</span></p>
                        </div>
                      </>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {(order.orderItemDetails || []).map((item) => (
                          <Link key={`${item.productId}-${item.quantity}`} to={`/product/${item.productId}`} className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-2 text-gray-800 hover:border-emerald-400 hover:text-emerald-800">
                            <span className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-700"><i className="fa-solid fa-box" /></span>
                            <span className="flex-1">{item.title}</span>
                            <span className="text-xs text-gray-500">Qty {item.quantity}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                          </Link>
                        ))}
                        {!order.orderItemDetails?.length && <p>{order.orderItems || `${order.items} item${Number(order.items) === 1 ? '' : 's'}`}</p>}
                      </div>
                    )}
                  </div>
                  {order.customRequestId && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900"><i className="fa-solid fa-circle-check mr-2" />Our team reviews the model and completes a quality check before dispatch.</p>}
                  {order.customNotes && <p><strong>Notes:</strong> {order.customNotes}</p>}
                  <p><strong>Shipping address:</strong> {order.shippingAddress || 'Not provided'}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
                    <strong>Total: ₹{Number(order.total).toLocaleString('en-IN')}</strong>
                    <a className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700" href={`mailto:hello@printforge.in?subject=Question about order ${order._id || order.id}`}><i className="fa-solid fa-message" />Contact seller</a>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
        {!isLoading && orders.length > pageSize && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Orders pagination">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
              <i className="fa-solid fa-chevron-left mr-2 text-xs" />Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button type="button" key={page} onClick={() => setCurrentPage(page)} aria-current={currentPage === page ? 'page' : undefined} className={`h-9 w-9 rounded-lg text-sm font-semibold ${currentPage === page ? 'bg-emerald-700 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-400'}`}>
                {page}
              </button>
            ))}
            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
              Next<i className="fa-solid fa-chevron-right ml-2 text-xs" />
            </button>
          </nav>
        )}
      </section>
      {previewOrder && createPortal(<div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-hidden bg-slate-950/70 p-3 pt-[112px] sm:p-5 sm:pt-[120px]" role="dialog" aria-modal="true" aria-labelledby="custom-order-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOrder(null); }}>
        <div className="max-h-[calc(100vh-136px)] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-[calc(100vh-144px)]">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Complete custom order</p><h2 id="custom-order-preview-title" className="mt-1 text-2xl font-bold text-gray-900">{previewOrder.customFileName || previewOrder.customRequestId}</h2><p className="mt-1 text-sm text-gray-500">Order {previewOrder._id || previewOrder.id} · {previewOrder.createdAt || previewOrder.date}</p></div><button type="button" onClick={() => setPreviewOrder(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="Close preview"><i className="fa-solid fa-xmark" /></button></div>
          <div className="space-y-3 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <div>{previewOrder.customFileType?.startsWith('image/') ? (previewSource ? <img className="h-56 w-full rounded-xl bg-gray-50 object-contain sm:h-64" src={previewSource} alt={previewOrder.customFileName || 'Uploaded custom model'} /> : <div className="flex h-56 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">Loading preview...</div>) : <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-white via-emerald-50 to-emerald-100 text-center shadow-inner sm:h-64"><div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-600 shadow-lg"><i className="fa-solid fa-cube text-4xl text-white/90" /></div><p className="mt-3 font-semibold text-gray-900">3D model preview</p><p className="mt-1 text-sm text-gray-500">{previewOrder.customFileName || 'Uploaded model'}</p>{previewSource && <a className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800" href={previewSource} target="_blank" rel="noreferrer"><i className="fa-solid fa-download" />Open file</a>}</div>}
                <div className="mt-4 rounded-xl border border-gray-100 p-3 text-sm text-gray-700"><strong className="text-gray-900">Customer notes</strong><p className="mt-1 whitespace-pre-wrap">{previewOrder.customNotes || 'No additional notes provided.'}</p></div>
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900"><i className="fa-solid fa-circle-info mr-2" />Disclaimer: this is an estimated order summary. Our team will review the model and confirm the final quote before processing or printing.</p>
              </div>
              <div className="grid gap-x-4 gap-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-1"><p><span className="text-gray-500">Request ID</span><strong className="block text-gray-900">{previewOrder.customRequestId}</strong></p><p><span className="text-gray-500">Print type</span><strong className="block text-gray-900">{previewOrder.customPrintType || 'Custom model'}</strong></p><p><span className="text-gray-500">Size</span><strong className="block text-gray-900">{previewOrder.customSize || 'Not specified'}</strong></p><p><span className="text-gray-500">Material and color</span><strong className="block text-gray-900">{previewOrder.customMaterial || 'Not specified'} · {previewOrder.customColor || 'Not specified'}</strong></p><p><span className="text-gray-500">Quantity</span><strong className="block text-gray-900">{previewOrder.customQuantity || previewOrder.items} copies</strong></p><p><span className="text-gray-500">Quality status</span><strong className="block text-gray-900">{formatStatus(previewOrder.customStatus || 'new')}</strong></p><p><span className="text-gray-500">Order status</span><strong className="block text-gray-900">{formatStatus(previewOrder.status)}</strong></p><p><span className="text-gray-500">Shipping address</span><strong className="block text-gray-900">{previewOrder.shippingAddress || 'Not provided'}</strong></p><p><span className="text-gray-500">Total</span><strong className="block text-lg text-gray-900">₹{Number(previewOrder.total).toLocaleString('en-IN')}</strong></p></div>
            </div>
          </div>
        </div>
      </div>, document.body)}
    </>
  );
}