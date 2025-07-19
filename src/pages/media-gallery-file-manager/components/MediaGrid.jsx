import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaGrid = ({ 
  items, 
  activeTab, 
  isSelectionMode, 
  selectedItems, 
  onItemSelect, 
  onItemClick,
  onLongPress 
}) => {
  const [loadingItems, setLoadingItems] = useState(new Set());

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleItemClick = (item, event) => {
    if (isSelectionMode) {
      event.preventDefault();
      onItemSelect(item.id);
    } else {
      onItemClick(item);
    }
  };

  const handleLongPress = (item) => {
    if (!isSelectionMode) {
      onLongPress(item);
    }
  };

  const renderMediaItem = (item) => {
    const isSelected = selectedItems.includes(item.id);
    const isLoading = loadingItems.has(item.id);

    return (
      <div
        key={item.id}
        className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
        }`}
        onClick={(e) => handleItemClick(item, e)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress(item);
        }}
      >
        {/* Selection checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-10">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'bg-primary border-primary' :'bg-white/80 border-white/80 backdrop-blur-sm'
            }`}>
              {isSelected && (
                <Icon name="Check" size={14} color="var(--color-primary-foreground)" />
              )}
            </div>
          </div>
        )}

        {/* Media content */}
        <div className="aspect-square bg-muted relative">
          {activeTab === 'photos' && (
            <Image
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
          
          {activeTab === 'videos' && (
            <div className="relative w-full h-full">
              <Image
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Icon name="Play" size={20} className="text-gray-800 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {item.duration}
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Icon 
                name={item.type === 'pdf' ? 'FileText' : item.type === 'doc' ? 'FileText' : 'File'} 
                size={32} 
                className="text-blue-600 dark:text-blue-400 mb-2" 
              />
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase">
                {item.extension}
              </span>
            </div>
          )}
          
          {activeTab === 'audio' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Icon name="Music" size={32} className="text-purple-600 dark:text-purple-400 mb-2" />
              <div className="text-xs font-medium text-purple-800 dark:text-purple-300">
                {item.duration}
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* File info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="text-white">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <div className="flex items-center justify-between text-xs opacity-90 mt-1">
              <span>{formatFileSize(item.size)}</span>
              <span>{formatDate(item.date)}</span>
            </div>
            <p className="text-xs opacity-75 mt-1">by {item.sender}</p>
          </div>
        </div>

        {/* Quick actions on hover (desktop) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden lg:flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 bg-white/80 hover:bg-white text-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Download:', item.name);
            }}
          >
            <Icon name="Download" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 bg-white/80 hover:bg-white text-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Share:', item.name);
            }}
          >
            <Icon name="Share" size={14} />
          </Button>
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon 
          name={
            activeTab === 'photos' ? 'Image' :
            activeTab === 'videos' ? 'Video' :
            activeTab === 'documents' ? 'FileText' : 'Music'
          } 
          size={64} 
          className="text-muted-foreground mb-4" 
        />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No {activeTab} found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {activeTab === 'photos' && "No photos have been shared in this room yet."}
          {activeTab === 'videos' && "No videos have been shared in this room yet."}
          {activeTab === 'documents' && "No documents have been shared in this room yet."}
          {activeTab === 'audio' && "No audio files have been shared in this room yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {items.map(renderMediaItem)}
    </div>
  );
};

export default MediaGrid;