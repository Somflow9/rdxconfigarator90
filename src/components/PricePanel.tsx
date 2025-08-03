'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IndianRupee, 
  Share2, 
  Download, 
  Calendar, 
  QrCode, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Clock,
  History,
  GitCompare,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import QRCode from 'react-qr-code';

interface SavedConfiguration {
  id: string;
  variant: { id: string; name: string };
  color: { id: string; name: string; hex: string };
  roof: { id: string; name: string };
  wheels: { id: string; name: string; type: string };
  interior: any[];
  addOns: any[];
  techPacks: any[];
  decals: any[];
  totalPrice: number;
  createdAt: string;
}

export default function PricePanel() {
  const { 
    variant, 
    color, 
    roof, 
    wheels, 
    interior, 
    addOns, 
    techPacks, 
    decals, 
    customPlate,
    totalPrice, 
    formattedPrice,
    priceBreakdown,
    configSummary,
    configHistory,
    resetConfiguration,
    saveConfiguration,
    validation,
    loadConfigurationById
  } = useConfigStore();

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedConfigForComparison, setSelectedConfigForComparison] = useState<SavedConfiguration | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);

  // Price animation effect
  useEffect(() => {
    setIsPriceAnimating(true);
    const timer = setTimeout(() => setIsPriceAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  const handleSaveConfig = () => {
    const config = saveConfiguration();
    const savedConfig: SavedConfiguration = {
      ...config,
      createdAt: config.createdAt.toISOString()
    };
    setSavedConfigs(prev => [...prev, savedConfig]);
    
    // Show success animation
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
    successElement.textContent = 'Configuration saved!';
    document.body.appendChild(successElement);
    
    setTimeout(() => {
      document.body.removeChild(successElement);
    }, 3000);
  };

  const handleShare = () => {
    const configData = {
      variant: variant.name,
      color: color.name,
      roof: roof.name,
      wheels: wheels.name,
      totalPrice: formattedPrice,
      configId: configSummary.configId
    };
    
    const shareText = `Check out my custom Thar configuration!\n\n${Object.entries(configData).map(([key, value]) => `${key}: ${value}`).join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Thar',
        text: shareText,
        url: `${window.location.origin}/config/${configSummary.configId}`
      });
    } else {
      navigator.clipboard.writeText(shareText);
      
      // Show copy success
      const copyElement = document.createElement('div');
      copyElement.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50';
      copyElement.textContent = 'Configuration copied to clipboard!';
      document.body.appendChild(copyElement);
      
      setTimeout(() => {
        document.body.removeChild(copyElement);
      }, 3000);
    }
  };

  const handleTestDrive = () => {
    // Enhanced test drive booking
    const testDriveData = {
      variant: variant.name,
      color: color.name,
      totalPrice: formattedPrice,
      configId: configSummary.configId
    };
    
    // In a real app, this would open a booking form
    console.log('Test drive booking:', testDriveData);
    alert('Test drive booking feature coming soon!');
  };

  const handleExportPDF = () => {
    // Enhanced PDF export
    const pdfData = {
      ...configSummary,
      generatedAt: new Date().toISOString(),
      breakdown: priceBreakdown.breakdown
    };
    
    // In a real app, this would generate and download a PDF
    console.log('PDF export:', pdfData);
    alert('PDF export feature coming soon!');
  };

  const handleCompareConfigs = (config1: SavedConfiguration, config2: SavedConfiguration) => {
    const comparison = {
      priceDifference: config1.totalPrice - config2.totalPrice,
      formattedPriceDifference: formatPrice(Math.abs(config1.totalPrice - config2.totalPrice)),
      isMoreExpensive: config1.totalPrice > config2.totalPrice,
      differences: {
        variant: config1.variant.id !== config2.variant.id,
        color: config1.color.id !== config2.color.id,
        roof: config1.roof.id !== config2.roof.id,
        wheels: config1.wheels.id !== config2.wheels.id,
        interior: config1.interior.length !== config2.interior.length,
        addOns: config1.addOns.length !== config2.addOns.length,
        techPacks: config1.techPacks.length !== config2.techPacks.length,
        decals: config1.decals.length !== config2.decals.length
      }
    };
    
    return comparison;
  };

  const priceBreakdownItems = [
    { label: 'Base Price', value: priceBreakdown.breakdown.base, category: 'base' },
    { label: 'Color', value: priceBreakdown.breakdown.color, category: 'exterior' },
    { label: 'Roof', value: priceBreakdown.breakdown.roof, category: 'exterior' },
    { label: 'Wheels', value: priceBreakdown.breakdown.wheels, category: 'exterior' },
    ...interior.map(item => ({ label: item.name, value: item.price, category: 'interior' })),
    ...addOns.map(item => ({ label: item.name, value: item.price, category: 'accessories' })),
    ...techPacks.map(item => ({ label: item.name, value: item.price, category: 'technology' })),
    ...decals.map(item => ({ label: item.name, value: item.price, category: 'exterior' })),
    ...(customPlate ? [{ label: 'Custom Plate', value: 5000, category: 'exterior' }] : [])
  ];

  const totalAddOns = priceBreakdownItems.filter(item => item.value > 0).reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="w-80 bg-card border-l border-border h-full overflow-y-auto"
    >
      <div className="p-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        >
          Your Build
        </motion.h2>

        {/* Enhanced Total Price with Animation */}
        <motion.div
          layout
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20 relative overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center relative z-10">
                <motion.div 
                  className="flex items-center justify-center gap-2 mb-2"
                  animate={isPriceAnimating ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <IndianRupee className="w-6 h-6 text-primary" />
                  <motion.span 
                    key={totalPrice}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-primary"
                  >
                    {formattedPrice}
                  </motion.span>
                </motion.div>
                <p className="text-sm text-muted-foreground">Total Configuration Price</p>
                
                {/* Price trend indicator */}
                {totalAddOns > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground"
                  >
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>+{formatPrice(totalAddOns)} in upgrades</span>
                  </motion.div>
                )}
              </div>
              
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5"
                animate={{ 
                  background: [
                    "linear-gradient(45deg, rgba(139, 92, 246, 0.05) 0%, rgba(108, 74, 182, 0.05) 100%)",
                    "linear-gradient(45deg, rgba(108, 74, 182, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Configuration Summary */}
        <motion.div
          layout
          className="mb-6"
        >
          <Card className="border-border hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Configuration</CardTitle>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                >
                  {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </motion.button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="text-sm text-muted-foreground">Variant</span>
                  <span className="text-sm font-medium">{variant.name}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-sm text-muted-foreground">Color</span>
                  <span className="text-sm font-medium">{color.name}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-sm text-muted-foreground">Roof</span>
                  <span className="text-sm font-medium">{roof.name}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm text-muted-foreground">Wheels</span>
                  <span className="text-sm font-medium">{wheels.name}</span>
                </motion.div>
                
                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-3 border-t border-border"
                    >
                      <LayoutGroup>
                        <div className="space-y-2">
                          {priceBreakdownItems.filter(item => item.value > 0).map((item, index) => (
                            <motion.div
                              key={item.label}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="font-medium text-primary">+{formatPrice(item.value)}</span>
                            </motion.div>
                          ))}
                        </div>
                      </LayoutGroup>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          layout
          className="space-y-3"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full relative overflow-hidden" 
              variant="premium"
              disabled={!validation.isValid}
              onClick={handleSaveConfig}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <CheckCircle className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Confirm Build</span>
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQR(!showQR)}
                className="w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestDrive}
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Test Drive
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportPDF}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                               <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => setShowComparison(!showComparison)}
                   className="w-full"
                 >
                   <GitCompare className="w-4 h-4 mr-2" />
                   Compare
                 </Button>
            </motion.div>
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetConfiguration}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Configuration
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card p-6 rounded-xl border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4 text-center">Scan to Share</h3>
                <div className="bg-white p-4 rounded-lg">
                  <QRCode 
                    value={`${window.location.origin}/config/${configSummary.configId}`}
                    size={200}
                    level="H"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Scan this QR code to share your configuration
                </p>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/config/${configSummary.configId}`);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Configuration History */}
        <AnimatePresence>
          {showHistory && configHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Configurations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {configHistory.slice(-5).reverse().map((config, index) => (
                      <motion.div
                        key={config.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                        onClick={() => loadConfigurationById(config.id)}
                      >
                        <div>
                          <p className="font-medium text-sm">{config.variant.name}</p>
                          <p className="text-xs text-muted-foreground">{config.color.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatPrice(config.totalPrice)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newConfigs = savedConfigs.filter(c => c.id !== config.id);
                              setSavedConfigs(newConfigs);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Configuration Comparison */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                                     <CardTitle className="text-lg flex items-center gap-2">
                     <GitCompare className="w-5 h-5" />
                     Compare Configurations
                   </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a saved configuration to compare with your current build
                  </p>
                  <div className="space-y-2">
                    {savedConfigs.map((config) => (
                      <Button
                        key={config.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          const comparison = handleCompareConfigs(configSummary, config);
                          console.log('Comparison:', comparison);
                          alert(`Price difference: ${comparison.formattedPriceDifference}`);
                        }}
                      >
                        <span className="truncate">{config.variant.name} - {config.color.name}</span>
                        <span className="ml-auto">{formatPrice(config.totalPrice)}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 