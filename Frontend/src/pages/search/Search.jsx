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
      <section className="section__container bg-[#E8E5DC] py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">Search Products</h2>
        <p className="text-[#434343] text-lg">Cook and dine, in good company.</p>
      </section>

      <section className="section__container py-8 px-4">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-3xl px-4 py-3 border border-[#E8E5DC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8E5DC] focus:border-transparent text-[#525151] placeholder:text-[#2c2b2b]"
            placeholder="Search for products..."
          />
          <button
            onClick={handleSearch}
            className="bg-[#3C2E25] hover:bg-[#E8E5DC] text-white font-semibold px-6 py-3 rounded-md transition-all shadow-md w-full md:w-auto"
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
