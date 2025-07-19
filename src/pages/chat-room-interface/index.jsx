import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import RoomHeader from './components/RoomHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import roomService from '../../utils/roomService';
import messageService from '../../utils/messageService';

const ChatRoomInterface = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [realtimeSubscription, setRealtimeSubscription] = useState(null);

  useEffect(() => {
    if (roomId && user) {
      loadRoomData();
    } else if (!roomId) {
      navigate('/');
    }

    return () => {
      if (realtimeSubscription) {
        messageService.unsubscribe(realtimeSubscription);
      }
    };
  }, [roomId, user, navigate]);

  const loadRoomData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load room details
      const roomResult = await roomService.getRoomDetails(roomId);
      if (!roomResult.success) {
        setError(roomResult.error || 'Failed to load room');
        return;
      }

      setRoom(roomResult.data);

      // Load messages
      const messagesResult = await messageService.getRoomMessages(roomId, 50);
      if (messagesResult.success) {
        setMessages(messagesResult.data || []);
      }

      // Set up real-time subscription
      const subscription = messageService.subscribeToRoomMessages(roomId, handleRealtimeMessage);
      setRealtimeSubscription(subscription);

    } catch (err) {
      setError('Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeMessage = (payload) => {
    if (payload.eventType === 'INSERT') {
      // New message received
      loadMessages(); // Reload messages to get complete data
    } else if (payload.eventType === 'UPDATE') {
      // Message updated (edited)
      loadMessages();
    } else if (payload.eventType === 'DELETE') {
      // Message deleted
      setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
    }
  };

  const loadMessages = async () => {
    const result = await messageService.getRoomMessages(roomId, 50);
    if (result.success) {
      setMessages(result.data || []);
    }
  };

  const handleSendMessage = async (messageData) => {
    if (!user) return;

    setSendingMessage(true);
    
    const result = await messageService.sendMessage({
      roomId: roomId,
      senderId: user.id,
      content: messageData.content,
      type: messageData.type || 'text',
      fileUrl: messageData.fileUrl,
      fileName: messageData.fileName,
      fileSize: messageData.fileSize,
      replyTo: messageData.replyTo
    });

    if (result.success) {
      // Message will be added via real-time subscription
      return { success: true };
    } else {
      setError(result.error || 'Failed to send message');
      return { success: false, error: result.error };
    }
    
    setSendingMessage(false);
  };

  const handleEditMessage = async (messageId, newContent) => {
    const result = await messageService.editMessage(messageId, newContent);
    if (result.success) {
      // Message will be updated via real-time subscription
      return { success: true };
    } else {
      setError(result.error || 'Failed to edit message');
      return { success: false, error: result.error };
    }
  };

  const handleDeleteMessage = async (messageId, deleteType = 'for_everyone') => {
    const result = await messageService.deleteMessage(messageId, deleteType);
    if (result.success) {
      // Message will be removed via real-time subscription
      return { success: true };
    } else {
      setError(result.error || 'Failed to delete message');
      return { success: false, error: result.error };
    }
  };

  const handleReaction = async (messageId, emoji) => {
    const result = await messageService.addReaction(messageId, user.id, emoji);
    if (result.success) {
      // Reload messages to show updated reactions
      loadMessages();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse-slow">
                <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-4"></div>
              </div>
              <p className="text-muted-foreground">Loading chat room...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  🔒 Authentication Required
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to access chat rooms and start messaging
                </p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors duration-150"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted/50 transition-colors duration-150"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Room Access Error
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {error}
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors duration-150"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 lg:pt-20">
        <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex flex-col">
          {/* Room Header */}
          <RoomHeader 
            room={room}
            currentUser={userProfile}
          />
          
          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList 
              messages={messages}
              currentUser={userProfile}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onReaction={handleReaction}
              loading={loading}
            />
            
            {/* Message Input */}
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={sendingMessage}
              currentUser={userProfile}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatRoomInterface;