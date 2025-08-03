'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Settings, Palette, Zap, Sparkles, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import CarViewer from '@/components/CarViewer';
import ConfigSidebar from '@/components/ConfigSidebar';
import PricePanel from '@/components/PricePanel';
import { useConfigStore } from '@/store/configStore';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { is3DLoaded, set3DLoaded, audioEnabled: storeAudioEnabled, setAudioEnabled: setStoreAudioEnabled } = useConfigStore();

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Intro animation sequence
    if (!isLoading) {
      const introTimer = setTimeout(() => {
        setShowIntro(false);
        // Play intro sound if audio is enabled
        if (audioEnabled) {
          console.log('Playing intro sound');
        }
      }, 4000);

      return () => clearTimeout(introTimer);
    }
  }, [isLoading, audioEnabled]);

  const handleAudioToggle = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    setStoreAudioEnabled(newAudioState);
    
    if (newAudioState) {
      setIsPlaying(true);
      // In a real app, this would play ambient engine sound
      console.log('Audio enabled - playing ambient sounds');
    } else {
      setIsPlaying(false);
      console.log('Audio disabled');
    }
  };

  const handleBuildComplete = () => {
    // Simulate build completion sound and animation
    if (audioEnabled) {
      console.log('Playing build completion sound');
    }
    
    // Show completion animation
    const completionElement = document.createElement('div');
    completionElement.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    completionElement.innerHTML = `
      <div class="bg-green-500/20 backdrop-blur-sm text-green-500 px-6 py-3 rounded-lg border border-green-500/30">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
          <span class="font-semibold">Build Complete!</span>
        </div>
      </div>
    `;
    document.body.appendChild(completionElement);
    
    setTimeout(() => {
      document.body.removeChild(completionElement);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Thar Configurator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mb-8 text-lg"
          >
            Loading your premium car configuration experience...
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-2"
          >
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Car driving in animation */}
        <motion.div
          initial={{ x: '-100vw', y: '50vh' }}
          animate={{ x: '50vw', y: '50vh' }}
          transition={{ 
            duration: 2, 
            ease: "easeOut",
            delay: 0.5
          }}
          className="absolute"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Car className="w-32 h-32 text-primary" />
          </motion.div>
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center z-10"
        >
          <motion.h1 
            className="text-6xl font-bold text-white mb-6"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.8)",
                "0 0 20px rgba(139, 92, 246, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to
          </motion.h1>
          <motion.h2 
            className="text-7xl font-bold text-gradient-glow mb-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, duration: 0.8, type: "spring" }}
          >
            Thar Configurator
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            Experience the ultimate freedom of customization
          </motion.p>
          
          {/* Audio toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3, type: "spring" }}
            onClick={handleAudioToggle}
            className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full p-4 hover:bg-primary/30 transition-all duration-300"
          >
            {audioEnabled ? (
              <Volume2 className="w-6 h-6 text-primary" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
          </motion.button>
        </motion.div>

        {/* Sparkle effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Car className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-white">Thar Configurator</h1>
            </motion.div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-4 h-4" />
                <span>3-Door</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Palette className="w-4 h-4" />
                <span>Customizable</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4" />
                <span>Premium</span>
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-400">Experience the</p>
              <p className="text-lg font-semibold text-white">Ultimate Freedom</p>
            </div>
            
            {/* Audio controls */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAudioToggle}
              className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-2 hover:bg-primary/30 transition-all duration-300"
            >
              {audioEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>
            
            {/* Play/Pause for ambient sounds */}
            {audioEnabled && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-2 hover:bg-primary/30 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-primary" />
                ) : (
                  <Play className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Configuration Sidebar */}
        <ConfigSidebar />
        
        {/* 3D Car Viewer */}
        <motion.main
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 relative"
        >
          <CarViewer />
          
          {/* Floating Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-6 left-6 glass-dark p-4 text-white max-w-sm"
          >
            <h3 className="font-semibold mb-2">Interactive 3D Experience</h3>
            <p className="text-sm text-gray-300 mb-3">
              Rotate, zoom, and explore your custom Thar from every angle. 
              Changes in the sidebar update the 3D model in real-time.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time updates</span>
            </div>
          </motion.div>

          {/* Build completion trigger */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleBuildComplete}
            className="absolute top-6 left-6 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-2 hover:bg-primary/30 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.button>
        </motion.main>
        
        {/* Price Panel */}
        <PricePanel />
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Price</p>
            <p className="text-lg font-bold text-primary">
              {useConfigStore.getState().formattedPrice}
            </p>
          </div>
          <motion.button 
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configure
          </motion.button>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Floating particles */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
