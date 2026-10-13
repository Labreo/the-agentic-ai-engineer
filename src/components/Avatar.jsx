import React, { useState } from 'react';

/**
 * Resilient Avatar component.
 * If the direct CDN image fails (e.g. LinkedIn/Instagram hotlink blocking),
 * it seamlessly cascades to images.weserv.nl proxy, and finally to styled SVG initials.
 */
export default function Avatar({ src, name, size = 64, style = {}, className = '' }) {
  const [errorStage, setErrorStage] = useState(0); // 0: direct, 1: weserv proxy, 2: initials fallback

  const getInitials = (n) => {
    if (!n) return 'Ψ';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (n) => {
    const palette = [
      '#2a2d2a', '#1e282d', '#2c2225', '#2a271f', '#25212e', '#1f2a24'
    ];
    let hash = 0;
    for (let i = 0; i < (n || '').length; i++) {
      hash = (hash << 5) - hash + n.charCodeAt(i);
      hash |= 0;
    }
    return palette[Math.abs(hash) % palette.length];
  };

  const handleError = () => {
    if (errorStage === 0 && src && src.startsWith('http')) {
      setErrorStage(1);
    } else {
      setErrorStage(2);
    }
  };

  let imageSrc = src;
  if (errorStage === 1 && src && src.startsWith('http')) {
    imageSrc = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${size * 2}&h=${size * 2}&fit=cover`;
  }

  if (errorStage === 2 || !src) {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius: style.borderRadius || '12px',
          backgroundColor: getBackgroundColor(name),
          border: '1px solid var(--border-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold)',
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: `${Math.round(size * 0.38)}px`,
          letterSpacing: '0.02em',
          userSelect: 'none',
          ...style
        }}
        title={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={name || 'Avatar'}
      onError={handleError}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: style.borderRadius || '12px',
        objectFit: 'cover',
        border: '1px solid var(--border-warm)',
        ...style
      }}
    />
  );
}
