import React from 'react';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  const SquareRadio = ({ name, value, checked, onChange, label }) => (
    <label className='flex items-center gap-2 cursor-pointer group'>
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className='hidden peer'
      />
      <div className='w-4 h-4 rounded-sm border border-[#8D6E63] peer-checked:bg-[#8D6E63] peer-checked:border-[#5C4033] transition-all duration-200 flex items-center justify-center'>
        <div className='w-2 h-2 bg-white rounded-sm peer-checked:block hidden'></div>
      </div>
      <span className='text-sm text-[#5C4033] capitalize group-hover:text-[#3E2723]'>{label}</span>
    </label>
  );

  return (
    <div className='w-full sm:max-w-[200px] p-4 sm:p-5 -ml-4  bg-[#F5F0EB] shadow-md space-y-5 border border-[#D6CCC2]'>
      <h3 className='text-xl font-semibold text-[#5C4033]'>Filters</h3>

      {/* Categories */}
      <div className='space-y-2'>
        <h4 className='font-medium text-base text-[#8D6E63]'>Category</h4>
        <div className='space-y-1'>
          {filters.categories.map((category) => (
            <SquareRadio
              key={category}
              name='category'
              value={category}
              label={category}
              checked={filtersState.category === category}
              onChange={(e) => setFiltersState({ ...filtersState, category: e.target.value })}
            />
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div className='space-y-2'>
        <h4 className='font-medium text-base text-[#8D6E63]'>Price Range</h4>
        <div className='space-y-1'>
          {filters.priceRanges.map((range) => (
            <SquareRadio
              key={range.label}
              name='priceRange'
              value={`${range.min}-${range.max}`}
              label={range.label}
              checked={filtersState.priceRange === `${range.min}-${range.max}`}
              onChange={(e) => setFiltersState({ ...filtersState, priceRange: e.target.value })}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className='w-full bg-[#7a4b3c] hover:bg-[#d38837] text-white py-2 px-3 rounded-lg text-sm font-medium shadow-sm transition-all'
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ShopFiltering;
