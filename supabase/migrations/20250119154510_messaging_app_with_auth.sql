-- Real-Time Messaging App Migration
-- Location: supabase/migrations/20250119154510_messaging_app_with_auth.sql

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'member');
CREATE TYPE public.room_type AS ENUM ('public', 'private', 'direct');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'document', 'audio', 'video');
CREATE TYPE public.emoji_category AS ENUM ('smileys', 'people', 'nature', 'food', 'activities', 'objects', 'symbols');

-- 2. Core Tables
-- User profiles table (intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    room_code TEXT UNIQUE NOT NULL, -- Shareable room ID
    room_type public.room_type DEFAULT 'public'::public.room_type,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    max_participants INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Room participants table
CREATE TABLE public.room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    role public.user_role DEFAULT 'member'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(room_id, user_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    message_type public.message_type DEFAULT 'text'::public.message_type,
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Message status tracking table
CREATE TABLE public.message_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.message_status DEFAULT 'sent'::public.message_status,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id)
);

-- Message reactions table
CREATE TABLE public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji)
);

-- Emoji presets table
CREATE TABLE public.emoji_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category public.emoji_category,
    emoji TEXT NOT NULL,
    name TEXT NOT NULL,
    keywords TEXT[],
    unicode_code TEXT NOT NULL
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_rooms_room_code ON public.rooms(room_code);
CREATE INDEX idx_rooms_owner_id ON public.rooms(owner_id);
CREATE INDEX idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX idx_messages_room_id ON public.messages(room_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_message_status_message_id ON public.message_status(message_id);
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emoji_presets ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_room_participant(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.room_participants rp
    WHERE rp.room_id = room_uuid 
    AND rp.user_id = auth.uid() 
    AND rp.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.is_room_owner(room_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.rooms r
    WHERE r.id = room_uuid AND r.owner_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_message(message_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.room_participants rp ON rp.room_id = m.room_id
    WHERE m.id = message_uuid 
    AND rp.user_id = auth.uid() 
    AND rp.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::text = required_role
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Function to generate unique room codes
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    room_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric code
        room_code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.rooms WHERE room_code = room_code) INTO code_exists;
        
        -- Exit loop if code is unique
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN room_code;
END;
$$;

-- Function to update message status
CREATE OR REPLACE FUNCTION public.update_message_status(message_uuid UUID, new_status public.message_status)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.message_status (message_id, user_id, status, timestamp)
    VALUES (message_uuid, auth.uid(), new_status, CURRENT_TIMESTAMP)
    ON CONFLICT (message_id, user_id)
    DO UPDATE SET 
        status = EXCLUDED.status,
        timestamp = EXCLUDED.timestamp
    WHERE public.message_status.status < EXCLUDED.status; -- Only allow status progression
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RLS Policies
-- User profiles policies
CREATE POLICY "users_view_own_profile" ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.user_profiles FOR UPDATE
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_view_public_profiles" ON public.user_profiles FOR SELECT
USING (true); -- Allow viewing other users for chat functionality

-- Rooms policies
CREATE POLICY "participants_view_rooms" ON public.rooms FOR SELECT
USING (public.is_room_participant(id) OR public.is_room_owner(id) OR room_type = 'public'::public.room_type);

CREATE POLICY "owners_manage_rooms" ON public.rooms FOR ALL
USING (public.is_room_owner(id)) WITH CHECK (public.is_room_owner(id));

CREATE POLICY "authenticated_create_rooms" ON public.rooms FOR INSERT
TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Room participants policies
CREATE POLICY "participants_view_room_members" ON public.room_participants FOR SELECT
USING (public.is_room_participant(room_id) OR public.is_room_owner(room_id));

CREATE POLICY "owners_manage_participants" ON public.room_participants FOR ALL
USING (public.is_room_owner(room_id)) WITH CHECK (public.is_room_owner(room_id));

CREATE POLICY "users_join_rooms" ON public.room_participants FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "participants_view_messages" ON public.messages FOR SELECT
USING (public.is_room_participant(room_id));

CREATE POLICY "participants_send_messages" ON public.messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = sender_id AND public.is_room_participant(room_id));

CREATE POLICY "senders_edit_own_messages" ON public.messages FOR UPDATE
USING (auth.uid() = sender_id AND public.is_room_participant(room_id));

CREATE POLICY "senders_delete_own_messages" ON public.messages FOR DELETE
USING (auth.uid() = sender_id OR public.is_room_owner(room_id));

-- Message status policies
CREATE POLICY "participants_manage_message_status" ON public.message_status FOR ALL
USING (public.can_access_message(message_id)) WITH CHECK (auth.uid() = user_id);

-- Message reactions policies
CREATE POLICY "participants_manage_reactions" ON public.message_reactions FOR ALL
USING (public.can_access_message(message_id)) WITH CHECK (auth.uid() = user_id);

-- Emoji presets policies (public read access)
CREATE POLICY "public_read_emojis" ON public.emoji_presets FOR SELECT
TO public USING (true);

-- 7. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user1_uuid UUID := gen_random_uuid();
    user2_uuid UUID := gen_random_uuid();
    room1_uuid UUID := gen_random_uuid();
    room2_uuid UUID := gen_random_uuid();
    message1_uuid UUID := gen_random_uuid();
    message2_uuid UUID := gen_random_uuid();
    room1_code TEXT := 'CHATROOM1';
    room2_code TEXT := 'MEETUP22';
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@chatflow.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Chat Admin", "username": "chatadmin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alice@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alice Johnson", "username": "alice_j"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'bob@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Bob Smith", "username": "bob_smith"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create rooms
    INSERT INTO public.rooms (id, name, description, room_code, room_type, owner_id, max_participants) VALUES
        (room1_uuid, 'General Chat', 'Welcome to the main chat room for everyone!', room1_code, 'public'::public.room_type, admin_uuid, 100),
        (room2_uuid, 'Tech Meetup', 'Discussion space for our weekly tech meetup', room2_code, 'private'::public.room_type, user1_uuid, 50);

    -- Add participants to rooms
    INSERT INTO public.room_participants (room_id, user_id, role) VALUES
        (room1_uuid, admin_uuid, 'admin'::public.user_role),
        (room1_uuid, user1_uuid, 'member'::public.user_role),
        (room1_uuid, user2_uuid, 'member'::public.user_role),
        (room2_uuid, user1_uuid, 'moderator'::public.user_role),
        (room2_uuid, user2_uuid, 'member'::public.user_role);

    -- Create sample messages
    INSERT INTO public.messages (id, room_id, sender_id, content, message_type) VALUES
        (message1_uuid, room1_uuid, admin_uuid, 'Welcome to ChatFlow! This is our main discussion room.', 'text'::public.message_type),
        (message2_uuid, room1_uuid, user1_uuid, 'Thanks for setting this up! Looking forward to chatting with everyone.', 'text'::public.message_type);

    -- Create message status records
    INSERT INTO public.message_status (message_id, user_id, status) VALUES
        (message1_uuid, user1_uuid, 'delivered'::public.message_status),
        (message1_uuid, user2_uuid, 'read'::public.message_status),
        (message2_uuid, admin_uuid, 'read'::public.message_status),
        (message2_uuid, user2_uuid, 'delivered'::public.message_status);

    -- Add sample emoji reactions
    INSERT INTO public.message_reactions (message_id, user_id, emoji) VALUES
        (message1_uuid, user1_uuid, '👍'),
        (message2_uuid, admin_uuid, '❤️');

    -- Populate emoji presets
    INSERT INTO public.emoji_presets (category, emoji, name, keywords, unicode_code) VALUES
        ('smileys'::public.emoji_category, '😀', 'grinning face', ARRAY['happy', 'smile', 'grin'], 'U+1F600'),
        ('smileys'::public.emoji_category, '😂', 'face with tears of joy', ARRAY['laugh', 'funny', 'lol'], 'U+1F602'),
        ('smileys'::public.emoji_category, '❤️', 'red heart', ARRAY['love', 'heart', 'like'], 'U+2764'),
        ('people'::public.emoji_category, '👍', 'thumbs up', ARRAY['like', 'good', 'approve'], 'U+1F44D'),
        ('people'::public.emoji_category, '👋', 'waving hand', ARRAY['hello', 'hi', 'wave'], 'U+1F44B'),
        ('nature'::public.emoji_category, '🌟', 'glowing star', ARRAY['star', 'sparkle', 'awesome'], 'U+1F31F'),
        ('food'::public.emoji_category, '🍕', 'pizza', ARRAY['food', 'pizza', 'hungry'], 'U+1F355'),
        ('activities'::public.emoji_category, '🎉', 'party popper', ARRAY['party', 'celebrate', 'congrats'], 'U+1F389');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- 8. Cleanup Function
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com' OR email LIKE '%@chatflow.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.message_reactions WHERE message_id IN (
        SELECT id FROM public.messages WHERE sender_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.message_status WHERE message_id IN (
        SELECT id FROM public.messages WHERE sender_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.messages WHERE sender_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.room_participants WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.rooms WHERE owner_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

    -- Clean up emoji presets if needed
    DELETE FROM public.emoji_presets WHERE category IS NOT NULL;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;