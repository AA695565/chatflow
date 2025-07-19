import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ModalOverlay = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
      
      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-2xl';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-300 flex items-center justify-center p-4 lg:p-6"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${getSizeClasses()} max-h-[90vh] 
          bg-card border border-border rounded-lg shadow-lg 
          animate-scale-in overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
            {title && (
              <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-auto"
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Specialized modal components for different content types
export const MessageDetailsModal = ({ isOpen, onClose, messageData }) => (
  <ModalOverlay
    isOpen={isOpen}
    onClose={onClose}
    title="Message Details"
    size="default"
  >
    <div className="p-4 lg:p-6 space-y-4">
      {messageData ? (
        <>
          <div className="space-y-2">
            <h3 className="font-medium text-card-foreground">Message Content</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{messageData.text || 'Media message'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-card-foreground">Sender</h4>
              <p className="text-sm text-muted-foreground">{messageData.sender || 'Unknown'}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-card-foreground">Timestamp</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {messageData.timestamp || new Date().toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-card-foreground">Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm text-muted-foreground">Delivered</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-card-foreground">Message ID</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {messageData.id || 'msg_' + Date.now()}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No message data available</p>
        </div>
      )}
    </div>
  </ModalOverlay>
);

export const MediaGalleryModal = ({ isOpen, onClose }) => (
  <ModalOverlay
    isOpen={isOpen}
    onClose={onClose}
    title="Media Gallery"
    size="lg"
  >
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Image" size={32} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  </ModalOverlay>
);

export const RoomSettingsModal = ({ isOpen, onClose }) => (
  <ModalOverlay
    isOpen={isOpen}
    onClose={onClose}
    title="Room Settings"
    size="default"
  >
    <div className="p-4 lg:p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-card-foreground">Room Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-card-foreground">Room Name</label>
              <input 
                type="text" 
                defaultValue="General Discussion"
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Description</label>
              <textarea 
                defaultValue="A place for general team discussions"
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-sm h-20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-card-foreground">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-card-foreground">Allow new members to join</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-card-foreground">Require approval for new members</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-card-foreground">Enable message history for new members</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </ModalOverlay>
);

export default ModalOverlay;