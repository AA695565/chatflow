import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryStatus = ({ message, participants = [] }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'read':
        return (
          <div className="flex space-x-1">
            <Icon name="Check" size={16} className="text-primary" />
            <Icon name="Check" size={16} className="text-primary -ml-2" />
          </div>
        );
      case 'delivered':
        return (
          <div className="flex space-x-1">
            <Icon name="Check" size={16} className="text-muted-foreground" />
            <Icon name="Check" size={16} className="text-muted-foreground -ml-2" />
          </div>
        );
      case 'sent':
        return <Icon name="Check" size={16} className="text-muted-foreground" />;
      default:
        return <Icon name="Clock" size={16} className="text-muted-foreground" />;
    }
  };

  const statusTimestamps = {
    sent: message.sentAt || message.timestamp,
    delivered: message.deliveredAt || new Date(message.timestamp.getTime() + 30000),
    read: message.readAt || (message.status === 'read' ? new Date(message.timestamp.getTime() + 120000) : null)
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Delivery Status</h3>
        
        <div className="space-y-4">
          {/* Sent Status */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Send" size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">Sent</span>
                <span className="text-sm text-muted-foreground">
                  {formatTimestamp(statusTimestamps.sent)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivered Status */}
          {statusTimestamps.delivered && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Truck" size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-card-foreground">Delivered</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(statusTimestamps.delivered)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Read Status */}
          {statusTimestamps.read && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Eye" size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-card-foreground">Read</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(statusTimestamps.read)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group Read Receipts */}
      {participants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Read by</h3>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-secondary-foreground)" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-card-foreground">{participant.name}</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(participant.status)}
                      <span className="text-sm text-muted-foreground">
                        {participant.readAt ? formatTimestamp(participant.readAt) : 'Not read'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatus;