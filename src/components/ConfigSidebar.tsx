'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  Palette, 
  Home, 
  Settings, 
  Plus, 
  Wrench, 
  Zap, 
  Tag,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { carVariants, carColors, roofTypes, wheelOptions, interiorOptions, addOns, techPacks, decals } from '@/data/carData';
import { formatPrice } from '@/lib/utils';

const sections = [
  { id: 'variant', label: 'Variant', icon: Car, category: 'core' },
  { id: 'color', label: 'Color', icon: Palette, category: 'exterior' },
  { id: 'roof', label: 'Roof', icon: Home, category: 'exterior' },
  { id: 'wheels', label: 'Wheels', icon: Settings, category: 'exterior' },
  { id: 'interior', label: 'Interior', icon: Plus, category: 'interior' },
  { id: 'addons', label: 'Add-ons', icon: Wrench, category: 'accessories' },
  { id: 'tech', label: 'Tech Packs', icon: Zap, category: 'technology' },
  { id: 'decals', label: 'Decals', icon: Tag, category: 'exterior' },
];

interface OptionCardProps {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
  showPrice?: boolean;
  disabled?: boolean;
  category?: string;
}

function OptionCard({ item, isSelected, onSelect, showPrice = true, disabled = false, category }: OptionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [audioEnabled] = useState(true); // In a real app, this would come from settings

  const handleSelect = () => {
    if (disabled) return;
    
    // Audio feedback
    if (audioEnabled) {
      // Simulate audio feedback (in real app, play actual sound)
      console.log('Selection sound played');
    }
    
    onSelect();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -2
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-lg shadow-primary/20' 
            : 'border-border hover:border-primary/50 hover:shadow-md'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
          isHovered && !disabled ? 'bg-card/80' : ''
        }`}
        onClick={handleSelect}
      >
        <CardContent className="p-4 relative overflow-hidden">
          {/* Selection glow effect */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-lg"
            />
          )}
          
          {/* Sparkle effect on selection */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-2 right-2"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              {showPrice && item.price > 0 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground mt-1"
                >
                  +{formatPrice(item.price)}
                </motion.p>
              )}
              {category && (
                <span className="inline-block px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground mt-2">
                  {category}
                </span>
              )}
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced section components with animations
function VariantSection() {
  const { variant, setVariant } = useConfigStore();

  const handleVariantChange = (variant: typeof carVariants[0]) => {
    setVariant(variant);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {carVariants.map((carVariant, index) => (
        <motion.div
          key={carVariant.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OptionCard
            item={carVariant}
            isSelected={variant.id === carVariant.id}
            onSelect={() => handleVariantChange(carVariant)}
            showPrice={false}
            category="core"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function ColorSection() {
  const { color, setColor } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {carColors.map((carColor, index) => (
        <motion.div
          key={carColor.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <OptionCard
            item={carColor}
            isSelected={color.id === carColor.id}
            onSelect={() => setColor(carColor)}
            category="exterior"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function RoofSection() {
  const { roof, setRoof, variant } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {roofTypes.map((roofType) => {
        const isCompatible = roofType.compatibleWith.includes(variant.id);
        return (
          <OptionCard
            key={roofType.id}
            item={roofType}
            isSelected={roof.id === roofType.id}
            onSelect={() => setRoof(roofType)}
            disabled={!isCompatible}
            category="exterior"
          />
        );
      })}
    </motion.div>
  );
}

function WheelsSection() {
  const { wheels, setWheels } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {wheelOptions.map((wheelOption) => (
        <OptionCard
          key={wheelOption.id}
          item={wheelOption}
          isSelected={wheels.id === wheelOption.id}
          onSelect={() => setWheels(wheelOption)}
          category="exterior"
        />
      ))}
    </motion.div>
  );
}

function InteriorSection() {
  const { interior, toggleInterior } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {interiorOptions.map((interiorOption) => {
        const isSelected = interior.some(item => item.id === interiorOption.id);
        return (
          <OptionCard
            key={interiorOption.id}
            item={interiorOption}
            isSelected={isSelected}
            onSelect={() => toggleInterior(interiorOption)}
            category="interior"
          />
        );
      })}
    </motion.div>
  );
}

function AddOnsSection() {
  const { addOns, toggleAddOn, variant, roof } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {addOns.map((addOn) => {
        const isSelected = addOns.some(item => item.id === addOn.id);
        const isCompatible = addOn.compatibleWith.includes(variant.id) &&
          (addOn.id !== 'roof-carrier' || roof.id === 'hardtop');
        
        return (
          <OptionCard
            key={addOn.id}
            item={addOn}
            isSelected={isSelected}
            onSelect={() => toggleAddOn(addOn)}
            disabled={!isCompatible}
            category="accessories"
          />
        );
      })}
    </motion.div>
  );
}

function TechPacksSection() {
  const { techPacks, toggleTechPack } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {techPacks.map((techPack) => {
        const isSelected = techPacks.some(item => item.id === techPack.id);
        return (
          <OptionCard
            key={techPack.id}
            item={techPack}
            isSelected={isSelected}
            onSelect={() => toggleTechPack(techPack)}
            category="technology"
          />
        );
      })}
    </motion.div>
  );
}

function DecalsSection() {
  const { decals, toggleDecal, setCustomPlate, customPlate } = useConfigStore();

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {decals.map((decal) => {
        const isSelected = decals.some(item => item.id === decal.id);
        return (
          <OptionCard
            key={decal.id}
            item={decal}
            isSelected={isSelected}
            onSelect={() => toggleDecal(decal)}
            category="exterior"
          />
        );
      })}
      
      {/* Enhanced custom plate input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">Custom Number Plate</h4>
            <motion.input
              type="text"
              value={customPlate}
              onChange={(e) => setCustomPlate(e.target.value)}
              placeholder="Enter custom plate"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              maxLength={10}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mt-2"
            >
              +{formatPrice(5000)}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function ConfigSidebar() {
  const { activeSection, setActiveSection, validation } = useConfigStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['variant']));
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'variant': return <VariantSection />;
      case 'color': return <ColorSection />;
      case 'roof': return <RoofSection />;
      case 'wheels': return <WheelsSection />;
      case 'interior': return <InteriorSection />;
      case 'addons': return <AddOnsSection />;
      case 'tech': return <TechPacksSection />;
      case 'decals': return <DecalsSection />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="w-80 bg-card border-r border-border h-full overflow-y-auto"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Configure Your Thar
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>
        </motion.div>
        
        {/* Enhanced validation errors */}
        <AnimatePresence>
          {!validation.isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6 border-destructive bg-destructive/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h4 className="font-medium text-destructive">Configuration Issues</h4>
                  </div>
                  <ul className="text-sm text-destructive space-y-1">
                    {validation.errors.map((error, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        • {error}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced warnings */}
        <AnimatePresence>
          {validation.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <h4 className="font-medium text-yellow-500">Warnings</h4>
                  </div>
                  <ul className="text-sm text-yellow-500 space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        • {warning}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced configuration sections */}
        <LayoutGroup>
          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border hover:border-primary/30 transition-all duration-300">
                    <CardHeader 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <motion.div 
                        className="flex items-center justify-between"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon className="w-5 h-5 text-primary" />
                          </motion.div>
                          <CardTitle className="text-lg">{section.label}</CardTitle>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </motion.div>
                      </motion.div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <CardContent className="p-4 pt-0">
                            {renderSection(section.id)}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </motion.div>
  );
} 