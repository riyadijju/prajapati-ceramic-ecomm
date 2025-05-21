import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../utils/baseURL';
import TimelineStep from './TimelineStep';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/features/cart/cartSlice';


const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch(); // ✅ Outside useEffect

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id: sessionId })
      })
        .then((res) => res.json())
        .then((data) => {
          setOrder(data.order);

          // ✅ Clear cart on success
          dispatch(clearCart());
        })
        .catch((err) => console.error("Error confirming payment", err));
    }
  }, [dispatch]);

 
    if(!order) {return <div>Loading...</div>}

    const isCompleted = (status) => {
        const statuses = ["pending", "processing", "shipped", "completed"];
        return statuses.indexOf(status) < statuses.indexOf(order.status)
    }

    const isCurrent = (status) => order.status ===  status;
    const steps = [
        {
          status: 'pending',
          label: 'Pending',
          description: 'Your order has been created and is awaiting processing.',
          icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
          status: 'processing',
          label: 'Processing',
          description: 'Your order is currently being processed.',
          icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
        },
        {
          status: 'shipped',
          label: 'Shipped',
          description: 'Your package has been handed over to the courier.',
          icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
        },
        {
          status: 'completed',
          label: 'Completed',
          description: 'Your order has been successfully delivered.',
          icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
        },
      ];

  return (
    <section className='section__container rounded p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Payment {order?.status}</h2>
        <p className='mb-4'>Order Id: {order?.orderId}</p>
        <p className='mb-8'>Status: {order?.status}</p>

        <ol className='sm:flex items-center relative'>
            {
               steps.map((step, index) => (
                <TimelineStep
                key={index}
                step={step}
                order={order}
                isCompleted={isCompleted(step.status)}
                isCurrent={isCurrent(step.status)}
                isLastStep = {index === steps.length - 1}
                icon={step.icon}
                description={step.description}
                />
               )) 
            }
        </ol>
        
    </section>
  )
}

export default PaymentSuccess