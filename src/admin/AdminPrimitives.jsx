import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const labelize = (value) => value.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function Page({ eyebrow = 'PRINTFORGE ADMIN', title, description, action, children }) {
  return <section className="admin-content"><div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="muted">{description}</p>}</div>{action}</div>{children}</section>;
}
Page.propTypes = { eyebrow: PropTypes.string, title: PropTypes.string.isRequired, description: PropTypes.string, action: PropTypes.node, children: PropTypes.node.isRequired };

export function StatusPill({ value }) {
  const tone = ['ACTIVE', 'SUCCESSFUL', 'CONFIRMED', 'DELIVERED', 'IN_STOCK', 'SENT', 'COMPLETED'].includes(value) ? 'green' : ['NEW', 'PENDING', 'PENDING_PAYMENT', 'LOW_STOCK', 'UNDER_REVIEW', 'QUOTE_SENT'].includes(value) ? 'violet' : ['PROCESSING', 'PRINTING', 'PRINTING_STARTED', 'SHIPPED', 'QUALITY_CHECK', 'QUALITY_CHECKED', 'MADE_TO_ORDER'].includes(value) ? 'orange' : 'blue';
  return <span className={`status-pill ${tone}`}>{labelize(value)}</span>;
}
StatusPill.propTypes = { value: PropTypes.string.isRequired };

export function Toolbar({ children }) { return <div className="admin-toolbar">{children}</div>; }
Toolbar.propTypes = { children: PropTypes.node.isRequired };

export function SearchInput({ placeholder = 'Search...', value, onChange }) { return <label className="admin-search"><i className="fa-solid fa-magnifying-glass" /><input value={value} onChange={onChange} placeholder={placeholder} /></label>; }
SearchInput.propTypes = { placeholder: PropTypes.string, value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired };

export function Field({ label, children, hint }) { return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
Field.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node.isRequired, hint: PropTypes.string };

export function SelectField({ label, options, value, onChange }) { return <Field label={label}><select value={value} onChange={onChange}>{options.map((option) => <option key={option} value={option}>{labelize(option)}</option>)}</select></Field>; }
SelectField.propTypes = { label: PropTypes.string.isRequired, options: PropTypes.arrayOf(PropTypes.string).isRequired, value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired };

export function DataTable({ headers, children }) { return <div className="panel table-panel"><div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div></div>; }
DataTable.propTypes = { headers: PropTypes.arrayOf(PropTypes.string).isRequired, children: PropTypes.node.isRequired };

export const ADMIN_PAGE_SIZE = 20;

export function Pagination({ currentPage, totalItems, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / ADMIN_PAGE_SIZE));
  if (totalItems <= ADMIN_PAGE_SIZE) return null;
  return <nav className="admin-pagination" aria-label="Pagination">
    <button type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page"><i className="fa-solid fa-chevron-left" /></button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" key={page} onClick={() => onPageChange(page)} aria-current={currentPage === page ? 'page' : undefined} className={currentPage === page ? 'active' : ''}>{page}</button>)}
    <button type="button" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page"><i className="fa-solid fa-chevron-right" /></button>
  </nav>;
}
Pagination.propTypes = { currentPage: PropTypes.number.isRequired, totalItems: PropTypes.number.isRequired, onPageChange: PropTypes.func.isRequired };

export function RowActions({ editPath, onEdit, onDelete }) { return <div className="admin-actions">{editPath && <Link className="row-action" to={editPath} aria-label="Edit"><i className="fa-solid fa-pen" /></Link>}{onEdit && <button type="button" className="row-action" onClick={onEdit} aria-label="Edit"><i className="fa-solid fa-pen" /></button>}{onDelete && <button type="button" className="row-action delete-action" onClick={onDelete} aria-label="Delete"><i className="fa-solid fa-trash" /></button>}</div>; }
RowActions.propTypes = { editPath: PropTypes.string, onEdit: PropTypes.func, onDelete: PropTypes.func };

export function ActionMenu({ label = 'Actions', options, onChange }) { return <label className="action-menu"><span className="sr-only">{label}</span><select aria-label={label} defaultValue="" onChange={(event) => { if (event.target.value) onChange(event.target.value); event.target.value = ''; }}><option value="">Choose...</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }
ActionMenu.propTypes = { label: PropTypes.string, options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired, onChange: PropTypes.func.isRequired };

export function FormSection({ title, children }) { return <section className="panel form-section"><h2>{title}</h2><div className="form-grid">{children}</div></section>; }
FormSection.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired };
