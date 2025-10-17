import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean };

export default function Button({ full, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      style={{
        width: full ? '100%' : undefined,
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid #222',
        background: '#222',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
        opacity: rest.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
