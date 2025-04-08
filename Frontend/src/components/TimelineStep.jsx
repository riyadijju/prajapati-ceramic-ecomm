import React from 'react'

const TimelineStep = ({step, order, isCompleted, isCurrent, isLastStep, icon, description}) => {
    // For incomplete steps, everything is grey
    const isIncomplete = !(isCompleted || isCurrent);
    
    // Icon styling
    const iconBgColor = isIncomplete ? 'bg-gray-200' : 
                      (icon.bgColor === 'green' ? 'bg-green-500' : 
                       icon.bgColor === 'red' ? 'bg-red-500' : 
                       icon.bgColor === 'blue' ? 'bg-blue-500' : 
                       'bg-indigo-500');
    
    const iconTextColor = isIncomplete ? 'text-gray-400' : 'text-white';
    
    // Connector styling
    const connectorColor = isIncomplete ? 'bg-gray-200' : 
                         (isCompleted ? 'bg-blue-500' : 'bg-gray-200');
    
    // Text styling
    const labelTextColor = isIncomplete ? 'text-gray-400' : 'text-gray-900';
    const descriptionTextColor = isIncomplete ? 'text-gray-400' : 'text-gray-900';

    return (
        <li className='relative mb-6 sm:mb-0 sm:pl-10'>
            <div className='flex items-center'>
                <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-white shrink-0 ${iconBgColor} ${iconTextColor}`}>
                    <i className={`ri-${icon.iconName} text-xl`}></i>
                </div>
                {!isLastStep && (
                    <div className={`hidden sm:flex w-full h-0.5 ${connectorColor}`}></div>
                )}
            </div>
            <div className='mt-3 sm:pe-8'>
                <h3 className={`font-medium text-base ${labelTextColor}`}>{step.label}</h3>
                <time className='block mb-2 text-sm font-normal leading-none text-gray-400'>
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'Time'}
                </time>
                <p className={`text-base font-normal ${descriptionTextColor}`}>{description}</p>
            </div>
        </li>
    )
}

export default TimelineStep