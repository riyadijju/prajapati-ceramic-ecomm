import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from "react-redux";
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {data, error, isLoading} = useFetchProductByIdQuery(id);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [zoomPosition, setZoomPosition] = useState({ 
      x: 0, 
      y: 0, 
      show: false,
      imgWidth: 0,
      imgHeight: 0 
    });
    const [zoomSize, setZoomSize] = useState(150);
    const imgRef = useRef(null);
   
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    const variants = singleProduct?.variants || [];

    // Prepare media array
    const media = [
        singleProduct?.mainImage,
        ...variants.map(v => v.image)
    ].filter(Boolean);

    useEffect(() => {
      if (imgRef.current) {
        setZoomPosition(prev => ({
          ...prev,
          imgWidth: imgRef.current.naturalWidth,
          imgHeight: imgRef.current.naturalHeight
        }));
      }
    }, [selectedVariant]);

    const handleAddToCart = (product) => {
        const cartItem = {
            ...product,
            variant: variants[selectedVariant],
            price: variants[selectedVariant]?.price || product.price,
            mainImage: product.mainImage,
            variantImage: variants[selectedVariant]?.image,
            image: variants[selectedVariant]?.image || product.mainImage
        };
        dispatch(addToCart(cartItem));
    };

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;
        
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        
        setZoomPosition({
            x: Math.max(0, Math.min(x, 100)),
            y: Math.max(0, Math.min(y, 100)),
            show: true,
            imgWidth: zoomPosition.imgWidth,
            imgHeight: zoomPosition.imgHeight
        });
    };

    const handleMouseLeave = () => {
        setZoomPosition(prev => ({ ...prev, show: false }));
    };

    if(isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if(error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading product details.</div>;

    return (
        <>
            <section className='section__container bg-primary-light py-6'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='section__header capitalize'>Product Details</h2>
                    <div className='section__subheader space-x-2'>
                        <span className='hover:text-primary'><Link to="/">Home</Link></span>
                        <i className="ri-arrow-right-s-line"></i>
                        <span className='hover:text-primary'><Link to="/shop">Shop</Link></span>
                        <i className="ri-arrow-right-s-line"></i>
                        <span className='hover:text-primary'>{singleProduct.name}</span>
                    </div>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        {/* Product Image Section with Zoom */}
                        <div className='lg:w-1/2 w-full'>
  <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
    {/* Main Image Container */}
    <div 
      className="relative h-[400px] w-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={variants[selectedVariant]?.image || singleProduct?.mainImage}
        alt={singleProduct?.name}
        className="w-full h-full object-contain"
        onLoad={(e) => {
          setZoomPosition(prev => ({
            ...prev,
            imgWidth: e.target.naturalWidth,
            imgHeight: e.target.naturalHeight
          }));
        }}
      />
      
      {/* Zoom Lens (hover box) */}
      {zoomPosition.show && (
        <div 
          className="absolute border-2 border-white bg-white bg-opacity-20 pointer-events-none"
          style={{
            width: `${zoomSize}px`,
            height: `${zoomSize}px`,
            left: `calc(${zoomPosition.x}% - ${zoomSize/2}px)`,
            top: `calc(${zoomPosition.y}% - ${zoomSize/2}px)`,
          }}
        />
      )}
      
      {/* Zoomed Image Preview - Fixed Version */}
      {zoomPosition.show && (
        <div 
          className="absolute left-[calc(100%+16px)] top-0 w-[400px] h-[400px] bg-white border border-gray-200 shadow-xl overflow-hidden z-50"
          style={{
            backgroundImage: `url(${variants[selectedVariant]?.image || singleProduct?.mainImage})`,
            backgroundSize: `${imgRef.current?.naturalWidth}px ${imgRef.current?.naturalHeight}px`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}
    </div>
                                
                                {/* Thumbnail Navigation */}
                                {media.length > 1 && (
                                    <div className="flex gap-2 p-4 overflow-x-auto">
                                        {media.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedVariant(index)}
                                                className={`flex-shrink-0 w-16 h-16 border-2 rounded transition-all ${
                                                    index === selectedVariant 
                                                        ? 'border-primary' 
                                                        : 'border-transparent hover:border-gray-300'
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Color Variants Selector */}
                            {variants.length > 0 && (
                                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                                    <h4 className="font-medium text-lg mb-3">Available Colors:</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {variants.map((variant, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedVariant(index)}
                                                className={`w-12 h-12 rounded-full border-2 transition-all ${
                                                    selectedVariant === index 
                                                        ? 'border-primary scale-110' 
                                                        : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                                style={{ backgroundColor: variant.color }}
                                                title={variant.name}
                                                aria-label={`Select ${variant.name} color`}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-3 text-md font-medium">
                                        Selected: <span className='text-primary'>{variants[selectedVariant]?.name}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Product Details Section */}
                        <div className='lg:w-1/2 w-full'>
                            <div className='bg-white p-6 rounded-lg shadow-md h-full'>
                                <h3 className='text-3xl font-bold mb-4'>{singleProduct?.name}</h3>
                                
                                <div className='flex items-center mb-6'>
                                    <p className='text-2xl text-primary font-bold'>
                                        ${variants[selectedVariant]?.price || singleProduct?.price} 
                                    </p>
                                    {singleProduct?.oldPrice && (
                                        <s className='ml-3 text-gray-400'>${singleProduct?.oldPrice}</s>
                                    )}
                                </div>
                                
                                <p className='text-gray-600 mb-6 leading-relaxed'>{singleProduct?.description}</p>

                                {/* Product Meta Information */}
                                <div className='space-y-3 mb-8'>
                                    <div className='flex'>
                                        <span className='w-32 font-medium'>Category:</span>
                                        <span className='text-gray-600'>{singleProduct?.category}</span>
                                    </div>
                                    {variants.length > 0 && (
                                        <div className='flex'>
                                            <span className='w-32 font-medium'>Color:</span>
                                            <span className='text-gray-600'>{variants[selectedVariant]?.name}</span>
                                        </div>
                                    )}
                                    <div className='flex items-center'>
                                        <span className='w-32 font-medium'>Rating:</span>
                                        <RatingStars rating={singleProduct?.rating}/>
                                        <span className='ml-2 text-gray-600'>({singleProduct?.rating}/5)</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(singleProduct)
                                    }}
                                    className='w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-300 flex items-center justify-center gap-2'
                                >
                                    <i className="ri-shopping-cart-2-line"></i>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */} 
            <section className='section__container mt-12'>
                <div className='max-w-7xl mx-auto px-4'>
                    <ReviewsCard productReviews={productReviews}/>
                </div>
            </section>
        </>
    );
};

export default SingleProduct;