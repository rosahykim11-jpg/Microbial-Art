import { useRef, useState, useEffect, useCallback } from "react";

const SHAPES = [
  { id: "circle", label: "●", title: "Circle" },
  { id: "square", label: "■", title: "Square" },
  { id: "star", label: "★", title: "Star" },
  { id: "triangle", label: "▲", title: "Triangle" },
  { id: "diamond", label: "◆", title: "Diamond" },
  { id: "cross", label: "+", title: "Cross" },
];

const COLORS = [
  "#ffffff", "#f43f5e", "#f97316", "#facc15", "#4ade80",
  "#22d3ee", "#818cf8", "#c084fc", "#fb7185", "#000000",
];

function drawShape(ctx, shape, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  const r = size / 2;
  switch (shape) {
    case "circle":
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "square":
      ctx.fillRect(x - r, y - r, size, size);
      break;
    case "star": {
      const outerR = r, innerR = r * 0.4, points = 5;
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const radius = i % 2 === 0 ? outerR : innerR;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "triangle":
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.866, y + r * 0.5);
      ctx.lineTo(x - r * 0.866, y + r * 0.5);
      ctx.closePath();
      ctx.fill();
      break;
    case "diamond":
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.6, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r * 0.6, y);
      ctx.closePath();
      ctx.fill();
      break;
    case "cross": {
      const w = size * 0.25, h = r;
      ctx.fillRect(x - w / 2, y - h, w, size);
      ctx.fillRect(x - h, y - w / 2, size, w);
      break;
    }
    default:
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
  }
}

export default function DrawingTool() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [shape, setShape] = useState("circle");
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#818cf8");
  const lastPos = useRef(null);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const container = canvas.parentElement;
      const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = container.offsetWidth;
      canvas.height = Math.min(520, window.innerHeight - 250);
      canvas.getContext("2d").putImageData(imageData, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const source = e.touches ? e.touches[0] : e;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const paint = useCallback((pos) => {
    const ctx = canvasRef.current.getContext("2d");
    if (lastPos.current) {
      const dx = pos.x - lastPos.current.x;
      const dy = pos.y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.max(1, size * 0.3);
      const steps = Math.ceil(dist / step);
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        drawShape(ctx, shape, lastPos.current.x + dx * t, lastPos.current.y + dy * t, size, color);
      }
    } else {
      drawShape(ctx, shape, pos.x, pos.y, size, color);
    }
    lastPos.current = pos;
  }, [shape, size, color]);

  const startDraw = (e) => { e.preventDefault(); setDrawing(true); lastPos.current = null; paint(getPos(e)); };
  const continueDraw = (e) => { e.preventDefault(); if (drawing) paint(getPos(e)); };
  const stopDraw = () => { setDrawing(false); lastPos.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const link = document.createElement("a");
    link.download = "canvas-drawing.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Drawing Canvas</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Pick a shape, size, and color — then paint freely</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="px-3 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
          >
            Save PNG
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-wrap gap-6 items-center">
        {/* Shapes */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Brush Shape</p>
          <div className="flex gap-1.5">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                title={s.title}
                onClick={() => setShape(s.id)}
                className={`w-9 h-9 rounded-xl text-lg transition-all duration-150 ${
                  shape === s.id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/30 scale-110"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="space-y-1.5 flex-1 min-w-36">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Size — {size}px</p>
          <input
            type="range"
            min="4"
            max="80"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />
        </div>

        {/* Colors */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Color</p>
          <div className="flex gap-1.5 items-center flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className={`w-7 h-7 rounded-lg transition-all duration-150 border-2 ${
                  color === c ? "scale-125 border-white shadow-lg" : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Custom color"
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-2 border-zinc-600 hover:border-zinc-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative"
        style={{ cursor: "crosshair" }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={continueDraw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={continueDraw}
          onTouchEnd={stopDraw}
          className="block w-full touch-none"
        />
        {/* Preview indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-zinc-900/80 backdrop-blur rounded-xl px-3 py-1.5 border border-zinc-800">
          <div
            className="rounded-full"
            style={{
              width: Math.min(20, size),
              height: Math.min(20, size),
              backgroundColor: color,
            }}
          />
          <span className="text-xs text-zinc-400">{SHAPES.find(s => s.id === shape)?.title}</span>
        </div>
      </div>
    </div>
  );
}
