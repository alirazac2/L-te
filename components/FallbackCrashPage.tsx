import React from 'react';

/**
 * A robust, zero-dependency fallback page that renders if the main app fails.
 * Uses inline styles to ensure it displays correctly even if tailwind/css fails.
 */
export const FallbackCrashPage: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#030712', // Matches app background
      color: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 99999
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '1rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.5rem', 
          fontWeight: 600,
          color: '#f3f4f6'
        }}>
          System Unavailable
        </h2>
        
        <p style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#9ca3af', 
          lineHeight: 1.5,
          fontSize: '0.95rem' 
        }}>
          The main app crashed. This fallback page loaded successfully.
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Reload Application
        </button>
      </div>
    </div>
  );
};
