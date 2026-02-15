// Auction Chat Service - Real-time chat for captains during auction
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  auction_id: string;
  sender_id: string;
  sender_name: string;
  sender_team?: string;
  message: string;
  created_at: string;
}

class AuctionChatService {
  // Get all messages for an auction
  async getMessages(auctionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('auction_chat')
        .select('*')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Send a message
  async sendMessage(
    auctionId: string,
    senderId: string,
    senderName: string,
    senderTeam: string | undefined,
    message: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_chat')
        .insert({
          auction_id: auctionId,
          sender_id: senderId,
          sender_name: senderName,
          sender_team: senderTeam,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Subscribe to new messages
  subscribeToMessages(auctionId: string, callback: (message: ChatMessage) => void) {
    const channelName = `auction-chat-${auctionId}-${Date.now()}`;
    console.log('🔔 Creating chat subscription channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_chat',
          filter: `auction_id=eq.${auctionId}`
        },
        (payload) => {
          console.log('📨 Real-time message received via subscription:', payload.new);
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Chat subscription status:', status);
        if (err) {
          console.error('❌ Chat subscription error:', err);
        }
      });

    return {
      unsubscribe: () => {
        console.log('🔕 Unsubscribing from chat channel:', channelName);
        supabase.removeChannel(channel);
      }
    };
  }
}

export default new AuctionChatService();
