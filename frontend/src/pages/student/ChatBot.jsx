import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function ChatBot() {
  const { studentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
          >
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mb-4"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 font-medium"
              >
                Preparing your AI companion...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-6 md:py-8 text-center rounded-2xl shadow-lg mb-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            MindEase AI Companion
          </h1>
          <p className="mt-2 text-base md:text-lg opacity-95">
            Hi! What can I help you with?
          </p>
        </motion.div>
      </motion.header>

      {/* Chatbot Section */}
      <main className="flex-grow flex items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-4xl h-[65vh] bg-white shadow-xl rounded-2xl overflow-hidden border border-indigo-100"
        >
          {/* Chatbot Frame */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="w-full h-full"
          >
            <iframe
              ref={iframeRef}
              src="https://www.chatbase.co/chatbot-iframe/EclNn7bsX2E9hkIZXTpI_"
              title="MindEase Chatbot"
              className="w-full h-full"
              allow="microphone"
              style={{ border: "none" }}
              onLoad={handleIframeLoad}
            ></iframe>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="py-4 bg-white rounded-xl shadow-sm mb-6"
      >
        <h2 className="text-center text-lg font-semibold mb-4 text-gray-700">How can I help you?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-4 rounded-lg bg-indigo-50 text-center border border-indigo-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-2xl mb-2">😌</div>
            <h3 className="font-medium mb-2 text-indigo-700">Reduce Anxiety</h3>
            <p className="text-xs text-gray-600">Calming techniques and exercises</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-4 rounded-lg bg-indigo-50 text-center border border-indigo-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="text-2xl mb-2">💭</div>
            <h3 className="font-medium mb-2 text-indigo-700">Mindfulness</h3>
            <p className="text-xs text-gray-600">Stay present and grounded</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-4 rounded-lg bg-indigo-50 text-center border border-indigo-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="text-2xl mb-2">🌙</div>
            <h3 className="font-medium mb-2 text-indigo-700">Sleep Better</h3>
            <p className="text-xs text-gray-600">Tips for restful sleep</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer Note */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="text-center text-xs text-gray-500 mt-4"
      >
        <p>Powered by Chatbase • Your conversations are private and secure</p>
        <p className="mt-1">For immediate crisis support, please contact emergency services</p>
      </motion.footer>
    </div>
  );
}