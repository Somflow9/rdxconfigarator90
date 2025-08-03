import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CarConfiguration, ConfigurationValidation } from '@/types/car';
import { 
  carVariants, 
  carColors, 
  roofTypes, 
  wheelOptions, 
  interiorOptions, 
  addOns, 
  techPacks, 
  decals,
  defaultConfiguration 
} from '@/data/carData';
import { generateConfigId, formatPrice } from '@/lib/utils';

// Enhanced configuration module interface
interface ConfigModule {
  id: string;
  title: string;
  imageKey: string;
  priceImpact: number;
  dependencies: string[];
  exclusions: string[];
  category: string;
  metadata?: Record<string, any>;
}

// Configuration state interface
interface ConfigState {
  // Core configuration
  variant: typeof carVariants[0];
  color: typeof carColors[0];
  roof: typeof roofTypes[0];
  wheels: typeof wheelOptions[0];
  interior: typeof interiorOptions;
  addOns: typeof addOns;
  techPacks: typeof techPacks;
  decals: typeof decals;
  customPlate: string;
  
  // UI State
  activeSection: string;
  is3DLoaded: boolean;
  cameraPosition: 'front' | 'side' | 'rear' | 'interior';
  audioEnabled: boolean;
  showAnimations: boolean;
  
  // Configuration history
  configHistory: CarConfiguration[];
  currentConfigId: string;
  
  // Actions
  setVariant: (variant: typeof carVariants[0]) => void;
  setColor: (color: typeof carColors[0]) => void;
  setRoof: (roof: typeof roofTypes[0]) => void;
  setWheels: (wheels: typeof wheelOptions[0]) => void;
  toggleInterior: (interior: typeof interiorOptions[0]) => void;
  toggleAddOn: (addOn: typeof addOns[0]) => void;
  toggleTechPack: (techPack: typeof techPacks[0]) => void;
  toggleDecal: (decal: typeof decals[0]) => void;
  setCustomPlate: (plate: string) => void;
  setActiveSection: (section: string) => void;
  set3DLoaded: (loaded: boolean) => void;
  setCameraPosition: (position: 'front' | 'side' | 'rear' | 'interior') => void;
  setAudioEnabled: (enabled: boolean) => void;
  setShowAnimations: (enabled: boolean) => void;
  resetConfiguration: () => void;
  saveConfiguration: () => CarConfiguration;
  loadConfiguration: (config: CarConfiguration) => void;
  loadConfigurationById: (configId: string) => void;
  compareConfigurations: (config1: CarConfiguration, config2: CarConfiguration) => any;
  
  // Computed values
  totalPrice: number;
  formattedPrice: string;
  validation: ConfigurationValidation;
  configSummary: any;
  compatibleOptions: any;
  priceBreakdown: any;
}

// Enhanced price calculation with detailed breakdown
const calculatePriceBreakdown = (state: Omit<ConfigState, 'totalPrice' | 'formattedPrice' | 'validation' | 'configSummary' | 'compatibleOptions' | 'priceBreakdown'>) => {
  const breakdown = {
    base: state.variant.basePrice,
    color: state.color.price,
    roof: state.roof.price,
    wheels: state.wheels.price,
    interior: state.interior.reduce((sum, item) => sum + item.price, 0),
    addOns: state.addOns.reduce((sum, item) => sum + item.price, 0),
    techPacks: state.techPacks.reduce((sum, item) => sum + item.price, 0),
    decals: state.decals.reduce((sum, item) => sum + item.price, 0),
    customPlate: state.customPlate ? 5000 : 0
  };

  const total = Object.values(breakdown).reduce((sum, price) => sum + price, 0);
  
  return {
    breakdown,
    total,
    formattedTotal: formatPrice(total)
  };
};

// Enhanced validation with detailed compatibility checking
const validateConfiguration = (state: Omit<ConfigState, 'totalPrice' | 'formattedPrice' | 'validation' | 'configSummary' | 'compatibleOptions' | 'priceBreakdown'>): ConfigurationValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const compatibilityIssues: any[] = [];

  // Check roof compatibility
  if (!state.roof.compatibleWith.includes(state.variant.id)) {
    errors.push(`${state.roof.name} is not compatible with ${state.variant.name}`);
    compatibilityIssues.push({
      type: 'error',
      component: 'roof',
      message: 'Incompatible roof type for selected variant'
    });
  }

  // Check add-on compatibility with enhanced logic
  state.addOns.forEach(addOn => {
    if (!addOn.compatibleWith.includes(state.variant.id)) {
      errors.push(`${addOn.name} is not compatible with ${state.variant.name}`);
      compatibilityIssues.push({
        type: 'error',
        component: 'addOn',
        item: addOn,
        message: 'Incompatible add-on for selected variant'
      });
    }
  });

  // Enhanced roof carrier compatibility
  const roofCarrier = state.addOns.find(addOn => addOn.id === 'roof-carrier');
  if (roofCarrier && state.roof.id !== 'hardtop') {
    errors.push('Roof carrier is only compatible with hardtop');
    compatibilityIssues.push({
      type: 'error',
      component: 'addOn',
      item: roofCarrier,
      message: 'Roof carrier requires hardtop'
    });
  }

  // Enhanced winch mount compatibility
  const winchMount = state.addOns.find(addOn => addOn.id === 'winch-mount');
  if (winchMount && state.variant.id !== 'x') {
    errors.push('Winch mount is only available on X variant');
    compatibilityIssues.push({
      type: 'error',
      component: 'addOn',
      item: winchMount,
      message: 'Winch mount requires X variant'
    });
  }

  // Enhanced snorkel compatibility
  const snorkel = state.addOns.find(addOn => addOn.id === 'snorkel-kit');
  if (snorkel && state.variant.id !== 'x') {
    errors.push('Snorkel kit is only available on X variant');
    compatibilityIssues.push({
      type: 'error',
      component: 'addOn',
      item: snorkel,
      message: 'Snorkel kit requires X variant'
    });
  }

  // Enhanced rear ladder compatibility
  const rearLadder = state.addOns.find(addOn => addOn.id === 'rear-ladder');
  if (rearLadder && !['lx', 'x'].includes(state.variant.id)) {
    errors.push('Rear ladder is only available on LX and X variants');
    compatibilityIssues.push({
      type: 'error',
      component: 'addOn',
      item: rearLadder,
      message: 'Rear ladder requires LX or X variant'
    });
  }

  // Enhanced warnings for expensive combinations
  if (state.decals.find(decal => decal.id === 'matte-wrap') && state.color.price > 0) {
    warnings.push('Matte wrap will cover your selected color');
    compatibilityIssues.push({
      type: 'warning',
      component: 'decal',
      message: 'Matte wrap covers color selection'
    });
  }

  // Performance warnings
  if (state.addOns.length > 4) {
    warnings.push('Multiple add-ons may affect vehicle performance');
  }

  // Budget warnings
  const totalPrice = calculatePriceBreakdown(state).total;
  if (totalPrice > 2500000) {
    warnings.push('Configuration exceeds premium budget range');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Generate configuration summary
const generateConfigSummary = (state: Omit<ConfigState, 'totalPrice' | 'formattedPrice' | 'validation' | 'configSummary' | 'compatibleOptions' | 'priceBreakdown'>) => {
  return {
    variant: state.variant.name,
    color: state.color.name,
    roof: state.roof.name,
    wheels: state.wheels.name,
    interior: state.interior.map(item => item.name),
    addOns: state.addOns.map(item => item.name),
    techPacks: state.techPacks.map(item => item.name),
    decals: state.decals.map(item => item.name),
    customPlate: state.customPlate,
    totalPrice: calculatePriceBreakdown(state).total,
    formattedPrice: calculatePriceBreakdown(state).formattedTotal,
    configId: state.currentConfigId
  };
};

// Get compatible options based on current configuration
const getCompatibleOptions = (state: Omit<ConfigState, 'totalPrice' | 'formattedPrice' | 'validation' | 'configSummary' | 'compatibleOptions' | 'priceBreakdown'>) => {
  return {
    roofTypes: roofTypes.filter(roof => roof.compatibleWith.includes(state.variant.id)),
    addOns: addOns.filter(addOn => {
      const baseCompatible = addOn.compatibleWith.includes(state.variant.id);
      const roofCompatible = addOn.id !== 'roof-carrier' || state.roof.id === 'hardtop';
      return baseCompatible && roofCompatible;
    }),
    techPacks: techPacks, // All tech packs are compatible
    decals: decals // All decals are compatible
  };
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultConfiguration,
      activeSection: 'variant',
      is3DLoaded: false,
      cameraPosition: 'front',
      audioEnabled: true,
      showAnimations: true,
      configHistory: [],
      currentConfigId: generateConfigId(),

      // Enhanced actions with better state management
      setVariant: (variant) => {
        set((state) => {
          const newState = { ...state, variant };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          
          // Reset incompatible options with enhanced logic
          let newRoof = state.roof;
          // Check if current roof is compatible with new variant
          const compatibleRoofs = roofTypes.filter(roof => roof.compatibleWith.includes(variant.id));
          if (!compatibleRoofs.find(roof => roof.id === state.roof.id)) {
            newRoof = compatibleRoofs[0] || roofTypes[0];
          }

          // Reset incompatible add-ons
          const newAddOns = state.addOns.filter(addOn => 
            addOn.compatibleWith.includes(variant.id) &&
            (addOn.id !== 'roof-carrier' || newRoof.id === 'hardtop')
          );

          return {
            ...newState,
            roof: newRoof,
            addOns: newAddOns,
            totalPrice,
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      setColor: (color) => {
        set((state) => {
          const newState = { ...state, color };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      setRoof: (roof) => {
        set((state) => {
          const newState = { ...state, roof };
          
          // Reset incompatible add-ons when roof changes
          const newAddOns = state.addOns.filter(addOn => 
            addOn.id !== 'roof-carrier' || roof.id === 'hardtop'
          );
          
          const updatedState = { ...newState, addOns: newAddOns };
          const totalPrice = calculatePriceBreakdown(updatedState).total;
          const validation = validateConfiguration(updatedState);
          
          return { 
            ...updatedState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      setWheels: (wheels) => {
        set((state) => {
          const newState = { ...state, wheels };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      toggleInterior: (interior) => {
        set((state) => {
          const isSelected = state.interior.some(item => item.id === interior.id);
          const newInterior = isSelected
            ? state.interior.filter(item => item.id !== interior.id)
            : [...state.interior, interior];
          
          const newState = { ...state, interior: newInterior };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      toggleAddOn: (addOn) => {
        set((state) => {
          const isSelected = state.addOns.some(item => item.id === addOn.id);
          const newAddOns = isSelected
            ? state.addOns.filter(item => item.id !== addOn.id)
            : [...state.addOns, addOn];
          
          const newState = { ...state, addOns: newAddOns };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      toggleTechPack: (techPack) => {
        set((state) => {
          const isSelected = state.techPacks.some(item => item.id === techPack.id);
          const newTechPacks = isSelected
            ? state.techPacks.filter(item => item.id !== techPack.id)
            : [...state.techPacks, techPack];
          
          const newState = { ...state, techPacks: newTechPacks };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      toggleDecal: (decal) => {
        set((state) => {
          const isSelected = state.decals.some(item => item.id === decal.id);
          const newDecals = isSelected
            ? state.decals.filter(item => item.id !== decal.id)
            : [...state.decals, decal];
          
          const newState = { ...state, decals: newDecals };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      setCustomPlate: (customPlate) => {
        set((state) => {
          const newState = { ...state, customPlate };
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      setActiveSection: (activeSection) => set({ activeSection }),
      set3DLoaded: (is3DLoaded) => set({ is3DLoaded }),
      setCameraPosition: (cameraPosition) => set({ cameraPosition }),
      setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
      setShowAnimations: (showAnimations) => set({ showAnimations }),

      resetConfiguration: () => {
        set((state) => {
          const newState = { ...state, ...defaultConfiguration };
          const totalPrice = calculatePriceBreakdown(newState).total;
          const validation = validateConfiguration(newState);
          return { 
            ...newState, 
            totalPrice, 
            validation,
            currentConfigId: generateConfigId()
          };
        });
      },

      saveConfiguration: () => {
        const state = get();
        const config: CarConfiguration = {
          id: state.currentConfigId,
          variant: state.variant,
          color: state.color,
          roof: state.roof,
          wheels: state.wheels,
          interior: state.interior,
          addOns: state.addOns,
          techPacks: state.techPacks,
          decals: state.decals,
          customPlate: state.customPlate,
          totalPrice: state.totalPrice,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Save to localStorage with enhanced structure
        const savedConfigs = JSON.parse(localStorage.getItem('thar-configs') || '[]');
        const existingIndex = savedConfigs.findIndex((c: any) => c.id === config.id);
        
        if (existingIndex >= 0) {
          savedConfigs[existingIndex] = config;
        } else {
          savedConfigs.push(config);
        }
        
        localStorage.setItem('thar-configs', JSON.stringify(savedConfigs));
        
        // Update history
        set((state) => ({
          configHistory: [...state.configHistory, config].slice(-10) // Keep last 10
        }));
        
        return config;
      },

      loadConfiguration: (config) => {
        set((state) => {
          const newState = {
            ...state,
            variant: config.variant,
            color: config.color,
            roof: config.roof,
            wheels: config.wheels,
            interior: config.interior,
            addOns: config.addOns,
            techPacks: config.techPacks,
            decals: config.decals,
            customPlate: config.customPlate || '',
            totalPrice: config.totalPrice,
            currentConfigId: config.id
          };
          const validation = validateConfiguration(newState);
          return { ...newState, validation };
        });
      },

      loadConfigurationById: (configId) => {
        const savedConfigs = JSON.parse(localStorage.getItem('thar-configs') || '[]');
        const config = savedConfigs.find((c: any) => c.id === configId);
        if (config) {
          get().loadConfiguration(config);
        }
      },

      compareConfigurations: (config1, config2) => {
        return {
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
      },

      // Computed values
      get totalPrice() {
        return calculatePriceBreakdown(get()).total;
      },

      get formattedPrice() {
        return calculatePriceBreakdown(get()).formattedTotal;
      },

      get validation() {
        return validateConfiguration(get());
      },

      get configSummary() {
        return generateConfigSummary(get());
      },

      get compatibleOptions() {
        return getCompatibleOptions(get());
      },

      get priceBreakdown() {
        return calculatePriceBreakdown(get());
      }
    }),
    {
      name: 'thar-configurator',
      partialize: (state) => ({
        variant: state.variant,
        color: state.color,
        roof: state.roof,
        wheels: state.wheels,
        interior: state.interior,
        addOns: state.addOns,
        techPacks: state.techPacks,
        decals: state.decals,
        customPlate: state.customPlate,
        audioEnabled: state.audioEnabled,
        showAnimations: state.showAnimations,
        configHistory: state.configHistory
      })
    }
  )
); 