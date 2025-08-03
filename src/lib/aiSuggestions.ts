// AI-Powered Suggestions System for Thar Configurator

export interface AISuggestion {
  id: string;
  name: string;
  description: string;
  configuration: {
    variant: string;
    color: string;
    roof: string;
    wheels: string;
    addOns: string[];
  };
  price: number;
  category: 'trending' | 'budget' | 'terrain' | 'luxury' | 'performance';
  confidence: number;
  reasoning: string[];
  thumbnail?: string;
}

export interface SuggestionFilters {
  budget?: number;
  terrain?: 'city' | 'highway' | 'offroad' | 'mixed';
  style?: 'conservative' | 'sporty' | 'luxury' | 'adventure';
  useCase?: 'daily' | 'weekend' | 'adventure' | 'show';
}

// Mock AI suggestions database
const SUGGESTIONS_DATABASE: AISuggestion[] = [
  {
    id: 'trending-1',
    name: 'Urban Explorer',
    description: 'Perfect for city driving with premium comfort',
    configuration: {
      variant: 'lx',
      color: 'galaxy-grey',
      roof: 'hardtop',
      wheels: 'alloy-r18',
      addOns: ['rear-ladder']
    },
    price: 1935000,
    category: 'trending',
    confidence: 0.92,
    reasoning: [
      'Most popular color choice in urban areas',
      'LX variant offers best comfort for daily use',
      'Alloy wheels provide better handling on city roads',
      'Hardtop ensures security and weather protection'
    ]
  },
  {
    id: 'budget-1',
    name: 'Smart Value',
    description: 'Maximum features within budget constraints',
    configuration: {
      variant: 'ax',
      color: 'napoli-black',
      roof: 'hardtop',
      wheels: 'standard-r17',
      addOns: ['front-bullbar']
    },
    price: 1545000,
    category: 'budget',
    confidence: 0.88,
    reasoning: [
      'AX variant provides essential features at lower cost',
      'Black color is timeless and easy to maintain',
      'Front bullbar adds protection without breaking budget',
      'Standard wheels are cost-effective and reliable'
    ]
  },
  {
    id: 'offroad-1',
    name: 'Adventure Ready',
    description: 'Built for extreme off-road conditions',
    configuration: {
      variant: 'x',
      color: 'deep-forest-green',
      roof: 'soft-top',
      wheels: 'offroad-r19',
      addOns: ['winch-mount', 'snorkel-kit', 'underbody-protection']
    },
    price: 2485000,
    category: 'terrain',
    confidence: 0.95,
    reasoning: [
      'X variant with off-road package is essential',
      'Forest green provides camouflage in natural settings',
      'Soft top allows for open-air adventure experience',
      'Off-road tires provide maximum traction',
      'Winch and snorkel essential for extreme conditions'
    ]
  },
  {
    id: 'luxury-1',
    name: 'Premium Experience',
    description: 'Ultimate luxury configuration with all premium features',
    configuration: {
      variant: 'x',
      color: 'aquamarine-blue',
      roof: 'convertible',
      wheels: 'alloy-r18',
      addOns: ['rear-ladder', 'roof-carrier']
    },
    price: 2410000,
    category: 'luxury',
    confidence: 0.89,
    reasoning: [
      'X variant offers maximum features and performance',
      'Aquamarine blue is exclusive and eye-catching',
      'Convertible roof provides premium open-air experience',
      'Alloy wheels enhance visual appeal and performance',
      'Premium add-ons complete the luxury package'
    ]
  },
  {
    id: 'city-1',
    name: 'City Cruiser',
    description: 'Optimized for urban commuting and parking',
    configuration: {
      variant: 'lx',
      color: 'rocky-beige',
      roof: 'hardtop',
      wheels: 'alloy-r18',
      addOns: []
    },
    price: 1880000,
    category: 'trending',
    confidence: 0.85,
    reasoning: [
      'LX provides comfort for daily commuting',
      'Beige color is practical and easy to maintain',
      'Hardtop ensures security in urban environments',
      'Alloy wheels improve handling on city roads',
      'Minimal add-ons for easier parking and maintenance'
    ]
  },
  {
    id: 'performance-1',
    name: 'Performance Focused',
    description: 'Optimized for driving dynamics and handling',
    configuration: {
      variant: 'x',
      color: 'napoli-black',
      roof: 'hardtop',
      wheels: 'alloy-r18',
      addOns: ['front-bullbar']
    },
    price: 2285000,
    category: 'performance',
    confidence: 0.87,
    reasoning: [
      'X variant provides best performance capabilities',
      'Black color reduces visual weight and looks aggressive',
      'Hardtop provides structural rigidity',
      'Alloy wheels improve unsprung weight and handling',
      'Front bullbar adds protection without compromising aerodynamics'
    ]
  }
];

// AI Suggestion Engine
export class AISuggestionEngine {
  private static instance: AISuggestionEngine;
  private userPreferences: Map<string, number> = new Map();
  private interactionHistory: string[] = [];

  static getInstance(): AISuggestionEngine {
    if (!AISuggestionEngine.instance) {
      AISuggestionEngine.instance = new AISuggestionEngine();
    }
    return AISuggestionEngine.instance;
  }

  // Update user preferences based on interactions
  updatePreferences(interaction: string, weight: number = 1): void {
    const currentWeight = this.userPreferences.get(interaction) || 0;
    this.userPreferences.set(interaction, currentWeight + weight);
    this.interactionHistory.push(interaction);
  }

  // Get personalized suggestions based on filters and preferences
  getSuggestions(filters: SuggestionFilters, limit: number = 6): AISuggestion[] {
    let suggestions = [...SUGGESTIONS_DATABASE];

    // Apply budget filter
    if (filters.budget) {
      suggestions = suggestions.filter(s => s.price <= filters.budget!);
    }

    // Apply terrain filter
    if (filters.terrain) {
      suggestions = suggestions.filter(s => {
        switch (filters.terrain) {
          case 'city':
            return s.category === 'trending' || s.configuration.variant === 'lx';
          case 'highway':
            return s.category === 'luxury' || s.category === 'performance';
          case 'offroad':
            return s.category === 'terrain' || s.configuration.variant === 'x';
          case 'mixed':
            return s.category === 'trending' || s.category === 'luxury';
          default:
            return true;
        }
      });
    }

    // Apply style filter
    if (filters.style) {
      suggestions = suggestions.filter(s => {
        switch (filters.style) {
          case 'conservative':
            return s.configuration.color === 'napoli-black' || s.configuration.color === 'galaxy-grey';
          case 'sporty':
            return s.configuration.color === 'aquamarine-blue' || s.category === 'performance';
          case 'luxury':
            return s.category === 'luxury' || s.configuration.roof === 'convertible';
          case 'adventure':
            return s.category === 'terrain' || s.configuration.addOns.length > 2;
          default:
            return true;
        }
      });
    }

    // Apply use case filter
    if (filters.useCase) {
      suggestions = suggestions.filter(s => {
        switch (filters.useCase) {
          case 'daily':
            return s.configuration.variant === 'lx' || s.category === 'budget';
          case 'weekend':
            return s.category === 'trending' || s.configuration.roof === 'convertible';
          case 'adventure':
            return s.category === 'terrain' || s.configuration.variant === 'x';
          case 'show':
            return s.category === 'luxury' || s.configuration.color === 'aquamarine-blue';
          default:
            return true;
        }
      });
    }

    // Apply personalization based on user preferences
    suggestions = this.applyPersonalization(suggestions);

    // Sort by confidence and relevance
    suggestions.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a);
      const bScore = this.calculateRelevanceScore(b);
      return bScore - aScore;
    });

    return suggestions.slice(0, limit);
  }

  // Apply personalization based on user interaction history
  private applyPersonalization(suggestions: AISuggestion[]): AISuggestion[] {
    if (this.userPreferences.size === 0) {
      return suggestions;
    }

    return suggestions.map(suggestion => {
      let personalizationScore = 0;

      // Check color preferences
      const colorPreference = this.userPreferences.get(`color_${suggestion.configuration.color}`);
      if (colorPreference) {
        personalizationScore += colorPreference * 0.3;
      }

      // Check variant preferences
      const variantPreference = this.userPreferences.get(`variant_${suggestion.configuration.variant}`);
      if (variantPreference) {
        personalizationScore += variantPreference * 0.4;
      }

      // Check category preferences
      const categoryPreference = this.userPreferences.get(`category_${suggestion.category}`);
      if (categoryPreference) {
        personalizationScore += categoryPreference * 0.2;
      }

      // Check price range preferences
      const priceRange = this.getPriceRange(suggestion.price);
      const pricePreference = this.userPreferences.get(`price_${priceRange}`);
      if (pricePreference) {
        personalizationScore += pricePreference * 0.1;
      }

      return {
        ...suggestion,
        confidence: Math.min(0.99, suggestion.confidence + personalizationScore * 0.1)
      };
    });
  }

  // Calculate relevance score for sorting
  private calculateRelevanceScore(suggestion: AISuggestion): number {
    let score = suggestion.confidence;

    // Boost trending suggestions
    if (suggestion.category === 'trending') {
      score += 0.1;
    }

    // Boost suggestions with recent interactions
    const recentInteractions = this.interactionHistory.slice(-10);
    const interactionMatches = recentInteractions.filter(interaction => 
      suggestion.reasoning.some(reason => reason.toLowerCase().includes(interaction.toLowerCase()))
    ).length;
    score += interactionMatches * 0.05;

    return score;
  }

  // Get price range category
  private getPriceRange(price: number): string {
    if (price <= 1600000) return 'budget';
    if (price <= 2000000) return 'mid';
    return 'premium';
  }

  // Get trending suggestions
  getTrendingSuggestions(limit: number = 3): AISuggestion[] {
    return SUGGESTIONS_DATABASE
      .filter(s => s.category === 'trending')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  // Get budget-friendly suggestions
  getBudgetSuggestions(maxBudget: number, limit: number = 3): AISuggestion[] {
    return SUGGESTIONS_DATABASE
      .filter(s => s.price <= maxBudget)
      .sort((a, b) => a.price - b.price)
      .slice(0, limit);
  }

  // Get terrain-specific suggestions
  getTerrainSuggestions(terrain: 'city' | 'highway' | 'offroad' | 'mixed', limit: number = 3): AISuggestion[] {
    return this.getSuggestions({ terrain }, limit);
  }

  // Get similar suggestions based on current configuration
  getSimilarSuggestions(
    currentConfig: {
      variant: string;
      color: string;
      roof: string;
      wheels: string;
      addOns: string[];
    },
    limit: number = 3
  ): AISuggestion[] {
    return SUGGESTIONS_DATABASE
      .map(suggestion => {
        let similarityScore = 0;

        // Exact matches
        if (suggestion.configuration.variant === currentConfig.variant) similarityScore += 0.4;
        if (suggestion.configuration.color === currentConfig.color) similarityScore += 0.2;
        if (suggestion.configuration.roof === currentConfig.roof) similarityScore += 0.2;
        if (suggestion.configuration.wheels === currentConfig.wheels) similarityScore += 0.1;

        // Add-on similarity
        const commonAddOns = suggestion.configuration.addOns.filter(addon => 
          currentConfig.addOns.includes(addon)
        ).length;
        similarityScore += commonAddOns * 0.05;

        return { ...suggestion, confidence: similarityScore };
      })
      .filter(s => s.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  // Clear user preferences (for testing or reset)
  clearPreferences(): void {
    this.userPreferences.clear();
    this.interactionHistory = [];
  }

  // Get user preference summary
  getUserPreferences(): Record<string, number> {
    return Object.fromEntries(this.userPreferences);
  }
}

// Export singleton instance
export const aiEngine = AISuggestionEngine.getInstance(); 