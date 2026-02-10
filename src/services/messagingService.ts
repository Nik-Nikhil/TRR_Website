import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  fromPlayer: string;
  fromPlayerNickname: string;
  toAdmin: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

class MessagingService {
  // Get all messages for a specific admin
  async getMessagesForAdmin(adminUsername: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('admin_messages')
        .select('*')
        .eq('to_admin', adminUsername)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (data || []).map(msg => ({
        id: msg.id,
        fromPlayer: msg.from_player,
        fromPlayerNickname: msg.from_player_nickname,
        toAdmin: msg.to_admin,
        subject: msg.subject,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isRead: msg.is_read,
        priority: msg.priority as 'low' | 'medium' | 'high'
      }));
    } catch (error) {
      console.error('Error in getMessagesForAdmin:', error);
      return [];
    }
  }

  // Get all messages from database
  async getAllMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('admin_messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching all messages:', error);
        return [];
      }

      return (data || []).map(msg => ({
        id: msg.id,
        fromPlayer: msg.from_player,
        fromPlayerNickname: msg.from_player_nickname,
        toAdmin: msg.to_admin,
        subject: msg.subject,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isRead: msg.is_read,
        priority: msg.priority as 'low' | 'medium' | 'high'
      }));
    } catch (error) {
      console.error('Error in getAllMessages:', error);
      return [];
    }
  }

  // Send a message to an admin
  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .insert({
          from_player: message.fromPlayer,
          from_player_nickname: message.fromPlayerNickname,
          to_admin: message.toAdmin,
          subject: message.subject,
          content: message.content,
          priority: message.priority,
          is_read: false
        });

      if (error) {
        console.error('Failed to send message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        console.error('Failed to mark message as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      return false;
    }
  }

  // Delete a message
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Failed to delete message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }

  // Get unread message count for admin
  async getUnreadCount(adminUsername: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('admin_messages')
        .select('*', { count: 'exact', head: true })
        .eq('to_admin', adminUsername)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  // Clear all messages (admin only)
  async clearAllMessages(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Failed to clear messages:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to clear messages:', error);
      return false;
    }
  }

  // Subscribe to real-time message updates for a specific admin
  subscribeToMessages(adminUsername: string, callback: (message: Message) => void) {
    const channel = supabase
      .channel(`admin_messages_${adminUsername}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_messages',
          filter: `to_admin=eq.${adminUsername}`
        },
        (payload) => {
          const msg = payload.new as any;
          const message: Message = {
            id: msg.id,
            fromPlayer: msg.from_player,
            fromPlayerNickname: msg.from_player_nickname,
            toAdmin: msg.to_admin,
            subject: msg.subject,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            isRead: msg.is_read,
            priority: msg.priority
          };
          callback(message);
        }
      )
      .subscribe();

    return channel;
  }
}

export default new MessagingService();
