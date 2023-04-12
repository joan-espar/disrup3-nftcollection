import React from 'react';

interface Props {
  value: boolean;
  text: string;
}


const GreenRedIndicator: React.FC<Props> = ({ value, text }) => {
  return (
    <div className="flex items-center justify-between p-1 mt-2">
      {value ? (
        <div className="text-2xl bg-green-500 pl-3 pr-3 rounded-sm border">
          {text}
        </div>
      ) : (
        <div className="text-2xl bg-red-500 pl-3 pr-3 rounded-sm border">
          {text}
        </div>
      )}
    </div>
  );
};
export default GreenRedIndicator;