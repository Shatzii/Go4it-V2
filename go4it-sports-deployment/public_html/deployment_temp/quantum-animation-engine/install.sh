#!/bin/bash

# Quantum Animation Engine Installation Script
# Version 5.0.1 - 256-bit Quantum HDR Pipeline

# Display header
echo "====================================================="
echo "  Quantum Animation Engine Installer - Version 5.0.1"
echo "  256-bit Quantum HDR Pipeline with Neural Rendering"
echo "====================================================="
echo ""

# Default installation path
DEFAULT_PATH="./src/lib/quantum-animation"

# Ask for installation path
read -p "Where would you like to install the Quantum Animation Engine? (Default: $DEFAULT_PATH): " INSTALL_PATH
INSTALL_PATH=${INSTALL_PATH:-$DEFAULT_PATH}

# Create the target directory if it doesn't exist
mkdir -p "$INSTALL_PATH"
echo "Created target directory: $INSTALL_PATH"

# Copy the files
echo "Copying files to $INSTALL_PATH..."
cp -r dist/* "$INSTALL_PATH/"

echo ""
echo "✅ Quantum Animation Engine installed successfully!"
echo ""
echo "Next steps:"
echo "1. Install required dependencies:"
echo "   npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs lucide-react"
echo ""
echo "2. Import the components in your application:"
echo "   import { AdvancedAnimationStudio } from '$INSTALL_PATH';"
echo ""
echo "3. Add the component to your JSX:"
echo "   <AdvancedAnimationStudio />"
echo ""
echo "For more information, see the README.md and INSTALL.md files in the installation directory."
echo ""