import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';

type Port = {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type?: string;
};

const PortsList: React.FC<{ ports?: Port[] }> = ({ ports }) => (
  <div className="mt-0.5 font-mono text-sm text-[var(--dark-gray)]">
    {ports?.map((port) => (
      <span className="flex" key={`${port.IP}-${port.PrivatePort}-${port.Type ?? ''}`}>
        {port.IP} {port.PrivatePort}&nbsp;
        <FaLongArrowAltRight />
        &nbsp;{port.PublicPort}/{port.Type}
      </span>
    ))}
  </div>
);

export default PortsList;
