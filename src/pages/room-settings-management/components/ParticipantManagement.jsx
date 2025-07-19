import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ParticipantManagement = ({ participants, userRole, onUpdateParticipant, onRemoveParticipant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectParticipant = (participantId) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'creator':
        return 'Crown';
      case 'admin':
        return 'Shield';
      case 'moderator':
        return 'UserCheck';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'creator':
        return 'text-warning';
      case 'admin':
        return 'text-destructive';
      case 'moderator':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      case 'busy':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Participant Management
          </h2>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            {participants.length} members
          </span>
        </div>
        
        {userRole === 'creator' && (
          <Button
            variant="outline"
            size="sm"
            iconName="UserPlus"
            iconPosition="left"
          >
            Invite
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        {userRole === 'creator' && selectedParticipants.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="UserMinus"
            >
              Remove ({selectedParticipants.length})
            </Button>
          </div>
        )}
      </div>

      {/* Participant List */}
      <div className="space-y-3">
        {/* Select All */}
        {userRole === 'creator' && filteredParticipants.length > 1 && (
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedParticipants.length === filteredParticipants.length}
              onChange={handleSelectAll}
              className="rounded border-border"
            />
            <span className="text-sm font-medium text-card-foreground">
              Select All ({filteredParticipants.length})
            </span>
          </div>
        )}

        {filteredParticipants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
          >
            {/* Selection Checkbox */}
            {userRole === 'creator' && participant.role !== 'creator' && (
              <input
                type="checkbox"
                checked={selectedParticipants.includes(participant.id)}
                onChange={() => handleSelectParticipant(participant.id)}
                className="rounded border-border"
              />
            )}

            {/* Avatar */}
            <div className="relative">
              <Image
                src={participant.avatar}
                alt={participant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(participant.status)}`} />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-card-foreground truncate">
                  {participant.name}
                </h3>
                <Icon 
                  name={getRoleIcon(participant.role)} 
                  size={14} 
                  className={getRoleColor(participant.role)} 
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="truncate">{participant.email}</span>
                <span>•</span>
                <span className="capitalize">{participant.status}</span>
              </div>
            </div>

            {/* Last Seen */}
            <div className="text-xs text-muted-foreground text-right">
              <div>{participant.lastSeen}</div>
              <div className="capitalize">{participant.role}</div>
            </div>

            {/* Actions */}
            {userRole === 'creator' && participant.role !== 'creator' && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateParticipant(participant.id, 'promote')}
                >
                  <Icon name="ArrowUp" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="UserMinus" size={16} />
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredParticipants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No participants found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagement;