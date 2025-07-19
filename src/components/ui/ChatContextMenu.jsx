import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const ChatContextMenu = ({ 
  isOpen, 
  onClose, 
  position = { x: 0, y: 0 }, 
  messageType = 'text',
  messageData = null,
  userRole = 'participant'
}) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [menuPosition, setMenuPosition] = useState(position);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust horizontal position if menu would overflow
      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 16;
      }

      // Adjust vertical position if menu would overflow
      if (position.y + rect.height > viewportHeight) {
        adjustedY = position.y - rect.height;
      }

      setMenuPosition({ x: adjustedX, y: adjustedY });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleMenuAction = (action) => {
    switch (action) {
      case 'message-details': navigate('/message-details-status');
        break;
      case 'media-gallery': navigate('/media-gallery-file-manager');
        break;
      case 'room-settings': navigate('/room-settings-management');
        break;
      case 'reply': console.log('Reply to message:', messageData);
        break;
      case 'forward':
        console.log('Forward message:', messageData);
        break;
      case 'copy':
        if (messageData?.text) {
          navigator.clipboard.writeText(messageData.text);
        }
        break;
      case 'delete':
        console.log('Delete message:', messageData);
        break;
      case 'edit': console.log('Edit message:', messageData);
        break;
      case 'download':
        console.log('Download media:', messageData);
        break;
      case 'star': console.log('Star message:', messageData);
        break;
      default:
        console.log('Unknown action:', action);
    }
    onClose();
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'message-details',
        label: 'Message Details',
        icon: 'Info',
        action: 'message-details'
      },
      {
        id: 'media-gallery',
        label: 'Media Gallery',
        icon: 'Image',
        action: 'media-gallery'
      }
    ];

    const messageActions = [];

    if (messageData) {
      messageActions.push(
        {
          id: 'reply',
          label: 'Reply',
          icon: 'Reply',
          action: 'reply'
        },
        {
          id: 'forward',
          label: 'Forward',
          icon: 'Forward',
          action: 'forward'
        }
      );

      if (messageType === 'text') {
        messageActions.push({
          id: 'copy',
          label: 'Copy Text',
          icon: 'Copy',
          action: 'copy'
        });
      }

      if (messageType === 'media') {
        messageActions.push({
          id: 'download',
          label: 'Download',
          icon: 'Download',
          action: 'download'
        });
      }

      messageActions.push({
        id: 'star',
        label: 'Star Message',
        icon: 'Star',
        action: 'star'
      });

      // Owner or admin actions
      if (userRole === 'creator' || messageData?.isOwn) {
        messageActions.push(
          {
            id: 'edit',
            label: 'Edit',
            icon: 'Edit',
            action: 'edit'
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: 'Trash2',
            action: 'delete',
            destructive: true
          }
        );
      }
    }

    const roomActions = [];
    if (userRole === 'creator') {
      roomActions.push({
        id: 'room-settings',
        label: 'Room Settings',
        icon: 'Settings',
        action: 'room-settings'
      });
    }

    return [...baseItems, ...messageActions, ...roomActions];
  };

  if (!isOpen) return null;

  const menuItems = getMenuItems();

  return createPortal(
    <div className="fixed inset-0 z-200">
      <div
        ref={menuRef}
        className="absolute bg-popover border border-border rounded-lg shadow-lg py-2 min-w-48 animate-scale-in"
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && index === 2 && (
              <div className="h-px bg-border my-1" />
            )}
            {index > 0 && index === menuItems.length - 1 && item.id === 'room-settings' && (
              <div className="h-px bg-border my-1" />
            )}
            <button
              onClick={() => handleMenuAction(item.action)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-150 hover:bg-muted ${
                item.destructive 
                  ? 'text-destructive hover:bg-destructive/10' :'text-popover-foreground'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={16} 
                color={item.destructive ? 'var(--color-destructive)' : 'currentColor'}
              />
              <span>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ChatContextMenu;