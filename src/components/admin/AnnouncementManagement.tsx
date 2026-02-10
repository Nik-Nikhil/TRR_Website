import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, Plus, Edit, Trash2, Eye, EyeOff, 
  Check, X, Calendar, User, Loader2
} from 'lucide-react';
import announcementService, { type Announcement } from '../../services/announcementService';
import { supabase } from '../../lib/supabase';

interface AnnouncementManagementProps {
  username: string;
}

export default function AnnouncementManagement({ username }: AnnouncementManagementProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    loadAnnouncements();

    // Subscribe to real-time updates
    const channel = announcementService.subscribeToAnnouncements((announcement, event) => {
      if (event === 'INSERT') {
        setAnnouncements(prev => [announcement, ...prev]);
      } else if (event === 'UPDATE') {
        setAnnouncements(prev => 
          prev.map(a => a.id === announcement.id ? announcement : a)
        );
      } else if (event === 'DELETE') {
        setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    const data = await announcementService.getAllAnnouncements();
    setAnnouncements(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    if (editingId) {
      const result = await announcementService.updateAnnouncement(editingId, {
        title: formData.title,
        content: formData.content
      });

      if (result.success) {
        resetForm();
        await loadAnnouncements();
      } else {
        alert(result.error || 'Failed to update announcement');
      }
    } else {
      const result = await announcementService.createAnnouncement(
        formData.title,
        formData.content,
        username,
        'draft'
      );

      if (result.success) {
        resetForm();
        await loadAnnouncements();
      } else {
        alert(result.error || 'Failed to create announcement');
      }
    }

    setIsLoading(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content
    });
    setShowEditor(true);
  };

  const handlePublish = async (id: string) => {
    const result = await announcementService.publishAnnouncement(id);
    if (result.success) {
      await loadAnnouncements();
    } else {
      alert(result.error || 'Failed to publish announcement');
    }
  };

  const handleArchive = async (id: string) => {
    const result = await announcementService.archiveAnnouncement(id);
    if (result.success) {
      await loadAnnouncements();
    } else {
      alert(result.error || 'Failed to archive announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const result = await announcementService.deleteAnnouncement(id);
    if (result.success) {
      await loadAnnouncements();
    } else {
      alert(result.error || 'Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setShowEditor(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'draft': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'archived': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Megaphone className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Announcement Management</h3>
          </div>
          
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {showEditor ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showEditor ? 'Cancel' : 'New Announcement'}</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      {showEditor && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <h4 className="text-lg font-bold text-white mb-4">
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter announcement title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Enter announcement content..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{editingId ? 'Update' : 'Save as Draft'}</span>
              </button>
              
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading && announcements.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
            <Megaphone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No announcements yet</p>
            <p className="text-gray-500 text-sm mt-2">Create your first announcement to get started</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-bold text-white">{announcement.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{announcement.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{announcement.createdAt.toLocaleDateString()}</span>
                    </div>
                    {announcement.publishedAt && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Published {announcement.publishedAt.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {announcement.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors"
                      title="Publish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  {announcement.status === 'published' && (
                    <button
                      onClick={() => handleArchive(announcement.id)}
                      className="p-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-400 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
