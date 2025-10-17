import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export default function TextField({ label, error, ...rest }: Props) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        {...rest}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #ccc',
          borderRadius: 8,
          outline: 'none',
        }}
      />
      {error ? <div style={{ color: '#b00020', fontSize: 12, marginTop: 4 }}>{error}</div> : null}
    </label>
  );
}
