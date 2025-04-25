import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';
import OrderSummary from './OrderSummary';

const CartModal = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Handle the quantity update (increment or decrement)
  const handleQuantity = (type, id, variantId, stock) => {
    if (type === 'increment') {
      const itemInCart = products.find(item => item._id === id && item.variant._id === variantId);
      if (itemInCart.quantity < stock) {
        dispatch(updateQuantity({ type, id, variantId }));
      }
    } else if (type === 'decrement') {
      dispatch(updateQuantity({ type, id, variantId }));
    }
  };

  // Handle removing item from cart
  const handleRemove = (e, id, variantId) => {
    e.preventDefault();
    dispatch(removeFromCart({ id, variantId }));
  };

  return (
    <div className={`fixed z-[1000] inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed right-0 top-0 md:w-1/3 w-full bg-[#f9f9f9] h-full overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='p-6 mt-4'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h4 className='text-2xl font-semibold text-[#333]'>Your Cart</h4>
            <button onClick={onClose} className='text-[#6b4c3b] hover:text-black text-xl'>
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className='space-y-5'>
            {products.length === 0 ? (
              <div className='text-gray-500 text-center mt-20'>Your cart is empty</div>
            ) : (
              products.map((item, index) => (
                <div key={index} className='flex flex-col gap-4 p-4 border border-[#e2e2e2] rounded-lg shadow-sm bg-white'>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm bg-[#6b4c3b] text-white rounded-full w-6 h-6 flex items-center justify-center'>
                      0{index + 1}
                    </span>
                    <img
                      src={item.image || item.variant?.image || item.mainImage}
                      alt={item.name}
                      className='w-14 h-14 object-cover rounded-md'
                      onError={(e) => {
                        e.target.src = '/images/fallback-product.jpg';
                      }}
                    />
                    <div>
                      <h5 className='text-base font-medium text-[#333]'>{item.name}</h5>
                      <p className='text-sm text-[#777]'>
                        Rs. {Number(item.variant?.price || item.price).toFixed(2)}
                        {item.variant && (
                          <span className="text-xs text-gray-400 ml-2">({item.variant.name})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <button
                        onClick={() => handleQuantity('decrement', item._id, item.variant._id, item.variant.stock)}
                        className='w-7 h-7 rounded-full bg-[#ececec] text-[#444] hover:bg-[#6b4c3b] hover:text-white'
                      >-</button>
                      <span className='min-w-[24px] text-center'>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity('increment', item._id, item.variant._id, item.variant.stock)}
                        className='w-7 h-7 rounded-full bg-[#ececec] text-[#444] hover:bg-[#6b4c3b] hover:text-white'
                      >+</button>
                    </div>
                    <button
                      onClick={(e) => handleRemove(e, item._id, item.variant._id)}
                      className='text-[#b23b3b] hover:text-red-700 text-sm'
                    >Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {products.length > 0 && (
            <div className='mt-8'>
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
