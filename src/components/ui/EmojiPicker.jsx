import React, { useState, useEffect } from 'react';
import { Search, Smile, Users, Leaf, Coffee, Activity, Shapes } from 'lucide-react';
import { cn } from '../../utils/cn';
import emojiService from '../../utils/emojiService';

const EmojiPicker = ({ onEmojiSelect, className, isOpen, onClose }) => {
  const [emojis, setEmojis] = useState({});
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'smileys', name: 'Smileys', icon: Smile },
    { id: 'people', name: 'People', icon: Users },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'food', name: 'Food', icon: Coffee },
    { id: 'activities', name: 'Activities', icon: Activity },
    { id: 'symbols', name: 'Symbols', icon: Shapes },
  ];

  useEffect(() => {
    loadEmojis();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchEmojis(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadEmojis = async () => {
    setLoading(true);
    const result = await emojiService.getEmojis();
    if (result.success) {
      setEmojis(result.data);
    }
    setLoading(false);
  };

  const searchEmojis = async (query) => {
    const result = await emojiService.searchEmojis(query);
    if (result.success) {
      setSearchResults(result.data);
    }
  };

  const handleEmojiClick = (emoji) => {
    onEmojiSelect?.(emoji);
    setSearchQuery('');
    onClose?.();
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "absolute bottom-full left-0 w-80 h-96 bg-card border border-border rounded-lg shadow-lg z-50",
      "flex flex-col overflow-hidden",
      className
    )}>
      {/* Header with search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex px-2 py-1 border-b border-border bg-muted/20">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex-1 p-2 rounded-md transition-colors duration-150",
                  "hover:bg-muted/50",
                  activeCategory === category.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
                title={category.name}
              >
                <IconComponent className="w-5 h-5 mx-auto" />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading emojis...</div>
          </div>
        ) : searchQuery ? (
          <div className="grid grid-cols-8 gap-1">
            {searchResults.map((emoji, index) => (
              <button
                key={`${emoji.emoji}-${index}`}
                onClick={() => handleEmojiClick(emoji.emoji)}
                className="p-2 hover:bg-muted/50 rounded text-lg transition-colors duration-150"
                title={emoji.name}
              >
                {emoji.emoji}
              </button>
            ))}
            {searchResults.length === 0 && (
              <div className="col-span-8 text-center py-8 text-sm text-muted-foreground">
                No emojis found for "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {(emojis[activeCategory] || []).map((emoji, index) => (
              <button
                key={`${activeCategory}-${emoji.emoji || emoji}-${index}`}
                onClick={() => handleEmojiClick(emoji.emoji || emoji)}
                className="p-2 hover:bg-muted/50 rounded text-lg transition-colors duration-150"
                title={emoji.name || ''}
              >
                {emoji.emoji || emoji}
              </button>
            ))}
            {(!emojis[activeCategory] || emojis[activeCategory].length === 0) && (
              <div className="col-span-8 text-center py-8 text-sm text-muted-foreground">
                No emojis in this category
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;