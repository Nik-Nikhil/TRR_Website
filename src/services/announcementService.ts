import { supabase } from '../lib/supabase';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

class AnnouncementService {
  // Get all published announcements
  async getPublishedAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        return [];
      }

      return (data || []).map(this.mapToAnnouncement);
    } catch (error) {
      console.error('Error in getPublishedAnnouncements:', error);
      return [];
    }
  }

  // Get all announcements (admin view)
  async getAllAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all announcements:', error);
        return [];
      }

      return (data || []).map(this.mapToAnnouncement);
    } catch (error) {
      console.error('Error in getAllAnnouncements:', error);
      return [];
    }
  }

  // Create a new announcement
  async createAnnouncement(
    title: string,
    content: string,
    author: string,
    status: 'draft' | 'published' = 'draft'
  ): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      const insertData: any = {
        title,
        content,
        author,
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        insertData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Failed to create announcement:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error: any) {
      console.error('Failed to create announcement:', error);
      return { success: false, error: error.message };
    }
  }

  // Update an announcement
  async updateAnnouncement(
    id: string,
    updates: Partial<Omit<Announcement, 'id' | 'createdAt'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.content) updateData.content = updates.content;
      if (updates.author) updateData.author = updates.author;
      if (updates.status) {
        updateData.status = updates.status;
        if (updates.status === 'published' && !updates.publishedAt) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Failed to update announcement:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to update announcement:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete an announcement
  async deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete announcement:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete announcement:', error);
      return { success: false, error: error.message };
    }
  }

  // Publish an announcement
  async publishAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    return this.updateAnnouncement(id, {
      status: 'published',
      publishedAt: new Date()
    });
  }

  // Archive an announcement
  async archiveAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    return this.updateAnnouncement(id, { status: 'archived' });
  }

  // Subscribe to real-time announcement updates
  subscribeToAnnouncements(callback: (announcement: Announcement, event: 'INSERT' | 'UPDATE' | 'DELETE') => void) {
    const channel = supabase
      .channel('announcements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            callback({ id: (payload.old as any).id } as Announcement, 'DELETE');
          } else {
            const announcement = this.mapToAnnouncement(payload.new as any);
            callback(announcement, payload.eventType as 'INSERT' | 'UPDATE');
          }
        }
      )
      .subscribe();

    return channel;
  }

  // Helper to map database row to Announcement
  private mapToAnnouncement(row: any): Announcement {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      author: row.author,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      publishedAt: row.published_at ? new Date(row.published_at) : undefined
    };
  }
}

export default new AnnouncementService();
