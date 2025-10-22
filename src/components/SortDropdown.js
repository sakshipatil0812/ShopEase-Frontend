import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const SortDropdown = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  return (
    <div className="relative inline-block">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
        Sort by:
      </label>
      <div className="relative inline-block">
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortDropdown;
