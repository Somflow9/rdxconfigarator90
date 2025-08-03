export interface CarVariant {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  image: string;
}

export interface CarColor {
  id: string;
  name: string;
  hex: string;
  price: number;
  image: string;
}

export interface RoofType {
  id: string;
  name: string;
  price: number;
  image: string;
  compatibleWith: string[];
}

export interface WheelOption {
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
  type: 'standard' | 'alloy' | 'offroad';
}

export interface InteriorOption {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'dashboard' | 'seats' | 'trim' | 'lighting';
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'protection' | 'utility' | 'style';
  compatibleWith: string[];
}

export interface TechPack {
  id: string;
  name: string;
  price: number;
  features: string[];
  image: string;
}

export interface Decal {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'stripe' | 'wrap' | 'plate' | 'tint';
}

export interface CarConfiguration {
  id: string;
  variant: CarVariant;
  color: CarColor;
  roof: RoofType;
  wheels: WheelOption;
  interior: InteriorOption[];
  addOns: AddOn[];
  techPacks: TechPack[];
  decals: Decal[];
  customPlate?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigurationValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} 