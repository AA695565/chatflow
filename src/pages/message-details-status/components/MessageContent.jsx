import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageContent = ({ message }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="bg-message-bubble border border-border rounded-lg p-4">
            <p className="text-card-foreground whitespace-pre-wrap">{message.content}</p>
            {message.isEdited && (
              <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                <Icon name="Edit" size={12} />
                <span>Edited</span>
              </div>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-message-bubble border border-border rounded-lg p-4">
            <div className="relative">
              <Image
                src={message.content}
                alt="Shared image"
                className="w-full max-w-sm rounded-lg"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Image • {message.metadata?.size || '2.4 MB'}</p>
              </div>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="bg-message-bubble border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="File" size={24} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{message.metadata?.filename || 'document.pdf'}</p>
                <p className="text-sm text-muted-foreground">
                  {message.metadata?.size || '1.2 MB'} • {message.metadata?.format || 'PDF'}
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-message-bubble border border-border rounded-lg p-4">
            <p className="text-card-foreground">{message.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={20} color="var(--color-secondary-foreground)" />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{message.sender}</h3>
            <p className="text-sm text-muted-foreground">{formatTimestamp(message.timestamp)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {message.status === 'read' && (
            <div className="flex space-x-1">
              <Icon name="Check" size={16} className="text-primary" />
              <Icon name="Check" size={16} className="text-primary -ml-2" />
            </div>
          )}
          {message.status === 'delivered' && (
            <div className="flex space-x-1">
              <Icon name="Check" size={16} className="text-muted-foreground" />
              <Icon name="Check" size={16} className="text-muted-foreground -ml-2" />
            </div>
          )}
          {message.status === 'sent' && (
            <Icon name="Check" size={16} className="text-muted-foreground" />
          )}
        </div>
      </div>
      
      {renderMessageContent()}
    </div>
  );
};

export default MessageContent;