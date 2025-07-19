import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationSettings = ({ settings, onUpdateSettings }) => {
  const [notificationSettings, setNotificationSettings] = useState(settings);

  const soundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'chime', label: 'Chime' },
    { value: 'bell', label: 'Bell' },
    { value: 'none', label: 'None' }
  ];

  const quietHoursOptions = [
    { value: 'disabled', label: 'Disabled' },
    { value: '22:00-08:00', label: '10:00 PM - 8:00 AM' },
    { value: '23:00-07:00', label: '11:00 PM - 7:00 AM' },
    { value: '00:00-09:00', label: '12:00 AM - 9:00 AM' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = {
      ...notificationSettings,
      [key]: value
    };
    setNotificationSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Bell" size={20} className="text-primary" />
        <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
          Notification Settings
        </h2>
      </div>

      <div className="space-y-6">
        {/* Message Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Message Notifications</h3>
          
          <Checkbox
            label="Enable message notifications"
            description="Receive notifications for new messages in this room"
            checked={notificationSettings.messageNotifications}
            onChange={(e) => handleSettingChange('messageNotifications', e.target.checked)}
          />

          <Checkbox
            label="Show message preview"
            description="Display message content in notifications"
            checked={notificationSettings.showPreview}
            onChange={(e) => handleSettingChange('showPreview', e.target.checked)}
            disabled={!notificationSettings.messageNotifications}
          />

          <Checkbox
            label="Notify for mentions only"
            description="Only receive notifications when mentioned"
            checked={notificationSettings.mentionsOnly}
            onChange={(e) => handleSettingChange('mentionsOnly', e.target.checked)}
            disabled={!notificationSettings.messageNotifications}
          />
        </div>

        {/* Sound Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Sound Settings</h3>
          
          <Select
            label="Notification Sound"
            description="Choose the sound for new message notifications"
            options={soundOptions}
            value={notificationSettings.soundType}
            onChange={(value) => handleSettingChange('soundType', value)}
            disabled={!notificationSettings.messageNotifications}
          />

          <Checkbox
            label="Play sound for own messages"
            description="Play notification sound for messages you send"
            checked={notificationSettings.ownMessageSound}
            onChange={(e) => handleSettingChange('ownMessageSound', e.target.checked)}
            disabled={!notificationSettings.messageNotifications || notificationSettings.soundType === 'none'}
          />
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Quiet Hours</h3>
          
          <Select
            label="Quiet Hours Schedule"
            description="Disable notifications during specified hours"
            options={quietHoursOptions}
            value={notificationSettings.quietHours}
            onChange={(value) => handleSettingChange('quietHours', value)}
          />

          <Checkbox
            label="Allow urgent notifications"
            description="Receive notifications for urgent messages during quiet hours"
            checked={notificationSettings.allowUrgent}
            onChange={(e) => handleSettingChange('allowUrgent', e.target.checked)}
            disabled={notificationSettings.quietHours === 'disabled'}
          />
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Push Notifications</h3>
          
          <Checkbox
            label="Enable push notifications"
            description="Receive notifications even when the app is closed"
            checked={notificationSettings.pushNotifications}
            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
          />

          <Checkbox
            label="Badge count on app icon"
            description="Show unread message count on the app icon"
            checked={notificationSettings.badgeCount}
            onChange={(e) => handleSettingChange('badgeCount', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;