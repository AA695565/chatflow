import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoomHeader = ({ roomData, onMenuClick }) => {
  const navigate = useNavigate();
  const [showParticipants, setShowParticipants] = useState(false);

  const handleBackClick = () => {
    navigate('/room-creation-join');
  };

  const handleRoomInfoClick = () => {
    navigate('/room-settings-management');
  };

  const handleMediaGalleryClick = () => {
    navigate('/media-gallery-file-manager');
  };

  const getOnlineStatus = () => {
    const onlineCount = roomData.participants.filter(p => p.status === 'online').length;
    return `${onlineCount} online`;
  };

  return (
    <div className="relative">
      {/* Main Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="lg:hidden"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>

          <div className="flex items-center space-x-3">
            {/* Room Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Users" size={20} color="var(--color-primary-foreground)" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-card rounded-full" />
            </div>

            {/* Room Info */}
            <div className="flex flex-col">
              <h1 className="font-semibold text-foreground text-lg">
                {roomData.name}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{roomData.participants.length} members</span>
                <span>•</span>
                <span>{getOnlineStatus()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowParticipants(!showParticipants)}
            className="hidden lg:flex"
          >
            <Icon name="Users" size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleMediaGalleryClick}
          >
            <Icon name="Image" size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRoomInfoClick}
          >
            <Icon name="Settings" size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
          >
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      {/* Participants Panel (Desktop) */}
      {showParticipants && (
        <div className="absolute top-full right-0 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-popover-foreground">
                Participants ({roomData.participants.length})
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowParticipants(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              {roomData.participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg">
                  <div className="relative">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="var(--color-secondary-foreground)" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-popover rounded-full ${
                      participant.status === 'online' ? 'bg-success' : 
                      participant.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-popover-foreground truncate">
                        {participant.name}
                      </p>
                      {participant.role === 'admin' && (
                        <Icon name="Crown" size={12} className="text-warning flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {participant.status}
                    </p>
                  </div>

                  {participant.isTyping && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomHeader;