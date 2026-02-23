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
  async getMessages(auctionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('auction_chat')
        .select('*')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: true });

      if (error) {
        return [];
      }

      return data || [];
    } catch (error) {
      return [];
    }
  }

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
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Subscribe to new messages
  subscribeToMessages(auctionId: string, callback: (message: ChatMessage) => void) {
    const channelName = `auction-chat-${auctionId}-${Date.now()}`;
    
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
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}

export default new AuctionChatService();
