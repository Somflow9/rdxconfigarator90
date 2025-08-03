// Performance Monitoring and Optimization System

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  loadTime: number;
  deviceCapabilities: DeviceCapabilities;
  optimizationLevel: 'low' | 'medium' | 'high';
}

export interface DeviceCapabilities {
  gpu: string;
  memory: number;
  cores: number;
  isMobile: boolean;
  isLowEnd: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
}

export interface OptimizationSettings {
  shadowQuality: 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  modelLOD: boolean;
  antialiasing: boolean;
  reflections: boolean;
  particleEffects: boolean;
  autoRotate: boolean;
}

// Performance Monitor Class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private settings: OptimizationSettings;
  private fpsHistory: number[] = [];
  private renderTimeHistory: number[] = [];
  private isMonitoring = false;
  private frameCount = 0;
  private lastTime = 0;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.settings = this.getDefaultSettings();
    this.detectDeviceCapabilities();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Initialize performance metrics
  private initializeMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      memoryUsage: 0,
      renderTime: 0,
      loadTime: 0,
      deviceCapabilities: {
        gpu: 'Unknown',
        memory: 0,
        cores: navigator.hardwareConcurrency || 1,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isLowEnd: false,
        supportsWebGL2: false,
        maxTextureSize: 2048
      },
      optimizationLevel: 'medium'
    };
  }

  // Detect device capabilities
  private detectDeviceCapabilities(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        this.metrics.deviceCapabilities.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      
      this.metrics.deviceCapabilities.supportsWebGL2 = !!canvas.getContext('webgl2');
      this.metrics.deviceCapabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }

    // Estimate memory
    if ('deviceMemory' in navigator) {
      this.metrics.deviceCapabilities.memory = (navigator as any).deviceMemory;
    } else {
      // Fallback estimation
      this.metrics.deviceCapabilities.memory = this.metrics.deviceCapabilities.cores * 2;
    }

    // Determine if device is low-end
    this.metrics.deviceCapabilities.isLowEnd = this.isLowEndDevice();
    
    // Set optimization level based on device capabilities
    this.metrics.optimizationLevel = this.determineOptimizationLevel();
  }

  // Check if device is low-end
  private isLowEndDevice(): boolean {
    const { deviceCapabilities } = this.metrics;
    
    // Mobile devices with limited resources
    if (deviceCapabilities.isMobile && deviceCapabilities.memory < 4) {
      return true;
    }
    
    // Low memory devices
    if (deviceCapabilities.memory < 4) {
      return true;
    }
    
    // Low core count devices
    if (deviceCapabilities.cores < 4) {
      return true;
    }
    
    // Old GPUs
    const oldGPUs = ['Intel', 'Mali', 'PowerVR', 'Adreno 5', 'Adreno 4'];
    if (oldGPUs.some(gpu => deviceCapabilities.gpu.includes(gpu))) {
      return true;
    }
    
    return false;
  }

  // Determine optimization level
  private determineOptimizationLevel(): 'low' | 'medium' | 'high' {
    if (this.metrics.deviceCapabilities.isLowEnd) {
      return 'low';
    }
    
    if (this.metrics.deviceCapabilities.memory >= 8 && this.metrics.deviceCapabilities.cores >= 8) {
      return 'high';
    }
    
    return 'medium';
  }

  // Get default optimization settings
  private getDefaultSettings(): OptimizationSettings {
    const level = this.metrics.optimizationLevel;
    
    switch (level) {
      case 'low':
        return {
          shadowQuality: 'low',
          textureQuality: 'low',
          modelLOD: true,
          antialiasing: false,
          reflections: false,
          particleEffects: false,
          autoRotate: false
        };
      case 'high':
        return {
          shadowQuality: 'high',
          textureQuality: 'high',
          modelLOD: false,
          antialiasing: true,
          reflections: true,
          particleEffects: true,
          autoRotate: true
        };
      default:
        return {
          shadowQuality: 'medium',
          textureQuality: 'medium',
          modelLOD: true,
          antialiasing: true,
          reflections: false,
          particleEffects: false,
          autoRotate: true
        };
    }
  }

  // Start performance monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    
    this.monitorFrame();
  }

  // Stop performance monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  // Monitor frame performance
  private monitorFrame(): void {
    if (!this.isMonitoring) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    if (deltaTime >= 1000) { // Update every second
      this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.fpsHistory.push(this.metrics.fps);
      
      // Keep only last 60 FPS readings
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Update optimization settings if needed
      this.adaptOptimization();
    }
    
    requestAnimationFrame(() => this.monitorFrame());
  }

  // Adapt optimization based on performance
  private adaptOptimization(): void {
    const avgFps = this.getAverageFps();
    
    if (avgFps < 30 && this.metrics.optimizationLevel !== 'low') {
      this.degradeQuality();
    } else if (avgFps > 55 && this.metrics.optimizationLevel !== 'high') {
      this.upgradeQuality();
    }
  }

  // Degrade quality for better performance
  private degradeQuality(): void {
    if (this.settings.shadowQuality === 'high') {
      this.settings.shadowQuality = 'medium';
    } else if (this.settings.shadowQuality === 'medium') {
      this.settings.shadowQuality = 'low';
    }
    
    if (this.settings.textureQuality === 'high') {
      this.settings.textureQuality = 'medium';
    } else if (this.settings.textureQuality === 'medium') {
      this.settings.textureQuality = 'low';
    }
    
    if (this.settings.antialiasing) {
      this.settings.antialiasing = false;
    }
    
    if (this.settings.reflections) {
      this.settings.reflections = false;
    }
    
    if (this.settings.particleEffects) {
      this.settings.particleEffects = false;
    }
    
    console.log('Performance degraded for better FPS');
  }

  // Upgrade quality if performance allows
  private upgradeQuality(): void {
    if (this.settings.shadowQuality === 'low') {
      this.settings.shadowQuality = 'medium';
    } else if (this.settings.shadowQuality === 'medium') {
      this.settings.shadowQuality = 'high';
    }
    
    if (this.settings.textureQuality === 'low') {
      this.settings.textureQuality = 'medium';
    } else if (this.settings.textureQuality === 'medium') {
      this.settings.textureQuality = 'high';
    }
    
    if (!this.settings.antialiasing) {
      this.settings.antialiasing = true;
    }
    
    console.log('Quality upgraded due to good performance');
  }

  // Get average FPS
  private getAverageFps(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  // Update render time
  updateRenderTime(time: number): void {
    this.metrics.renderTime = time;
    this.renderTimeHistory.push(time);
    
    if (this.renderTimeHistory.length > 60) {
      this.renderTimeHistory.shift();
    }
  }

  // Update memory usage
  updateMemoryUsage(usage: number): void {
    this.metrics.memoryUsage = usage;
  }

  // Update load time
  updateLoadTime(time: number): void {
    this.metrics.loadTime = time;
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get optimization settings
  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  // Update optimization settings
  updateSettings(settings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  // Get performance report
  getPerformanceReport(): string {
    const avgFps = this.getAverageFps();
    const avgRenderTime = this.renderTimeHistory.length > 0 
      ? this.renderTimeHistory.reduce((sum, time) => sum + time, 0) / this.renderTimeHistory.length 
      : 0;
    
    return `
Performance Report:
- Average FPS: ${avgFps.toFixed(1)}
- Average Render Time: ${avgRenderTime.toFixed(2)}ms
- Memory Usage: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
- Load Time: ${this.metrics.loadTime.toFixed(2)}ms
- Optimization Level: ${this.metrics.optimizationLevel}
- Device: ${this.metrics.deviceCapabilities.gpu}
- Memory: ${this.metrics.deviceCapabilities.memory}GB
- Cores: ${this.metrics.deviceCapabilities.cores}
- Mobile: ${this.metrics.deviceCapabilities.isMobile}
- Low-end: ${this.metrics.deviceCapabilities.isLowEnd}
    `.trim();
  }

  // Check if performance is acceptable
  isPerformanceAcceptable(): boolean {
    const avgFps = this.getAverageFps();
    return avgFps >= 30;
  }

  // Get recommended settings for current device
  getRecommendedSettings(): OptimizationSettings {
    return this.getDefaultSettings();
  }

  // Reset to default settings
  resetToDefaults(): void {
    this.settings = this.getDefaultSettings();
  }

  // Export performance data
  exportData(): any {
    return {
      metrics: this.metrics,
      settings: this.settings,
      fpsHistory: this.fpsHistory,
      renderTimeHistory: this.renderTimeHistory,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions for optimization
export const optimizationUtils = {
  // Compress texture based on quality setting
  getTextureQuality(quality: 'low' | 'medium' | 'high'): number {
    switch (quality) {
      case 'low': return 0.5;
      case 'medium': return 0.75;
      case 'high': return 1.0;
      default: return 0.75;
    }
  },

  // Get shadow map size based on quality
  getShadowMapSize(quality: 'low' | 'medium' | 'high'): number {
    switch (quality) {
      case 'low': return 512;
      case 'medium': return 1024;
      case 'high': return 2048;
      default: return 1024;
    }
  },

  // Get LOD distance based on device capabilities
  getLODDistance(isLowEnd: boolean): number {
    return isLowEnd ? 50 : 100;
  },

  // Check if feature should be enabled
  shouldEnableFeature(feature: keyof OptimizationSettings, settings: OptimizationSettings): boolean {
    return settings[feature] as boolean;
  }
}; 