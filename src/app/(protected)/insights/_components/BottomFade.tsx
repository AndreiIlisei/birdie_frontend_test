import React from 'react';

export function BottomFade({ height = 100, style }: { height?: number, style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height,
        pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0))',
        zIndex: 1000,
        ...style,
      }}
    />
  );
} 