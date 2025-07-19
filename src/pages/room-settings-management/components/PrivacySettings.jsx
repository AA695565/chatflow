import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PrivacySettings = ({ settings, onUpdateSettings }) => {
  const [privacySettings, setPrivacySettings] = useState(settings);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const retentionOptions = [
    { value: 'forever', label: 'Keep Forever' },
    { value: '1year', label: '1 Year' },
    { value: '6months', label: '6 Months' },
    { value: '3months', label: '3 Months' },
    { value: '1month', label: '1 Month' },
    { value: '1week', label: '1 Week' }
  ];

  const joinRestrictionOptions = [
    { value: 'open', label: 'Anyone with room ID' },
    { value: 'approval', label: 'Require approval' },
    { value: 'invite', label: 'Invite only' },
    { value: 'closed', label: 'Closed to new members' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = {
      ...privacySettings,
      [key]: value
    };
    setPrivacySettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  const handleDeleteRoom = () => {
    // This would typically show a confirmation dialog
    console.log('Delete room requested');
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Privacy & Security
          </h2>
        </div>

        <div className="space-y-6">
          {/* Message Retention */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-card-foreground">Message Retention</h3>
            
            <Select
              label="Message History"
              description="How long to keep message history in this room"
              options={retentionOptions}
              value={privacySettings.messageRetention}
              onChange={(value) => handleSettingChange('messageRetention', value)}
            />

            <Checkbox
              label="Auto-delete media files"
              description="Automatically delete shared media after retention period"
              checked={privacySettings.autoDeleteMedia}
              onChange={(e) => handleSettingChange('autoDeleteMedia', e.target.checked)}
            />
          </div>

          {/* Join Restrictions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-card-foreground">Join Restrictions</h3>
            
            <Select
              label="Who can join"
              description="Control who can join this room"
              options={joinRestrictionOptions}
              value={privacySettings.joinRestriction}
              onChange={(value) => handleSettingChange('joinRestriction', value)}
            />

            <Checkbox
              label="Require verification"
              description="New members must verify their identity"
              checked={privacySettings.requireVerification}
              onChange={(e) => handleSettingChange('requireVerification', e.target.checked)}
              disabled={privacySettings.joinRestriction === 'closed'}
            />
          </div>

          {/* Screenshot & Recording */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-card-foreground">Screenshot Protection</h3>
            
            <Checkbox
              label="Notify on screenshots"
              description="Alert when someone takes a screenshot"
              checked={privacySettings.screenshotNotification}
              onChange={(e) => handleSettingChange('screenshotNotification', e.target.checked)}
            />

            <Checkbox
              label="Prevent screenshots"
              description="Attempt to block screenshot functionality"
              checked={privacySettings.preventScreenshots}
              onChange={(e) => handleSettingChange('preventScreenshots', e.target.checked)}
            />

            <Checkbox
              label="Disable message forwarding"
              description="Prevent messages from being forwarded outside this room"
              checked={privacySettings.disableForwarding}
              onChange={(e) => handleSettingChange('disableForwarding', e.target.checked)}
            />
          </div>

          {/* Anonymous Participation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-card-foreground">Anonymous Participation</h3>
            
            <Checkbox
              label="Allow anonymous users"
              description="Let users join without creating an account"
              checked={privacySettings.allowAnonymous}
              onChange={(e) => handleSettingChange('allowAnonymous', e.target.checked)}
            />

            <Checkbox
              label="Hide user list"
              description="Don't show the list of participants to members"
              checked={privacySettings.hideUserList}
              onChange={(e) => handleSettingChange('hideUserList', e.target.checked)}
            />

            <Checkbox
              label="Hide read receipts"
              description="Don't show when messages are read"
              checked={privacySettings.hideReadReceipts}
              onChange={(e) => handleSettingChange('hideReadReceipts', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Export & Backup */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Download" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Export & Backup
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your room's message history and media files for backup or migration purposes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              iconName="FileText"
              iconPosition="left"
            >
              Export Messages
            </Button>
            <Button
              variant="outline"
              iconName="Image"
              iconPosition="left"
            >
              Export Media
            </Button>
            <Button
              variant="outline"
              iconName="Archive"
              iconPosition="left"
            >
              Full Backup
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-destructive" />
          <h2 className="text-lg lg:text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h3 className="font-medium text-destructive mb-2">Delete Room</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete this room and all its messages. This action cannot be undone.
              All participants will be removed and lose access to the conversation history.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Room
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-destructive" />
              <h3 className="text-lg font-semibold text-card-foreground">Delete Room</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this room? This will permanently remove:
            </p>
            
            <ul className="text-sm text-muted-foreground mb-6 space-y-1 ml-4">
              <li>• All message history</li>
              <li>• All shared media files</li>
              <li>• All participant access</li>
              <li>• Room settings and configuration</li>
            </ul>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteRoom}
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;