import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onFilterToggle, isFilterOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-lg text-sm transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-ring border-ring' : 'hover:border-muted-foreground'
              }`}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <Button
          variant={isFilterOpen ? "default" : "outline"}
          size="default"
          onClick={onFilterToggle}
          iconName="Filter"
          iconPosition="left"
          className="whitespace-nowrap"
        >
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Search suggestions (when focused and has query) */}
      {isSearchFocused && searchQuery && (
        <div className="absolute left-4 right-4 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto scrollbar-thin">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Recent searches</div>
            {[
              'vacation photos',
              'project documents',
              'meeting recording',
              'presentation.pdf'
            ].filter(item => 
              item.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="w-full text-left px-2 py-2 text-sm hover:bg-muted rounded transition-colors duration-150"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;