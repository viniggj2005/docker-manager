import React from 'react';
import { classState } from '../../../shared/functions/TreatmentFunction';

const StatusBadge: React.FC<{ state: string; title?: string }> = ({ state, title }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-md font-medium ${classState(state)}`}
    title={title || state}
  >
    {state}
  </span>
);

export default StatusBadge;
