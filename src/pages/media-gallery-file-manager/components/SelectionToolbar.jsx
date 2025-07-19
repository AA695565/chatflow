import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SelectionToolbar = ({ 
  isVisible, 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onDownload, 
  onDelete, 
  onShare, 
  onCancel,
  totalItems 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-100 animate-fade-in">
      <div className="flex items-center justify-between p-4">
        {/* Selection info */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <Icon name="X" size={16} className="mr-2" />
            Cancel
          </Button>
          <div className="text-sm font-medium text-foreground">
            {selectedCount} of {totalItems} selected
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Select/Deselect All */}
          {selectedCount === totalItems ? (
            <Button variant="outline" size="sm" onClick={onDeselectAll}>
              Deselect All
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              Select All
            </Button>
          )}

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              disabled={selectedCount === 0}
              className="w-10 h-10"
            >
              <Icon name="Share" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              disabled={selectedCount === 0}
              className="w-10 h-10"
            >
              <Icon name="Download" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={selectedCount === 0}
              className="w-10 h-10 text-destructive hover:text-destructive"
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar for batch operations */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: '0%' }} />
      </div>
    </div>
  );
};

export default SelectionToolbar;