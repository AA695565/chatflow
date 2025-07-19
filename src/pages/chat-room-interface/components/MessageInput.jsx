import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Image, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import EmojiPicker from '../../../components/ui/EmojiPicker';
import { cn } from '../../../utils/cn';
import emojiService from '../../../utils/emojiService';

const MessageInput = ({ onSendMessage, disabled = false, currentUser }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    const messageData = {
      content: message.trim(),
      type: attachments.length > 0 ? 'image' : 'text', // Simplified for demo
      fileUrl: attachments[0]?.url || null,
      fileName: attachments[0]?.name || null,
      fileSize: attachments[0]?.size || null
    };

    const result = await onSendMessage?.(messageData);
    
    if (result?.success) {
      setMessage('');
      setAttachments([]);
      setShowEmojiPicker(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setMessage(emojiService.parseEmojis(value)); // Convert emoji shortcodes
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // For demo purposes, just show file name (real implementation would upload to storage)
    const fileAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // For preview only
    }));
    
    setAttachments(prev => [...prev, ...fileAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const isMessageEmpty = !message.trim() && attachments.length === 0;
  const canSend = !isMessageEmpty && !disabled && !uploading;

  return (
    <div className="border-t border-border bg-card">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                {attachment.type?.startsWith('image/') ? (
                  <Image className="w-4 h-4 text-primary" />
                ) : (
                  <FileText className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm text-foreground truncate max-w-32">
                  {attachment.name}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-3">
          {/* File attachment button */}
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,document/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className={cn(
                "p-2 rounded-lg transition-colors duration-150",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          {/* Message input area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message as ${currentUser?.full_name || 'User'}...`}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full px-4 py-3 pr-12 border border-border rounded-lg resize-none",
                "bg-background text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "min-h-[48px] max-h-[120px]"
              )}
            />
            
            {/* Emoji picker trigger */}
            <div className="absolute right-3 bottom-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                className={cn(
                  "p-1 rounded transition-colors duration-150",
                  "text-muted-foreground hover:text-foreground",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  showEmojiPicker && "text-primary bg-primary/10"
                )}
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Emoji Picker */}
            <EmojiPicker
              isOpen={showEmojiPicker}
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
              className="bottom-12 right-0"
            />
          </div>

          {/* Send button */}
          <div className="flex-shrink-0">
            <Button
              type="submit"
              size="sm"
              disabled={!canSend}
              className={cn(
                "p-3 rounded-lg transition-all duration-150",
                canSend 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Typing indicator or tips */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Press Enter to send, Shift+Enter for new line
          </div>
          {message.length > 0 && (
            <div>
              {message.length}/2000
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;