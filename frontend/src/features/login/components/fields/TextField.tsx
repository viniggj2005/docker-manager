import React from 'react';
import { TextFieldProps } from '../../../../interfaces/AuthInterfaces';

const TextField: React.FC<TextFieldProps> = ({ label, error, ...rest }) => {
  return (
    <label className="block mb-3">
      <div className="text-sm mb-1">{label}</div>
      <input
        {...rest}
        className="w-full pl-2 py-1 pr-3 border text-[var(--dark-primary)]  rounded-xl outline-none "
      />
      {error ? <div className="text-sm text-[var(--exit-red)] mt-1">{error}</div> : null}
    </label>
  );
};

export default TextField;
