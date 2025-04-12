import React, { useState } from 'react';
import productsData from '../../data/products.json';
import ProductCards from '../shop/ProductCards';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = productsData.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <section className="section__container bg-[#fff8f2] py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#5a3928] mb-2">Search Products</h2>
        <p className="text-[#8c6650] text-lg">Cook and dine, in good company.</p>
      </section>

      <section className="section__container py-8 px-4">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-3xl px-4 py-3 border border-[#d6c2b5] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a1603e] focus:border-transparent text-[#5a3928] placeholder:text-[#b08a70]"
            placeholder="Search for products..."
          />
          <button
            onClick={handleSearch}
            className="bg-[#a1603e] hover:bg-[#8e4e31] text-white font-semibold px-6 py-3 rounded-md transition-all shadow-md w-full md:w-auto"
          >
            Search
          </button>
        </div>

        <ProductCards products={filteredProducts} />
      </section>
    </>
  );
};

export default Search;
