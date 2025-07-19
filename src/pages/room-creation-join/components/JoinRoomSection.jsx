import React, { useState } from 'react';
import { UserPlus, Hash } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';
import roomService from '../../../utils/roomService';

const JoinRoomSection = ({ onRoomJoined }) => {
  const { user } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setRoomCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to join a room');
      return;
    }

    if (!roomCode.trim()) {
      setError('Room code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await roomService.joinRoomByCode(roomCode.trim(), user.id);

      if (result.success) {
        onRoomJoined?.(result.data);
        setRoomCode('');
      } else {
        setError(result.error || 'Failed to join room');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <UserPlus className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Join Existing Room</h3>
          <p className="text-sm text-muted-foreground">Enter a room code to join</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!user && (
        <div className="mb-4 p-4 bg-muted/30 border border-border rounded-md">
          <p className="text-sm text-muted-foreground text-center mb-2">
            🔒 Preview Mode
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Sign in to join real chat rooms and start messaging
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomCode" className="block text-sm font-medium text-foreground mb-1">
            Room Code *
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="roomCode"
              name="roomCode"
              type="text"
              placeholder="Enter 8-character room code"
              value={roomCode}
              onChange={handleChange}
              className="pl-9 uppercase"
              maxLength={8}
              disabled={loading || !user}
              required
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Room codes are 8 characters long (e.g., CHATROOM1)
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !roomCode.trim() || !user}
          loading={loading}
        >
          {loading ? 'Joining Room...' : 'Join Room'}
        </Button>
      </form>

      {/* Sample room codes for demo */}
      <div className="mt-4 p-3 bg-muted/30 rounded-md">
        <p className="text-xs text-muted-foreground mb-2">Try these sample room codes:</p>
        <div className="flex flex-wrap gap-2">
          {['CHATROOM1', 'MEETUP22'].map((code) => (
            <button
              key={code}
              onClick={() => !loading && user && setRoomCode(code)}
              disabled={loading || !user}
              className={cn(
                "px-2 py-1 text-xs bg-muted border border-border rounded",
                "hover:bg-muted/70 transition-colors duration-150",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRoomSection;