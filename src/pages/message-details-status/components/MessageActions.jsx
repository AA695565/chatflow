import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageActions = ({ message, onClose }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState(null);

  const handleEdit = () => {
    console.log('Edit message:', message.id);
    onClose();
    // Navigate back to chat with edit mode
    navigate('/chat-room-interface', { state: { editMessage: message } });
  };

  const handleForward = () => {
    console.log('Forward message:', message.id);
    onClose();
    navigate('/chat-room-interface', { state: { forwardMessage: message } });
  };

  const handleCopy = async () => {
    if (message.type === 'text') {
      try {
        await navigator.clipboard.writeText(message.content);
        console.log('Message copied to clipboard');
      } catch (err) {
        console.error('Failed to copy message:', err);
      }
    }
  };

  const handleDownload = () => {
    if (message.type === 'image' || message.type === 'file') {
      console.log('Download media:', message.content);
      // Simulate download
      const link = document.createElement('a');
      link.href = message.content;
      link.download = message.metadata?.filename || 'download';
      link.click();
    }
  };

  const handleDeleteConfirm = (type) => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const executeDelete = () => {
    console.log(`Delete message ${deleteType}:`, message.id);
    setShowDeleteConfirm(false);
    onClose();
    // Navigate back to chat
    navigate('/chat-room-interface');
  };

  const canEdit = () => {
    const now = new Date();
    const messageTime = new Date(message.timestamp);
    const timeDiff = (now - messageTime) / (1000 * 60); // minutes
    return timeDiff <= 15 && message.type === 'text' && message.isOwn;
  };

  const canDelete = () => {
    return message.isOwn;
  };

  if (showDeleteConfirm) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Trash2" size={32} className="text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Delete Message?
          </h3>
          <p className="text-muted-foreground">
            {deleteType === 'everyone' ?'This message will be deleted for everyone in the conversation. This action cannot be undone.' :'This message will be deleted for you only. Other participants will still see it.'
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={executeDelete}
            fullWidth
          >
            Delete {deleteType === 'everyone' ? 'for Everyone' : 'for Me'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground">Message Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Forward */}
        <Button
          variant="outline"
          onClick={handleForward}
          iconName="Forward"
          iconPosition="left"
          fullWidth
        >
          Forward
        </Button>

        {/* Copy (for text messages) */}
        {message.type === 'text' && (
          <Button
            variant="outline"
            onClick={handleCopy}
            iconName="Copy"
            iconPosition="left"
            fullWidth
          >
            Copy Text
          </Button>
        )}

        {/* Download (for media messages) */}
        {(message.type === 'image' || message.type === 'file') && (
          <Button
            variant="outline"
            onClick={handleDownload}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            Download
          </Button>
        )}

        {/* Edit (if within time limit) */}
        {canEdit() && (
          <Button
            variant="outline"
            onClick={handleEdit}
            iconName="Edit"
            iconPosition="left"
            fullWidth
          >
            Edit Message
          </Button>
        )}
      </div>

      {/* Delete Actions */}
      {canDelete() && (
        <div className="space-y-3">
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-card-foreground mb-3">Delete Options</h4>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => handleDeleteConfirm('me')}
                iconName="Trash2"
                iconPosition="left"
                fullWidth
                className="text-destructive border-destructive/20 hover:bg-destructive/5"
              >
                Delete for Me
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => handleDeleteConfirm('everyone')}
                iconName="Trash2"
                iconPosition="left"
                fullWidth
              >
                Delete for Everyone
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="mt-0.5" />
              <div>
                <p><strong>Delete for Me:</strong> Removes the message from your view only.</p>
                <p><strong>Delete for Everyone:</strong> Removes the message for all participants.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageActions;