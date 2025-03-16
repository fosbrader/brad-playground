import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

type TextOverlay = {
  headline: string;
  subheadline: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  blurStrength: number;
  shadowStrength: number;
};

type ImageState = {
  scale: number;
  position: { x: number; y: number };
};

type DragState = {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
  target: 'text' | 'image' | null;
};

export default function TextGenerator() {
  const { logout } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const [image, setImage] = useState<string | null>(null);
  const [imageState, setImageState] = useState<ImageState>({
    scale: 1,
    position: { x: 0, y: 0 }
  });
  
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    headline: 'Your Headline',
    subheadline: 'Your subheadline text goes here',
    color: '#ffffff',
    fontSize: 32,
    position: { x: 40, y: 1250 },
    blurStrength: 20,
    shadowStrength: 0.6
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    target: null
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is near the text
    const scale = canvas.width / rect.width;
    const clickX = x * scale;
    const clickY = y * scale;
    
    const textX = textOverlay.position.x;
    const textY = textOverlay.position.y;
    
    // Create a hit area around the text
    const hitArea = 100; // Increased hit area
    if (Math.abs(clickX - textX) < hitArea && Math.abs(clickY - textY) < hitArea) {
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: textOverlay.position.x,
        startPosY: textOverlay.position.y,
        target: 'text'
      });
    } else {
      // If not dragging text, drag image
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: imageState.position.x,
        startPosY: imageState.position.y,
        target: 'image'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    
    const deltaX = (e.clientX - dragState.startX) * scale;
    const deltaY = (e.clientY - dragState.startY) * scale;
    
    if (dragState.target === 'text') {
      const newX = Math.max(0, Math.min(canvas.width, dragState.startPosX + deltaX));
      const newY = Math.max(0, Math.min(canvas.height, dragState.startPosY + deltaY));
      
      setTextOverlay(prev => ({
        ...prev,
        position: { x: newX, y: newY }
      }));
    } else if (dragState.target === 'image') {
      setImageState(prev => ({
        ...prev,
        position: {
          x: dragState.startPosX + deltaX / prev.scale,
          y: dragState.startPosY + deltaY / prev.scale
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false, target: null }));
  };

  // Draw the image and text on canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Load the image
    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate base scaling to fit image while maintaining aspect ratio
      const baseScale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );
      
      // Apply user scaling
      const totalScale = baseScale * imageState.scale;
      const newWidth = img.width * totalScale;
      const newHeight = img.height * totalScale;
      
      // Calculate centered position with user offset
      const x = (canvas.width - newWidth) / 2 + imageState.position.x;
      const y = (canvas.height - newHeight) / 2 + imageState.position.y;

      // First, draw the original image
      ctx.drawImage(img, x, y, newWidth, newHeight);

      // Create a temporary canvas for the blur effect
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Copy the bottom portion of the image to temp canvas
      const gradientHeight = 400;
      tempCtx.drawImage(
        canvas,
        0, canvas.height - gradientHeight,
        canvas.width, gradientHeight,
        0, canvas.height - gradientHeight,
        canvas.width, gradientHeight
      );

      // Apply blur to the temp canvas
      tempCtx.filter = `blur(${textOverlay.blurStrength * 2}px)`;
      tempCtx.drawImage(
        tempCanvas,
        0, canvas.height - gradientHeight,
        canvas.width, gradientHeight,
        0, canvas.height - gradientHeight,
        canvas.width, gradientHeight
      );

      // Create a gradient mask
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height - gradientHeight,
        0,
        canvas.height
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

      // Apply the gradient mask to the temp canvas
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, canvas.height - gradientHeight, canvas.width, gradientHeight);

      // Draw the blurred gradient back onto the main canvas
      ctx.drawImage(tempCanvas, 0, 0);
      
      // Add shadow if enabled
      if (textOverlay.shadowStrength > 0) {
        const shadowGradient = ctx.createLinearGradient(
          0,
          canvas.height - gradientHeight,
          0,
          canvas.height
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(1, `rgba(0, 0, 0, ${textOverlay.shadowStrength})`);
        ctx.fillStyle = shadowGradient;
        ctx.fillRect(0, canvas.height - gradientHeight, canvas.width, gradientHeight);
      }
      
      // Calculate dynamic line spacing based on font size
      const lineSpacing = textOverlay.fontSize * 1.2;
      
      // Draw text with shadow
      ctx.fillStyle = textOverlay.color;
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw headline
      ctx.font = `bold ${textOverlay.fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.fillText(
        textOverlay.headline,
        textOverlay.position.x,
        textOverlay.position.y - lineSpacing
      );
      
      // Draw subheadline
      ctx.font = `${textOverlay.fontSize * 0.7}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.fillText(
        textOverlay.subheadline,
        textOverlay.position.x,
        textOverlay.position.y
      );
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };
    img.src = image;
  };

  // Update canvas when image, text, or image state changes
  useEffect(() => {
    drawCanvas();
  }, [image, textOverlay, imageState]);

  // Download the result
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'text-overlay.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        {/* Header */}
        <header className="navbar">
          <div className="navbar-search" style={{ 
            width: '280px',
            backgroundColor: 'rgba(36, 48, 77, 0.5)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)', opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search tools..."
              className="search-input"
            />
          </div>
          
          <div style={{ flex: 1 }}></div>
          
          <div className="navbar-links">
            <div style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)',
              opacity: 0.7
            }}>
              {currentDate}
            </div>
            
            <button
              onClick={logout}
              className="icon-button"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                width: '40px',
                height: '40px',
                color: 'var(--color-text-primary)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content" style={{ paddingTop: 'var(--space-8)' }}>
          <div>
            <h1 className="navbar-title">Text Generator</h1>
            <div className="navbar-welcome">Add text overlays to your images</div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 'var(--space-8)', gap: 'var(--space-6)' }}>
            {/* Controls Section */}
            <div className="card">
              <div className="controls-panel">
                {/* Media Controls */}
                <div className="control-section">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Media Controls
                  </h3>
                  <div className="control-group">
                    <div className="control-field">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary"
                      >
                        Choose Image
                      </button>
                    </div>
                    <div className="control-field">
                      <label>Image Scale</label>
                      <input
                        type="range"
                        value={imageState.scale * 100}
                        onChange={(e) => setImageState(prev => ({
                          ...prev,
                          scale: parseInt(e.target.value) / 100
                        }))}
                        className="input-range"
                        min="100"
                        max="300"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Controls */}
                <div className="control-section">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 7 4 4 20 4 20 7"></polyline>
                      <line x1="9" y1="20" x2="15" y2="20"></line>
                      <line x1="12" y1="4" x2="12" y2="20"></line>
                    </svg>
                    Text Controls
                  </h3>
                  <div className="control-group">
                    <div className="control-field">
                      <label>Headline</label>
                      <input
                        type="text"
                        value={textOverlay.headline}
                        onChange={(e) => setTextOverlay({
                          ...textOverlay,
                          headline: e.target.value
                        })}
                        placeholder="Enter headline text"
                        className="input-field"
                      />
                    </div>
                    <div className="control-field">
                      <label>Subheadline</label>
                      <input
                        type="text"
                        value={textOverlay.subheadline}
                        onChange={(e) => setTextOverlay({
                          ...textOverlay,
                          subheadline: e.target.value
                        })}
                        placeholder="Enter subheadline text"
                        className="input-field"
                      />
                    </div>
                    <div className="control-row">
                      <div className="control-field">
                        <label>Font Size</label>
                        <input
                          type="number"
                          value={textOverlay.fontSize}
                          onChange={(e) => setTextOverlay({
                            ...textOverlay,
                            fontSize: parseInt(e.target.value)
                          })}
                          className="input-field"
                          min="12"
                          max="120"
                        />
                      </div>
                      <div className="control-field">
                        <label>Text Color</label>
                        <input
                          type="color"
                          value={textOverlay.color}
                          onChange={(e) => setTextOverlay({
                            ...textOverlay,
                            color: e.target.value
                          })}
                          className="input-color"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position Controls */}
                <div className="control-section">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 9l4-4 4 4"></path>
                      <path d="M19 15l-4 4-4-4"></path>
                      <path d="M15 5l4 4-4 4"></path>
                      <path d="M9 19L5 15l4-4"></path>
                    </svg>
                    Text Position
                  </h3>
                  <div className="control-group">
                    <div className="control-field">
                      <label>Click and drag text directly on the image, or use the controls below:</label>
                    </div>
                    <div className="control-row">
                      <div className="control-field">
                        <label>X Position</label>
                        <input
                          type="number"
                          value={Math.round(textOverlay.position.x)}
                          onChange={(e) => setTextOverlay({
                            ...textOverlay,
                            position: {
                              ...textOverlay.position,
                              x: parseInt(e.target.value)
                            }
                          })}
                          className="input-field"
                          min="0"
                          max="1080"
                        />
                      </div>
                      <div className="control-field">
                        <label>Y Position</label>
                        <input
                          type="number"
                          value={Math.round(textOverlay.position.y)}
                          onChange={(e) => setTextOverlay({
                            ...textOverlay,
                            position: {
                              ...textOverlay.position,
                              y: parseInt(e.target.value)
                            }
                          })}
                          className="input-field"
                          min="0"
                          max="1350"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Effects Controls */}
                <div className="control-section">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v14"></path>
                      <path d="M5 10h14"></path>
                      <path d="M5 21l7-7 7 7"></path>
                    </svg>
                    Effects
                  </h3>
                  <div className="control-group">
                    <div className="control-field">
                      <label>Background Blur</label>
                      <input
                        type="range"
                        value={textOverlay.blurStrength}
                        onChange={(e) => setTextOverlay({
                          ...textOverlay,
                          blurStrength: parseInt(e.target.value)
                        })}
                        className="input-range"
                        min="0"
                        max="20"
                      />
                    </div>
                    <div className="control-field">
                      <label>Shadow Strength</label>
                      <input
                        type="range"
                        value={textOverlay.shadowStrength * 100}
                        onChange={(e) => setTextOverlay({
                          ...textOverlay,
                          shadowStrength: parseInt(e.target.value) / 100
                        })}
                        className="input-range"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Export Controls */}
                <div className="control-section">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export
                  </h3>
                  <div className="control-group">
                    <button
                      onClick={downloadImage}
                      className="btn btn-primary"
                      disabled={!image}
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="card" style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
              <canvas
                ref={canvasRef}
                width={1080}
                height={1350}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#1a1a1a',
                  borderRadius: 'var(--radius-md)',
                  cursor: dragState.isDragging 
                    ? dragState.target === 'text' 
                      ? 'grabbing' 
                      : 'move' 
                    : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 