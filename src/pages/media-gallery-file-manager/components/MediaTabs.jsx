import React from 'react';
import Icon from '../../../components/AppIcon';

const MediaTabs = ({ activeTab, onTabChange, mediaCounts }) => {
  const tabs = [
    { id: 'photos', label: 'Photos', icon: 'Image', count: mediaCounts.photos },
    { id: 'videos', label: 'Videos', icon: 'Video', count: mediaCounts.videos },
    { id: 'documents', label: 'Documents', icon: 'FileText', count: mediaCounts.documents },
    { id: 'audio', label: 'Audio', icon: 'Music', count: mediaCounts.audio }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 ${
              activeTab === tab.id
                ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaTabs;