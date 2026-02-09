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
  private storageKey = 'adminMessages';

  // Get all messages for a specific admin
  getMessagesForAdmin(adminUsername: string): Message[] {
    const allMessages = this.getAllMessages();
    return allMessages.filter(msg => msg.toAdmin === adminUsername);
  }

  // Get all messages from storage
  getAllMessages(): Message[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch {
      return [];
    }
  }

  // Send a message to an admin
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): boolean {
    try {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        isRead: false
      };

      const allMessages = this.getAllMessages();
      allMessages.push(newMessage);
      
      localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
      
      // Dispatch custom event to notify admin dashboards
      window.dispatchEvent(new CustomEvent('newAdminMessage', { 
        detail: { message: newMessage } 
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // Mark message as read
  markAsRead(messageId: string): boolean {
    try {
      const allMessages = this.getAllMessages();
      const messageIndex = allMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex === -1) return false;
      
      allMessages[messageIndex].isRead = true;
      localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
      
      return true;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      return false;
    }
  }

  // Delete a message
  deleteMessage(messageId: string): boolean {
    try {
      const allMessages = this.getAllMessages();
      const filteredMessages = allMessages.filter(msg => msg.id !== messageId);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredMessages));
      return true;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }

  // Get unread message count for admin
  getUnreadCount(adminUsername: string): number {
    const messages = this.getMessagesForAdmin(adminUsername);
    return messages.filter(msg => !msg.isRead).length;
  }

  // Clear all messages (admin only)
  clearAllMessages(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear messages:', error);
      return false;
    }
  }
}

export default new MessagingService();