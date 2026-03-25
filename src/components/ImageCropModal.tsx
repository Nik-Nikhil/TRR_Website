import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface Props {
  imageSrc: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const CANVAS_SIZE = 320; // preview canvas px
  const OUTPUT_SIZE = 400; // output image px

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // Center image initially
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Draw preview
  useEffect(() => {
    if (!imgLoaded || !imgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    const size = CANVAS_SIZE;

    ctx.clearRect(0, 0, size, size);

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw image centered + zoomed + offset
    const scale = zoom * Math.max(size / img.width, size / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (size - drawW) / 2 + offset.x;
    const y = (size - drawH) / 2 + offset.y;

    ctx.drawImage(img, x, y, drawW, drawH);
    ctx.restore();

    // Circle border
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [imgLoaded, zoom, offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(0.5, z - e.deltaY * 0.001)));
  };

  // Touch support
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    lastTouchRef.current = { x: t.clientX - offset.x, y: t.clientY - offset.y };
    setDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!lastTouchRef.current) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - lastTouchRef.current.x, y: t.clientY - lastTouchRef.current.y });
  };
  const handleTouchEnd = () => { setDragging(false); lastTouchRef.current = null; };

  const handleConfirm = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const size = CANVAS_SIZE;
    const out = OUTPUT_SIZE;

    // Render at output resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = out;
    offscreen.height = out;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = zoom * Math.max(size / img.width, size / img.height) * (out / size);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (out - drawW) / 2 + offset.x * (out / size);
    const y = (out - drawH) / 2 + offset.y * (out / size);

    ctx.drawImage(img, x, y, drawW, drawH);
    ctx.restore();

    offscreen.toBlob(blob => {
      if (blob) onConfirm(blob);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl overflow-hidden w-full max-w-sm" style={{ background: 'rgba(10,13,18,0.98)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="text-white font-semibold text-sm">Crop Photo</h3>
          <button onClick={onCancel} className="text-white/40 hover:text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex flex-col items-center gap-4 px-5 py-6">
          <p className="text-white/30 text-xs">Drag to reposition · Scroll to zoom</p>

          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, cursor: dragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="block"
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3 w-full">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="text-white/40 hover:text-white/70 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range" min="0.5" max="4" step="0.01"
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <button onClick={() => setZoom(z => Math.min(4, z + 0.1))} className="text-white/40 hover:text-white/70 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.8)')}
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
