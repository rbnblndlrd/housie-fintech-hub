import React from 'react';

export function CanonAuraEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
    </div>
  );
}