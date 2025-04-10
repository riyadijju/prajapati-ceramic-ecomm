import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import {useDispatch} from "react-redux"
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {data, error, isLoading} = useFetchProductByIdQuery(id);
    const [selectedVariant, setSelectedVariant] = useState(0);
   
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    const variants = singleProduct?.variants || [];

    const handleAddToCart = (product) => {
      const cartItem = {
          ...product,
          variant: variants[selectedVariant],
          price: variants[selectedVariant]?.price || product.price,
          // ✅ Keep mainImage & variant image separate
          mainImage: product.mainImage, // Explicitly include main image
          variantImage: variants[selectedVariant]?.image // Optional: Store variant image separately
      };
      dispatch(addToCart(cartItem));
  };

    if(isLoading) return <p>Loading...</p>
    if(error) return <p>Error loading product details.</p>

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div className='section__subheader space-x-2'>
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='flex flex-col items-center md:flex-row gap-8'>
                    {/* product image */}
                    <div className='md:w-1/2 w-full'>
                        <img 
                            src={variants[selectedVariant]?.image || singleProduct?.mainImage} 
                            alt={singleProduct?.name}
                            className='rounded-md w-full h-auto'
                        />
                        
                        {/* Color Variants Selector */}
                        {variants.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Available Colors:</h4>
                                <div className="flex gap-2">
                                    {variants.map((variant, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedVariant(index)}
                                            className={`w-10 h-10 rounded-full border-2 ${selectedVariant === index ? 'border-primary' : 'border-gray-300'}`}
                                            style={{ backgroundColor: variant.color }}
                                            title={variant.name}
                                        />
                                    ))}
                                </div>
                                <p className="mt-2 text-sm">
                                    Selected: {variants[selectedVariant]?.name}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='md:w-1/2 w-full'>
                        <h3 className='text-2xl font-semibold mb-4'>{singleProduct?.name}</h3>
                        <p className='text-xl text-primary mb-4 space-x-1'>
                            ${variants[selectedVariant]?.price || singleProduct?.price} 
                            {singleProduct?.oldPrice && <s className='ml-1'>${singleProduct?.oldPrice}</s>}
                        </p>
                        <p className='text-gray-400 mb-4'>{singleProduct?.description}</p>

                        {/* additional product info */}
                        <div className='flex flex-col space-y-2'>
                            <p><strong>Category:</strong> {singleProduct?.category}</p>
                            {variants.length > 0 && (
                                <p><strong>Color:</strong> {variants[selectedVariant]?.name}</p>
                            )}
                            <div className='flex gap-1 items-center'>
                                <strong>Rating: </strong>
                                <RatingStars rating={singleProduct?.rating}/>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(singleProduct)
                            }}
                            className='mt-6 px-6 py-3 bg-primary text-white rounded-md'
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* display Reviews */} 
            <section className='section__container mt-8'>
                <ReviewsCard productReviews={productReviews}/>
            </section>
        </>
    )
}

export default SingleProduct