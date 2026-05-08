import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, File, X, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'video/mp4', 'audio/webm'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|m4a|mp4|webm)$/i)) {
      toast.error('Please upload a valid audio/video file (mp3, wav, m4a, mp4)');
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 100MB');
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const uploadRes = await axios.post('/meeting/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const meetingId = uploadRes.data.data._id;
      toast.success('File uploaded successfully!');

      setUploading(false);
      setProcessing(true);

      // Start AI processing
      await axios.post(`/meeting/process/${meetingId}`);
      
      toast.success('Meeting processed successfully!');
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
      setUploading(false);
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Upload <span className="gradient-text">Meeting</span>
          </h1>
          <p className="text-gray-400 mb-8">Upload your meeting recording for AI processing</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`glass rounded-xl p-8 border-2 border-dashed transition ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="text-center">
                  <UploadIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Drop your file here</h3>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    Select File
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported: MP3, WAV, M4A, MP4 (Max 100MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInput}
                    accept="audio/*,video/mp4"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <File className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{file.name}</div>
                      <div className="text-sm text-gray-400">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Meeting Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="e.g., Q4 Planning Meeting"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || uploading || processing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  Upload & Process
                </>
              )}
            </button>
          </form>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">🎤</div>
              <div className="font-semibold mb-1">Transcription</div>
              <div className="text-sm text-gray-400">Whisper AI converts speech to text</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold mb-1">AI Analysis</div>
              <div className="text-sm text-gray-400">GPT-4 extracts insights & tasks</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold mb-1">Email Draft</div>
              <div className="text-sm text-gray-400">Auto-generated follow-up notes</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
