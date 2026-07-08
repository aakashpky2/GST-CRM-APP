import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const GSTVideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  if (!videoId) {
    return <div className="p-8 text-slate-500">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Video Lesson</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Learning Center</span>
                <span>•</span>
                <span>GST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-2 sm:p-4 bg-slate-900 rounded-t-[2rem]">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
              />
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Module Lecture</h2>
            <p className="text-slate-600 mt-2 leading-relaxed max-w-3xl">
              Watch this comprehensive video lesson to understand the fundamental concepts. Make sure to complete the entire module before proceeding to the next section.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default GSTVideoPlayer;
