import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import profileImageService, { type UserType } from '../services/profileImageService';

interface ProfileImageUploadProps {
  userId: string;
  userType: UserType;
  currentImageUrl: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileImageUpload = ({
  userId,
  userType,
  currentImageUrl,
  onClose,
  onSuccess
}: ProfileImageUploadProps) => {
  const [uploadType, setUploadType] = useState<'upload' | 'link'>('link');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isAdminOrSuperAdmin = userType === 'admin' || userType === 'superadmin';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = '';

      if (uploadType === 'link') {
        // Validate URL
        if (!imageUrl) {
          setError('Please enter an image URL');
          setLoading(false);
          return;
        }

        try {
          new URL(imageUrl);
        } catch {
          setError('Please enter a valid URL');
          setLoading(false);
          return;
        }

        finalImageUrl = imageUrl;
      } else {
        // For file upload, we'll use the preview URL for now
        // In production, you'd upload to Supabase Storage first
        if (!imageFile || !previewUrl) {
          setError('Please select an image file');
          setLoading(false);
          return;
        }

        // TODO: Upload to Supabase Storage
        // For now, we'll use a placeholder
        finalImageUrl = previewUrl;
      }

      // Submit the request
      const result = await profileImageService.submitImageUpdate(
        userId,
        userType,
        currentImageUrl,
        finalImageUrl,
        uploadType
      );

      if (!result.success) {
        setError(result.error || 'Failed to submit request');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Update Profile Image</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">
              {isAdminOrSuperAdmin ? 'Image Updated!' : 'Request Submitted!'}
            </p>
            <p className="text-gray-400 text-sm">
              {isAdminOrSuperAdmin
                ? 'Your profile image has been updated.'
                : 'Your request is pending admin approval.'}
            </p>
          </div>
        ) : (
          <>
            {/* Upload Type Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setUploadType('link')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  uploadType === 'link'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Image URL
              </button>
              <button
                onClick={() => setUploadType('upload')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  uploadType === 'upload'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
            </div>

            {/* Input Area */}
            {uploadType === 'link' ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Select Image
                </label>
                <div className="border-2 border-dashed border-purple-500/40 rounded-lg p-6 text-center hover:border-purple-500/60 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium mb-1">
                      {imageFile ? imageFile.name : 'Click to upload'}
                    </p>
                    <p className="text-gray-400 text-sm">Max size: 5MB</p>
                  </label>
                </div>
              </div>
            )}

            {/* Preview */}
            {(previewUrl || imageUrl) && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Preview
                </label>
                <div className="flex justify-center">
                  <img
                    src={uploadType === 'link' ? imageUrl : previewUrl || ''}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                    onError={(e) => {
                      e.currentTarget.src = '/avatars/default.jpg';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Info Message */}
            {!isAdminOrSuperAdmin && (
              <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Your image will be reviewed by an admin before being applied.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (!imageUrl && !imageFile)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
