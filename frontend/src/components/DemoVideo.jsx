import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Demo screenshots/frames
  const demoFrames = [
    {
      title: "Upload Your Meeting",
      description: "Drag & drop audio or video files",
      image: "🎤"
    },
    {
      title: "AI Processing",
      description: "Whisper transcribes, GPT-4 analyzes",
      image: "🤖"
    },
    {
      title: "Get Insights",
      description: "Summary, tasks, and action items",
      image: "📊"
    },
    {
      title: "Send Follow-ups",
      description: "Auto-generated professional emails",
      image: "📧"
    }
  ];

  const [currentFrame, setCurrentFrame] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    // Auto-advance frames
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= demoFrames.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
      {/* Demo Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={currentFrame}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">{demoFrames[currentFrame].image}</div>
          <h3 className="text-3xl font-bold mb-2">{demoFrames[currentFrame].title}</h3>
          <p className="text-xl text-gray-400">{demoFrames[currentFrame].description}</p>
        </motion.div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <button
            onClick={handlePlay}
            className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition transform hover:scale-110"
          >
            <Play className="w-10 h-10 ml-1" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentFrame + 1) / demoFrames.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 hover:opacity-100 transition">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
        <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DemoVideo;
