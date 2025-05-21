import React from 'react';

const TimelineStep = ({ step, order, isCompleted, isCurrent, isLastStep, icon, description }) => {
  // 🟢 Step color logic
  const getStepColor = () => {
    if (isCompleted) return 'bg-green-700 text-white'; // Completed
    if (isCurrent) {
      switch (step.status) {
        case 'pending':
          return 'bg-orange-500 text-white';
        case 'processing':
          return 'bg-yellow-600 text-white';
        case 'shipped':
          return 'bg-blue-600 text-white';
        case 'completed':
          return 'bg-green-800 text-white';
        default:
          return 'bg-gray-300 text-gray-600';
      }
    }
    return 'bg-gray-200 text-gray-400'; // Upcoming
  };

  const connectorColor = isCompleted ? 'bg-green-600' : 'bg-gray-300';
  const labelTextColor = isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400';
  const descriptionTextColor = isCompleted || isCurrent ? 'text-gray-700' : 'text-gray-400';

  return (
    <li className='relative mb-6 sm:mb-0 sm:pl-10'>
      <div className='flex items-center'>
        <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${getStepColor()} ring-2 ring-white shadow`}>
          <i className={`ri-${icon.iconName} text-base`}></i>
        </div>
        {!isLastStep && (
          <div className={`hidden sm:flex w-full h-0.5 ${connectorColor}`}></div>
        )}
      </div>

      <div className='mt-3 sm:pe-8'>
        <h3 className={`font-semibold text-sm ${labelTextColor}`}>{step.label}</h3>
        <time className='block mb-1 text-xs font-normal text-gray-400'>
          {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'Time'}
        </time>
        <p className={`text-sm font-normal ${descriptionTextColor}`}>{description}</p>
      </div>
    </li>
  );
};

export default TimelineStep;
