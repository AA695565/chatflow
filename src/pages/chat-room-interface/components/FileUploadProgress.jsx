import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadProgress = ({ uploads, onCancel, onRetry }) => {
  if (!uploads || uploads.length === 0) return null;

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    if (fileType.includes('pdf')) return 'FileText';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      case 'paused':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return 'Upload';
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      case 'paused':
        return 'Pause';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-card-foreground">File Uploads</h4>
        <span className="text-sm text-muted-foreground">
          {uploads.filter(u => u.status === 'completed').length} of {uploads.length} completed
        </span>
      </div>

      {uploads.map((upload) => (
        <div key={upload.id} className="space-y-2">
          <div className="flex items-center space-x-3">
            {/* File Icon */}
            <div className="flex-shrink-0">
              <Icon 
                name={getFileIcon(upload.file.type)} 
                size={20} 
                className="text-muted-foreground" 
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {upload.file.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(upload.status)} 
                    size={16} 
                    className={getStatusColor(upload.status)} 
                  />
                  {upload.status === 'uploading' && (
                    <span className="text-xs text-muted-foreground">
                      {upload.progress}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(upload.file.size)}</span>
                {upload.status === 'uploading' && (
                  <span>{formatFileSize(upload.uploadedBytes)} / {formatFileSize(upload.file.size)}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {upload.status === 'uploading' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancel?.(upload.id)}
                  className="w-6 h-6"
                >
                  <Icon name="X" size={12} />
                </Button>
              )}
              
              {upload.status === 'error' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRetry?.(upload.id)}
                  className="w-6 h-6"
                >
                  <Icon name="RotateCcw" size={12} />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {upload.status === 'uploading' && (
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          )}

          {/* Error Message */}
          {upload.status === 'error' && upload.error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded p-2">
              {upload.error}
            </p>
          )}
        </div>
      ))}

      {/* Overall Progress */}
      {uploads.some(u => u.status === 'uploading') && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-card-foreground font-medium">
              {Math.round(uploads.reduce((acc, u) => acc + (u.progress || 0), 0) / uploads.length)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${uploads.reduce((acc, u) => acc + (u.progress || 0), 0) / uploads.length}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadProgress;