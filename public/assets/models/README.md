# 3D Models Directory

This directory should contain the 3D model files for the Thar car configurator.

## Required Files

The following `.glb` files are expected by the application:

### Base Models
- `thar-base.glb` - Base car model
- `thar-ax.glb` - AX variant model
- `thar-lx.glb` - LX variant model
- `thar-x.glb` - X variant model

### Roof Models
- `roof-hardtop.glb` - Hardtop roof
- `roof-soft-top.glb` - Soft top roof
- `roof-convertible.glb` - Convertible roof

### Wheel Models
- `wheels-standard-r17.glb` - Standard R17 wheels
- `wheels-alloy-r18.glb` - Alloy R18 wheels
- `wheels-offroad-r19.glb` - Off-road R19 wheels

### Add-on Models
- `addons/front-bullbar.glb` - Front bullbar
- `addons/rear-ladder.glb` - Rear ladder
- `addons/roof-carrier.glb` - Roof carrier
- `addons/winch-mount.glb` - Winch mount
- `addons/snorkel-kit.glb` - Snorkel kit
- `addons/underbody-protection.glb` - Underbody protection

## Current Status

**⚠️ No 3D model files are currently available.**

The application uses a fallback geometry system that renders basic 3D shapes (boxes, cylinders, spheres) to represent the car when actual model files are missing.

## Model Requirements

When adding 3D models, ensure they meet these requirements:

- **Format**: GLB (GL Binary) format
- **Scale**: 1 unit = 1 meter (recommended)
- **Materials**: Use standard Three.js materials for proper customization
- **Naming**: Include descriptive keywords in mesh names (e.g., "body", "trim", "wheel")
- **Optimization**: Keep file sizes reasonable for web loading

## Fallback System

The application automatically detects missing models and renders:
- Car body as a box geometry
- Roof as a smaller box
- Four wheels as cylinders
- Headlights as spheres
- Proper materials and shadows

This ensures the configurator remains functional even without actual 3D models. 