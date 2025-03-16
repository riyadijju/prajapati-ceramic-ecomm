import React, { useEffect, useState } from 'react'

import productsData from "../../data/products.json"
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';

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
    const [products, setProducts] = useState(productsData);
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        color: 'all',
        priceRange: ''
    });

    // fitering functions
    const applyFilters =() => {
        let filteredProducts = productsData;

        // filter by category
        if(filtersState.category && filtersState.category !== 'all'){
            filteredProducts = filteredProducts.filter(product => product.category === filtersState.category)
        }

        // filter by color
        if(filtersState.color && filtersState.color !== 'all'){
            filteredProducts = filteredProducts.filter(product => product.color === filtersState.color)
        }

        // filter by prices
        if(filtersState.priceRange){
            const [minPrice, maxPrice] = filtersState.priceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(product => product.price >= minPrice &&
            product.price <= maxPrice)
        }

        setProducts(filteredProducts)


    }

    useEffect(() => {
        applyFilters()
    }, [filtersState])

    // clear filters
    const clearFilters = () => {
        setFiltersState({
        category: 'all',
        color: 'all',
        priceRange: ''
        })
    }

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
                    <div>
                        <h3 className='text-xl font-medium mb-4'>
                            products available: {products.length}
                        </h3>
                        <ProductCards products={products}/>
                 

                        </div>
                </div>
            </section>

        </>
  )
}

export default ShopPage
