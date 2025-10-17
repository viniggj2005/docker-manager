import React from 'react';
import LoginForm from '../components/login/LoginForm';

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f6f7f9',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
}
