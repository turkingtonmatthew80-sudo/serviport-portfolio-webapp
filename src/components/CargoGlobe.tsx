import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2, Radio, RefreshCw, Anchor } from 'lucide-react';
import { saveShipRecords, getShipRecordsByPort, TradeVesselMovements } from '../lib/idb';

interface LiveShip {
  mmsi: number;
  shipName: string;
  destinationPort: string;
  lat: number;
  lng: number;
  date: string;
}

export function CargoGlobe() {
  const globeEl = useRef<any>(null);
  const [liveData, setLiveData] = useState<LiveShip[]>([]);
  const [staticData, setStaticData] = useState<TradeVesselMovements[]>([]);
  const [countries, setCountries] = useState({ features: [] });
  const [loading, setLoading] = useState(true);
  const [syncingLayer, setSyncingLayer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  
  const [selectedPort, setSelectedPort] = useState('Puerto Cabello');
  const [tradeFilter, setTradeFilter] = useState<'all' | 'import' | 'export'>('all');
  const [listTab, setListTab] = useState<'live' | 'history'>('history');
  
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
         if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            setGlobeSize((prev) => {
               if (prev.width === entry.contentRect.width && prev.height === entry.contentRect.height) {
                   return prev;
               }
               return {
                 width: entry.contentRect.width,
                 height: entry.contentRect.height
               };
            });
         }
      }
    });
    observer.observe(containerRef.current);
    
    // Initial size
    if (containerRef.current) {
        setGlobeSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight
        });
    }

    return () => observer.disconnect();
  }, []);
  
  const { theme } = useTheme();

  // Map to center the globe on port selection
  const portCoords: Record<string, { lat: number, lng: number }> = {
    "Puerto Cabello": { lat: 10.48, lng: -68.01 },
    "La Guaira": { lat: 10.60, lng: -66.93 },
    "Maracaibo": { lat: 10.64, lng: -71.60 },
    "Guanta": { lat: 10.24, lng: -64.59 }
  };

  const loadLocalDbData = async () => {
    try {
       const cached = await getShipRecordsByPort(selectedPort);
       if (cached && cached.length > 0) {
         setStaticData(cached);
       }
    } catch (e) {
       console.error("IDB load error", e);
    }
  };

  const forceScrape = async () => {
    setSyncingLayer(true);
    try {
      const res = await fetch('/api/vessel-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port: selectedPort, forceScrape: true })
      });
      const json = await res.json();
      if (json.success) {
        setLiveData(json.liveData || []);
        if (json.staticData && json.staticData.length > 0) {
           await saveShipRecords(json.staticData, selectedPort);
           setStaticData(json.staticData);
        }
        setError(null);
      } else {
        setError(json.error || "Error al sincronizar datos");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setSyncingLayer(false);
    }
  };

  useEffect(() => {
    // Fetch countries geojson
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
      .catch(err => console.error("Could not load countries", err));
      
    let interval: any;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/vessel-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ port: selectedPort, forceScrape: false })
        });
        const json = await res.json();
        
        if (json.success) {
          setLiveData(json.liveData || []);
          if (json.staticData && json.staticData.length > 0) {
            // Merge with local static data or overwrite
            await saveShipRecords(json.staticData, selectedPort);
            
            // Reload all from IDB to get merged result
            const cached = await getShipRecordsByPort(selectedPort);
            setStaticData(cached.length > 0 ? cached : json.staticData);
          }
          setIsLive(true);
        } else {
          setError(json.error);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch from IDB, then ask for live & force scrape
    setLoading(true);
    let isMounted = true;
    
    const initData = async () => {
      await loadLocalDbData();
      if (!isMounted) return;
      await fetchData(); // Fetch data (without forceScrape)
    };
    
    initData();

    // Poll every 10 seconds for live updates (without scraping)
    interval = setInterval(fetchData, 10000);

    return () => {
       isMounted = false;
       clearInterval(interval);
    };
  }, [selectedPort]);

  useEffect(() => {
    if (globeEl.current) {
      const coords = portCoords[selectedPort] || portCoords["Puerto Cabello"];
      globeEl.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 2.2 }, 1000);
      globeEl.current.controls().autoRotate = false;
    }
  }, [selectedPort]);

  const filteredStaticData = useMemo(() => {
    if (tradeFilter === 'all') return staticData;
    return staticData.filter(d => d.type === tradeFilter);
  }, [staticData, tradeFilter]);

  // Format data for arcs explicitly from static scraped data
  const arcsData = filteredStaticData
    .map(d => ({
      startLat: d.originLat,
      startLng: d.originLng,
      endLat: d.destinationLat,
      endLng: d.destinationLng,
      color: d.type === 'import' ? 'rgba(59, 130, 246, 0.65)' : 'rgba(234, 179, 8, 0.65)',
      name: `<b>${d.shipName}</b><br/>Tipo: ${d.type === 'import' ? 'Importación' : 'Exportación'}`
    }));

  // Map live data into points
  const liveMarkers = liveData.map(d => ({
    lat: d.lat, 
    lng: d.lng, 
    name: `<b>${d.shipName}</b><br/>Hacia: ${d.destinationPort}`, 
    color: '#0ea5e9' // Clean blue dot
  }));

  const staticMarkers = filteredStaticData.map(d => ({
    lat: d.type === 'import' ? d.originLat : d.destinationLat,
    lng: d.type === 'import' ? d.originLng : d.destinationLng,
    name: `<b>${d.shipName}</b><br/>Tipo: ${d.type === 'import' ? 'Importación' : 'Exportación'}`,
    color: d.type === 'import' ? '#3b82f6' : '#eab308'
  }));

  // Add the port itself as a marker
  const portMarker = {
    lat: portCoords[selectedPort].lat,
    lng: portCoords[selectedPort].lng,
    name: `<b>Base: ${selectedPort}</b>`,
    color: '#ef4444' // Red target port
  };
  
  const customTooltip = (htmlText: string) => `
    <div style="background: rgba(15, 23, 42, 0.9); color: white; padding: 6px 10px; border-radius: 6px; font-size: 13px; font-family: sans-serif; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      ${htmlText}
    </div>
  `;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full flex-col lg:flex-row flex gap-6 mt-8">
        <div className="w-full lg:w-1/3 bg-background-muted p-6 rounded-lg border border-border shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Tráfico en Vivo</h3>
              {isLive && (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
                      <Radio size={14} className="animate-pulse" />
                      AIS Live
                  </div>
              )}
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-semibold text-foreground-muted">Puerto (Venezuela)</label>
            <select 
              className="w-full bg-background border border-border rounded p-2 text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
            >
              <option value="Puerto Cabello">Puerto Cabello</option>
              <option value="La Guaira">La Guaira</option>
              <option value="Maracaibo">Maracaibo</option>
              <option value="Guanta">Guanta</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-semibold text-foreground-muted">Historial de Rutas</label>
            <div className="flex gap-2">
              {(['all', 'import', 'export'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTradeFilter(type)}
                  className={`flex-1 py-1.5 px-2 rounded border text-xs font-medium capitalize transition-colors ${tradeFilter === type ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground-muted border-border hover:bg-background-muted'}`}
                >
                  {type === 'all' ? 'Ambos' : type === 'import' ? 'Importación' : 'Exportación'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-sm text-foreground font-medium">Puerto Seleccionado</span>
            </div>
            {listTab === 'live' ? (
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                <span className="text-sm text-foreground font-medium">Buque en Tránsito (AIS)</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-blue-500 opacity-60"></div>
                  <span className="text-sm text-foreground font-medium">Ruta Histórica (Importación)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-yellow-500 opacity-60"></div>
                  <span className="text-sm text-foreground font-medium">Ruta Histórica (Exportación)</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-4">
              <button 
                onClick={forceScrape} 
                disabled={syncingLayer}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded font-semibold text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={syncingLayer ? 'animate-spin' : ''} />
                Actualizar Datos (Vía Apify)
              </button>
              
              <div className="bg-background border border-border p-3 rounded text-sm text-foreground-muted">
                  <strong>Buques Activos:</strong> {liveData.length}
                  <br />
                  <span className="text-xs opacity-70 mt-1 block leading-relaxed">
                      Adquiriendo datos de telemetría a través de la constelación AISStream Satelital, complementado con scrape de registros de puerto.
                  </span>
              </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 h-[500px] md:h-[600px] border border-border rounded-lg overflow-hidden relative cursor-move" style={{ backgroundColor: theme === 'dark' ? '#0b1424' : '#bae6fd' }}>
          {loading && liveData.length === 0 && staticData.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="font-bold tracking-widest uppercase text-center max-w-sm">
                  Conectando con red satelital AIS...
              </p>
              <p className="text-xs text-slate-300 mt-2 text-center">
                  Esperando el primer reporte de posiciones.
              </p>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-sm px-4">
              <div className="bg-red-950/80 p-6 border border-red-500/50 rounded-lg max-w-md text-center shadow-xl backdrop-blur-md">
                <span className="text-red-400 font-bold block mb-2 text-lg">Se requiere acción manual</span>
                <p className="text-red-200 text-sm mb-4">
                  {error.split('https://')[0]}
                </p>
                {error.includes('https://') && (
                  <a 
                    href={`https://${error.split('https://')[1]}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-base text-black hover:bg-slate-200 hover:scale-105 transition-all font-bold py-2 px-4 rounded-md"
                  >
                    Abrir consola para autorizar
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="w-full h-full" ref={containerRef}>
             {globeSize.width > 0 && globeSize.height > 0 && (
                 <Globe
                    ref={globeEl}
                    width={globeSize.width}
                    height={globeSize.height}
                    showGlobe={true}
                    showAtmosphere={true}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl={"//unpkg.com/three-globe/example/img/earth-water.png"}
                    
                    // Clean vector polygons for countries
                    polygonsData={countries.features}
                polygonCapColor={() => theme === 'dark' ? '#1e293b' : '#ffffff'}
                polygonSideColor={() => 'rgba(0,0,0,0.05)'}
                polygonStrokeColor={() => theme === 'dark' ? '#334155' : '#cbd5e1'}
                
                // Continuous, non-animated arcs
                arcsData={listTab === 'history' ? arcsData : []}
                arcColor="color"
                arcAltitudeAutoScale={0.25}
                arcStroke={1.0}
                arcLabel={(d: any) => customTooltip(d.name)}
                
                // Points only, no permanent text, smaller sizes, no animation
                labelsData={listTab === 'live' ? [...liveMarkers, portMarker] : [...staticMarkers, portMarker]}
                labelLat={(d: any) => d.lat}
                labelLng={(d: any) => d.lng}
                labelText={() => ''}
                labelLabel={(d: any) => customTooltip(d.name)}
                labelSize={0.5}
                labelDotRadius={(d: any) => d.color === '#ef4444' ? 0.8 : 0.3}
                labelColor={(d: any) => d.color}
                labelResolution={2}
             />
             )}
          </div>
        </div>
      </div>

      {/* Dynamic List purely of Static data parsed */}
      <div className="w-full bg-background-muted border border-border rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Anchor size={20} className="text-primary"/> 
                Registros de Puertos
            </h4>
            
            <div className="flex p-1 bg-background border border-border rounded-lg">
                <button 
                  onClick={() => setListTab('live')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${listTab === 'live' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  Posiciones Actuales (En Vivo)
                </button>
                <button 
                  onClick={() => setListTab('history')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${listTab === 'history' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  Conexiones (Histórico)
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {listTab === 'history' ? (
              filteredStaticData.length === 0 && !loading ? (
                <p className="text-sm text-foreground-muted col-span-full">No hay registros históricos de rutas para este puerto o filtro.</p>
              ) : (
                filteredStaticData.map((d, index) => (
                  <div key={`${d.mmsi}-${index}`} className="flex flex-col p-3 rounded-md border border-border bg-background hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-foreground truncate mr-2" title={d.shipName}>{d.shipName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap ${d.type === 'import' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {d.type === 'import' ? 'IMPORTACIÓN' : 'EXPORTACIÓN'}
                        </span>
                      </div>
                      <div className="text-xs text-foreground-muted flex flex-col gap-1">
                        <span className="truncate">Latitud: <span className="font-mono text-foreground">{((d.type === 'import' ? d.originLat : d.destinationLat) || 0).toFixed(3)}</span></span>
                        <span className="truncate">Longitud: <span className="font-mono text-foreground">{((d.type === 'import' ? d.originLng : d.destinationLng) || 0).toFixed(3)}</span></span>
                      </div>
                  </div>
                ))
              )
          ) : (
              liveData.length === 0 && !loading ? (
                <p className="text-sm text-foreground-muted col-span-full">No hay buques detectados en el perímetro en este momento.</p>
              ) : (
                liveData.map((d, index) => (
                  <div key={`live-${d.mmsi}-${index}`} className="flex flex-col p-3 rounded-md border border-border bg-background hover:border-sky-500/50 transition-colors shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-bl-full -mr-4 -mt-4"></div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="font-bold text-sm text-foreground truncate mr-2" title={d.shipName}>{d.shipName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap bg-sky-500/10 text-sky-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                          LIVE
                        </span>
                      </div>
                      <div className="text-xs text-foreground-muted flex flex-col gap-1 relative z-10">
                        <span className="truncate">Hacia: <span className="font-medium text-foreground">{d.destinationPort || 'Desconocido'}</span></span>
                        <span className="truncate">MMSI: <span className="font-mono text-foreground">{d.mmsi}</span></span>
                      </div>
                  </div>
                ))
              )
          )}
        </div>
      </div>
    </div>
  );
}

