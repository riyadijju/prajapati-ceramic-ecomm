import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { getBaseUrl } from '../../utils/baseURL';
import { useNavigate } from 'react-router-dom';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const products = useSelector((store) => store.cart.products);
  const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector((store) => store.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const makePayment = async () => {
    if (!user) {
      // Send state for redirect
      navigate('/login', { state: { from: 'cart' } });
      return;
    }

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

    const body = {
      products: products,
      userId: user._id,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.error('Payment Error:', error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 mt-8 rounded-md shadow-md max-w-md mx-auto text-sm">
      <div className="p-6 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Order Summary</h2>

        <table className="w-full text-left border-separate border-spacing-y-2">
          <tbody>
            <tr>
              <td className="font-medium">Selected Items</td>
              <td className="text-right">{selectedItems}</td>
            </tr>
            <tr>
              <td className="font-medium">Total Price</td>
              <td className="text-right">Rs. {totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-medium">Tax ({(taxRate * 100).toFixed(0)}%)</td>
              <td className="text-right">Rs. {tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <hr className="my-2 border-gray-300" />
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-base">Grand Total</td>
              <td className="text-right font-semibold text-base">Rs. {grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleClearCart}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition font-medium"
          >
            Clear Cart
          </button>

          <button
            onClick={makePayment}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
