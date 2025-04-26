import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import RatingStars from '../../../components/RatingStars';
import ReviewsCard from '../reviews/ReviewsCard';
import bgTransparent from '../../../assets/bgTransparent.png';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false, imgWidth: 0, imgHeight: 0 });
  const [zoomSize, setZoomSize] = useState(150);
  const imgRef = useRef(null);

  const singleProduct = data?.product || {};
  const productReviews = data?.reviews || [];
  const variants = singleProduct?.variants || [];

  const media = [singleProduct?.mainImage, ...variants.map(v => v.image)].filter(Boolean);

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
    setZoomPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
      show: true
    }));
  };

  const handleMouseLeave = () => {
    setZoomPosition(prev => ({ ...prev, show: false }));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading product details.</div>;

  return (
    <>
      <section className="relative py-8 border-b border-[#D1B28C] bg-[#F5F2E1] overflow-hidden">
        <img
          src={bgTransparent}
          alt="Ceramic Background"
          className="absolute right-0 bottom-0 w-56 opacity-80 pointer-events-none select-none z-0"
          style={{ objectFit: "contain" }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-semibold text-[#5D4F3B] mb-2 tracking-wide">Product Details</h2>
          <div className="flex items-center space-x-2 text-sm text-[#8B5E3C]">
            <Link to="/" className="hover:underline hover:text-[#5D4F3B] transition-colors duration-200">
              Home
            </Link>
            <i className="ri-arrow-right-s-line text-[#D1B28C]" />
            <Link to="/shop" className="hover:underline hover:text-[#5D4F3B] transition-colors duration-200">
              Shop
            </Link>
            <i className="ri-arrow-right-s-line text-[#D1B28C]" />
            <span className="font-medium">{singleProduct.name}</span>
          </div>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image and Zoom */}
            <div className="lg:w-1/2 w-full">
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <div
                  className="relative h-[500px] w-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="aspect-square w-full h-[500px] overflow-hidden">
                    <img
                      ref={imgRef}
                      src={variants[selectedVariant]?.image || singleProduct?.mainImage}
                      alt={singleProduct?.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        setZoomPosition(prev => ({
                          ...prev,
                          imgWidth: e.target.naturalWidth,
                          imgHeight: e.target.naturalHeight
                        }));
                      }}
                    />
                  </div>

                  {zoomPosition.show && (
                    <>
                      <div
                        className="absolute border-2 border-white bg-white bg-opacity-20 pointer-events-none"
                        style={{
                          width: `${zoomSize}px`,
                          height: `${zoomSize}px`,
                          left: `calc(${zoomPosition.x}% - ${zoomSize / 2}px)`,
                          top: `calc(${zoomPosition.y}% - ${zoomSize / 2}px)`,
                        }}
                      />
                      <div
                        className="absolute left-[calc(100%+16px)] top-0 w-[400px] h-[500px] bg-white border border-gray-200 shadow-xl overflow-hidden z-50"
                        style={{
                          backgroundImage: `url(${variants[selectedVariant]?.image || singleProduct?.mainImage})`,
                          backgroundSize: `${zoomPosition.imgWidth}px ${zoomPosition.imgHeight}px`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {media.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`flex-shrink-0 w-16 h-16 border-2 rounded transition-all ${
                          index === selectedVariant ? 'border-primary' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-square w-16 h-16 overflow-hidden rounded">
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h3 className="text-3xl font-bold mb-4 text-[#5D4F3B]">{singleProduct?.name}</h3>

                <div className="flex items-center mb-6">
                  <p className="text-2xl text-[#8B5E3C] font-bold">
                    Rs. {variants[selectedVariant]?.price || singleProduct?.price}
                  </p>
                </div>

                <div className="text-gray-600 mb-6 leading-relaxed space-y-3">
                  {singleProduct?.description?.split('<br>').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex">
                    <span className="w-32 font-medium text-[#5D4F3B]">Category:</span>
                    <span className="text-gray-600">{singleProduct?.category}</span>
                  </div>

                  {variants.length > 0 && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium pt-1 text-[#5D4F3B]">Colors:</span>
                      <div className="flex flex-wrap gap-4">
                        {variants.map((variant, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedVariant(index)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                selectedVariant === index ? 'border-[#8B5E3C] scale-110' : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: variant.color }}
                              title={variant.name}
                              aria-label={`Select ${variant.name} color`}
                            />
                            <span className="text-gray-600 text-sm">{variant.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex">
                    <span className="w-32 font-medium text-[#5D4F3B]">Stock:</span>
                    <span className="text-gray-600">{variants[selectedVariant]?.stock ?? 0}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-32 font-medium text-[#5D4F3B]">Rating:</span>
                    <RatingStars rating={singleProduct?.rating} />
                    <span className="ml-2 text-gray-600">({singleProduct?.rating}/5)</span>
                  </div>
                </div>

                {/* Add to Cart Button based on user role */}
                {user?.role === 'user' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(singleProduct);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#8B5E3C] to-[#D1B28C] hover:bg-[#D1B28C] text-white rounded-md transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <i className="ri-shopping-cart-2-line" />
                    Add to Cart
                  </button>
                ) : (
                  <div className="text-center text-red-500 font-medium py-3">
                    Admins are not allowed to add products to cart.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section__container mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <ReviewsCard productReviews={productReviews} />
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
