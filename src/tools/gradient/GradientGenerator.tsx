import { useState, useEffect, useRef, MouseEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// Define a type for color with position
type ColorStop = {
  color: string;
  x: number; // 0-100% horizontal position
  y: number; // 0-100% vertical position
};

// Define gradient types
type GradientType = 'linear' | 'radial' | 'conic';

export default function GradientGenerator() {
  const { logout } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#3b82f6', x: 0, y: 50 },
    { color: '#8b5cf6', x: 100, y: 50 }
  ]);
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState('to right');
  const [cssCode, setCssCode] = useState('');
  const [isAnimated, setIsAnimated] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(15); // seconds
  const [animationType, setAnimationType] = useState('slide');
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [downloadSize, setDownloadSize] = useState('medium');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Define preset color combinations
  const presets = {
    default: [
      { color: '#3b82f6', x: 0, y: 50 },
      { color: '#8b5cf6', x: 100, y: 50 }
    ],
    sunset: [
      { color: '#ff7e5f', x: 0, y: 50 },
      { color: '#feb47b', x: 100, y: 50 }
    ],
    ocean: [
      { color: '#2193b0', x: 0, y: 50 },
      { color: '#6dd5ed', x: 100, y: 50 }
    ],
    forest: [
      { color: '#56ab2f', x: 0, y: 50 },
      { color: '#a8e063', x: 100, y: 50 }
    ],
    berry: [
      { color: '#614385', x: 0, y: 50 },
      { color: '#516395', x: 100, y: 50 }
    ],
    fire: [
      { color: '#ff416c', x: 0, y: 50 },
      { color: '#ff4b2b', x: 100, y: 50 }
    ],
    midnight: [
      { color: '#000428', x: 0, y: 50 },
      { color: '#004e92', x: 100, y: 50 }
    ],
    cosmic: [
      { color: '#8A2387', x: 0, y: 50 },
      { color: '#E94057', x: 50, y: 50 },
      { color: '#F27121', x: 100, y: 50 }
    ],
    rainbow: [
      { color: '#ff0000', x: 0, y: 50 },
      { color: '#ff7f00', x: 25, y: 50 },
      { color: '#ffff00', x: 50, y: 50 },
      { color: '#00ff00', x: 75, y: 50 },
      { color: '#0000ff', x: 100, y: 50 }
    ],
    // 2D presets
    corner: [
      { color: '#ff416c', x: 0, y: 0 },
      { color: '#8A2387', x: 100, y: 0 },
      { color: '#3b82f6', x: 100, y: 100 },
      { color: '#a8e063', x: 0, y: 100 }
    ],
    radialBurst: [
      { color: '#ffffff', x: 50, y: 50 },
      { color: '#3b82f6', x: 0, y: 0 },
      { color: '#8b5cf6', x: 100, y: 0 },
      { color: '#ff416c', x: 100, y: 100 },
      { color: '#a8e063', x: 0, y: 100 }
    ]
  };

  // Define download dimensions
  const downloadSizes = {
    small: { width: 640, height: 360 },
    medium: { width: 1280, height: 720 },
    large: { width: 1920, height: 1080 },
    extraLarge: { width: 3840, height: 2160 },
  };

  // Download the gradient as an image
  const downloadGradient = () => {
    if (!previewRef.current) return;
    
    const { width, height } = downloadSizes[downloadSize as keyof typeof downloadSizes];
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Generate gradient on canvas directly instead of using SVG
    if (gradientType === 'linear') {
      // Determine angle based on direction
      let angle = 0;
      if (direction === 'to right') angle = 90;
      else if (direction === 'to left') angle = 270;
      else if (direction === 'to bottom') angle = 180;
      else if (direction === 'to top') angle = 0;
      else if (direction === '45deg') angle = 45;
      else if (direction === '135deg') angle = 135;
      else if (direction === '225deg') angle = 225;
      else if (direction === '315deg') angle = 315;
      
      // Convert angle to radians
      const radians = angle * (Math.PI / 180);
      
      // Calculate endpoint coordinates based on angle
      const centerX = width / 2;
      const centerY = height / 2;
      const diagonalLength = Math.sqrt(width * width + height * height);
      
      // Calculate start and end points for the gradient
      const startX = centerX - Math.cos(radians) * diagonalLength / 2;
      const startY = centerY - Math.sin(radians) * diagonalLength / 2;
      const endX = centerX + Math.cos(radians) * diagonalLength / 2;
      const endY = centerY + Math.sin(radians) * diagonalLength / 2;
      
      // Create linear gradient
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      
      // Add color stops with proper blending
      const gradientCssString = getGradientCssString();
      const colorStopsRegex = /([#a-zA-Z0-9(),.]+)\s+(\d+(?:\.\d+)?)%/g;
      
      // Parse the CSS string to get color stops
      const matches = Array.from(gradientCssString.matchAll(colorStopsRegex));
      matches.forEach((match) => {
        const color = match[1];
        const position = parseFloat(match[2]) / 100;
        gradient.addColorStop(position, color);
      });
      
      // If no matches found, add color stops manually
      if (matches.length === 0) {
        colorStops.forEach((stop) => {
          let position;
          if (direction === 'to right' || direction === 'to left') {
            position = stop.x / 100;
          } else if (direction === 'to bottom' || direction === 'to top') {
            position = stop.y / 100;
          } else {
            // For diagonal directions
            const dx = stop.x - 50;
            const dy = stop.y - 50;
            position = ((dx + dy) / 2) / 100 + 0.5;
          }
          gradient.addColorStop(Math.min(Math.max(0, position), 1), stop.color);
        });
      }
      
      // Fill the canvas with the gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (gradientType === 'radial') {
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      
      // Add color stops with proper blending
      const sortedByDistance = [...colorStops].sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x - 50, 2) + Math.pow(a.y - 50, 2));
        const distB = Math.sqrt(Math.pow(b.x - 50, 2) + Math.pow(b.y - 50, 2));
        return distA - distB;
      });
      
      // Add intermediate stops if needed to smooth gradient
      for (let i = 0; i < sortedByDistance.length; i++) {
        const stop = sortedByDistance[i];
        const dx = stop.x - 50;
        const dy = stop.y - 50;
        const distance = Math.sqrt(dx * dx + dy * dy) / 70.71; // Normalize to 0-1
        
        const position = Math.min(Math.max(0, distance), 1);
        gradient.addColorStop(position, stop.color);
        
        // Add intermediate stop if needed
        if (i < sortedByDistance.length - 1) {
          const nextStop = sortedByDistance[i + 1];
          const nextDx = nextStop.x - 50;
          const nextDy = nextStop.y - 50;
          const nextDistance = Math.sqrt(nextDx * nextDx + nextDy * nextDy) / 70.71;
          
          // If gap is large, add intermediate stop
          if (nextDistance - distance > 0.2) {
            const midPosition = (position + Math.min(Math.max(0, nextDistance), 1)) / 2;
            gradient.addColorStop(midPosition, stop.color);
          }
        }
      }
      
      // Fill the canvas with the gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (gradientType === 'conic') {
      // For conic gradients, we need to use multiple sectors
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(width, height);
      
      // Sort color stops by angle
      const sortedByAngle = [...colorStops].sort((a, b) => {
        const angleA = Math.atan2(a.y - 50, a.x - 50);
        const angleB = Math.atan2(b.y - 50, b.x - 50);
        return angleA - angleB;
      });
      
      // Draw the conic gradient by segments
      for (let i = 0; i < sortedByAngle.length; i++) {
        const currentStop = sortedByAngle[i];
        const nextStop = sortedByAngle[(i + 1) % sortedByAngle.length];
        
        // Calculate angles
        let startAngle = Math.atan2(currentStop.y - 50, currentStop.x - 50);
        let endAngle = Math.atan2(nextStop.y - 50, nextStop.x - 50);
        
        // Ensure we go clockwise
        if (endAngle <= startAngle) {
          endAngle += Math.PI * 2;
        }
        
        // Create a gradient for this segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Add additional segments for smoother transition
        const segments = 5; // Divide each section into this many segments
        const angleStep = (endAngle - startAngle) / segments;
        
        for (let j = 0; j < segments; j++) {
          const segStartAngle = startAngle + j * angleStep;
          const segEndAngle = startAngle + (j + 1) * angleStep;
          
          // Calculate colors for this segment
          const t = j / segments;
          
          // Parse color components
          const startR = parseInt(currentStop.color.substring(1, 3), 16);
          const startG = parseInt(currentStop.color.substring(3, 5), 16);
          const startB = parseInt(currentStop.color.substring(5, 7), 16);
          
          const endR = parseInt(nextStop.color.substring(1, 3), 16);
          const endG = parseInt(nextStop.color.substring(3, 5), 16);
          const endB = parseInt(nextStop.color.substring(5, 7), 16);
          
          // Interpolate color
          const r = Math.round(startR + (endR - startR) * t);
          const g = Math.round(startG + (endG - startG) * t);
          const b = Math.round(startB + (endB - startB) * t);
          
          const interpolatedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          
          // Draw segment
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, segStartAngle, segEndAngle);
          ctx.closePath();
          ctx.fillStyle = interpolatedColor;
          ctx.fill();
        }
      }
    }
    
    // Convert to data URL and trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `gradient-${width}x${height}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Improved function to get CSS for gradient
  const getGradientCssString = () => {
    if (gradientType === 'linear') {
      // For linear gradients, create a smooth transition by adding intermediate stops
      const sortedByPosition = [...colorStops].sort((a, b) => {
        // Sort based on progression along the direction line
        if (direction === 'to right') return a.x - b.x;
        if (direction === 'to left') return b.x - a.x;
        if (direction === 'to bottom') return a.y - b.y;
        if (direction === 'to top') return b.y - a.y;
        if (direction === '45deg') return (a.x + a.y) - (b.x + b.y);
        if (direction === '135deg') return (a.x + (100 - a.y)) - (b.x + (100 - b.y));
        if (direction === '225deg') return ((100 - a.x) + (100 - a.y)) - ((100 - b.x) + (100 - b.y));
        if (direction === '315deg') return ((100 - a.x) + a.y) - ((100 - b.x) + b.y);
        return a.x - b.x; // Default
      });
      
      // Calculate position percentage for each stop based on direction
      let result = '';
      
      for (let i = 0; i < sortedByPosition.length; i++) {
        const stop = sortedByPosition[i];
        let position;
        
        if (direction === 'to right' || direction === 'to left') {
          position = stop.x;
        } else if (direction === 'to bottom' || direction === 'to top') {
          position = stop.y;
        } else {
          // For diagonal directions, project the point onto the direction line
          const dx = stop.x - 50;
          const dy = stop.y - 50;
          
          // Advanced projection calculation based on direction
          if (direction === '45deg') {
            position = ((dx + dy) / 2) + 50;
          } else if (direction === '135deg') {
            position = ((dx - dy) / 2) + 50;
          } else if (direction === '225deg') {
            position = ((-dx - dy) / 2) + 50;
          } else if (direction === '315deg') {
            position = ((-dx + dy) / 2) + 50;
          } else {
            position = (stop.x + stop.y) / 2;
          }
        }
        
        position = Math.min(Math.max(0, position), 100);
        
        // Add the color stop
        result += `${stop.color} ${position}%`;
        
        // Add an extra stop at the same position if needed to create hard transitions
        if (i < sortedByPosition.length - 1) {
          // Check if there's a cluster of points at same position
          const nextStop = sortedByPosition[i + 1];
          let nextPosition;
          
          if (direction === 'to right' || direction === 'to left') {
            nextPosition = nextStop.x;
          } else if (direction === 'to bottom' || direction === 'to top') {
            nextPosition = nextStop.y;
          } else {
            // Calculate position for next stop
            const dx = nextStop.x - 50;
            const dy = nextStop.y - 50;
            
            if (direction === '45deg') {
              nextPosition = ((dx + dy) / 2) + 50;
            } else if (direction === '135deg') {
              nextPosition = ((dx - dy) / 2) + 50;
            } else if (direction === '225deg') {
              nextPosition = ((-dx - dy) / 2) + 50;
            } else if (direction === '315deg') {
              nextPosition = ((-dx + dy) / 2) + 50;
            } else {
              nextPosition = (nextStop.x + nextStop.y) / 2;
            }
          }
          
          nextPosition = Math.min(Math.max(0, nextPosition), 100);
          
          // If positions are very close, add a small offset to force a blend
          if (Math.abs(nextPosition - position) < 0.1) {
            result += `, ${stop.color} ${position + 0.1}%`;
          }
          
          // Always add an intermediate blending stop if gap is large
          if (nextPosition - position > 10) {
            // Create an intermediate color to blend between them
            result += `, ${stop.color} ${position + 1}%`;
          }
          
          result += ', ';
        }
      }
      
      return result;
    } else if (gradientType === 'radial') {
      // Sort by distance from center
      const sortedByDistance = [...colorStops].sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x - 50, 2) + Math.pow(a.y - 50, 2));
        const distB = Math.sqrt(Math.pow(b.x - 50, 2) + Math.pow(b.y - 50, 2));
        return distA - distB;
      });
      
      // For radial gradients, make sure we have smooth transitions
      let result = '';
      
      for (let i = 0; i < sortedByDistance.length; i++) {
        const stop = sortedByDistance[i];
        // Calculate distance from center
        const dx = stop.x - 50;
        const dy = stop.y - 50;
        const distance = Math.sqrt(dx * dx + dy * dy) * 1.42; // Scale to reach corners
        
        // Add the color stop
        result += `${stop.color} ${Math.min(distance, 100)}%`;
        
        // Add a small offset for points that are too close
        if (i < sortedByDistance.length - 1) {
          const nextStop = sortedByDistance[i + 1];
          const nextDx = nextStop.x - 50;
          const nextDy = nextStop.y - 50;
          const nextDistance = Math.sqrt(nextDx * nextDx + nextDy * nextDy) * 1.42;
          
          if (Math.abs(nextDistance - distance) < 0.1) {
            // Add a small offset to force a blend
            result += `, ${stop.color} ${Math.min(distance + 0.5, 100)}%`;
          }
          
          result += ', ';
        }
      }
      
      return result;
    } else if (gradientType === 'conic') {
      // Sort by angle from center
      const sortedByAngle = [...colorStops].sort((a, b) => {
        const angleA = Math.atan2(a.y - 50, a.x - 50);
        const angleB = Math.atan2(b.y - 50, b.x - 50);
        return angleA - angleB;
      });
      
      // For conic gradients, make sure we have smooth transitions
      let result = '';
      
      for (let i = 0; i < sortedByAngle.length; i++) {
        const stop = sortedByAngle[i];
        // Calculate angle in degrees from center
        const dx = stop.x - 50;
        const dy = stop.y - 50;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        
        // Add the color stop
        result += `${stop.color} ${angle}deg`;
        
        // Add a small offset for points that are too close
        if (i < sortedByAngle.length - 1) {
          const nextStop = sortedByAngle[(i + 1) % sortedByAngle.length];
          const nextDx = nextStop.x - 50;
          const nextDy = nextStop.y - 50;
          let nextAngle = Math.atan2(nextDy, nextDx) * (180 / Math.PI);
          if (nextAngle < 0) nextAngle += 360;
          
          if (Math.abs(nextAngle - angle) < 0.5) {
            // Add a small offset to force a blend
            result += `, ${stop.color} ${(angle + 0.5) % 360}deg`;
          }
          
          // If we're spanning the 0/360 boundary
          if (i === sortedByAngle.length - 1 && (nextAngle < angle)) {
            nextAngle += 360;
          }
          
          // Add intermediate point for large gaps
          if (nextAngle - angle > 45) {
            const midAngle = (angle + nextAngle) / 2;
            result += `, ${stop.color} ${midAngle % 360}deg, ${nextStop.color} ${(nextAngle - 0.5) % 360}deg`;
          }
          
          result += ', ';
        }
      }
      
      return result;
    }
    
    // Fallback
    return colorStops.map(stop => `${stop.color}`).join(', ');
  };

  // Load preset colors
  const loadPreset = (presetName: string) => {
    if (presets[presetName as keyof typeof presets]) {
      setColorStops(presets[presetName as keyof typeof presets]);
      setSelectedPreset(presetName);
      
      // Set appropriate gradient type for the preset
      if (presetName === 'radialBurst') {
        setGradientType('radial');
      } else if (presetName === 'corner') {
        setGradientType('conic');
      } else {
        setGradientType('linear');
      }
    }
  };

  // Animation types
  const animationTypes = [
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'pulse', label: 'Pulse' },
  ];

  // Update the CSS code when gradient settings change
  useEffect(() => {
    const gradientString = getGradientCssString();
    let gradientCSS = '';
    
    if (gradientType === 'linear') {
      gradientCSS = `background: linear-gradient(${direction}, ${gradientString});`;
    } else if (gradientType === 'radial') {
      gradientCSS = `background: radial-gradient(circle, ${gradientString});`;
    } else if (gradientType === 'conic') {
      gradientCSS = `background: conic-gradient(from 0deg at 50% 50%, ${gradientString});`;
    }
    
    if (isAnimated) {
      let keyframes = '';
      
      switch (animationType) {
        case 'slide':
          keyframes = `
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }`;
          gradientCSS = `
${gradientCSS.substring(0, gradientCSS.length - 1)}
background-size: 200% 200%;
animation: gradientAnimation ${animationSpeed}s ease infinite;

@keyframes gradientAnimation {${keyframes}
}`;
          break;
        
        case 'zoom':
          keyframes = `
  0% { background-size: 100% 100%; }
  50% { background-size: 200% 200%; }
  100% { background-size: 100% 100%; }`;
          gradientCSS = `
${gradientCSS.substring(0, gradientCSS.length - 1)}
background-position: center;
animation: gradientAnimation ${animationSpeed}s ease infinite;

@keyframes gradientAnimation {${keyframes}
}`;
          break;
          
        case 'rotate':
          keyframes = `
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }`;
          gradientCSS = `
position: relative;
overflow: hidden;

&::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  ${gradientCSS.substring(0, gradientCSS.length - 1)}
  animation: gradientAnimation ${animationSpeed}s linear infinite;
}

@keyframes gradientAnimation {${keyframes}
}`;
          break;
          
        case 'pulse':
          keyframes = `
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }`;
          gradientCSS = `
${gradientCSS.substring(0, gradientCSS.length - 1)}
animation: gradientAnimation ${animationSpeed}s ease infinite;

@keyframes gradientAnimation {${keyframes}
}`;
          break;
      }
    }
    
    setCssCode(gradientCSS);
  }, [colorStops, direction, isAnimated, animationSpeed, animationType, gradientType]);

  // Handle color change
  const handleColorChange = (index: number, value: string) => {
    const newColorStops = [...colorStops];
    newColorStops[index] = { ...newColorStops[index], color: value };
    setColorStops(newColorStops);
    setSelectedPreset('custom');
  };

  // Handle position change from sliders
  const handlePositionChange = (index: number, axis: 'x' | 'y', value: number) => {
    const newColorStops = [...colorStops];
    newColorStops[index] = { ...newColorStops[index], [axis]: value };
    setColorStops(newColorStops);
    setSelectedPreset('custom');
  };

  // Handle mouse down on color point in the visual editor
  const handleColorPointMouseDown = (e: MouseEvent, index: number) => {
    e.preventDefault();
    setSelectedColorIndex(index);
    setIsDragging(true);
  };

  // Handle mouse move for dragging
  const handleEditorMouseMove = (e: MouseEvent) => {
    if (!isDragging || selectedColorIndex === null || !editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100);
    
    const newColorStops = [...colorStops];
    newColorStops[selectedColorIndex] = { ...newColorStops[selectedColorIndex], x, y };
    setColorStops(newColorStops);
    setSelectedPreset('custom');
  };

  // Handle mouse up to stop dragging
  const handleEditorMouseUp = () => {
    setIsDragging(false);
  };

  // Add a new color at the clicked position
  const handleEditorClick = (e: MouseEvent) => {
    if (isDragging || !editorRef.current || colorStops.length >= 5) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Don't add if clicked very close to an existing point
    const isNearExistingPoint = colorStops.some(stop => {
      const dx = stop.x - x;
      const dy = stop.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 5;
    });
    
    if (!isNearExistingPoint) {
      setColorStops([...colorStops, { color: '#ffffff', x, y }]);
      setSelectedPreset('custom');
    }
  };

  // Add a new color
  const addColor = () => {
    if (colorStops.length < 5) {
      // For 2D gradients, we'll place new colors in less crowded areas
      // Find a spot that's furthest from all existing points
      
      // Divide the 100x100 space into a grid and find the furthest cell
      const gridSize = 10;
      let maxMinDistance = 0;
      let bestX = 50;
      let bestY = 50;
      
      for (let gx = 0; gx <= 100; gx += gridSize) {
        for (let gy = 0; gy <= 100; gy += gridSize) {
          let minDistance = Infinity;
          
          for (const stop of colorStops) {
            const dx = stop.x - gx;
            const dy = stop.y - gy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            minDistance = Math.min(minDistance, distance);
          }
          
          if (minDistance > maxMinDistance) {
            maxMinDistance = minDistance;
            bestX = gx;
            bestY = gy;
          }
        }
      }
      
      setColorStops([...colorStops, { color: '#ffffff', x: bestX, y: bestY }]);
      setSelectedPreset('custom');
    }
  };

  // Remove a color
  const removeColor = (index: number) => {
    if (colorStops.length > 2) {
      const newColorStops = [...colorStops];
      newColorStops.splice(index, 1);
      setColorStops(newColorStops);
      setSelectedPreset('custom');
    }
  };

  // Copy CSS to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    alert('CSS copied to clipboard!');
  };

  // Direction options (for linear gradients)
  const directions = [
    { value: 'to right', label: 'Left to Right' },
    { value: 'to left', label: 'Right to Left' },
    { value: 'to bottom', label: 'Top to Bottom' },
    { value: 'to top', label: 'Bottom to Top' },
    { value: '45deg', label: 'Diagonal ↘' },
    { value: '135deg', label: 'Diagonal ↗' },
    { value: '225deg', label: 'Diagonal ↖' },
    { value: '315deg', label: 'Diagonal ↙' },
  ];

  // Gradient type options
  const gradientTypes = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
    { value: 'conic', label: 'Conic' },
  ];

  // Get the background style for the preview
  const getPreviewBackground = () => {
    const gradientString = getGradientCssString();
    
    if (gradientType === 'linear') {
      return `linear-gradient(${direction}, ${gradientString})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(circle, ${gradientString})`;
    } else {
      return `conic-gradient(from 0deg at 50% 50%, ${gradientString})`;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="navbar">
          <div>
            <div className="navbar-title">Gradient Generator</div>
            <div className="navbar-welcome">Create beautiful gradients with a visual editor</div>
          </div>
          
          <div className="navbar-links">
            <div className="navbar-search">
              <input 
                type="text" 
                placeholder="Search tools..."
                className="search-input"
              />
            </div>
            
            <div className="navbar-date">
              Today: {currentDate}
            </div>
            
            <button
              onClick={logout}
              className="button button-red"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          <div className="grid grid-2" style={{ marginTop: 'var(--space-4)' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Gradient Controls</div>
              </div>
              
              <div style={{ marginTop: 'var(--space-5)' }}>
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ marginBottom: 'var(--space-3)' }}>Gradient Type</h3>
                  <select
                    className="input"
                    value={gradientType}
                    onChange={(e) => setGradientType(e.target.value as GradientType)}
                  >
                    {gradientTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {gradientType === 'linear' && (
                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Direction</h3>
                    <select 
                      className="input"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                    >
                      {directions.map((dir) => (
                        <option key={dir.value} value={dir.value}>
                          {dir.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ marginBottom: 'var(--space-3)' }}>Preset Colors</h3>
                  <select 
                    className="input"
                    value={selectedPreset}
                    onChange={(e) => loadPreset(e.target.value)}
                  >
                    <option value="default">Default Blue/Purple</option>
                    <option value="sunset">Sunset</option>
                    <option value="ocean">Ocean</option>
                    <option value="forest">Forest</option>
                    <option value="berry">Berry</option>
                    <option value="fire">Fire</option>
                    <option value="midnight">Midnight</option>
                    <option value="cosmic">Cosmic (3 colors)</option>
                    <option value="rainbow">Rainbow (5 colors)</option>
                    <option value="corner">Corner Gradient</option>
                    <option value="radialBurst">Radial Burst</option>
                    <option value="custom" disabled={selectedPreset !== 'custom'}>Custom</option>
                  </select>
                </div>
              
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ marginBottom: 'var(--space-3)' }}>Colors</h3>
                  {colorStops.map((colorStop, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        marginBottom: 'var(--space-4)', 
                        padding: 'var(--space-3)', 
                        backgroundColor: 'var(--color-bg-tertiary)', 
                        borderRadius: 'var(--radius-md)' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <input
                            type="color"
                            value={colorStop.color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            style={{ width: '3rem', height: '2rem', padding: '0', border: 'none', background: 'none' }}
                          />
                          <input
                            type="text"
                            value={colorStop.color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="input"
                            style={{ width: '8rem' }}
                          />
                        </div>
                        {colorStops.length > 2 && (
                          <button 
                            onClick={() => removeColor(index)}
                            className="button button-red"
                            style={{ padding: 'var(--space-1) var(--space-2)', marginLeft: 'auto' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                          X Position: {colorStop.x.toFixed(1)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={colorStop.x}
                          onChange={(e) => handlePositionChange(index, 'x', parseFloat(e.target.value))}
                          className="input"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                          Y Position: {colorStop.y.toFixed(1)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={colorStop.y}
                          onChange={(e) => handlePositionChange(index, 'y', parseFloat(e.target.value))}
                          className="input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
                  {colorStops.length < 5 && (
                    <button 
                      onClick={addColor}
                      className="button"
                      style={{ marginTop: 'var(--space-2)' }}
                    >
                      Add Color
                    </button>
                  )}
                </div>
                
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ marginBottom: 'var(--space-3)' }}>Animation</h3>
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <select 
                      className="input"
                      value={isAnimated ? 'animated' : 'static'}
                      onChange={(e) => setIsAnimated(e.target.value === 'animated')}
                    >
                      <option value="static">Static</option>
                      <option value="animated">Animated</option>
                    </select>
                  </div>
                  
                  {isAnimated && (
                    <>
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                          Animation Type
                        </label>
                        <select 
                          className="input"
                          value={animationType}
                          onChange={(e) => setAnimationType(e.target.value)}
                        >
                          {animationTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                        Animation Speed: {animationSpeed}s
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                        className="input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </>
                )}
                </div>
                
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ marginBottom: 'var(--space-3)' }}>Download Options</h3>
                  <select 
                    className="input"
                    value={downloadSize}
                    onChange={(e) => setDownloadSize(e.target.value)}
                    style={{ marginBottom: 'var(--space-3)' }}
                  >
                    <option value="small">Small (640×360)</option>
                    <option value="medium">Medium (1280×720)</option>
                    <option value="large">Large (1920×1080)</option>
                    <option value="extraLarge">Extra Large (3840×2160)</option>
                  </select>
                  
                  <button 
                    onClick={downloadGradient}
                    className="button"
                    style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                  >
                    Download Gradient Image
                  </button>
                </div>
                
                <button 
                  onClick={copyToClipboard}
                  className="button"
                  style={{ width: '100%' }}
                >
                  Copy CSS to Clipboard
                </button>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <div className="card-title">Gradient Preview</div>
              </div>
              
              <div style={{ marginTop: 'var(--space-5)' }}>
                <div
                  ref={previewRef}
                  style={{
                    height: '200px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-5)',
                    background: getPreviewBackground(),
                    backgroundSize: isAnimated && animationType === 'slide' ? '200% 200%' : '100% 100%',
                    animation: isAnimated 
                      ? `gradient${animationType.charAt(0).toUpperCase() + animationType.slice(1)}Animation ${animationSpeed}s ease infinite` 
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isAnimated && animationType === 'rotate' && (
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: getPreviewBackground(),
                      animation: `gradientRotateAnimation ${animationSpeed}s linear infinite`,
                    }}></div>
                  )}
                </div>
                
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Visual Editor</h3>
                <p style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {colorStops.length < 5 ? 'Click to add colors. ' : ''}
                  Drag to reposition points.
                </p>
                
                <div
                  ref={editorRef}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    marginBottom: 'var(--space-5)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    background: getPreviewBackground(),
                    cursor: colorStops.length < 5 ? 'crosshair' : 'default',
                  }}
                  onClick={handleEditorClick}
                  onMouseMove={handleEditorMouseMove}
                  onMouseUp={handleEditorMouseUp}
                  onMouseLeave={handleEditorMouseUp}
                >
                  {colorStops.map((stop, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        top: `${stop.y}%`,
                        left: `${stop.x}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '20px',
                        backgroundColor: stop.color,
                        border: index === selectedColorIndex ? '3px solid white' : '2px solid white',
                        borderRadius: '50%',
                        cursor: 'move',
                        zIndex: index === selectedColorIndex ? 10 : 1,
                        boxShadow: '0 0 5px rgba(0,0,0,0.5)'
                      }}
                      onMouseDown={(e) => handleColorPointMouseDown(e, index)}
                    />
                  ))}
                </div>
                
                <style>
                  {`
                  @keyframes gradientSlideAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  @keyframes gradientZoomAnimation {
                    0% { background-size: 100% 100%; }
                    50% { background-size: 200% 200%; }
                    100% { background-size: 100% 100%; }
                  }
                  @keyframes gradientRotateAnimation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  @keyframes gradientPulseAnimation {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                  }
                  `}
                </style>
                
                <h3 style={{ marginBottom: 'var(--space-3)' }}>CSS Code</h3>
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'monospace',
                    fontSize: 'var(--font-size-sm)',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                  }}
                >
                  {cssCode}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 