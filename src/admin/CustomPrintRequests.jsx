import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import {
  ActionMenu,
  DataTable,
  Field,
  Page,
  SearchInput,
  StatusPill,
  Toolbar,
} from './AdminPrimitives';

const apiOrigin = apiClient.defaults.baseURL.replace(/\/api\/v1\/?$/, '');

export default function CustomPrintRequests() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSources, setImageSources] = useState({});
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/admin/custom-requests')
      .then(({ data }) => setRows(data.data || []))
      .catch(() => setError('Unable to load custom requests.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const objectUrls = [];
    const imageRequests = rows.filter(
      (request) => request.file_url && request.file_type?.startsWith('image/'),
    );

    Promise.all(
      imageRequests.map(async (request) => {
        try {
          const { data } = await apiClient.get(request.file_url, {
            responseType: 'blob',
          });
          const objectUrl = URL.createObjectURL(data);
          objectUrls.push(objectUrl);
          return [request.id, objectUrl];
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      if (active) setImageSources(Object.fromEntries(entries.filter(Boolean)));
    });

    return () => {
      active = false;
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, [rows]);

  const visible = rows.filter(
    (request) =>
      `${request.id} ${request.customer} ${request.file_name}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!statusFilter || request.status === statusFilter),
  );

  const handleAction = async (request, status) => {
    try {
      await apiClient.put(
        `/admin/custom-requests/${encodeURIComponent(request.id)}`,
        { status },
      );
      setRows((current) =>
        current.map((row) =>
          row.id === request.id ? { ...row, status } : row,
        ),
      );
      setSelected((current) =>
        current?.id === request.id ? { ...current, status } : current,
      );
    } catch {
      setError('Unable to update request status.');
    }
  };

  const handleDownload = async (request) => {
    try {
      const { data } = await apiClient.get(request.file_url, {
        responseType: 'blob',
      });
      const objectUrl = URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = request.file_name || 'customer-upload';
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setError('Unable to download the customer file.');
    }
  };

  return (
    <Page
      title="Custom print requests"
      description="Review uploaded models, prepare quotes and manage fulfilment."
    >
      <Toolbar>
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search request, customer or file..."
        />
        <select
          aria-label="Request status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All request statuses</option>
          <option value="waiting_confirmation">Waiting for confirmation</option>
          <option value="confirmed">Confirmed</option>
          <option value="printing_started">Printing started</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </Toolbar>
      {error && (
        <p className="save-message" role="alert">
          {error}
        </p>
      )}
      {isLoading ? (
        <p className="muted">Loading custom requests...</p>
      ) : (
        <DataTable
          headers={[
            'REQUEST ID',
            'CUSTOMER',
            'MODEL',
            'CUSTOMER INFORMATION',
            'MATERIAL',
            'COLOR',
            'QUANTITY',
            'REQUEST DATE',
            'STATUS',
            'QUOTED PRICE',
            'ACTIONS',
          ]}
        >
          {visible.map((request) => (
            <tr key={request.id}>
              <td>
                <button
                  className="row-link"
                  onClick={() => setSelected(request)}
                >
                  {request.id}
                </button>
              </td>
              <td>
                {request.customer}
                <small className="table-subtext">{request.email}</small>
              </td>
              <td>
                {request.file_url && request.file_type.startsWith('image/') ? (
                  imageSources[request.id] ? (
                    <button
                      className="image-button"
                      onClick={() =>
                        setImagePreview({
                          url: imageSources[request.id],
                          name: request.file_name || 'Uploaded model',
                        })
                      }
                    >
                      <img
                        className="request-thumbnail"
                        src={imageSources[request.id]}
                        alt={request.file_name || 'Uploaded model'}
                      />
                    </button>
                  ) : (
                    <span className="muted">Loading image...</span>
                  )
                ) : request.file_url ? (
                  <a
                    className="text-link"
                    href={`${apiOrigin}${request.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open file
                  </a>
                ) : (
                  'No file'
                )}
              </td>
              <td className="request-notes">
                {request.notes || 'No notes provided'}
              </td>
              <td>{request.material}</td>
              <td>{request.color}</td>
              <td>{request.quantity}</td>
              <td>{request.date}</td>
              <td>
                <StatusPill value={request.status.toUpperCase()} />
              </td>
              <td>₹{Number(request.quote).toLocaleString('en-IN')}</td>
              <td>
                <ActionMenu
                  label={`Actions for ${request.id}`}
                  options={[
                    { value: 'waiting_confirmation', label: 'Waiting for confirmation' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'printing_started', label: 'Printing started' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  onChange={(status) => handleAction(request, status)}
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      {selected && (
        <div className="panel inline-form">
          <div className="panel-heading">
            <div>
              <h2>
                {selected.id} · {selected.file_name || 'Custom model'}
              </h2>
              <p className="muted">
                {selected.customer} · {selected.material} · {selected.color} ·{' '}
                {selected.quantity} copies
              </p>
            </div>
            <button
              className="row-action"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          {selected.file_url && (
            <div className="custom-preview">
              {selected.file_type.startsWith('image/') ? (
                imageSources[selected.id] ? (
                  <button
                    className="image-button"
                    onClick={() =>
                      setImagePreview({
                        url: imageSources[selected.id],
                        name: selected.file_name || 'Uploaded model',
                      })
                    }
                  >
                    <img
                      src={imageSources[selected.id]}
                      alt={selected.file_name}
                    />
                  </button>
                ) : (
                  <p className="muted">Loading image...</p>
                )
              ) : (
                <a
                  href={`${apiOrigin}${selected.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open uploaded 3D model file
                </a>
              )}
              <a
                className="text-link"
                href={`${apiOrigin}${selected.file_url}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleDownload(selected);
                }}
              >
                Download file <i className="fa-solid fa-download" />
              </a>
            </div>
          )}
          <p className="muted">
            Order: {selected.order_id} · Type: {selected.print_type} · Size:{' '}
            {selected.size}
          </p>
          <Field label="Status">
            <select
              value={selected.status}
              onChange={(event) => handleAction(selected, event.target.value)}
            >
              <option value="waiting_confirmation">Waiting for confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="printing_started">Printing started</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <div className="customer-information">
            <strong>Customer information</strong>
            <p>{selected.notes || 'No additional information provided.'}</p>
          </div>
          <strong className="quote-total">
            Linked order total: ₹
            {Number(selected.quote).toLocaleString('en-IN')}
          </strong>
        </div>
      )}
      {imagePreview && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Uploaded image preview"
        >
          <button
            className="image-lightbox-close"
            onClick={() => setImagePreview(null)}
            aria-label="Close image preview"
          >
            <i className="fa-solid fa-xmark" />
          </button>
          <img src={imagePreview.url} alt={imagePreview.name} />
          <a
            className="image-lightbox-download"
            href={imagePreview.url}
            download={imagePreview.name}
          >
            <i className="fa-solid fa-download" /> Download image
          </a>
        </div>
      )}
    </Page>
  );
}
