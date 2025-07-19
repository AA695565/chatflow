import React from 'react';
import Icon from '../../../components/AppIcon';

const MediaMetadata = ({ message }) => {
  if (message.type === 'text') {
    return null;
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Music';
      case 'file':
        return 'File';
      default:
        return 'File';
    }
  };

  const metadata = message.metadata || {};
  
  // Mock metadata for demonstration
  const mockMetadata = {
    filename: metadata.filename || 'document.pdf',
    size: metadata.size || 2457600, // 2.4 MB
    format: metadata.format || 'PDF',
    dimensions: metadata.dimensions || '1920x1080',
    duration: metadata.duration || '00:02:34',
    uploadedAt: metadata.uploadedAt || message.timestamp,
    downloads: metadata.downloads || 3,
    quality: metadata.quality || 'High'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Media Information</h3>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getFileIcon(message.type)} size={24} className="text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-card-foreground">{mockMetadata.filename}</h4>
            <p className="text-sm text-muted-foreground">
              {mockMetadata.format} • {formatFileSize(mockMetadata.size)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* File Size */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">File Size</span>
            <span className="text-sm font-medium text-card-foreground">
              {formatFileSize(mockMetadata.size)}
            </span>
          </div>

          {/* Format */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Format</span>
            <span className="text-sm font-medium text-card-foreground">
              {mockMetadata.format}
            </span>
          </div>

          {/* Dimensions (for images/videos) */}
          {(message.type === 'image' || message.type === 'video') && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dimensions</span>
              <span className="text-sm font-medium text-card-foreground">
                {mockMetadata.dimensions}
              </span>
            </div>
          )}

          {/* Duration (for videos/audio) */}
          {(message.type === 'video' || message.type === 'audio') && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium text-card-foreground">
                {mockMetadata.duration}
              </span>
            </div>
          )}

          {/* Quality */}
          {(message.type === 'image' || message.type === 'video') && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quality</span>
              <span className="text-sm font-medium text-card-foreground">
                {mockMetadata.quality}
              </span>
            </div>
          )}

          {/* Upload Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Uploaded</span>
            <span className="text-sm font-medium text-card-foreground">
              {new Date(mockMetadata.uploadedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Download Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Downloads</span>
            <span className="text-sm font-medium text-card-foreground">
              {mockMetadata.downloads}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm text-card-foreground">Virus scan: Clean</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-primary" />
          <span className="text-sm text-card-foreground">End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default MediaMetadata;