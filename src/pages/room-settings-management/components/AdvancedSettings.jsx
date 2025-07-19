import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AdvancedSettings = ({ settings, onUpdateSettings }) => {
  const [advancedSettings, setAdvancedSettings] = useState(settings);

  const connectionModeOptions = [
    { value: 'auto', label: 'Automatic' },
    { value: 'websocket', label: 'WebSocket Only' },
    { value: 'polling', label: 'Long Polling' },
    { value: 'hybrid', label: 'Hybrid Mode' }
  ];

  const mediaQualityOptions = [
    { value: 'original', label: 'Original Quality' },
    { value: 'high', label: 'High Quality' },
    { value: 'medium', label: 'Medium Quality' },
    { value: 'low', label: 'Low Quality (Data Saver)' }
  ];

  const autoDownloadOptions = [
    { value: 'all', label: 'All Media' },
    { value: 'images', label: 'Images Only' },
    { value: 'documents', label: 'Documents Only' },
    { value: 'none', label: 'None' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = {
      ...advancedSettings,
      [key]: value
    };
    setAdvancedSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  return (
    <div className="space-y-6">
      {/* Connection Settings */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Wifi" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Connection Settings
          </h2>
        </div>

        <div className="space-y-4">
          <Select
            label="Connection Mode"
            description="Choose how the app connects to the server"
            options={connectionModeOptions}
            value={advancedSettings.connectionMode}
            onChange={(value) => handleSettingChange('connectionMode', value)}
          />

          <Input
            label="Connection Timeout (seconds)"
            type="number"
            description="How long to wait before timing out a connection"
            value={advancedSettings.connectionTimeout}
            onChange={(e) => handleSettingChange('connectionTimeout', parseInt(e.target.value))}
            min={5}
            max={60}
          />

          <Checkbox
            label="Auto-reconnect"
            description="Automatically reconnect when connection is lost"
            checked={advancedSettings.autoReconnect}
            onChange={(e) => handleSettingChange('autoReconnect', e.target.checked)}
          />

          <Checkbox
            label="Persistent connection"
            description="Keep connection alive even when app is in background"
            checked={advancedSettings.persistentConnection}
            onChange={(e) => handleSettingChange('persistentConnection', e.target.checked)}
          />
        </div>
      </div>

      {/* Media & Bandwidth */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Image" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Media & Bandwidth
          </h2>
        </div>

        <div className="space-y-4">
          <Select
            label="Media Quality"
            description="Default quality for uploaded media"
            options={mediaQualityOptions}
            value={advancedSettings.mediaQuality}
            onChange={(value) => handleSettingChange('mediaQuality', value)}
          />

          <Select
            label="Auto-download"
            description="Automatically download media files"
            options={autoDownloadOptions}
            value={advancedSettings.autoDownload}
            onChange={(value) => handleSettingChange('autoDownload', value)}
          />

          <Input
            label="Max File Size (MB)"
            type="number"
            description="Maximum file size for uploads"
            value={advancedSettings.maxFileSize}
            onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
            min={1}
            max={100}
          />

          <Checkbox
            label="Compress images"
            description="Automatically compress images before uploading"
            checked={advancedSettings.compressImages}
            onChange={(e) => handleSettingChange('compressImages', e.target.checked)}
          />

          <Checkbox
            label="Data saver mode"
            description="Reduce data usage by limiting media quality"
            checked={advancedSettings.dataSaverMode}
            onChange={(e) => handleSettingChange('dataSaverMode', e.target.checked)}
          />
        </div>
      </div>

      {/* Performance Settings */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Performance Settings
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Message Cache Size"
            type="number"
            description="Number of messages to keep in memory"
            value={advancedSettings.messageCacheSize}
            onChange={(e) => handleSettingChange('messageCacheSize', parseInt(e.target.value))}
            min={50}
            max={1000}
          />

          <Input
            label="Scroll Buffer Size"
            type="number"
            description="Number of messages to render outside viewport"
            value={advancedSettings.scrollBufferSize}
            onChange={(e) => handleSettingChange('scrollBufferSize', parseInt(e.target.value))}
            min={10}
            max={100}
          />

          <Checkbox
            label="Virtual scrolling"
            description="Use virtual scrolling for better performance with large message lists"
            checked={advancedSettings.virtualScrolling}
            onChange={(e) => handleSettingChange('virtualScrolling', e.target.checked)}
          />

          <Checkbox
            label="Lazy load media"
            description="Load media files only when they come into view"
            checked={advancedSettings.lazyLoadMedia}
            onChange={(e) => handleSettingChange('lazyLoadMedia', e.target.checked)}
          />

          <Checkbox
            label="Preload next messages"
            description="Load upcoming messages in advance for smoother scrolling"
            checked={advancedSettings.preloadMessages}
            onChange={(e) => handleSettingChange('preloadMessages', e.target.checked)}
          />
        </div>
      </div>

      {/* Developer Options */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Code" size={20} className="text-primary" />
          <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
            Developer Options
          </h2>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Enable debug mode"
            description="Show detailed logging and debug information"
            checked={advancedSettings.debugMode}
            onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
          />

          <Checkbox
            label="Show connection status"
            description="Display connection status indicator"
            checked={advancedSettings.showConnectionStatus}
            onChange={(e) => handleSettingChange('showConnectionStatus', e.target.checked)}
          />

          <Checkbox
            label="Log network activity"
            description="Log all network requests and responses"
            checked={advancedSettings.logNetworkActivity}
            onChange={(e) => handleSettingChange('logNetworkActivity', e.target.checked)}
          />

          <Checkbox
            label="Performance monitoring"
            description="Track and report performance metrics"
            checked={advancedSettings.performanceMonitoring}
            onChange={(e) => handleSettingChange('performanceMonitoring', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;