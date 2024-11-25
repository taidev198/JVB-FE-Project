import React from 'react';

export const Loading = (): JSX.Element => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="absolute bottom-1/2 right-1/2 h-[120px] w-[120px] translate-x-1/2 translate-y-1/2">
        <circle cx="50" cy="50" r="0" fill="none" stroke="#e90c59" strokeWidth="8">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="1s"
            values="0;40"
            keyTimes="0;1"
            keySplines="0 0.2 0.8 1"
            calcMode="spline"
            begin="0s"></animate>
          <animate
            attributeName="opacity"
            repeatCount="indefinite"
            dur="1s"
            values="1;0"
            keyTimes="0;1"
            keySplines="0.2 0 0.8 1"
            calcMode="spline"
            begin="0s"></animate>
        </circle>
        <circle cx="50" cy="50" r="0" fill="none" stroke="#46dff0" strokeWidth="8">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="1s"
            values="0;40"
            keyTimes="0;1"
            keySplines="0 0.2 0.8 1"
            calcMode="spline"
            begin="-0.5s"></animate>
          <animate
            attributeName="opacity"
            repeatCount="indefinite"
            dur="1s"
            values="1;0"
            keyTimes="0;1"
            keySplines="0.2 0 0.8 1"
            calcMode="spline"
            begin="-0.5s"></animate>
        </circle>
      </svg>
    </div>
  );
};
