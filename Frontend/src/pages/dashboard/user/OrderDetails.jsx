import React from 'react'
import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { orderId } = useParams();
    console.log(orderId)
    const { data: order, error, isLoading } = useGetOrderByIdQuery(orderId);
    
    if(isLoading) return <div>Loading...</div>
    if(error)  return <div>No orders!</div>

  return (
    <div>
      hey
    </div>
  )
}

export default OrderDetails
