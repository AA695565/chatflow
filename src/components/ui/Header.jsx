import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';


const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/', { replace: true });
  };

  const navigation = [
    { name: 'Rooms', href: '/', icon: MessageCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors duration-150"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <span className="hidden sm:block">ChatFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-150"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-foreground">
                      {userProfile?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userProfile?.email || user.email}
                    </div>
                  </div>
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20">
                      <div className="p-3 border-b border-border">
                        <div className="text-sm font-medium text-foreground">
                          {userProfile?.full_name || 'User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {userProfile?.email || user.email}
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-colors duration-150"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </button>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {!user && (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-center py-2 px-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-150"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;