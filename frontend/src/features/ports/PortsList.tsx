import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { PortInterface } from '../../interfaces/PortsInterfaces';

const PortsList: React.FC<{ ports?: PortInterface[] }> = ({ ports }) => (
  <div className="mt-0.5 font-mono max-h-12 text-sm text-zinc-900 dark:text-white">
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
