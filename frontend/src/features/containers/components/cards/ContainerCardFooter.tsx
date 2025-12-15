import React from 'react';

const CardFooter: React.FC<{ id: string }> = ({ id }) => (
  <div className="pt-3 border-t border-gray-100">
    <div className="text-xs mb-1 text-gray-500">
      {id.slice(0, 12)}
    </div>
  </div>
);
export default CardFooter;
