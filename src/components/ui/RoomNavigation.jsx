import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const RoomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('join');
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    // Load recent rooms from localStorage or API
    const savedRooms = localStorage.getItem('recentRooms');
    if (savedRooms) {
      setRecentRooms(JSON.parse(savedRooms));
    } else {
      // Mock recent rooms data
      setRecentRooms([
        {
          id: 'room_1',
          name: 'General Discussion',
          participants: 12,
          lastActivity: '2 minutes ago',
          isPrivate: false,
          unreadCount: 3
        },
        {
          id: 'room_2',
          name: 'Project Alpha',
          participants: 8,
          lastActivity: '1 hour ago',
          isPrivate: true,
          unreadCount: 0
        },
        {
          id: 'room_3',
          name: 'Random Chat',
          participants: 25,
          lastActivity: '3 hours ago',
          isPrivate: false,
          unreadCount: 7
        }
      ]);
    }
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      // Simulate joining room
      console.log('Joining room with code:', roomCode);
      navigate('/chat-room-interface');
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      // Simulate creating room
      const newRoom = {
        id: 'room_' + Date.now(),
        name: roomName,
        description: roomDescription,
        isPrivate,
        participants: 1,
        lastActivity: 'Just now',
        unreadCount: 0
      };
      
      const updatedRooms = [newRoom, ...recentRooms];
      setRecentRooms(updatedRooms);
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
      
      console.log('Creating room:', newRoom);
      navigate('/chat-room-interface');
    }
  };

  const handleRoomClick = (room) => {
    console.log('Joining room:', room);
    navigate('/chat-room-interface');
  };

  const handleQuickJoin = () => {
    // Generate random room code for quick join
    const quickCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(quickCode);
    navigate('/chat-room-interface');
  };

  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Welcome to ChatFlow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with your team, friends, or communities in real-time. 
            Join an existing room or create your own space for conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'join' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Join Room
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'create' ?'bg-card text-card-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Room
              </button>
            </div>

            {/* Join Room Form */}
            {activeTab === 'join' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="LogIn" size={24} className="text-primary" />
                  <h2 className="text-xl font-semibold text-card-foreground">Join Existing Room</h2>
                </div>
                
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <Input
                    label="Room Code"
                    type="text"
                    placeholder="Enter 6-digit room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    description="Ask the room creator for the room code"
                    className="font-mono"
                    maxLength={6}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="submit" 
                      variant="default" 
                      disabled={!roomCode.trim()}
                      className="flex-1"
                    >
                      Join Room
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleQuickJoin}
                      iconName="Shuffle"
                      iconPosition="left"
                    >
                      Quick Join
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Create Room Form */}
            {activeTab === 'create' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Plus" size={24} className="text-primary" />
                  <h2 className="text-xl font-semibold text-card-foreground">Create New Room</h2>
                </div>
                
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <Input
                    label="Room Name"
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                  
                  <Input
                    label="Description (Optional)"
                    type="text"
                    placeholder="Brief description of the room"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                  />
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="private-room"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-border"
                    />
                    <label htmlFor="private-room" className="text-sm text-card-foreground">
                      Make this room private (requires approval to join)
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="default" 
                    disabled={!roomName.trim()}
                    fullWidth
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create Room
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Recent Rooms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Rooms</h3>
              <Button variant="ghost" size="sm" iconName="RefreshCw">
                Refresh
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentRooms.length > 0 ? (
                recentRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-card-foreground">{room.name}</h4>
                        {room.isPrivate && (
                          <Icon name="Lock" size={14} className="text-muted-foreground" />
                        )}
                      </div>
                      {room.unreadCount > 0 && (
                        <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Icon name="Users" size={14} />
                          <span>{room.participants}</span>
                        </span>
                        <span>{room.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent rooms</p>
                  <p className="text-sm">Create or join a room to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomNavigation;