'use client';

import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

/**
 * Custom React component to load images from a server behind an ngrok tunnel.
 * It uses a fetch request with a special header to bypass ngrok's browser security warning.
 * The component fetches the image as a Blob and creates a local object URL to display it.
 *
 * @param {string} src The URL of the image to fetch.
 * @param {string} alt The alternative text for the image.
 * @param {object} style Custom styles for the img element.
 * @param {object} props Any other standard img attributes.
 */
const NgrokImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, style, ...props }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || typeof src !== 'string') return;

  setLoading(true);
  setError(false);

  fetch(src, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  })
    if (!src) {
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Use fetch with a specific header to bypass the ngrok warning.
    fetch(src, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    })
    .then(response => {
      // Check if the network response was successful.
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
      }
      return response.blob();
    })
    .then(blob => {
      // Create a local object URL from the Blob data.
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching image:", err);
      setError(true);
      setLoading(false);
    });

    // Cleanup function to revoke the object URL.
    // This prevents memory leaks by releasing the created URL.
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="small" />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: '#d9d9d9', textAlign: 'center' }}>Error loading image</div>;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...style
      }}
      {...props}
    />
  );
};

export default NgrokImage;