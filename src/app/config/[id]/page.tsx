'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useConfigStore } from '@/store/configStore';
import CarViewer from '@/components/CarViewer';
import ConfigSidebar from '@/components/ConfigSidebar';
import PricePanel from '@/components/PricePanel';
import { motion } from 'framer-motion';

export default function ConfigPage() {
  const params = useParams();
  const configId = params?.id as string;
  const { loadConfiguration } = useConfigStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (configId) {
          // For now, just simulate loading
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (err) {
        console.error('Failed to load configuration:', err);
        setError('Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [configId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6 animate-spin"></div>
          <h1 className="text-4xl font-bold text-white mb-4">Loading Configuration</h1>
          <p className="text-gray-400 text-lg">Please wait while we load your saved configuration...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Configuration Not Found</h1>
          <p className="text-gray-400 text-lg mb-8">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold"
            onClick={() => window.history.back()}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="flex h-screen">
        <ConfigSidebar />
        <div className="flex-1 relative">
          <CarViewer />
        </div>
        <PricePanel />
      </div>
    </div>
  );
} 