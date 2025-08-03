# Thar 3-Door Configurator

An interactive 3D car configurator for the Mahindra Thar 3-door SUV, built with Next.js, React Three Fiber, and TypeScript.

## Features

- **Interactive 3D Car Visualization**: Real-time 3D rendering with fallback geometry
- **Multiple Variants**: AX Standard, LX Luxury, and X Off-Road variants
- **Customization Options**: Colors, roofs, wheels, add-ons, and decals
- **Real-time Price Calculation**: Dynamic pricing based on selected options
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion powered transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rdxconfigarator90
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3D Models

The application currently uses fallback geometry when 3D model files are not available. To add actual 3D models:

### Required Model Files

Place your `.glb` files in the `public/assets/models/` directory:

```
public/assets/models/
├── thar-base.glb          # Base car model
├── thar-ax.glb           # AX variant model
├── thar-lx.glb           # LX variant model  
├── thar-x.glb            # X variant model
├── roof-hardtop.glb      # Hardtop roof
├── roof-soft-top.glb     # Soft top roof
├── roof-convertible.glb  # Convertible roof
├── wheels-standard-r17.glb # Standard wheels
├── wheels-alloy-r18.glb  # Alloy wheels
├── wheels-offroad-r19.glb # Off-road wheels
└── addons/               # Add-on models
    ├── front-bullbar.glb
    ├── rear-ladder.glb
    ├── roof-carrier.glb
    ├── winch-mount.glb
    ├── snorkel-kit.glb
    └── underbody-protection.glb
```

### Model Requirements

- **Format**: GLB (GL Binary) format
- **Scale**: Models should be properly scaled (1 unit = 1 meter recommended)
- **Materials**: Models should use standard materials for proper customization
- **Naming**: Mesh names should include descriptive keywords (e.g., "body", "trim", "wheel")

### Fallback System

If 3D model files are missing, the application automatically renders a fallback car geometry with:
- Basic car body (box geometry)
- Roof section
- Four wheels
- Headlights
- Proper materials and shadows

## Customization Options

### Variants
- **AX Standard**: Basic features, R17 wheels
- **LX Luxury**: Premium interior, R18 alloy wheels  
- **X Off-Road**: Off-road package, R19 off-road tires

### Colors
- Napoli Black (solid)
- Galaxy Grey (metallic)
- Aquamarine Blue (pearlescent)
- Rocky Beige (solid)
- Deep Forest Green (metallic)

### Roofs
- Hardtop (standard)
- Soft Top (convertible)
- Convertible (removable)

### Wheels
- Standard R17 (steel)
- Alloy R18 (premium)
- Off-road R19 (rugged)

### Add-ons
- Front Bullbar
- Rear Ladder
- Roof Carrier
- Winch Mount
- Snorkel Kit
- Underbody Protection

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **3D Graphics**: React Three Fiber, Three.js
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with shadcn/ui

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── CarViewer.tsx   # 3D car visualization
│   ├── ConfigSidebar.tsx # Configuration panel
│   └── ui/             # UI components
├── store/              # State management
├── types/              # TypeScript types
├── lib/                # Utility functions
└── data/               # Static data
```

## Development

### Adding New Features

1. **New Variants**: Update `src/lib/assetManager.ts` with variant configuration
2. **New Colors**: Add color definitions to the color variants array
3. **New Add-ons**: Extend the add-on configuration and create corresponding 3D models
4. **Customization Logic**: Modify `src/components/CarViewer.tsx` for new customization options

### Performance Optimization

- Use `useGLTF` with proper error handling for model loading
- Implement model preloading for better user experience
- Use `Suspense` boundaries for loading states
- Optimize 3D geometry and materials

## Troubleshooting

### Common Issues

1. **Missing 3D Models**: The application will show fallback geometry and log warnings
2. **Performance Issues**: Check browser console for memory leaks or heavy computations
3. **Material Issues**: Ensure 3D models use standard materials for proper customization

### Error Handling

The application includes comprehensive error handling for:
- Missing 3D model files
- Failed model loading
- Invalid configurations
- Browser compatibility issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
