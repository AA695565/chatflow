import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import WelcomeHeader from './components/WelcomeHeader';
import CreateRoomSection from './components/CreateRoomSection';
import JoinRoomSection from './components/JoinRoomSection';
import RecentRoomsList from './components/RecentRoomsList';
import roomService from '../../utils/roomService';

const RoomCreationJoin = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userRooms, setUserRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (user && userProfile) {
      loadUserRooms();
    }
  }, [user, userProfile]);

  const loadUserRooms = async () => {
    if (!user?.id) return;
    
    setLoadingRooms(true);
    const result = await roomService.getUserRooms(user.id);
    if (result.success) {
      setUserRooms(result.data || []);
    }
    setLoadingRooms(false);
  };

  const handleRoomCreated = (room) => {
    navigate(`/room/${room.id}`);
  };

  const handleRoomJoined = (room) => {
    navigate(`/room/${room.id}`);
  };

  const handleRoomSelect = (room) => {
    navigate(`/room/${room.id}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse-slow">
                <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-4"></div>
              </div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show preview mode for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Preview Mode Banner */}
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  🚀 Preview Mode - ChatFlow Messaging App
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This is a preview of the ChatFlow interface. Sign in to create and join real chat rooms!
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

            <WelcomeHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Actions */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CreateRoomSection />
                  <JoinRoomSection />
                </div>
                
                {/* Quick Actions */}
                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">1</span>
                      </div>
                      <h4 className="font-medium text-card-foreground mb-1">Create</h4>
                      <p className="text-xs text-muted-foreground">Generate room ID</p>
                    </div>
                    
                    <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-accent font-semibold text-sm">2</span>
                      </div>
                      <h4 className="font-medium text-card-foreground mb-1">Share</h4>
                      <p className="text-xs text-muted-foreground">Invite others</p>
                    </div>
                    
                    <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                      <div className="w-10 h-10 bg-success/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-success font-semibold text-sm">3</span>
                      </div>
                      <h4 className="font-medium text-card-foreground mb-1">Chat</h4>
                      <p className="text-xs text-muted-foreground">Start messaging</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Rooms Sidebar */}
              <div className="lg:col-span-1">
                <RecentRoomsList />
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <WelcomeHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CreateRoomSection onRoomCreated={handleRoomCreated} />
                <JoinRoomSection onRoomJoined={handleRoomJoined} />
              </div>
              
              {/* Quick Actions */}
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">1</span>
                    </div>
                    <h4 className="font-medium text-card-foreground mb-1">Create</h4>
                    <p className="text-xs text-muted-foreground">Generate room ID</p>
                  </div>
                  
                  <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm">2</span>
                    </div>
                    <h4 className="font-medium text-card-foreground mb-1">Share</h4>
                    <p className="text-xs text-muted-foreground">Invite others</p>
                  </div>
                  
                  <div className="text-center p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                    <div className="w-10 h-10 bg-success/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-success font-semibold text-sm">3</span>
                    </div>
                    <h4 className="font-medium text-card-foreground mb-1">Chat</h4>
                    <p className="text-xs text-muted-foreground">Start messaging</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Rooms Sidebar */}
            <div className="lg:col-span-1">
              <RecentRoomsList 
                rooms={userRooms}
                loading={loadingRooms}
                onRoomSelect={handleRoomSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomCreationJoin;