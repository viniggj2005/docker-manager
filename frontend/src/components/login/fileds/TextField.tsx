import React from 'react';
import { TextFieldProps } from '../../../interfaces/AuthInterfaces';

const TextField: React.FC<TextFieldProps> = ({ label, error, ...rest }) => {
  return (
    <label className="block mb-3">
      <div className="text-sm mb-1">{label}</div>
      <input {...rest} className="w-full pt-[10px] pr-[12px] border  rounded-xl outline-none " />
      {error ? <div className="text-sm text-[var(--exit-red)] mt-1">{error}</div> : null}
    </label>
  );
};

export default TextField;
