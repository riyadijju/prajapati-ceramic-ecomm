import React, { useEffect, useState } from 'react'
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const filters = {
    categories: ['all', 'tableware', 'homedecor', 'holiday', 'dinnerware'],
    artists: ['all', 'Maya Prajapati', 'Purna Prajapati', 'Tej K. Prajapati'], // example names
    priceRanges: [
        { label: 'Under Rs. 500', min: 0, max: 500 },
        { label: 'Rs. 500 - Rs. 1500', min: 500, max: 1500 },
        { label: 'Rs. 1500 - Rs. 2500', min: 1500, max: 2500 },
        { label: 'Rs. 2500 and above', min: 2500, max: Infinity }
    ]
};

const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        artist: 'all',
        priceRange: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);

    const { category, artist, priceRange } = filtersState;
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        artist: artist !== 'all' ? artist : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: ProductsPerPage,
    });
    

    // Transform products data to ensure consistent image structure
    const transformedProducts = products.map(product => ({
        ...product,
        // Ensure we always have an image URL
        displayImage: product.variants?.[0]?.image || product.mainImage
    }));

    // clear filters
    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            artist: 'all',
            priceRange: ''
        });
        setCurrentPage(1);
    }
    

    // handle page change
    const handlePageChange = (pageNumber) => {
        if(pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
        }
    }

    if (isLoading) return <div className="text-center py-8">Loading products...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error loading products: {error.message}</div>;

    const startProduct = (currentPage - 1) * ProductsPerPage + 1;
    const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);

    return (
        <>
            {/* <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Shop Page</h2>
                <p className='section__subheader'>Browse a diverse range of ceramics, from tableware to versatile home decors. Elevate your space today!</p>
            </section> */}

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left side */}
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    {/* right side */}
                    <div className="flex-1">
                        <h3 className='text-xl font-medium mb-4'>
                            Showing {startProduct} to {endProduct} of {totalProducts} products
                        </h3>
                        
                        {/* Pass the transformed products with consistent image structure */}
                        <ProductCards products={transformedProducts} />

                        {/* pagination controls */}
                        {totalPages > 1 && (
  <div className="mt-10 flex justify-center items-center gap-2 flex-wrap font-montserrat">
    <button
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage - 1)}
      className="flex items-center gap-1 px-4 py-2 bg-[#e8d8cd] text-[#5e3b2d] rounded-2xl shadow-md hover:bg-[#d8c4b8] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm">Prev</span>
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 shadow-md border 
          ${
            currentPage === index + 1
              ? 'bg-[#9b4d4d] text-white border-[#8a3f3f] shadow-lg scale-105'
              : 'bg-[#f9f3f0] text-[#5e3b2d] hover:bg-[#e2cfc3] border-[#e0d0c3]'
          }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => handlePageChange(currentPage + 1)}
      className="flex items-center gap-1 px-4 py-2 bg-[#e8d8cd] text-[#5e3b2d] rounded-2xl shadow-md hover:bg-[#d8c4b8] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-sm">Next</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
)}

                    </div>
                </div>
            </section>
        </>
    );
}

export default ShopPage;