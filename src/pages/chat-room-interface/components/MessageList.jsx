import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import MessageBubble from './MessageBubble';
import Icon from '../../../components/AppIcon';

const MessageList = ({ 
  messages, 
  currentUserId, 
  onContextMenu, 
  onReaction, 
  onImageClick,
  isLoading = false,
  connectionStatus = 'connected'
}) => {
  const listRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);

  useEffect(() => {
    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      const randomUsers = ['Alice Johnson', 'Bob Smith', 'Carol Davis'];
      const activeTypers = Math.random() > 0.7 ? 
        randomUsers.slice(0, Math.floor(Math.random() * 2) + 1) : [];
      setTypingUsers(activeTypers);
    }, 3000);

    return () => clearInterval(typingInterval);
  }, []);

  const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested) {
      const container = listRef.current;
      if (container) {
        const { scrollHeight, clientHeight } = container;
        const isNearBottom = scrollOffset + clientHeight >= scrollHeight - 100;
        setShowScrollButton(!isNearBottom);
      }
    }
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
      setShowScrollButton(false);
    }
  };

  const MessageItem = ({ index, style }) => {
    const message = messages[index];
    const isOwn = message.senderId === currentUserId;
    
    return (
      <div style={style} className="px-4">
        <MessageBubble
          message={message}
          isOwn={isOwn}
          onContextMenu={onContextMenu}
          onReaction={onReaction}
          onImageClick={onImageClick}
        />
      </div>
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex-1 relative bg-background">
      {/* Connection Status */}
      {connectionStatus !== 'connected' && (
        <div className={`absolute top-0 left-0 right-0 z-10 bg-card border-b border-border p-2 text-center ${getConnectionStatusColor()}`}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-sm font-medium">{getConnectionStatusText()}</span>
          </div>
        </div>
      )}

      {/* Messages List */}
      {messages.length > 0 ? (
        <List
          ref={listRef}
          height={window.innerHeight - 200} // Adjust based on header/footer height
          itemCount={messages.length}
          itemSize={120} // Estimated message height
          onScroll={handleScroll}
          className="scrollbar-thin"
        >
          {MessageItem}
        </List>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-muted-foreground">
                Start the conversation by sending a message below
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-sm text-muted-foreground">
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers[typingUsers.length - 1]} are typing...`
              }
            </span>
          </div>
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-150 flex items-center justify-center z-20"
        >
          <Icon name="ChevronDown" size={20} />
        </button>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading messages...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;