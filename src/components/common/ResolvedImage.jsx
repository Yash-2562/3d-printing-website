import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient, { isBackendUploadUrl, resolveImageUrl } from '../../lib/api';

const ResolvedImage = forwardRef(function ResolvedImage(
  { src, onError, ...props },
  ref,
) {
  const [displaySrc, setDisplaySrc] = useState(() => resolveImageUrl(src));

  useEffect(() => {
    const resolvedSrc = resolveImageUrl(src);
    setDisplaySrc(resolvedSrc);

    if (!isBackendUploadUrl(src)) return undefined;

    let active = true;
    let objectUrl = '';

    apiClient
      .get(resolvedSrc, { responseType: 'blob' })
      .then(({ data }) => {
        const nextObjectUrl = URL.createObjectURL(data);

        if (!active) {
          URL.revokeObjectURL(nextObjectUrl);
          return;
        }

        objectUrl = nextObjectUrl;
        setDisplaySrc(nextObjectUrl);
      })
      .catch(() => {
        if (active) setDisplaySrc(resolvedSrc);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return <img {...props} ref={ref} src={displaySrc || ''} onError={onError} />;
});

ResolvedImage.propTypes = {
  src: PropTypes.string,
  onError: PropTypes.func,
};

export default ResolvedImage;
