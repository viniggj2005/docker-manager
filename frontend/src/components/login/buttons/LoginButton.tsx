import React from 'react';
import { LoginButtonProps } from '../../../interfaces/AuthInterfaces';

const Button: React.FC<LoginButtonProps> = ({ full, children, ...rest }) => {
  return (
    <button
      className="w-full pt-3 pr-4 rounded-lg border bg-transparent cursor-pointer opacity-5 font-semibold"
      {...rest}
    >
      {children}
    </button>
  );
};
export default Button;
