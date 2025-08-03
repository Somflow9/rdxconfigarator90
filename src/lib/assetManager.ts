// Asset Management System for Thar Configurator

export interface AssetConfig {
  id: string;
  name: string;
  modelPath: string;
  texturePath?: string;
  thumbnailPath?: string;
  price: number;
  category: string;
  compatibleWith: string[];
  metadata?: Record<string, any>;
}

export interface ModelVariant {
  id: string;
  name: string;
  baseModel: string;
  variantModels: string[];
  price: number;
  features: string[];
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  modelPath?: string;
  texturePath?: string;
  price: number;
  type: 'solid' | 'metallic' | 'pearlescent' | 'matte';
}

export interface RoofVariant {
  id: string;
  name: string;
  modelPath: string;
  price: number;
  compatibleWith: string[];
  type: 'hardtop' | 'soft-top' | 'convertible';
}

export interface WheelVariant {
  id: string;
  name: string;
  modelPath: string;
  size: string;
  price: number;
  type: 'standard' | 'alloy' | 'offroad';
  compatibleWith: string[];
}

export interface AddOnVariant {
  id: string;
  name: string;
  modelPath: string;
  price: number;
  category: 'protection' | 'utility' | 'style';
  compatibleWith: string[];
  position: [number, number, number];
  scale: [number, number, number];
}

// Asset configurations
export const MODEL_VARIANTS: ModelVariant[] = [
  {
    id: 'ax',
    name: 'AX Standard',
    baseModel: '/assets/models/thar-base.glb',
    variantModels: ['/assets/models/thar-ax.glb'],
    price: 1500000,
    features: ['Basic Interior', 'Standard Features', 'R17 Wheels']
  },
  {
    id: 'lx',
    name: 'LX Luxury',
    baseModel: '/assets/models/thar-base.glb',
    variantModels: ['/assets/models/thar-lx.glb'],
    price: 1800000,
    features: ['Premium Interior', 'Advanced Features', 'R18 Alloy Wheels']
  },
  {
    id: 'x',
    name: 'X Off-Road',
    baseModel: '/assets/models/thar-base.glb',
    variantModels: ['/assets/models/thar-x.glb'],
    price: 2200000,
    features: ['Off-Road Package', 'Enhanced Features', 'R19 Off-Road Tires']
  }
];

export const COLOR_VARIANTS: ColorVariant[] = [
  {
    id: 'napoli-black',
    name: 'Napoli Black',
    hex: '#1a1a1a',
    price: 0,
    type: 'solid'
  },
  {
    id: 'galaxy-grey',
    name: 'Galaxy Grey',
    hex: '#4a4a4a',
    price: 50000,
    type: 'metallic'
  },
  {
    id: 'aquamarine-blue',
    name: 'Aquamarine Blue',
    hex: '#7FCDCD',
    price: 75000,
    type: 'pearlescent'
  },
  {
    id: 'rocky-beige',
    name: 'Rocky Beige',
    hex: '#D2B48C',
    price: 60000,
    type: 'solid'
  },
  {
    id: 'deep-forest-green',
    name: 'Deep Forest Green',
    hex: '#2F4F4F',
    price: 80000,
    type: 'metallic'
  }
];

export const ROOF_VARIANTS: RoofVariant[] = [
  {
    id: 'hardtop',
    name: 'Hardtop',
    modelPath: '/assets/models/roof-hardtop.glb',
    price: 0,
    compatibleWith: ['ax', 'lx', 'x'],
    type: 'hardtop'
  },
  {
    id: 'soft-top',
    name: 'Soft Top',
    modelPath: '/assets/models/roof-soft-top.glb',
    price: 50000,
    compatibleWith: ['ax', 'lx', 'x'],
    type: 'soft-top'
  },
  {
    id: 'convertible',
    name: 'Convertible',
    modelPath: '/assets/models/roof-convertible.glb',
    price: 100000,
    compatibleWith: ['lx', 'x'],
    type: 'convertible'
  }
];

export const WHEEL_VARIANTS: WheelVariant[] = [
  {
    id: 'standard-r17',
    name: 'Standard R17',
    modelPath: '/assets/models/wheels-standard-r17.glb',
    size: 'R17',
    price: 0,
    type: 'standard',
    compatibleWith: ['ax', 'lx', 'x']
  },
  {
    id: 'alloy-r18',
    name: 'Alloy R18',
    modelPath: '/assets/models/wheels-alloy-r18.glb',
    size: 'R18',
    price: 80000,
    type: 'alloy',
    compatibleWith: ['lx', 'x']
  },
  {
    id: 'offroad-r19',
    name: 'Off-road AT R19',
    modelPath: '/assets/models/wheels-offroad-r19.glb',
    size: 'R19',
    price: 120000,
    type: 'offroad',
    compatibleWith: ['x']
  }
];

export const ADDON_VARIANTS: AddOnVariant[] = [
  {
    id: 'front-bullbar',
    name: 'Front Bullbar',
    modelPath: '/assets/models/addons/front-bullbar.glb',
    price: 45000,
    category: 'protection',
    compatibleWith: ['ax', 'lx', 'x'],
    position: [0, 0.2, -2.2],
    scale: [1.5, 0.8, 0.1]
  },
  {
    id: 'rear-ladder',
    name: 'Rear Ladder',
    modelPath: '/assets/models/addons/rear-ladder.glb',
    price: 35000,
    category: 'utility',
    compatibleWith: ['lx', 'x'],
    position: [0, 0.5, 2.2],
    scale: [0.3, 1, 0.1]
  },
  {
    id: 'roof-carrier',
    name: 'Roof Carrier',
    modelPath: '/assets/models/addons/roof-carrier.glb',
    price: 55000,
    category: 'utility',
    compatibleWith: ['ax', 'lx', 'x'],
    position: [0, 1.2, 0],
    scale: [1.6, 0.2, 2.8]
  },
  {
    id: 'winch-mount',
    name: 'Winch Mount',
    modelPath: '/assets/models/addons/winch-mount.glb',
    price: 75000,
    category: 'utility',
    compatibleWith: ['x'],
    position: [0, 0.1, -2.5],
    scale: [1.2, 0.6, 0.2]
  },
  {
    id: 'snorkel-kit',
    name: 'Snorkel Kit',
    modelPath: '/assets/models/addons/snorkel-kit.glb',
    price: 65000,
    category: 'utility',
    compatibleWith: ['x'],
    position: [1.5, 1.5, 0],
    scale: [0.2, 1.5, 0.2]
  },
  {
    id: 'underbody-protection',
    name: 'Underbody Protection',
    modelPath: '/assets/models/addons/underbody-protection.glb',
    price: 85000,
    category: 'protection',
    compatibleWith: ['x'],
    position: [0, -0.8, 0],
    scale: [2.5, 0.1, 4.5]
  }
];

// Asset loading utilities
export class AssetManager {
  private static instance: AssetManager;
  private loadedAssets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  async loadModel(path: string): Promise<any> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path);
    }

    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    const loadPromise = new Promise((resolve, reject) => {
      // In a real implementation, this would use GLTFLoader
      // For now, we'll simulate loading
      setTimeout(() => {
        const mockModel = {
          scene: {
            clone: () => ({ traverse: (fn: any) => fn({ name: 'body', material: {} }) }),
            traverse: (fn: any) => fn({ name: 'body', material: {} })
          }
        };
        this.loadedAssets.set(path, mockModel);
        this.loadingPromises.delete(path);
        resolve(mockModel);
      }, 1000);
    });

    this.loadingPromises.set(path, loadPromise);
    return loadPromise;
  }

  async loadTexture(path: string): Promise<any> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path);
    }

    const texture = new Promise((resolve) => {
      setTimeout(() => {
        const mockTexture = { image: { src: path } };
        this.loadedAssets.set(path, mockTexture);
        resolve(mockTexture);
      }, 500);
    });

    return texture;
  }

  preloadAssets(assets: string[]): Promise<void[]> {
    return Promise.all(assets.map(asset => this.loadModel(asset)));
  }

  getAsset(path: string): any {
    return this.loadedAssets.get(path);
  }

  clearCache(): void {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }

  getAssetSize(): number {
    return this.loadedAssets.size;
  }
}

// Configuration validation utilities
export function validateConfiguration(
  variant: string,
  color: string,
  roof: string,
  wheels: string,
  addOns: string[]
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check variant compatibility
  const selectedVariant = MODEL_VARIANTS.find(v => v.id === variant);
  if (!selectedVariant) {
    errors.push('Invalid variant selected');
  }

  // Check roof compatibility
  const selectedRoof = ROOF_VARIANTS.find(r => r.id === roof);
  if (selectedRoof && !selectedRoof.compatibleWith.includes(variant)) {
    errors.push(`${selectedRoof.name} is not compatible with ${selectedVariant?.name}`);
  }

  // Check wheel compatibility
  const selectedWheels = WHEEL_VARIANTS.find(w => w.id === wheels);
  if (selectedWheels && !selectedWheels.compatibleWith.includes(variant)) {
    errors.push(`${selectedWheels.name} are not compatible with ${selectedVariant?.name}`);
  }

  // Check add-on compatibility
  addOns.forEach(addonId => {
    const addon = ADDON_VARIANTS.find(a => a.id === addonId);
    if (addon && !addon.compatibleWith.includes(variant)) {
      errors.push(`${addon.name} is not compatible with ${selectedVariant?.name}`);
    }
  });

  // Check roof carrier compatibility
  if (addOns.includes('roof-carrier') && roof !== 'hardtop') {
    errors.push('Roof carrier is only compatible with hardtop');
  }

  // Performance warnings
  if (addOns.length > 4) {
    warnings.push('Multiple add-ons may affect vehicle performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Price calculation utilities
export function calculateTotalPrice(
  variant: string,
  color: string,
  roof: string,
  wheels: string,
  addOns: string[]
): { total: number; breakdown: Record<string, number> } {
  const variantPrice = MODEL_VARIANTS.find(v => v.id === variant)?.price || 0;
  const colorPrice = COLOR_VARIANTS.find(c => c.id === color)?.price || 0;
  const roofPrice = ROOF_VARIANTS.find(r => r.id === roof)?.price || 0;
  const wheelPrice = WHEEL_VARIANTS.find(w => w.id === wheels)?.price || 0;
  
  const addOnPrices = addOns.reduce((total, addonId) => {
    const addon = ADDON_VARIANTS.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);

  const total = variantPrice + colorPrice + roofPrice + wheelPrice + addOnPrices;

  return {
    total,
    breakdown: {
      variant: variantPrice,
      color: colorPrice,
      roof: roofPrice,
      wheels: wheelPrice,
      addOns: addOnPrices
    }
  };
}

// Export all configurations
export const ASSET_CONFIGS = {
  variants: MODEL_VARIANTS,
  colors: COLOR_VARIANTS,
  roofs: ROOF_VARIANTS,
  wheels: WHEEL_VARIANTS,
  addOns: ADDON_VARIANTS
}; 