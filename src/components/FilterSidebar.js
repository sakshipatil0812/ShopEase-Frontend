import React, { useState, useEffect } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck, FiRotateCcw } from 'react-icons/fi';

const FilterSidebar = ({ onFilterChange, currentFilters, filterOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
  });

  // Temporary filters state (before applying)
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  useEffect(() => {
    if (currentFilters) {
      const filters = {
        categories: currentFilters.categories || [],
        brands: currentFilters.brands || [],
        minPrice: currentFilters.minPrice || '',
        maxPrice: currentFilters.maxPrice || '',
        minRating: currentFilters.minRating || '',
      };
      setTempFilters(filters);
      setAppliedFilters(filters);
    }
  }, [currentFilters]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter((c) => c !== category)
      : [...tempFilters.categories, category];
    
    setTempFilters({ ...tempFilters, categories: newCategories });
  };

  const handleBrandChange = (brand) => {
    const newBrands = tempFilters.brands.includes(brand)
      ? tempFilters.brands.filter((b) => b !== brand)
      : [...tempFilters.brands, brand];
    
    setTempFilters({ ...tempFilters, brands: newBrands });
  };

  const handlePriceChange = (min, max) => {
    setTempFilters({
      ...tempFilters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleRatingChange = (rating) => {
    setTempFilters({
      ...tempFilters,
      minRating: tempFilters.minRating === rating ? '' : rating,
    });
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    onFilterChange(tempFilters);
    setIsOpen(false); // Close mobile sidebar after applying
  };

  const resetFilters = () => {
    const emptyFilters = {
      categories: [],
      brands: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return (
      appliedFilters.categories.length > 0 ||
      appliedFilters.brands.length > 0 ||
      appliedFilters.minPrice ||
      appliedFilters.maxPrice ||
      appliedFilters.minRating
    );
  };

  const hasPendingChanges = () => {
    return JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);
  };

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: 999999 },
  ];

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-purple-600 text-xl" />
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          {hasActiveFilters() && (
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
              {appliedFilters.categories.length + appliedFilters.brands.length + 
               (appliedFilters.minPrice || appliedFilters.maxPrice ? 1 : 0) + 
               (appliedFilters.minRating ? 1 : 0)} Active
            </span>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors"
        >
          <span>Category</span>
          {expandedSections.category ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions?.categories?.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tempFilters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    tempFilters.minPrice === range.min.toString() &&
                    tempFilters.maxPrice === range.max.toString()
                  }
                  onChange={() =>
                    handlePriceChange(range.min.toString(), range.max.toString())
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            {/* Custom Price Range */}
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-600 mb-2 font-medium">Custom Range</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.minPrice}
                  onChange={(e) =>
                    handlePriceChange(e.target.value, tempFilters.maxPrice)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.maxPrice}
                  onChange={(e) =>
                    handlePriceChange(tempFilters.minPrice, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      {filterOptions?.brands?.length > 0 && (
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors"
          >
            <span>Brand</span>
            {expandedSections.brand ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filterOptions.brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tempFilters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating Filter */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors"
        >
          <span>Customer Rating</span>
          {expandedSections.rating ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={tempFilters.minRating === rating.toString()}
                  onChange={() => handleRatingChange(rating.toString())}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-sm ${
                        index < rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Apply and Reset Buttons */}
      <div className="pt-4 border-t space-y-3">
        <button
          onClick={applyFilters}
          disabled={!hasPendingChanges()}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            hasPendingChanges()
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <FiCheck className="text-lg" />
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          disabled={!hasActiveFilters()}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            hasActiveFilters()
              ? 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiRotateCcw className="text-lg" />
          Reset All
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center gap-2"
      >
        <FiFilter className="text-xl" />
        {hasActiveFilters() && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform p-6 overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              <FiX />
            </button>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Collapsible */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm sticky top-20 overflow-hidden transition-all duration-300">
        {/* Collapse/Expand Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <div className="flex items-center gap-2">
            <FiFilter className="text-purple-600 text-lg" />
            <h3 className="font-bold text-gray-800">
              {isSidebarCollapsed ? 'Filters' : 'Filter Products'}
            </h3>
            {hasActiveFilters() && !isSidebarCollapsed && (
              <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {appliedFilters.categories.length + appliedFilters.brands.length + 
                 (appliedFilters.minPrice || appliedFilters.maxPrice ? 1 : 0) + 
                 (appliedFilters.minRating ? 1 : 0)}
              </span>
            )}
          </div>
          <button className="text-gray-600 hover:text-purple-600 transition-colors">
            {isSidebarCollapsed ? (
              <FiChevronDown className="text-xl" />
            ) : (
              <FiChevronUp className="text-xl" />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'max-h-0' : 'max-h-[800px]'} overflow-hidden`}>
          <div className="p-6">
            <FilterContent />
          </div>
        </div>

        {/* Collapsed View - Show Active Filters */}
        {isSidebarCollapsed && hasActiveFilters() && (
          <div className="p-4 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {appliedFilters.categories.map(cat => (
                <span key={cat} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {cat}
                </span>
              ))}
              {appliedFilters.brands.map(brand => (
                <span key={brand} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                  {brand}
                </span>
              ))}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  ₹{appliedFilters.minPrice || 0} - ₹{appliedFilters.maxPrice || '∞'}
                </span>
              )}
              {appliedFilters.minRating && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  ★ {appliedFilters.minRating}+
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterSidebar;
