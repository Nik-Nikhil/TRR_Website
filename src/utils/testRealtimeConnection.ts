// Test utility to verify Supabase real-time connection
import { supabase } from '../lib/supabase';

export async function testRealtimeConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🧪 Testing Supabase real-time connection...');

    // Create a test channel
    const testChannel = supabase
      .channel('realtime-test-channel')
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Presence sync received');
      })
      .subscribe((status, err) => {
        console.log('📡 Test channel status:', status);
        if (err) {
          console.error('❌ Test channel error:', err);
        }
      });

    // Wait for subscription
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check channel status
    const channelState = testChannel.state;
    console.log('📊 Channel state:', channelState);

    // Clean up
    supabase.removeChannel(testChannel);

    if (channelState === 'joined') {
      return {
        success: true,
        message: 'Real-time connection is working! ✅',
        details: { state: channelState }
      };
    } else {
      return {
        success: false,
        message: `Real-time connection issue. Channel state: ${channelState}`,
        details: { state: channelState }
      };
    }
  } catch (error) {
    console.error('❌ Real-time test failed:', error);
    return {
      success: false,
      message: 'Real-time test failed with error',
      details: error
    };
  }
}

// Test auction_chat table real-time specifically
export async function testAuctionChatRealtime(auctionId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧪 Testing auction_chat real-time for auction:', auctionId);

    let messageReceived = false;

    // Subscribe to auction_chat changes
    const channel = supabase
      .channel(`test-auction-chat-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_chat',
          filter: `auction_id=eq.${auctionId}`
        },
        (payload) => {
          console.log('✅ Real-time message received:', payload);
          messageReceived = true;
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Auction chat test subscription status:', status);
        if (err) {
          console.error('❌ Subscription error:', err);
        }
      });

    // Wait for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send a test message
    const { error } = await supabase
      .from('auction_chat')
      .insert({
        auction_id: auctionId,
        sender_id: 'test-user',
        sender_name: 'Test User',
        sender_team: 'Test Team',
        message: '🧪 Real-time test message'
      });

    if (error) {
      console.error('❌ Failed to send test message:', error);
      supabase.removeChannel(channel);
      return {
        success: false,
        message: `Failed to send test message: ${error.message}`
      };
    }

    // Wait to see if we receive the message via real-time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Clean up
    supabase.removeChannel(channel);

    if (messageReceived) {
      return {
        success: true,
        message: 'Auction chat real-time is working! ✅'
      };
    } else {
      return {
        success: false,
        message: 'Real-time not working. Message was sent but not received via subscription. Check Supabase Dashboard → Database → Replication to enable real-time for auction_chat table.'
      };
    }
  } catch (error) {
    console.error('❌ Auction chat real-time test failed:', error);
    return {
      success: false,
      message: 'Test failed with error'
    };
  }
}
