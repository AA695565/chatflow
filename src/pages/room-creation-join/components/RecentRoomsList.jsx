import React from 'react';
import { Clock, Users, Lock, Globe, MessageCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useAuth } from '../../../contexts/AuthContext';

const RecentRoomsList = ({ rooms = [], loading = false, onRoomSelect }) => {
  const { user } = useAuth();

  // Sample rooms for preview mode
  const sampleRooms = [
    {
      id: '1',
      name: 'General Chat',
      room_code: 'CHATROOM1',
      room_type: 'public',
      created_at: '2025-01-19T10:00:00Z',
      userRole: 'member',
      user_profiles: { full_name: 'Admin User' }
    },
    {
      id: '2',
      name: 'Tech Meetup',
      room_code: 'MEETUP22',
      room_type: 'private',
      created_at: '2025-01-18T15:30:00Z',
      userRole: 'member',
      user_profiles: { full_name: 'Alice Johnson' }
    }
  ];

  const displayRooms = user ? rooms : sampleRooms;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const getRoomIcon = (roomType) => {
    return roomType === 'private' ? Lock : Globe;
  };

  const handleRoomClick = (room) => {
    if (user && onRoomSelect) {
      onRoomSelect(room);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Clock className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Rooms</h3>
          <p className="text-sm text-muted-foreground">
            {user ? 'Your recent conversations' : 'Sample rooms available'}
          </p>
        </div>
      </div>

      {!user && (
        <div className="mb-4 p-4 bg-muted/30 border border-border rounded-md">
          <p className="text-sm text-muted-foreground text-center mb-2">
            📋 Preview Mode
          </p>
          <p className="text-xs text-muted-foreground text-center">
            These are sample rooms. Sign in to see your actual conversations
          </p>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : displayRooms.length > 0 ? (
          displayRooms.slice(0, 5).map((room) => {
            const RoomIcon = getRoomIcon(room.room_type);
            return (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-border transition-colors duration-150",
                  user 
                    ? "hover:bg-muted/30 cursor-pointer" :"opacity-75 cursor-default",
                  !user && "bg-muted/10"
                )}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RoomIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {room.name}
                    </h4>
                    {room.userRole === 'admin' && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{room.room_code}</span>
                    <span>•</span>
                    <span>{formatDate(room.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>
                      Created by {room.user_profiles?.full_name || 'Unknown'}
                    </span>
                  </div>
                </div>
                {user && (
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-muted/30 rounded-lg mb-3 mx-auto w-fit">
              <MessageCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {user ? 'No recent rooms' : 'Sample rooms shown above'}
            </p>
            <p className="text-xs text-muted-foreground">
              {user 
                ? 'Create or join a room to start chatting' :'Sign in to see your actual room history'}
            </p>
          </div>
        )}
      </div>

      {user && displayRooms.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Showing 5 of {displayRooms.length} rooms
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentRoomsList;