import { CarVariant, CarColor, RoofType, WheelOption, InteriorOption, AddOn, TechPack, Decal } from '@/types/car';

export const carVariants: CarVariant[] = [
  {
    id: 'ax',
    name: 'AX (Standard)',
    basePrice: 1500000,
    description: 'The perfect entry point to the Thar experience with essential features',
    features: [
      '4x4 Capability',
      'Manual Transmission',
      'Basic Interior',
      'Standard Safety Features'
    ],
    image: '/images/variants/ax.jpg'
  },
  {
    id: 'lx',
    name: 'LX (Luxury)',
    basePrice: 1800000,
    description: 'Premium comfort meets off-road capability',
    features: [
      '4x4 Capability',
      'Automatic Transmission',
      'Premium Interior',
      'Advanced Safety Features',
      'Climate Control'
    ],
    image: '/images/variants/lx.jpg'
  },
  {
    id: 'x',
    name: 'X (Off-Road)',
    basePrice: 2000000,
    description: 'Ultimate off-road performance with premium features',
    features: [
      'Enhanced 4x4 System',
      'Automatic Transmission',
      'Luxury Interior',
      'Advanced Safety Suite',
      'Off-Road Assist',
      'Premium Audio System'
    ],
    image: '/images/variants/x.jpg'
  }
];

export const carColors: CarColor[] = [
  {
    id: 'napoli-black',
    name: 'Napoli Black',
    hex: '#000000',
    price: 0,
    image: '/images/colors/napoli-black.jpg'
  },
  {
    id: 'galaxy-grey',
    name: 'Galaxy Grey',
    hex: '#4A4A4A',
    price: 15000,
    image: '/images/colors/galaxy-grey.jpg'
  },
  {
    id: 'aquamarine-blue',
    name: 'Aquamarine Blue',
    hex: '#00CED1',
    price: 25000,
    image: '/images/colors/aquamarine-blue.jpg'
  },
  {
    id: 'rocky-beige',
    name: 'Rocky Beige',
    hex: '#D2B48C',
    price: 20000,
    image: '/images/colors/rocky-beige.jpg'
  },
  {
    id: 'deep-forest-green',
    name: 'Deep Forest Green',
    hex: '#228B22',
    price: 30000,
    image: '/images/colors/deep-forest-green.jpg'
  }
];

export const roofTypes: RoofType[] = [
  {
    id: 'hardtop',
    name: 'Hardtop',
    price: 0,
    image: '/images/roofs/hardtop.jpg',
    compatibleWith: ['ax', 'lx', 'x']
  },
  {
    id: 'convertible',
    name: 'Convertible',
    price: 50000,
    image: '/images/roofs/convertible.jpg',
    compatibleWith: ['lx', 'x']
  },
  {
    id: 'soft-top',
    name: 'Soft Top',
    price: 30000,
    image: '/images/roofs/soft-top.jpg',
    compatibleWith: ['ax', 'lx', 'x']
  }
];

export const wheelOptions: WheelOption[] = [
  {
    id: 'standard-r17',
    name: 'Standard R17',
    size: 'R17',
    price: 0,
    image: '/images/wheels/standard-r17.jpg',
    type: 'standard'
  },
  {
    id: 'alloy-r18',
    name: 'Alloy R18',
    size: 'R18',
    price: 45000,
    image: '/images/wheels/alloy-r18.jpg',
    type: 'alloy'
  },
  {
    id: 'offroad-at-r19',
    name: 'Off-road AT R19',
    size: 'R19',
    price: 75000,
    image: '/images/wheels/offroad-at-r19.jpg',
    type: 'offroad'
  }
];

export const interiorOptions: InteriorOption[] = [
  {
    id: 'dual-tone-dashboard',
    name: 'Dual-tone Dashboard',
    price: 25000,
    image: '/images/interior/dual-tone-dashboard.jpg',
    category: 'dashboard'
  },
  {
    id: 'leather-seats',
    name: 'Leather Seat Upgrade',
    price: 60000,
    image: '/images/interior/leather-seats.jpg',
    category: 'seats'
  },
  {
    id: 'red-stitching',
    name: 'Red Stitching Trim',
    price: 15000,
    image: '/images/interior/red-stitching.jpg',
    category: 'trim'
  },
  {
    id: 'ambient-lighting',
    name: 'Ambient Lighting',
    price: 35000,
    image: '/images/interior/ambient-lighting.jpg',
    category: 'lighting'
  }
];

export const addOns: AddOn[] = [
  {
    id: 'front-bullbar',
    name: 'Front Bullbar',
    price: 45000,
    image: '/images/addons/front-bullbar.jpg',
    category: 'protection',
    compatibleWith: ['ax', 'lx', 'x']
  },
  {
    id: 'rear-ladder',
    name: 'Rear Ladder',
    price: 25000,
    image: '/images/addons/rear-ladder.jpg',
    category: 'utility',
    compatibleWith: ['lx', 'x']
  },
  {
    id: 'roof-carrier',
    name: 'Roof Carrier',
    price: 35000,
    image: '/images/addons/roof-carrier.jpg',
    category: 'utility',
    compatibleWith: ['hardtop']
  },
  {
    id: 'winch-mount',
    name: 'Winch Mount',
    price: 55000,
    image: '/images/addons/winch-mount.jpg',
    category: 'utility',
    compatibleWith: ['x']
  },
  {
    id: 'snorkel-kit',
    name: 'Snorkel Kit',
    price: 40000,
    image: '/images/addons/snorkel-kit.jpg',
    category: 'utility',
    compatibleWith: ['x']
  },
  {
    id: 'underbody-protection',
    name: 'Underbody Protection',
    price: 65000,
    image: '/images/addons/underbody-protection.jpg',
    category: 'protection',
    compatibleWith: ['ax', 'lx', 'x']
  }
];

export const techPacks: TechPack[] = [
  {
    id: 'touchscreen-nav',
    name: '10-inch Touchscreen + Navigation',
    price: 75000,
    features: [
      '10-inch HD Display',
      'Built-in Navigation',
      'Apple CarPlay & Android Auto',
      'Voice Commands'
    ],
    image: '/images/tech/touchscreen-nav.jpg'
  },
  {
    id: 'sony-audio',
    name: 'Sony Audio System',
    price: 45000,
    features: [
      'Premium Sony Speakers',
      'Subwoofer',
      'Amplified Sound',
      'Custom EQ Settings'
    ],
    image: '/images/tech/sony-audio.jpg'
  },
  {
    id: 'offroad-assist',
    name: 'Off-Road Assist Package',
    price: 85000,
    features: [
      'Digital Inclinometer',
      'Tire Pressure Monitoring',
      'Compass & Altimeter',
      'Terrain Response System'
    ],
    image: '/images/tech/offroad-assist.jpg'
  },
  {
    id: '360-camera',
    name: '360° Camera Setup',
    price: 65000,
    features: [
      'Surround View Camera',
      'Parking Assist',
      'Off-road Camera Views',
      'Recording Capability'
    ],
    image: '/images/tech/360-camera.jpg'
  }
];

export const decals: Decal[] = [
  {
    id: 'retro-stripe',
    name: 'Retro Stripe Decal',
    price: 15000,
    image: '/images/decals/retro-stripe.jpg',
    type: 'stripe'
  },
  {
    id: 'matte-wrap',
    name: 'Matte Wrap',
    price: 120000,
    image: '/images/decals/matte-wrap.jpg',
    type: 'wrap'
  },
  {
    id: 'custom-plate',
    name: 'Custom Number Plate',
    price: 5000,
    image: '/images/decals/custom-plate.jpg',
    type: 'plate'
  },
  {
    id: 'side-mirror-tints',
    name: 'Side Mirror Tints',
    price: 8000,
    image: '/images/decals/side-mirror-tints.jpg',
    type: 'tint'
  }
];

export const defaultConfiguration = {
  variant: carVariants[0],
  color: carColors[0],
  roof: roofTypes[0],
  wheels: wheelOptions[0],
  interior: [],
  addOns: [],
  techPacks: [],
  decals: [],
  customPlate: '',
  totalPrice: carVariants[0].basePrice
}; 