import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Import user from Redux state

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProductName, setPopupProductName] = useState('');

  const handleAddToCart = (product) => {
    if (user?.role !== 'user') return; // 🚫 Prevent admins from adding to cart

    const selectedImage = product.variants?.[0]?.image || product.mainImage;

    const cartItem = {
      ...product,
      image: selectedImage,
      mainImage: product.mainImage,
      variantImage: product.variants?.[0]?.image,
      variant: product.variants?.[0] || null,
      price: product.variants?.[0]?.price || product.price
    };

    dispatch(addToCart(cartItem));

    setPopupProductName(product.name);
    setPopupVisible(true);

    setTimeout(() => setPopupVisible(false), 2000);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {products.map((product) => {
        const displayImage = product.variants?.[0]?.image || product.mainImage || '/images/fallback-product.jpg';

        return (
          <div key={product._id} className='product__card group transform transition-all hover:scale-105 border border-gray-100 overflow-hidden bg-white'>
            <div className='relative'>
              <Link to={`/shop/${product._id}`}>
                <img 
                  src={displayImage} 
                  alt={product.name} 
                  className='w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105'
                  onError={(e) => {
                    e.target.src = '/images/fallback-product.jpg';
                  }}
                />
              </Link>

              {user?.role === 'user' && (
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className='p-2 bg-gradient-to-r from-[#9b4d4d] to-[#c16a6a] text-white rounded-full shadow-md hover:opacity-80 transition-all duration-300'
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <i className="ri-shopping-cart-2-line"></i>
                  </button>
                </div>
              )}
            </div>

            <div className='product__card__content p-4'>
              <Link to={`/shop/${product._id}`}>
                <h4 className='font-semibold text-xl text-gray-800 hover:text-[#9b4d4d] transition-colors'>{product.name}</h4>
              </Link>
              <div className='flex justify-center mt-2'>
                <p className='text-[#9b4d4d] font-semibold'>
                  Rs.{product.variants?.[0]?.price || product.price}
                </p>
              </div>
              <RatingStars rating={product.rating} />
            </div>
          </div>
        );
      })}

      {/* Popup for Item Added to Cart */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs opacity-100 transition-opacity duration-300">
            <p className="text-lg font-semibold text-indigo-600 text-center">Item Added to Cart</p>
            <p className="text-gray-500 text-center mt-2">{popupProductName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCards;
