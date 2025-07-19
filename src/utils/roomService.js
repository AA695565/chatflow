import { supabase } from './supabase';

class RoomService {
  // Create a new room
  async createRoom(roomData) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomData.name,
          description: roomData.description,
          room_type: roomData.type || 'public',
          owner_id: roomData.ownerId,
          max_participants: roomData.maxParticipants || 100,
          room_code: await this.generateRoomCode(),
          settings: roomData.settings || {}
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add creator as participant
      await this.joinRoom(data.id, data.owner_id, 'admin');

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create room.' };
    }
  }

  // Generate unique room code
  async generateRoomCode() {
    try {
      const { data, error } = await supabase.rpc('generate_room_code');
      
      if (error) {
        // Fallback to client-side generation
        return this.generateClientRoomCode();
      }

      return data;
    } catch (error) {
      return this.generateClientRoomCode();
    }
  }

  // Client-side room code generation fallback
  generateClientRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Join room by room code
  async joinRoomByCode(roomCode, userId) {
    try {
      // First, find the room by code
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .eq('is_active', true)
        .single();

      if (roomError || !room) {
        return { success: false, error: 'Room not found or inactive.' };
      }

      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('user_id', userId)
        .single();

      if (existingParticipant) {
        // Reactivate if inactive
        if (!existingParticipant.is_active) {
          const { error: updateError } = await supabase
            .from('room_participants')
            .update({ is_active: true, joined_at: new Date().toISOString() })
            .eq('id', existingParticipant.id);

          if (updateError) {
            return { success: false, error: updateError.message };
          }
        }
        return { success: true, data: room };
      }

      // Join as new participant
      const joinResult = await this.joinRoom(room.id, userId, 'member');
      if (!joinResult.success) {
        return joinResult;
      }

      return { success: true, data: room };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to join room.' };
    }
  }

  // Join room
  async joinRoom(roomId, userId, role = 'member') {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .insert({
          room_id: roomId,
          user_id: userId,
          role: role,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to join room.' };
    }
  }

  // Get user's rooms
  async getUserRooms(userId) {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select(`
          room_id,
          joined_at,
          role,
          rooms (
            id,
            name,
            description,
            room_code,
            room_type,
            created_at,
            owner_id,
            user_profiles!rooms_owner_id_fkey (
              id,
              full_name,
              username
            )
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const rooms = data?.map(participant => ({
        ...participant.rooms,
        userRole: participant.role,
        joinedAt: participant.joined_at
      })) || [];

      return { success: true, data: rooms };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load rooms.' };
    }
  }

  // Get room details
  async getRoomDetails(roomId) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          user_profiles!rooms_owner_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          ),
          room_participants (
            user_id,
            role,
            joined_at,
            is_active,
            user_profiles (
              id,
              full_name,
              username,
              avatar_url,
              is_online,
              last_seen
            )
          )
        `)
        .eq('id', roomId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load room details.' };
    }
  }

  // Leave room
  async leaveRoom(roomId, userId) {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ is_active: false })
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to leave room.' };
    }
  }

  // Update room settings
  async updateRoomSettings(roomId, settings) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', roomId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update room settings.' };
    }
  }

  // Delete room
  async deleteRoom(roomId) {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_active: false })
        .eq('id', roomId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete room.' };
    }
  }
}

const roomService = new RoomService();
export default roomService;