import { supabase } from './supabase';

class EmojiService {
  // Get all emoji presets
  async getEmojiPresets() {
    try {
      const { data, error } = await supabase
        .from('emoji_presets')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      // Group emojis by category
      const groupedEmojis = data?.reduce((acc, emoji) => {
        const category = emoji.category || 'other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(emoji);
        return acc;
      }, {}) || {};

      return { success: true, data: groupedEmojis };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load emojis.' };
    }
  }

  // Search emojis
  async searchEmojis(query) {
    try {
      const { data, error } = await supabase
        .from('emoji_presets')
        .select('*')
        .or(`name.ilike.%${query}%,keywords.cs.{${query}}`);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to search emojis.' };
    }
  }

  // Get frequently used emojis for a user
  async getUserFrequentEmojis(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('emoji, count(*)')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .group('emoji')
        .order('count', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to load frequent emojis.' };
    }
  }

  // Default emoji categories and data for client-side fallback
  getDefaultEmojis() {
    return {
      smileys: [
        { emoji: '😀', name: 'grinning face', keywords: ['happy', 'smile', 'grin'] },
        { emoji: '😂', name: 'face with tears of joy', keywords: ['laugh', 'funny', 'lol'] },
        { emoji: '😍', name: 'smiling face with heart-eyes', keywords: ['love', 'heart', 'like'] },
        { emoji: '😊', name: 'smiling face with smiling eyes', keywords: ['happy', 'smile', 'joy'] },
        { emoji: '😎', name: 'smiling face with sunglasses', keywords: ['cool', 'sunglasses'] },
        { emoji: '😢', name: 'crying face', keywords: ['sad', 'cry', 'tear'] },
        { emoji: '😡', name: 'angry face', keywords: ['angry', 'mad', 'rage'] },
        { emoji: '🤔', name: 'thinking face', keywords: ['think', 'consider'] }
      ],
      people: [
        { emoji: '👍', name: 'thumbs up', keywords: ['like', 'good', 'approve'] },
        { emoji: '👎', name: 'thumbs down', keywords: ['dislike', 'bad', 'disapprove'] },
        { emoji: '👋', name: 'waving hand', keywords: ['hello', 'hi', 'wave'] },
        { emoji: '🙏', name: 'folded hands', keywords: ['pray', 'thanks', 'please'] },
        { emoji: '👏', name: 'clapping hands', keywords: ['clap', 'applaud', 'good'] },
        { emoji: '✌️', name: 'victory hand', keywords: ['peace', 'victory'] }
      ],
      nature: [
        { emoji: '🌟', name: 'glowing star', keywords: ['star', 'sparkle', 'awesome'] },
        { emoji: '🔥', name: 'fire', keywords: ['fire', 'hot', 'lit'] },
        { emoji: '💧', name: 'droplet', keywords: ['water', 'drop'] },
        { emoji: '🌈', name: 'rainbow', keywords: ['rainbow', 'colorful'] },
        { emoji: '⚡', name: 'lightning', keywords: ['lightning', 'electric', 'fast'] }
      ],
      food: [
        { emoji: '🍕', name: 'pizza', keywords: ['food', 'pizza', 'hungry'] },
        { emoji: '🍔', name: 'hamburger', keywords: ['food', 'burger', 'hungry'] },
        { emoji: '☕', name: 'coffee', keywords: ['coffee', 'drink', 'caffeine'] },
        { emoji: '🍰', name: 'cake', keywords: ['cake', 'dessert', 'sweet'] }
      ],
      activities: [
        { emoji: '🎉', name: 'party popper', keywords: ['party', 'celebrate', 'congrats'] },
        { emoji: '🎊', name: 'confetti ball', keywords: ['celebration', 'party'] },
        { emoji: '🏆', name: 'trophy', keywords: ['win', 'award', 'achievement'] },
        { emoji: '⚽', name: 'soccer ball', keywords: ['soccer', 'football', 'sport'] }
      ],
      symbols: [
        { emoji: '❤️', name: 'red heart', keywords: ['love', 'heart', 'like'] },
        { emoji: '💯', name: 'hundred points', keywords: ['hundred', 'perfect', 'score'] },
        { emoji: '✅', name: 'check mark', keywords: ['check', 'correct', 'done'] },
        { emoji: '❌', name: 'cross mark', keywords: ['no', 'wrong', 'cancel'] }
      ]
    };
  }

  // Get emoji data (try database first, fallback to defaults)
  async getEmojis() {
    const dbResult = await this.getEmojiPresets();
    
    if (dbResult.success && Object.keys(dbResult.data).length > 0) {
      return dbResult;
    }

    // Fallback to default emojis
    return { success: true, data: this.getDefaultEmojis() };
  }

  // Convert emoji to unicode
  emojiToUnicode(emoji) {
    return emoji.codePointAt(0).toString(16).toUpperCase();
  }

  // Check if string contains only emojis
  isOnlyEmojis(text) {
    const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]+$/u;
    return emojiRegex.test(text?.trim());
  }

  // Parse text and extract emojis
  extractEmojis(text) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    return text?.match(emojiRegex) || [];
  }

  // Replace emoji shortcodes with emojis (basic implementation)
  parseEmojis(text) {
    const shortcodes = {
      ':)': '😊',
      ':-)': '😊',
      ':(': '😢',
      ':-(': '😢',
      ':D': '😃',
      ':-D': '😃',
      ':P': '😛',
      ':-P': '😛',
      ';)': '😉',
      ';-)': '😉',
      ':o': '😮',
      ':-o': '😮',
      '<3': '❤️',
      '</3': '💔'
    };

    let result = text;
    Object.entries(shortcodes).forEach(([code, emoji]) => {
      result = result?.replace(new RegExp(escapeRegExp(code), 'g'), emoji);
    });

    return result;
  }
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
  return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const emojiService = new EmojiService();
export default emojiService;