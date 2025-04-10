import React, { useEffect, useState } from 'react'
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const filters = {
    categories: ['all', 'tableware', 'homedecor', 'holiday', 'dinnerware'],
    colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'],
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
        color: 'all',
        priceRange: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);

    const { category, color, priceRange } = filtersState;
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        color: color !== 'all' ? color : '',
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
            color: 'all',
            priceRange: ''
        });
        setCurrentPage(1); // Reset to first page when clearing filters
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
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Shop Page</h2>
                <p className='section__subheader'>Browse a diverse range of ceramics, from tableware to versatile home decors. Elevate your space today!</p>
            </section>

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
                            <div className='mt-6 flex justify-center flex-wrap gap-2'>
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50'
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 ${
                                            currentPage === index + 1 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-300 text-gray-700'
                                        } rounded-md`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50'
                                >
                                    Next
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