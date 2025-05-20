import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import RatingStars from '../../../components/RatingStars';
import ReviewsCard from '../reviews/ReviewsCard';
import bgTransparent from '../../../assets/bgTransparent.png';
import ReactMarkdown from 'react-markdown';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false, imgWidth: 0, imgHeight: 0 });
  const [zoomSize, setZoomSize] = useState(150);
  const imgRef = useRef(null);

  const product = data?.product || {};
  const productReviews = data?.reviews || [];
  const variants = product.variants || [];
  const variant = variants[selectedVariant] || {};
  const media = [product.mainImage, ...variants.map(v => v.image)].filter(Boolean);

  useEffect(() => {
    if (imgRef.current) {
      setZoomPosition(prev => ({
        ...prev,
        imgWidth: imgRef.current.naturalWidth,
        imgHeight: imgRef.current.naturalHeight
      }));
    }
  }, [selectedVariant]);

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

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      variant,
      price: variant.price || product.price,
      mainImage: product.mainImage,
      variantImage: variant.image,
      image: variant.image || product.mainImage
    };
    dispatch(addToCart(cartItem));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading product.</div>;

  return (
    <>
      <section className="py-8 border-b border-[#E8E5DC] bg-[#E8E5DC] relative overflow-hidden">
        <img src={bgTransparent} alt="" className="absolute bottom-0 right-0 w-56 opacity-80 pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-semibold text-[#5D4F3B] mb-2">Product Details</h2>
          <div className="flex items-center space-x-2 text-sm text-[#8B5E3C]">
            <Link to="/" className="hover:underline hover:text-[#5D4F3B]">Home</Link>
            <i className="ri-arrow-right-s-line text-[#D1B28C]" />
            <Link to="/shop" className="hover:underline hover:text-[#5D4F3B]">Shop</Link>
            <i className="ri-arrow-right-s-line text-[#D1B28C]" />
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
          
          {/* Zoom Image Section */}
          <div className="lg:w-1/2 w-full">
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
              <div
                className="relative h-[500px] w-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imgRef}
                  src={variant.image || product.mainImage}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                  onLoad={(e) => {
                    setZoomPosition(prev => ({
                      ...prev,
                      imgWidth: e.target.naturalWidth,
                      imgHeight: e.target.naturalHeight
                    }));
                  }}
                />

                {/* Zoom lens */}
                {zoomPosition.show && (
                  <div
                    className="absolute border-2 border-white bg-white bg-opacity-20 pointer-events-none"
                    style={{
                      width: `${zoomSize}px`,
                      height: `${zoomSize}px`,
                      left: `calc(${zoomPosition.x}% - ${zoomSize / 2}px)`,
                      top: `calc(${zoomPosition.y}% - ${zoomSize / 2}px)`,
                    }}
                  />
                )}

                {/* Zoom preview */}
                {zoomPosition.show && (
                  <div
                    className="fixed top-24 right-12 w-[400px] h-[500px] bg-white border border-gray-200 shadow-2xl z-50"
                    style={{
                      backgroundImage: `url(${variant.image || product.mainImage})`,
                      backgroundSize: `${zoomPosition.imgWidth}px ${zoomPosition.imgHeight}px`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: "no-repeat"
                    }}
                  />
                )}
              </div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {media.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`w-16 h-16 border-2 rounded ${
                        selectedVariant === index ? 'border-[#8B5E3C]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <h3 className="text-3xl font-bold mb-4 text-[#5D4F3B]">{variant.name}</h3>
              <p className="text-2xl text-[#8B5E3C] font-bold mb-6">Rs. {variant.price}</p>

              <div className="text-gray-600 mb-6 leading-relaxed prose max-w-none whitespace-pre-line">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>

              <div className="mb-4">
                <div className="font-medium text-[#5D4F3B]">Category: <span className="text-gray-600">{product.category}</span></div>
              </div>

              {variants.length > 0 && (
                <div className="mb-4">
                  <div className="font-medium text-[#5D4F3B] mb-1">Colors:</div>
                  <div className="flex gap-4">
                    {variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(i)}
                        className={`w-6 h-6 rounded-full border-2 ${selectedVariant === i ? 'border-[#8B5E3C]' : 'border-gray-300'}`}
                        style={{ backgroundColor: v.color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="font-medium text-[#5D4F3B]">Stock: <span className="text-gray-600">{variant.stock}</span></div>
              </div>

              <div className="flex items-center mb-6">
                <span className="font-medium text-[#5D4F3B] mr-2">Rating:</span>
                <RatingStars rating={product.rating} />
                <span className="ml-2 text-gray-600">({product.rating}/5)</span>
              </div>

              {/* Add to Cart */}
              {!user || user.role === 'user' ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-gradient-to-r from-[#8B5E3C] to-[#D1B28C] text-white rounded-md hover:opacity-90 transition-all"
                >
                  <i className="ri-shopping-cart-2-line mr-2" />
                  Add to Cart
                </button>
              ) : (
                <p className="text-center text-[#8B5E3C] font-medium py-3">
                  {/* Admins are not allowed to add products to cart. */}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section__container mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <ReviewsCard productReviews={productReviews} />
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
