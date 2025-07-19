import { supabase } from './supabase';

class MessageService {
  // Send a message
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: messageData.roomId,
          sender_id: messageData.senderId,
          content: messageData.content,
          message_type: messageData.type || 'text',
          file_url: messageData.fileUrl,
          file_name: messageData.fileName,
          file_size: messageData.fileSize,
          reply_to: messageData.replyTo
        })
        .select(`
          *,
          user_profiles!messages_sender_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          ),
          reply_message:messages!messages_reply_to_fkey (
            id,
            content,
            message_type,
            user_profiles!messages_sender_id_fkey (
              full_name,
              username
            )
          )
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update message status for all room participants
      await this.updateMessageStatusForRoom(data.id, messageData.roomId);

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to send message.' };
    }
  }

  // Get messages for a room
  async getRoomMessages(roomId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profiles!messages_sender_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          ),
          reply_message:messages!messages_reply_to_fkey (
            id,
            content,
            message_type,
            file_url,
            user_profiles!messages_sender_id_fkey (
              full_name,
              username
            )
          ),
          message_reactions (
            emoji,
            user_id,
            user_profiles (
              full_name,
              username
            )
          ),
          message_status (
            user_id,
            status,
            timestamp
          )
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data?.reverse() || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load messages.' };
    }
  }

  // Edit message
  async editMessage(messageId, newContent) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select(`
          *,
          user_profiles!messages_sender_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to edit message.' };
    }
  }

  // Delete message
  async deleteMessage(messageId, deleteType = 'for_me') {
    try {
      let updateData = {};
      
      if (deleteType === 'for_everyone') {
        updateData = {
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          content: null
        };
      } else {
        // For "delete for me" we would need a separate table to track per-user deletions
        // For now, we'll implement basic deletion
        updateData = {
          is_deleted: true,
          deleted_at: new Date().toISOString()
        };
      }

      const { error } = await supabase
        .from('messages')
        .update(updateData)
        .eq('id', messageId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete message.' };
    }
  }

  // Update message status
  async updateMessageStatus(messageId, status, userId) {
    try {
      const { error } = await supabase.rpc('update_message_status', {
        message_uuid: messageId,
        new_status: status
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update message status.' };
    }
  }

  // Update message status for all room participants
  async updateMessageStatusForRoom(messageId, roomId) {
    try {
      // Get all active participants in the room
      const { data: participants, error: participantsError } = await supabase
        .from('room_participants')
        .select('user_id')
        .eq('room_id', roomId)
        .eq('is_active', true);

      if (participantsError) {
        return { success: false, error: participantsError.message };
      }

      // Insert delivered status for all participants
      const statusInserts = participants?.map(participant => ({
        message_id: messageId,
        user_id: participant.user_id,
        status: 'delivered'
      })) || [];

      if (statusInserts.length > 0) {
        const { error } = await supabase
          .from('message_status')
          .insert(statusInserts);

        if (error && !error.message?.includes('duplicate key')) {
          return { success: false, error: error.message };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update message status.' };
    }
  }

  // Mark message as read
  async markAsRead(messageId, userId) {
    return this.updateMessageStatus(messageId, 'read', userId);
  }

  // Add reaction to message
  async addReaction(messageId, userId, emoji) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji: emoji
        })
        .select(`
          *,
          user_profiles (
            full_name,
            username
          )
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to add reaction.' };
    }
  }

  // Remove reaction from message
  async removeReaction(messageId, userId, emoji) {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove reaction.' };
    }
  }

  // Get message details with full status info
  async getMessageDetails(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profiles!messages_sender_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          ),
          message_status (
            user_id,
            status,
            timestamp,
            user_profiles (
              full_name,
              username
            )
          ),
          message_reactions (
            emoji,
            user_id,
            created_at,
            user_profiles (
              full_name,
              username
            )
          )
        `)
        .eq('id', messageId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load message details.' };
    }
  }

  // Subscribe to real-time message updates
  subscribeToRoomMessages(roomId, callback) {
    return supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to message status updates
  subscribeToMessageStatus(messageId, callback) {
    return supabase
      .channel(`message-status-${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_status',
          filter: `message_id=eq.${messageId}`
        },
        callback
      )
      .subscribe();
  }

  // Unsubscribe from channel
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

const messageService = new MessageService();
export default messageService;