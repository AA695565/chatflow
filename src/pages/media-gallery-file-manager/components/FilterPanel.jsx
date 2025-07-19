import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: 'all',
      sender: 'all',
      fileSize: 'all',
      sortBy: 'newest'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Filter panel */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-lg lg:relative lg:w-full lg:shadow-none animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-card-foreground">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto scrollbar-thin max-h-[calc(100vh-80px)]">
          {/* Date Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">Date Range</label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'custom', label: 'Custom Range' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={localFilters.dateRange === option.value}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="rounded-full"
                  />
                  <span className="text-sm text-card-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sender Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">Shared By</label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Everyone' },
                { value: 'me', label: 'Me' },
                { value: 'others', label: 'Others' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sender"
                    value={option.value}
                    checked={localFilters.sender === option.value}
                    onChange={(e) => handleFilterChange('sender', e.target.value)}
                    className="rounded-full"
                  />
                  <span className="text-sm text-card-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* File Size */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">File Size</label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Any Size' },
                { value: 'small', label: 'Small (< 1MB)' },
                { value: 'medium', label: 'Medium (1-10MB)' },
                { value: 'large', label: 'Large (> 10MB)' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="fileSize"
                    value={option.value}
                    checked={localFilters.fileSize === option.value}
                    onChange={(e) => handleFilterChange('fileSize', e.target.value)}
                    className="rounded-full"
                  />
                  <span className="text-sm text-card-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">Sort By</label>
            <div className="space-y-2">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name', label: 'File Name' },
                { value: 'size', label: 'File Size' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={localFilters.sortBy === option.value}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="rounded-full"
                  />
                  <span className="text-sm text-card-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4 border-t border-border">
            <Button variant="default" onClick={handleApplyFilters} fullWidth>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleResetFilters} fullWidth>
              Reset All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;