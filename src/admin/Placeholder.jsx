import PropTypes from 'prop-types';

function Placeholder({ title }) {
  return <section className="admin-content"><div className="page-heading"><div><p className="eyebrow">PRINTFORGE ADMIN</p><h1>{title}</h1><p className="muted">This workspace is ready for the next management workflow.</p></div><button className="primary-button"><i className="fa-solid fa-plus" /> Create new</button></div><div className="panel empty-panel"><div className="empty-icon"><i className="fa-solid fa-cube" /></div><h2>{title} workspace</h2><p>Mock data and API service hooks will be connected here before the PHP backend is added.</p></div></section>;
}

Placeholder.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Placeholder;
