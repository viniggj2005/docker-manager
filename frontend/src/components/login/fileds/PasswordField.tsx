import TextField from './TextField';
import React, { useState } from 'react';

type Props = {
  label: string;
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string | null;
  placeholder?: string;
};

export default function PasswordField(props: Props) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <TextField
        label={props.label}
        type={show ? 'text' : 'password'}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        error={props.error}
        placeholder={props.placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: 'absolute',
          right: 10,
          top: 32,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="alternar visibilidade da senha"
      >
        {show ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>
  );
}
