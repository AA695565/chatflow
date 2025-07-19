import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  onContextMenu, 
  onReaction, 
  onImageClick 
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Icon name="Check" size={14} className="text-muted-foreground" />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <Icon name="Check" size={14} className="text-muted-foreground" />
            <Icon name="Check" size={14} className="text-muted-foreground" />
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <Icon name="Check" size={14} className="text-blue-500" />
            <Icon name="Check" size={14} className="text-blue-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu?.(e, message);
  };

  const handleReactionClick = (emoji) => {
    onReaction?.(message.id, emoji);
    setShowReactions(false);
  };

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name for received messages */}
        {!isOwn && (
          <div className="text-xs text-muted-foreground mb-1 px-3">
            {message.sender}
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card border border-border rounded-bl-md'
          }`}
          onContextMenu={handleContextMenu}
        >
          {/* Text message */}
          {message.type === 'text' && (
            <div className="break-words">
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.edited && (
                <span className="text-xs opacity-70 italic"> (edited)</span>
              )}
            </div>
          )}

          {/* Image message */}
          {message.type === 'image' && (
            <div className="space-y-2">
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onImageClick?.(message.content)}
              >
                <Image
                  src={message.content}
                  alt="Shared image"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-150" />
              </div>
              {message.caption && (
                <p className="text-sm">{message.caption}</p>
              )}
            </div>
          )}

          {/* File message */}
          {message.type === 'file' && (
            <div className="flex items-center space-x-3 p-2 bg-muted/20 rounded-lg">
              <div className="flex-shrink-0">
                <Icon name="File" size={24} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.fileName}</p>
                <p className="text-xs text-muted-foreground">{message.fileSize}</p>
              </div>
              <button className="flex-shrink-0 p-1 hover:bg-muted/30 rounded">
                <Icon name="Download" size={16} />
              </button>
            </div>
          )}

          {/* Audio message */}
          {message.type === 'audio' && (
            <div className="flex items-center space-x-3 p-2">
              <button className="flex-shrink-0 p-2 bg-muted/20 rounded-full hover:bg-muted/30">
                <Icon name="Play" size={16} />
              </button>
              <div className="flex-1">
                <div className="h-1 bg-muted/30 rounded-full">
                  <div className="h-1 bg-primary rounded-full w-1/3" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{message.duration}</p>
              </div>
            </div>
          )}

          {/* Message timestamp and status */}
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            <span className="text-xs">{formatTime(message.timestamp)}</span>
            {isOwn && getStatusIcon()}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-3">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded-full text-xs hover:bg-muted/70 transition-colors duration-150"
                onClick={() => handleReactionClick(reaction.emoji)}
              >
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick reactions */}
        {showReactions && (
          <div className="flex space-x-1 mt-2 px-3">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                className="p-2 hover:bg-muted/50 rounded-full transition-colors duration-150"
                onClick={() => handleReactionClick(emoji)}
              >
                <span className="text-lg">{emoji}</span>
              </button>
            ))}
          </div>
        )}

        {/* Reaction toggle button */}
        <button
          className="mt-1 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
          onClick={() => setShowReactions(!showReactions)}
        >
          {showReactions ? 'Hide reactions' : 'Add reaction'}
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;