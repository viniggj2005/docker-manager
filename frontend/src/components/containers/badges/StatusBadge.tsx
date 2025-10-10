import React from 'react';
import { classState } from '../../../functions/TreatmentFunction';

type Props = { state: string; title?: string };

const StatusBadge: React.FC<Props> = ({ state, title }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-md font-medium ${classState(state)}`}
    title={title || state}
  >
    {state}
  </span>
);

export default StatusBadge;
