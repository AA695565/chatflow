import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaPreview = ({ isOpen, onClose, item, allItems, currentIndex, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < allItems.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, allItems.length, onClose, onNavigate]);

  const handleDownload = () => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      console.log('Downloaded:', item.name);
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        url: item.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(item.url);
      console.log('Link copied to clipboard');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !item) return null;

  return createPortal(
    <div className="fixed inset-0 z-300 bg-black/90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-white">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <Icon name="X" size={20} />
            </Button>
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm opacity-75">
                {currentIndex + 1} of {allItems.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="text-white hover:bg-white/20"
            >
              <Icon name="Share" size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDownload}
              disabled={isLoading}
              className="text-white hover:bg-white/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="Download" size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 text-white hover:bg-white/20 z-10"
        >
          <Icon name="ChevronLeft" size={24} />
        </Button>
      )}
      
      {currentIndex < allItems.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 text-white hover:bg-white/20 z-10"
        >
          <Icon name="ChevronRight" size={24} />
        </Button>
      )}

      {/* Media content */}
      <div className="w-full h-full flex items-center justify-center p-16">
        {item.type === 'image' && (
          <Image
            src={item.url}
            alt={item.name}
            className="max-w-full max-h-full object-contain"
            onError={() => setError('Failed to load image')}
          />
        )}
        
        {item.type === 'video' && (
          <video
            controls
            className="max-w-full max-h-full"
            onError={() => setError('Failed to load video')}
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {item.type === 'audio' && (
          <div className="bg-card rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <Icon name="Music" size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="font-medium text-card-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">Audio File</p>
            </div>
            <audio controls className="w-full">
              <source src={item.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        
        {item.type === 'document' && (
          <div className="bg-card rounded-lg p-8 max-w-md w-full text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="font-medium text-card-foreground mb-2">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {item.extension?.toUpperCase()} Document
            </p>
            <Button variant="default" onClick={handleDownload} disabled={isLoading}>
              {isLoading ? 'Downloading...' : 'Download to View'}
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-card rounded-lg p-8 max-w-md w-full text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
            <h3 className="font-medium text-card-foreground mb-2">Error Loading File</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}
      </div>

      {/* Footer with file info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="text-white text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="opacity-75">Shared by {item.sender}</p>
            </div>
            <div className="text-right">
              <p>{formatFileSize(item.size)}</p>
              <p className="opacity-75">{formatDate(item.date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MediaPreview;