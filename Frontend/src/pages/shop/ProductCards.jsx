import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    // Determine which image to use (variant image or main image)
    const selectedImage = product.variants?.[0]?.image || product.mainImage;
    
    // Create the cart item with proper image references
    const cartItem = {
      ...product,
      // The image that should be displayed in cart
      image: selectedImage,
      // Preserve all image references
      mainImage: product.mainImage,
      variantImage: product.variants?.[0]?.image,
      // Include full variant data if available
      variant: product.variants?.[0] || null,
      // Use variant price if available
      price: product.variants?.[0]?.price || product.price
    };

    dispatch(addToCart(cartItem));
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {products.map((product) => {
        // Determine display image (variant first, then main)
        const displayImage = product.variants?.[0]?.image || product.mainImage;
        
        return (
          <div key={product._id} className='product__card group'>
            <div className='relative overflow-hidden'>
              <Link to={`/shop/${product._id}`}>
                <img 
                  src={displayImage} 
                  alt={product.name} 
                  className='w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105'
                  onError={(e) => {
                    e.target.src = '/images/fallback-product.jpg'; // Add your fallback image path
                  }}
                />
              </Link>
              <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                  className='p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white'
                  aria-label={`Add ${product.name} to cart`}
                >
                  <i className="ri-shopping-cart-2-line"></i>
                </button>
              </div>
            </div>

            <div className='product__card__content mt-4'>
              <Link to={`/shop/${product._id}`}>
                <h4 className='font-medium text-lg hover:text-primary transition-colors'>
                  {product.name}
                </h4>
              </Link>
              <div className='flex items-center gap-2 mt-2'>
                <p className='text-primary font-semibold'>
                  Rs.{product.variants?.[0]?.price || product.price}
                </p>
                {product?.oldPrice && (
                  <s className='text-gray-400'>Rs.{product.oldPrice}</s>
                )}
              </div>
              <RatingStars rating={product.rating} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCards;