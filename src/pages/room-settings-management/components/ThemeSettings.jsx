import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const ThemeSettings = ({ settings, onUpdateSettings }) => {
  const [themeSettings, setThemeSettings] = useState(settings);
  const [previewTheme, setPreviewTheme] = useState(settings.theme);

  const themeOptions = [
    { value: 'system', label: 'System Default' },
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (Time-based)' }
  ];

  const accentColorOptions = [
    { value: 'indigo', label: 'Indigo (Default)' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
    { value: 'teal', label: 'Teal' }
  ];

  const fontSizeOptions = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'base', label: 'Normal' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  const messageDensityOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'comfortable', label: 'Comfortable' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = {
      ...themeSettings,
      [key]: value
    };
    setThemeSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  const handlePreviewTheme = (theme) => {
    setPreviewTheme(theme);
    // Apply theme preview to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };

  const applyTheme = () => {
    handleSettingChange('theme', previewTheme);
  };

  const resetTheme = () => {
    setPreviewTheme(themeSettings.theme);
    // Reset to original theme
    if (themeSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getAccentColorPreview = (color) => {
    const colorMap = {
      indigo: '#6366f1',
      blue: '#3b82f6',
      purple: '#8b5cf6',
      green: '#10b981',
      orange: '#f59e0b',
      red: '#ef4444',
      pink: '#ec4899',
      teal: '#14b8a6'
    };
    return colorMap[color] || '#6366f1';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Palette" size={20} className="text-primary" />
        <h2 className="text-lg lg:text-xl font-semibold text-card-foreground">
          Theme Settings
        </h2>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Appearance</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePreviewTheme(option.value)}
                className={`p-3 border rounded-lg text-left transition-colors duration-150 ${
                  previewTheme === option.value
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-4 h-4 rounded-full ${
                    option.value === 'dark' ? 'bg-slate-800' :
                    option.value === 'light'? 'bg-white border border-border' : 'bg-gradient-to-r from-white to-slate-800'
                  }`} />
                  <span className="text-sm font-medium text-card-foreground">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {previewTheme !== themeSettings.theme && (
            <div className="flex space-x-3">
              <Button
                variant="default"
                size="sm"
                onClick={applyTheme}
              >
                Apply Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTheme}
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Accent Color */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Accent Color</h3>
          
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {accentColorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleSettingChange('accentColor', color.value)}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors duration-150 ${
                  themeSettings.accentColor === color.value
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: getAccentColorPreview(color.value) }}
                />
                <span className="text-xs text-card-foreground">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Typography</h3>
          
          <Select
            label="Font Size"
            description="Adjust the overall text size"
            options={fontSizeOptions}
            value={themeSettings.fontSize}
            onChange={(value) => handleSettingChange('fontSize', value)}
          />

          <Checkbox
            label="Use system font"
            description="Use your device's default system font"
            checked={themeSettings.useSystemFont}
            onChange={(e) => handleSettingChange('useSystemFont', e.target.checked)}
          />
        </div>

        {/* Message Appearance */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Message Appearance</h3>
          
          <Select
            label="Message Density"
            description="Adjust spacing between messages"
            options={messageDensityOptions}
            value={themeSettings.messageDensity}
            onChange={(value) => handleSettingChange('messageDensity', value)}
          />

          <Checkbox
            label="Show message timestamps"
            description="Display timestamp for each message"
            checked={themeSettings.showTimestamps}
            onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
          />

          <Checkbox
            label="Show user avatars"
            description="Display profile pictures next to messages"
            checked={themeSettings.showAvatars}
            onChange={(e) => handleSettingChange('showAvatars', e.target.checked)}
          />

          <Checkbox
            label="Rounded message bubbles"
            description="Use rounded corners for message bubbles"
            checked={themeSettings.roundedBubbles}
            onChange={(e) => handleSettingChange('roundedBubbles', e.target.checked)}
          />
        </div>

        {/* Animation Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Animations</h3>
          
          <Checkbox
            label="Enable animations"
            description="Show smooth transitions and animations"
            checked={themeSettings.enableAnimations}
            onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
          />

          <Checkbox
            label="Reduce motion"
            description="Minimize animations for better accessibility"
            checked={themeSettings.reduceMotion}
            onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
            disabled={!themeSettings.enableAnimations}
          />
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">Preview</h3>
          
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <div className="bg-card border border-border rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-card-foreground">
                      This is how your messages will look with the current theme settings.
                    </p>
                  </div>
                  {themeSettings.showTimestamps && (
                    <p className="text-xs text-muted-foreground mt-1">2:30 PM</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-3 justify-end">
                <div className="flex-1 flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      And this is how your own messages will appear.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;