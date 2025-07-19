import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import MessageContent from './components/MessageContent';
import DeliveryStatus from './components/DeliveryStatus';
import EditHistory from './components/EditHistory';
import MessageActions from './components/MessageActions';
import MediaMetadata from './components/MediaMetadata';

const MessageDetailsStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('status');
  const [message, setMessage] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Get message data from navigation state or mock data
    const messageData = location.state?.message || {
      id: 'msg_1737301066840',
      sender: 'Sarah Johnson',
      content: `Hey team! I've finished reviewing the project proposal and I think we're on the right track. The technical specifications look solid, but I have a few suggestions for the user interface design.\n\nCould we schedule a quick call tomorrow to discuss the implementation timeline?`,
      type: 'text',
      timestamp: new Date('2025-01-19T14:30:00'),
      status: 'read',
      isOwn: false,
      isEdited: true,
      sentAt: new Date('2025-01-19T14:30:00'),
      deliveredAt: new Date('2025-01-19T14:30:30'),
      readAt: new Date('2025-01-19T14:32:15'),
      metadata: {
        messageId: 'msg_1737301066840',
        roomId: 'room_general_discussion'
      }
    };

    setMessage(messageData);

    // Mock participants data for group chat
    setParticipants([
      {
        id: 'user_1',
        name: 'Alex Chen',
        status: 'read',
        readAt: new Date('2025-01-19T14:31:45')
      },
      {
        id: 'user_2',
        name: 'Maria Rodriguez',
        status: 'read',
        readAt: new Date('2025-01-19T14:33:20')
      },
      {
        id: 'user_3',
        name: 'David Kim',
        status: 'delivered',
        readAt: null
      },
      {
        id: 'user_4',
        name: 'Emma Wilson',
        status: 'read',
        readAt: new Date('2025-01-19T14:35:10')
      }
    ]);
  }, [location.state]);

  const handleClose = () => {
    navigate('/chat-room-interface');
  };

  const handlePrevMessage = () => {
    console.log('Navigate to previous message');
    // In a real app, this would load the previous message in the conversation
  };

  const handleNextMessage = () => {
    console.log('Navigate to next message');
    // In a real app, this would load the next message in the conversation
  };

  // Mock edit history data
  const editHistory = message?.isEdited ? [
    {
      content: message.content,
      timestamp: new Date('2025-01-19T14:30:00')
    },
    {
      content: `Hey team! I've finished reviewing the project proposal and I think we're on the right track. The technical specifications look solid, but I have a few suggestions for the user interface design.\n\nCould we schedule a call tomorrow to discuss?`,
      timestamp: new Date('2025-01-19T14:31:30')
    },
    {
      content: `Hey team! I've finished reviewing the project proposal and I think we're on the right track. The technical specifications look solid.`,
      timestamp: new Date('2025-01-19T14:30:00')
    }
  ] : [];

  if (!message) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading message details...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'status', label: 'Status', icon: 'CheckCircle' },
    { id: 'actions', label: 'Actions', icon: 'Settings' },
    ...(message.isEdited ? [{ id: 'history', label: 'History', icon: 'History' }] : []),
    ...(message.type !== 'text' ? [{ id: 'metadata', label: 'Media Info', icon: 'Info' }] : [])
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-200 bg-black/50 backdrop-blur-sm pt-16 lg:pt-20">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-card-foreground">Message Details</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Navigation arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMessage}
                  className="w-8 h-8"
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMessage}
                  className="w-8 h-8"
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="w-8 h-8"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto scrollbar-thin max-h-[calc(90vh-120px)]">
              <div className="p-4 lg:p-6 space-y-6">
                {/* Message Content */}
                <MessageContent message={message} />

                {/* Tab Navigation */}
                <div className="flex bg-muted rounded-lg p-1 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-card text-card-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === 'status' && (
                    <DeliveryStatus message={message} participants={participants} />
                  )}
                  
                  {activeTab === 'actions' && (
                    <MessageActions message={message} onClose={handleClose} />
                  )}
                  
                  {activeTab === 'history' && message.isEdited && (
                    <EditHistory editHistory={editHistory} />
                  )}
                  
                  {activeTab === 'metadata' && message.type !== 'text' && (
                    <MediaMetadata message={message} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsStatus;