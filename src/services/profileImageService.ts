import { supabase } from '../lib/supabase';

export type UserType = 'player' | 'admin' | 'superadmin';
export type ImageType = 'upload' | 'link';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ProfileImageUpdate {
  id: string;
  user_id: string;
  user_type: UserType;
  current_image_url: string | null;
  new_image_url: string;
  image_type: ImageType;
  status: RequestStatus;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
}

class ProfileImageService {
  /**
   * Submit a profile image update request
   * Admins/SuperAdmins: Auto-approved
   * Players: Requires approval
   */
  async submitImageUpdate(
    userId: string,
    userType: UserType,
    currentImageUrl: string | null,
    newImageUrl: string,
    imageType: ImageType
  ): Promise<{ success: boolean; error?: string; autoApproved?: boolean }> {
    try {
      // For admins and superadmins, auto-approve
      const isAdminOrSuperAdmin = userType === 'admin' || userType === 'superadmin';
      
      if (isAdminOrSuperAdmin) {
        // Directly update the image (you'll need to implement this based on your user storage)
        // For now, we'll still create a request but mark it as approved
        const { error } = await supabase
          .from('profile_image_updates')
          .insert({
            user_id: userId,
            user_type: userType,
            current_image_url: currentImageUrl,
            new_image_url: newImageUrl,
            image_type: imageType,
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: 'auto-approved'
          });

        if (error) {
          console.error('Error submitting image update:', error);
          return { success: false, error: error.message };
        }

        return { success: true, autoApproved: true };
      }

      // For players, create pending request
      const { error } = await supabase
        .from('profile_image_updates')
        .insert({
          user_id: userId,
          user_type: userType,
          current_image_url: currentImageUrl,
          new_image_url: newImageUrl,
          image_type: imageType,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting image update:', error);
        return { success: false, error: error.message };
      }

      return { success: true, autoApproved: false };
    } catch (error: any) {
      console.error('Error in submitImageUpdate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all pending image update requests
   */
  async getPendingRequests(): Promise<ProfileImageUpdate[]> {
    try {
      const { data, error } = await supabase
        .from('profile_image_updates')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return [];
    }
  }

  /**
   * Get all requests for a specific user
   */
  async getUserRequests(userId: string): Promise<ProfileImageUpdate[]> {
    try {
      const { data, error } = await supabase
        .from('profile_image_updates')
        .select('*')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching user requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserRequests:', error);
      return [];
    }
  }

  /**
   * Approve an image update request
   */
  async approveRequest(
    requestId: string,
    reviewedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First, get the request details
      const { data: request, error: fetchError } = await supabase
        .from('profile_image_updates')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError || !request) {
        console.error('Error fetching request:', fetchError);
        return { success: false, error: 'Request not found' };
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('profile_image_updates')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewedBy
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error approving request:', updateError);
        return { success: false, error: updateError.message };
      }

      // Update the actual player/admin avatar in the database
      if (request.user_type === 'player') {
        // Try to update by ID first, if that fails, try by nickname
        let { error: playerUpdateError } = await supabase
          .from('players')
          .update({ 
            avatar_url: request.new_image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', request.user_id);

        // If update by ID failed, try by nickname
        if (playerUpdateError) {
          const { error: nicknameUpdateError } = await supabase
            .from('players')
            .update({ 
              avatar_url: request.new_image_url,
              updated_at: new Date().toISOString()
            })
            .eq('nickname', request.user_id);

          if (nicknameUpdateError) {
            console.error('Error updating player avatar by nickname:', nicknameUpdateError);
            console.error('Error details:', JSON.stringify(nicknameUpdateError, null, 2));
            return { success: false, error: `Failed to update player avatar: ${nicknameUpdateError.message || JSON.stringify(nicknameUpdateError)}` };
          }
        }
      } else if (request.user_type === 'admin' || request.user_type === 'superadmin') {
        const { error: adminUpdateError } = await supabase
          .from('admins')
          .update({ 
            avatar_url: request.new_image_url,
            updated_at: new Date().toISOString()
          })
          .eq('username', request.user_id);

        if (adminUpdateError) {
          console.error('Error updating admin avatar:', adminUpdateError);
          console.error('Error details:', JSON.stringify(adminUpdateError, null, 2));
          return { success: false, error: `Failed to update admin avatar: ${adminUpdateError.message || JSON.stringify(adminUpdateError)}` };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in approveRequest:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reject an image update request
   */
  async rejectRequest(
    requestId: string,
    reviewedBy: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profile_image_updates')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewedBy,
          rejection_reason: reason
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error rejecting request:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in rejectRequest:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a request
   */
  async deleteRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profile_image_updates')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('Error deleting request:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteRequest:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to profile image update changes
   */
  subscribeToImageUpdates(callback: (update: ProfileImageUpdate) => void) {
    const channel = supabase
      .channel('profile-image-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_image_updates'
        },
        (payload) => {
          callback(payload.new as ProfileImageUpdate);
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

export default new ProfileImageService();
