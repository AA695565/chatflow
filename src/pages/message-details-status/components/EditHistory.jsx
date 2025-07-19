import React from 'react';
import Icon from '../../../components/AppIcon';

const EditHistory = ({ editHistory = [] }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!editHistory.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Edit History</h3>
      
      <div className="space-y-4">
        {editHistory.map((edit, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="Edit" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">
                  {index === 0 ? 'Current Version' : `Version ${editHistory.length - index}`}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatTimestamp(edit.timestamp)}
              </span>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-card-foreground whitespace-pre-wrap">{edit.content}</p>
            </div>
            
            {index === 0 && (
              <div className="flex items-center space-x-1 mt-2">
                <Icon name="Clock" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Edited {formatTimestamp(edit.timestamp)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} className="mt-0.5" />
          <div>
            <p>Messages can be edited within 15 minutes of sending.</p>
            <p>Edit history is visible to all participants in the conversation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHistory;