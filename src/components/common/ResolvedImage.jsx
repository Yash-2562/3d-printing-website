import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient, { resolveImageUrl } from '../../lib/api';

function getUploadPath(imageUrl) {
  if (!imageUrl) return '';

  try {
    const image = new URL(
      imageUrl,
      typeof window !== 'undefined' ? window.location.origin : undefined,
    );

    return image.pathname.startsWith('/uploads/')
      ? `${image.pathname}${image.search}`
      : '';
  } catch {
    return '';
  }
}

const ResolvedImage = forwardRef(function ResolvedImage(
  { src, onError, ...props },
  ref,
) {
  const [displaySrc, setDisplaySrc] = useState(() => resolveImageUrl(src));

  useEffect(() => {
    const resolvedSrc = resolveImageUrl(src);
    const uploadPath = getUploadPath(src);
    setDisplaySrc(resolvedSrc);

    if (!uploadPath) return undefined;

    let active = true;
    let objectUrl = '';

    apiClient
      .get(uploadPath, { responseType: 'blob' })
      .then(({ data }) => {
        if (!data.type.startsWith('image/')) throw new Error('Invalid image response');

        const nextObjectUrl = URL.createObjectURL(data);

        if (!active) {
          URL.revokeObjectURL(nextObjectUrl);
          return;
        }

        objectUrl = nextObjectUrl;
        setDisplaySrc(nextObjectUrl);
      })
      .catch(() => {
        if (active) setDisplaySrc('');
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!displaySrc) return null;

  return <img {...props} ref={ref} src={displaySrc} onError={onError} />;
});

ResolvedImage.propTypes = {
  src: PropTypes.string,
  onError: PropTypes.func,
};

export default ResolvedImage;
