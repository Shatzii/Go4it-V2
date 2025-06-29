/**
 * Utility script to convert SVG files to PNG for better browser compatibility
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');

// SVG files to convert
const svgFiles = [
  { input: 'wizard-assets/logo.svg', output: 'wizard-assets/logo.png', width: 200, height: 200 },
  { input: 'wizard-assets/welcome.svg', output: 'wizard-assets/welcome.png', width: 600, height: 400 },
  { input: 'wizard-assets/favicon.svg', output: 'wizard-assets/favicon.png', width: 32, height: 32 }
];

// Function to convert SVG to PNG
async function convertSvgToPng(svgPath, pngPath, width, height) {
  try {
    // Read SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create a data URL from the SVG content
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // Set up canvas with desired dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Load SVG as image
    const img = new Image();
    
    // Wrap in a promise to handle async loading
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
      img.src = svgDataUrl;
    });
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);
    
    // Save canvas to PNG file
    const pngBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, pngBuffer);
    
    console.log(`✅ Converted ${svgPath} to ${pngPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${svgPath} to ${pngPath}:`, error);
    return false;
  }
}

// Convert all SVG files
async function convertAll() {
  console.log('Starting SVG to PNG conversion...');
  
  let success = true;
  
  for (const file of svgFiles) {
    const result = await convertSvgToPng(file.input, file.output, file.width, file.height);
    if (!result) success = false;
  }
  
  if (success) {
    console.log('All SVG files converted successfully!');
  } else {
    console.error('Some conversions failed. Check the logs above for details.');
    process.exit(1);
  }
}

// Run the conversion
convertAll();