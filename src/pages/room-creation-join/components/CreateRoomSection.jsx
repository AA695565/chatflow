import React, { useState } from 'react';
import { Plus, Users, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import roomService from '../../../utils/roomService';

const CreateRoomSection = ({ onRoomCreated }) => {
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    maxParticipants: '100'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roomTypes = [
    { value: 'public', label: 'Public Room' },
    { value: 'private', label: 'Private Room' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to create a room');
      return;
    }

    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await roomService.createRoom({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        ownerId: user.id
      });

      if (result.success) {
        onRoomCreated?.(result.data);
        setFormData({
          name: '',
          description: '',
          type: 'public',
          maxParticipants: '100'
        });
      } else {
        setError(result.error || 'Failed to create room');
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
        <div className="p-2 bg-primary/10 rounded-lg">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Create New Room</h3>
          <p className="text-sm text-muted-foreground">Start a new conversation space</p>
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
            Sign in to create real chat rooms and start messaging
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-foreground mb-1">
            Room Name *
          </label>
          <Input
            id="roomName"
            name="name"
            type="text"
            placeholder="Enter room name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading || !user}
            required
          />
        </div>

        <div>
          <label htmlFor="roomDescription" className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            id="roomDescription"
            name="description"
            placeholder="Optional room description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading || !user}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-foreground mb-1">
              Room Type
            </label>
            <Select
              id="roomType"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading || !user}
              options={roomTypes}
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-foreground mb-1">
              Max Participants
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                placeholder="100"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="pl-9"
                min="2"
                max="1000"
                disabled={loading || !user}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !formData.name.trim() || !user}
          loading={loading}
        >
          {loading ? 'Creating Room...' : 'Create Room'}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-muted/30 rounded-md">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Settings className="w-3 h-3" />
          <span>Room Settings</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Public rooms are discoverable by anyone</li>
          <li>• Private rooms require an invitation</li>
          <li>• You can modify settings after creation</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateRoomSection;