import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoomInfoSection from './components/RoomInfoSection';
import NotificationSettings from './components/NotificationSettings';
import ParticipantManagement from './components/ParticipantManagement';
import PrivacySettings from './components/PrivacySettings';
import AdvancedSettings from './components/AdvancedSettings';
import ThemeSettings from './components/ThemeSettings';

const RoomSettingsManagement = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('info');
  const [roomData, setRoomData] = useState({});
  const [participants, setParticipants] = useState([]);
  const [userRole, setUserRole] = useState('creator');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Mock room data
    setRoomData({
      id: 'ROOM123',
      name: 'General Discussion',
      description: 'A place for team discussions and updates',
      participants: 12,
      createdAt: 'Jan 15, 2025',
      creator: 'John Doe'
    });

    // Mock participants data
    setParticipants([
      {
        id: 'user_1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'creator',
        status: 'online',
        lastSeen: 'Active now'
      },
      {
        id: 'user_2',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'admin',
        status: 'online',
        lastSeen: '5 minutes ago'
      },
      {
        id: 'user_3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'moderator',
        status: 'away',
        lastSeen: '1 hour ago'
      },
      {
        id: 'user_4',
        name: 'Emily Chen',
        email: 'emily.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'participant',
        status: 'offline',
        lastSeen: '2 hours ago'
      }
    ]);

    // Mock settings data
    setSettings({
      notifications: {
        messageNotifications: true,
        showPreview: true,
        mentionsOnly: false,
        soundType: 'default',
        ownMessageSound: false,
        quietHours: '22:00-08:00',
        allowUrgent: true,
        pushNotifications: true,
        badgeCount: true
      },
      privacy: {
        messageRetention: 'forever',
        autoDeleteMedia: false,
        joinRestriction: 'open',
        requireVerification: false,
        screenshotNotification: true,
        preventScreenshots: false,
        disableForwarding: false,
        allowAnonymous: false,
        hideUserList: false,
        hideReadReceipts: false
      },
      advanced: {
        connectionMode: 'auto',
        connectionTimeout: 30,
        autoReconnect: true,
        persistentConnection: true,
        mediaQuality: 'high',
        autoDownload: 'images',
        maxFileSize: 25,
        compressImages: true,
        dataSaverMode: false,
        messageCacheSize: 500,
        scrollBufferSize: 50,
        virtualScrolling: true,
        lazyLoadMedia: true,
        preloadMessages: true,
        debugMode: false,
        showConnectionStatus: false,
        logNetworkActivity: false,
        performanceMonitoring: false
      },
      theme: {
        theme: 'system',
        accentColor: 'indigo',
        fontSize: 'base',
        useSystemFont: false,
        messageDensity: 'normal',
        showTimestamps: true,
        showAvatars: true,
        roundedBubbles: true,
        enableAnimations: true,
        reduceMotion: false
      }
    });
  }, []);

  const sections = [
    { id: 'info', label: 'Room Info', icon: 'Info' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'participants', label: 'Participants', icon: 'Users' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'theme', label: 'Theme', icon: 'Palette' },
    { id: 'advanced', label: 'Advanced', icon: 'Settings' }
  ];

  const handleUpdateRoom = (updatedRoom) => {
    setRoomData(updatedRoom);
    console.log('Room updated:', updatedRoom);
  };

  const handleUpdateSettings = (section, updatedSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: updatedSettings
    }));
    console.log(`${section} settings updated:`, updatedSettings);
  };

  const handleUpdateParticipant = (participantId, action) => {
    console.log(`${action} participant:`, participantId);
    // Handle participant role changes
  };

  const handleRemoveParticipant = (participantId) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    console.log('Participant removed:', participantId);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'info':
        return (
          <RoomInfoSection
            roomData={roomData}
            onUpdateRoom={handleUpdateRoom}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            settings={settings.notifications}
            onUpdateSettings={(updatedSettings) => handleUpdateSettings('notifications', updatedSettings)}
          />
        );
      case 'participants':
        return (
          <ParticipantManagement
            participants={participants}
            userRole={userRole}
            onUpdateParticipant={handleUpdateParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            settings={settings.privacy}
            onUpdateSettings={(updatedSettings) => handleUpdateSettings('privacy', updatedSettings)}
          />
        );
      case 'theme':
        return (
          <ThemeSettings
            settings={settings.theme}
            onUpdateSettings={(updatedSettings) => handleUpdateSettings('theme', updatedSettings)}
          />
        );
      case 'advanced':
        return (
          <AdvancedSettings
            settings={settings.advanced}
            onUpdateSettings={(updatedSettings) => handleUpdateSettings('advanced', updatedSettings)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 lg:pt-20">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/chat-room-interface')}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-card-foreground">Room Settings</h1>
                <p className="text-sm text-muted-foreground">{roomData.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <div className="flex items-center space-x-3 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/chat-room-interface')}
                  >
                    <Icon name="ArrowLeft" size={20} />
                  </Button>
                  <div>
                    <h1 className="text-lg font-semibold text-card-foreground">Room Settings</h1>
                    <p className="text-sm text-muted-foreground">{roomData.name}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-card-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={18} 
                        color={activeSection === section.id ? 'currentColor' : 'currentColor'}
                      />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile Section Selector */}
            <div className="lg:hidden">
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors duration-150 ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-card-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={20} 
                        color={activeSection === section.id ? 'currentColor' : 'currentColor'}
                      />
                      <span className="text-xs font-medium text-center">{section.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettingsManagement;