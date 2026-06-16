import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text, Path, Group, Line, RegularPolygon } from "react-konva";
import useImage from "use-image";

interface LiveShip {
  mmsi: number;
  shipName: string;
  lat: number;
  lng: number;
}

export function PortCanvas({ port = "Puerto Cabello" }: { port?: string }) {
  const [stageWidth, setStageWidth] = useState(800);
  const stageHeight = 400; // Fixed inner height for ratio
  const containerRef = useRef<HTMLDivElement>(null);
  const [ships, setShips] = useState<LiveShip[]>([]);
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch real ships for this
  useEffect(() => {
    const fetchShips = async () => {
      try {
        const res = await fetch("/api/vessel-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ port }),
        });
        const data = await res.json();
        if (data.success && data.liveData) {
          setShips(data.liveData);
        }
      } catch (e) {}
    };
    fetchShips();
    const interval = setInterval(fetchShips, 30000);
    return () => clearInterval(interval);
  }, [port]);

  // For animation
  const [truckPos, setTruckPos] = useState(0);
  useEffect(() => {
    let animId: number;
    let pos = 0;
    const animate = () => {
      pos += 0.5;
      if (pos > 800) pos = -50;
      setTruckPos(pos);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const themePrimary = "#00A9CE";
  const themeSecondaryDark = "#0b1424";
  const themeSecondary = "#0b1a2e";
  const themeAccent = "#F7941D";

  // Mathematical Geometry layout engine based on assigned port
  const getLayout = () => {
     if (port === "La Guaira") {
        return {
           pierLine: `M ${stageWidth * 0.4} 120 L ${stageWidth} 120 L ${stageWidth} ${stageHeight} L ${stageWidth * 0.4} ${stageHeight} Z`,
           roadPath: `M 0 ${stageHeight * 0.8} L ${stageWidth * 0.45} ${stageHeight * 0.8} L ${stageWidth * 0.45} 140`,
           patioAX: stageWidth * 0.5, patioAY: 140,
           patioBX: stageWidth * 0.75, patioBY: 140,
           shipX: stageWidth * 0.6, shipY: 80,
           cranesX: [stageWidth * 0.5, stageWidth * 0.7, stageWidth * 0.9],
           garitaX: stageWidth * 0.25, garitaY: stageHeight * 0.8,
           truckFn: (p: number) => {
              if (p < stageWidth * 0.45) return { x: p, y: stageHeight * 0.8, rot: 90 };
              return { x: stageWidth * 0.45, y: stageHeight * 0.8 - (p - stageWidth * 0.45), rot: 0 };
           },
        };
     } else if (port === "Maracaibo") {
        return {
           pierLine: `M ${stageWidth * 0.1} 200 L ${stageWidth * 0.7} 200 L ${stageWidth * 0.7} ${stageHeight} L ${stageWidth * 0.1} ${stageHeight} Z`,
           roadPath: `M ${stageWidth} ${stageHeight - 40} L ${stageWidth * 0.8} 250 L ${stageWidth * 0.6} 250`,
           patioAX: stageWidth * 0.15, patioAY: 230,
           patioBX: stageWidth * 0.4, patioBY: 230,
           shipX: stageWidth * 0.4, shipY: 160,
           cranesX: [stageWidth * 0.2, stageWidth * 0.5],
           garitaX: stageWidth * 0.85, garitaY: 280,
           truckFn: (p: number) => {
              const seg1Dist = Math.hypot(stageWidth*0.2, stageHeight - 40 - 250);
              if (p < seg1Dist) {
                 const ratio = p / seg1Dist;
                 return { x: stageWidth - ratio*stageWidth*0.2, y: stageHeight - 40 - ratio*(stageHeight - 40 - 250), rot: -45 };
              }
              return { x: stageWidth * 0.8 - (p - seg1Dist), y: 250, rot: -90 };
           },
        };
     } else if (port === "Guanta") {
        return {
           pierLine: `M 0 100 L ${stageWidth * 0.5} 100 L ${stageWidth * 0.5} ${stageHeight} L 0 ${stageHeight} Z`,
           roadPath: `M ${stageWidth * 0.6} ${stageHeight} L ${stageWidth * 0.6} 150 L ${stageWidth * 0.4} 150`,
           patioAX: 50, patioAY: 180,
           patioBX: stageWidth * 0.25, patioBY: 180,
           shipX: stageWidth * 0.25, shipY: 60,
           cranesX: [100, stageWidth * 0.4],
           garitaX: stageWidth * 0.6, garitaY: stageHeight - 80,
           truckFn: (p: number) => {
              const y = stageHeight - p;
              if (y > 150) return { x: stageWidth * 0.6, y, rot: 0 };
              return { x: stageWidth * 0.6 - (p - (stageHeight - 150)), y: 150, rot: -90 };
           },
        };
     }
     
     // Puerto Cabello (Default)
     return {
         pierLine: `M ${stageWidth * 0.2} 150 L ${stageWidth * 0.9} 150 L ${stageWidth * 0.9} ${stageHeight} L ${stageWidth * 0.2} ${stageHeight} Z`,
         roadPath: `M ${stageWidth * 0.1} ${stageHeight} L ${stageWidth * 0.25} 170 L ${stageWidth * 0.8} 170`,
         patioAX: stageWidth * 0.3, patioAY: 200,
         patioBX: stageWidth * 0.5, patioBY: 180,
         shipX: stageWidth * 0.5, shipY: 110,
         cranesX: [stageWidth * 0.4, stageWidth * 0.6, stageWidth * 0.8],
         garitaX: stageWidth * 0.18, garitaY: stageHeight * 0.7,
         truckFn: (p: number) => {
            const seg1 = Math.hypot(stageWidth*0.15, stageHeight - 170);
            if (p < seg1) {
               const ratio = p / seg1;
               return { x: stageWidth * 0.1 + ratio*stageWidth*0.15, y: stageHeight - ratio*(stageHeight - 170), rot: 15 };
            }
            return { x: stageWidth * 0.25 + (p - seg1), y: 170, rot: 90 };
         },
     };
  };

  const layout = getLayout();

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0b1424] relative overflow-hidden rounded-md border border-slate-800">
      <Stage width={stageWidth} height={stageHeight} className="absolute inset-0">
        <Layer>
          {/* SEA LAYER */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill="#031b31"
          />
          
          {/* PIER / DOCKS */}
          <Path
            data={layout.pierLine}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={2}
          />

          {/* ROAD */}
          <Path
            data={layout.roadPath}
            stroke="#0f172a"
            strokeWidth={15}
            lineCap="round"
            lineJoin="round"
          />
          <Path
            data={layout.roadPath}
            stroke="#cbd5e1"
            strokeWidth={1}
            dash={[10, 10]}
            lineCap="round"
            lineJoin="round"
          />

          {/* PATIO A (Exportación) */}
          <Rect
            x={layout.patioAX}
            y={layout.patioAY}
            width={120}
            height={80}
            fill="#0b1a2e"
            stroke="#00A9CE"
            strokeWidth={2}
            cornerRadius={4}
            opacity={0.8}
          />
          <Text
            x={layout.patioAX + 10}
            y={layout.patioAY + 10}
            text="PATIO A (EXP)"
            fill="#00A9CE"
            fontFamily="monospace"
            fontSize={10}
            fontStyle="bold"
          />
          {/* Draw some stacks */}
          <Line points={[layout.patioAX + 10, layout.patioAY + 30, layout.patioAX + 110, layout.patioAY + 30]} stroke="#00A9CE" strokeWidth={4} dash={[15, 5]} />
          <Line points={[layout.patioAX + 10, layout.patioAY + 45, layout.patioAX + 110, layout.patioAY + 45]} stroke="#00A9CE" strokeWidth={4} dash={[15, 5]} />
          <Line points={[layout.patioAX + 10, layout.patioAY + 60, layout.patioAX + 110, layout.patioAY + 60]} stroke="#00A9CE" strokeWidth={4} dash={[15, 5]} />

          {/* PATIO B (Importación) - Closer to the dock */}
          <Rect
            x={layout.patioBX}
            y={layout.patioBY}
            width={140}
            height={90}
            fill="#0b1a2e"
            stroke="#F7941D"
            strokeWidth={2}
            cornerRadius={4}
            opacity={0.8}
          />
          <Text
            x={layout.patioBX + 10}
            y={layout.patioBY + 10}
            text="PATIO B (IMP)"
            fill="#F7941D"
            fontFamily="monospace"
            fontSize={10}
            fontStyle="bold"
          />
          <Line points={[layout.patioBX + 10, layout.patioBY + 30, layout.patioBX + 130, layout.patioBY + 30]} stroke="#F7941D" strokeWidth={4} dash={[20, 5]} />
          <Line points={[layout.patioBX + 10, layout.patioBY + 50, layout.patioBX + 130, layout.patioBY + 50]} stroke="#F7941D" strokeWidth={4} dash={[20, 5]} />
          <Line points={[layout.patioBX + 10, layout.patioBY + 70, layout.patioBX + 130, layout.patioBY + 70]} stroke="#F7941D" strokeWidth={4} dash={[20, 5]} />


          {/* CRANES ON THE EDGE */}
          {layout.cranesX.map((cx, i) => (
             <Group key={`crane-${i}`} x={cx} y={layout.shipY + 40}>
               <Rect x={-10} y={-10} width={20} height={10} fill="#F7941D" />
               <Line points={[0, 0, 0, -30]} stroke="#F7941D" strokeWidth={3} />
               <Line points={[0, -30, -30, -30]} stroke="#F7941D" strokeWidth={3} />
               <Line points={[-30, -30, -30, -10]} stroke="#475569" strokeWidth={1} dash={[2,1]} />
             </Group>
          ))}

          {/* DOCKED SHIP */}
          <Group x={layout.shipX} y={layout.shipY}>
             {/* Ship Hull */}
             <Path 
               data="M -80 15 L 60 15 L 80 0 L 80 -15 L -80 -15 Z" 
               fill="#ef4444" 
               stroke="#b91c1c" 
               strokeWidth={1} 
             />
             <Rect x={-60} y={-15} width={40} height={10} fill="#e2e8f0" />
             <Rect x={-50} y={-25} width={20} height={10} fill="#e2e8f0" />
             <Text x={-10} y={-5} text={`SERVIPORT ${port.substring(0,3).toUpperCase()}`} fontSize={8} fontFamily="monospace" fill="#ffffff" />
          </Group>

          {/* GARITA / GATE */}
          <Group x={layout.garitaX} y={layout.garitaY}>
            <Rect x={-15} y={-10} width={30} height={20} fill="#1e293b" stroke="#00A9CE" strokeWidth={2} cornerRadius={2} />
            <Text x={-12} y={-5} text="GATE" fontSize={8} fill="#00A9CE" fontFamily="monospace" fontStyle="bold" />
            <Line points={[-15, 10, 15, 10]} stroke="#ef4444" strokeWidth={2} />
          </Group>

          {/* ANIMATED TRUCK (Gandola) */}
          <Group x={layout.truckFn(truckPos).x} y={layout.truckFn(truckPos).y} rotation={layout.truckFn(truckPos).rot}>
            {/* Simple truck representation */}
            <Rect x={-5} y={-5} width={10} height={10} fill="#ffffff" />
            {/* Trailer */}
            <Rect x={-5} y={5} width={10} height={20} fill="#00A9CE" />
          </Group>

          {/* LIVE SHIPS IN SIGHT (telemetry bounding box) */}
          {ships.map((ship, i) => {
            // Very rough mapping of lat/lng to x/y just to show icons off the coast
            // Let's just place them randomly in the sea area (top part) for demo purposes
            // In a real scenario we use proper projection math
            const x = 50 + (i * 60) % (stageWidth - 100);
            const y = 20 + (i * 30) % 80;
            return (
              <Group key={ship.mmsi} x={x} y={y}>
                <Circle radius={4} fill="#00A9CE" shadowColor="#00A9CE" shadowBlur={10} />
                <Text text={ship.shipName} x={8} y={-4} fill="#94a3b8" fontSize={9} fontFamily="monospace" />
              </Group>
            );
          })}

        </Layer>
      </Stage>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 flex gap-2">
         <div className="bg-[#0b1a2e]/80 backdrop-blur border border-[#00A9CE]/30 text-white px-3 py-1.5 rounded text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(0,169,206,0.2)]">
            <span className="text-[#00A9CE] me-2">●</span> LIVE TOS LINKED
         </div>
         <div className="bg-[#0b1a2e]/80 backdrop-blur border border-slate-700 text-white px-3 py-1.5 rounded text-xs font-mono font-bold tracking-widest">
            {ships.length} RADAR CONTACTS
         </div>
      </div>
    </div>
  );
}
