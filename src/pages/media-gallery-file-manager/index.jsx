import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MediaTabs from './components/MediaTabs';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import MediaGrid from './components/MediaGrid';
import SelectionToolbar from './components/SelectionToolbar';
import MediaPreview from './components/MediaPreview';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MediaGalleryFileManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sender: 'all',
    fileSize: 'all',
    sortBy: 'newest'
  });

  // Mock media data
  const [allMediaData] = useState({
    photos: [
      {
        id: 'photo_1',
        name: 'vacation_beach.jpg',
        url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
        type: 'image',
        size: 2048576,
        date: '2025-01-15T10:30:00Z',
        sender: 'Alice Johnson',
        extension: 'jpg'
      },
      {
        id: 'photo_2',
        name: 'team_meeting.png',
        url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
        type: 'image',
        size: 1536000,
        date: '2025-01-14T14:20:00Z',
        sender: 'Bob Smith',
        extension: 'png'
      },
      {
        id: 'photo_3',
        name: 'project_screenshot.jpg',
        url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
        type: 'image',
        size: 892000,
        date: '2025-01-13T09:15:00Z',
        sender: 'You',
        extension: 'jpg'
      },
      {
        id: 'photo_4',
        name: 'office_party.jpg',
        url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
        type: 'image',
        size: 3200000,
        date: '2025-01-12T18:45:00Z',
        sender: 'Carol Davis',
        extension: 'jpg'
      },
      {
        id: 'photo_5',
        name: 'product_demo.png',
        url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        type: 'image',
        size: 1800000,
        date: '2025-01-11T11:30:00Z',
        sender: 'David Wilson',
        extension: 'png'
      },
      {
        id: 'photo_6',
        name: 'conference_hall.jpg',
        url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        type: 'image',
        size: 2500000,
        date: '2025-01-10T16:20:00Z',
        sender: 'Emma Brown',
        extension: 'jpg'
      }
    ],
    videos: [
      {
        id: 'video_1',
        name: 'presentation_demo.mp4',
        url: '/mock-video-1.mp4',
        thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        type: 'video',
        size: 15728640,
        date: '2025-01-14T16:45:00Z',
        sender: 'Alice Johnson',
        duration: '3:24',
        extension: 'mp4'
      },
      {
        id: 'video_2',
        name: 'team_standup.mov',
        url: '/mock-video-2.mov',
        thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
        type: 'video',
        size: 25165824,
        date: '2025-01-13T09:30:00Z',
        sender: 'Bob Smith',
        duration: '12:15',
        extension: 'mov'
      },
      {
        id: 'video_3',
        name: 'product_walkthrough.mp4',
        url: '/mock-video-3.mp4',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
        type: 'video',
        size: 42991616,
        date: '2025-01-12T14:20:00Z',
        sender: 'You',
        duration: '8:42',
        extension: 'mp4'
      }
    ],
    documents: [
      {
        id: 'doc_1',
        name: 'project_proposal.pdf',
        url: '/mock-doc-1.pdf',
        type: 'document',
        size: 1048576,
        date: '2025-01-15T08:30:00Z',
        sender: 'Alice Johnson',
        extension: 'pdf'
      },
      {
        id: 'doc_2',
        name: 'meeting_notes.docx',
        url: '/mock-doc-2.docx',
        type: 'document',
        size: 524288,
        date: '2025-01-14T13:15:00Z',
        sender: 'Bob Smith',
        extension: 'docx'
      },
      {
        id: 'doc_3',
        name: 'budget_spreadsheet.xlsx',
        url: '/mock-doc-3.xlsx',
        type: 'document',
        size: 786432,
        date: '2025-01-13T10:45:00Z',
        sender: 'Carol Davis',
        extension: 'xlsx'
      },
      {
        id: 'doc_4',
        name: 'technical_specs.pdf',
        url: '/mock-doc-4.pdf',
        type: 'document',
        size: 2097152,
        date: '2025-01-12T15:30:00Z',
        sender: 'You',
        extension: 'pdf'
      }
    ],
    audio: [
      {
        id: 'audio_1',
        name: 'voice_memo.m4a',
        url: '/mock-audio-1.m4a',
        type: 'audio',
        size: 3145728,
        date: '2025-01-14T11:20:00Z',
        sender: 'Alice Johnson',
        duration: '2:15',
        extension: 'm4a'
      },
      {
        id: 'audio_2',
        name: 'interview_recording.mp3',
        url: '/mock-audio-2.mp3',
        type: 'audio',
        size: 8388608,
        date: '2025-01-13T16:30:00Z',
        sender: 'Bob Smith',
        duration: '15:42',
        extension: 'mp3'
      }
    ]
  });

  // Calculate media counts
  const mediaCounts = {
    photos: allMediaData.photos.length,
    videos: allMediaData.videos.length,
    documents: allMediaData.documents.length,
    audio: allMediaData.audio.length
  };

  // Filter and search media items
  const getFilteredItems = useCallback(() => {
    let items = allMediaData[activeTab] || [];

    // Apply search filter
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.sender !== 'all') {
      if (filters.sender === 'me') {
        items = items.filter(item => item.sender === 'You');
      } else if (filters.sender === 'others') {
        items = items.filter(item => item.sender !== 'You');
      }
    }

    if (filters.fileSize !== 'all') {
      items = items.filter(item => {
        const sizeMB = item.size / (1024 * 1024);
        if (filters.fileSize === 'small') return sizeMB < 1;
        if (filters.fileSize === 'medium') return sizeMB >= 1 && sizeMB <= 10;
        if (filters.fileSize === 'large') return sizeMB > 10;
        return true;
      });
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      items = items.filter(item => {
        const itemDate = new Date(item.date);
        if (filters.dateRange === 'today') return itemDate >= today;
        if (filters.dateRange === 'week') return itemDate >= weekAgo;
        if (filters.dateRange === 'month') return itemDate >= monthAgo;
        return true;
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

    return items;
  }, [activeTab, searchQuery, filters, allMediaData]);

  const filteredItems = getFilteredItems();

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle filter toggle
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle item selection
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle long press (enter selection mode)
  const handleLongPress = (item) => {
    setIsSelectionMode(true);
    setSelectedItems([item.id]);
  };

  // Handle item click (preview)
  const handleItemClick = (item) => {
    const itemIndex = filteredItems.findIndex(i => i.id === item.id);
    setPreviewItem(item);
    setPreviewIndex(itemIndex);
  };

  // Handle preview navigation
  const handlePreviewNavigate = (newIndex) => {
    if (newIndex >= 0 && newIndex < filteredItems.length) {
      setPreviewIndex(newIndex);
      setPreviewItem(filteredItems[newIndex]);
    }
  };

  // Selection toolbar actions
  const handleSelectAll = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDownload = () => {
    console.log('Downloading items:', selectedItems);
    // Simulate bulk download
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleBulkDelete = () => {
    console.log('Deleting items:', selectedItems);
    // Simulate bulk delete
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleBulkShare = () => {
    console.log('Sharing items:', selectedItems);
    // Simulate bulk share
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleCancelSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/chat-room-interface');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-card border-b border-border pt-16 lg:pt-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
                Media Gallery
              </h1>
              <p className="text-sm text-muted-foreground">
                Browse and manage shared files
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
              onClick={() => console.log('Upload files')}
            >
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Media Tabs */}
      <MediaTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mediaCounts={mediaCounts}
      />

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        isFilterOpen={isFilterOpen}
      />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <MediaGrid
            items={filteredItems}
            activeTab={activeTab}
            isSelectionMode={isSelectionMode}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onItemClick={handleItemClick}
            onLongPress={handleLongPress}
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Selection Toolbar */}
      <SelectionToolbar
        isVisible={isSelectionMode}
        selectedCount={selectedItems.length}
        totalItems={filteredItems.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onDownload={handleBulkDownload}
        onDelete={handleBulkDelete}
        onShare={handleBulkShare}
        onCancel={handleCancelSelection}
      />

      {/* Media Preview */}
      <MediaPreview
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
        allItems={filteredItems}
        currentIndex={previewIndex}
        onNavigate={handlePreviewNavigate}
      />
    </div>
  );
};

export default MediaGalleryFileManager;