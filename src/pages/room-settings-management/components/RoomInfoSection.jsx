import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoomInfoSection = ({ roomData, onUpdateRoom }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roomName, setRoomName] = useState(roomData.name);
  const [roomDescription, setRoomDescription] = useState(roomData.description);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomData.id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  const handleSaveChanges = () => {
    onUpdateRoom({
      ...roomData,
      name: roomName,
      description: roomDescription
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setRoomName(roomData.name);
    setRoomDescription(roomData.description);
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">Room Information</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Room Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter room name"
            />
          ) : (
            <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
              {roomData.name}
            </p>
          )}
        </div>

        {/* Room Description */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Enter room description"
            />
          ) : (
            <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
              {roomData.description || 'No description provided'}
            </p>
          )}
        </div>

        {/* Room ID */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Room ID
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-muted px-3 py-2 rounded-md">
              <code className="text-sm font-mono text-muted-foreground">{roomData.id}</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRoomId}
              iconName={copySuccess ? "Check" : "Copy"}
              className={copySuccess ? "text-success border-success" : ""}
            >
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Room Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Participants
            </label>
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{roomData.participants}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Created
            </label>
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{roomData.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomInfoSection;