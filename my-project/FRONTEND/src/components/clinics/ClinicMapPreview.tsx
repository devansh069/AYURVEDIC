import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Map, MapPin, ZoomIn, ZoomOut, Coffee, Navigation, ShieldCheck, RefreshCw, Crosshair } from 'lucide-react';
import { Clinic } from '../../types';
import clinicApi from '../../services/clinicApi';

interface ClinicMapPreviewProps {
  clinics: Clinic[];
  userLocation: { latitude: number; longitude: number } | null;
  onRefresh: () => Promise<void>;
}

export const ClinicMapPreview: React.FC<ClinicMapPreviewProps> = ({
  clinics,
  userLocation,
  onRefresh
}) => {
  const [activeClinicId, setActiveClinicId] = useState<string>(clinics[0]?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  
  // Registrar States
  const [registrarClinicId, setRegistrarClinicId] = useState<string>(clinics[0]?.id || '');
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerStatus, setRegisterStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showManual, setShowManual] = useState<boolean>(false);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const activeClinic = useMemo(() => {
    return clinics.find(c => c.id === activeClinicId) || clinics[0];
  }, [clinics, activeClinicId]);

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js-cdn';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  // Initialize/Update map instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Center coordinates
    let centerLat = 20.5937; // Default India Center
    let centerLng = 78.9629;

    if (activeClinic && activeClinic.latitude && activeClinic.longitude) {
      centerLat = parseFloat(activeClinic.latitude as any);
      centerLng = parseFloat(activeClinic.longitude as any);
    } else if (userLocation) {
      centerLat = userLocation.latitude;
      centerLng = userLocation.longitude;
    }

    // Create Map if it does not exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([centerLat, centerLng], zoomLevel);

      // OpenStreetMap Tiles (Premium Organic Aesthetics)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      markersGroupRef.current = L.featureGroup().addTo(mapInstanceRef.current);
    } else {
      // Re-center map view
      mapInstanceRef.current.setView([centerLat, centerLng], zoomLevel);
    }

    // Clear old markers
    markersGroupRef.current.clearLayers();

    // Custom marker icons
    const clinicIcon = L.divIcon({
      className: 'custom-clinic-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="background-color: #2E7D32; color: #FFFFFF; border: 2px solid #FFFFFF; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
            🏥
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #2E7D32; margin-top: -1px;"></div>
        </div>
      `,
      iconSize: [28, 38],
      iconAnchor: [14, 38]
    });

    const activeIcon = L.divIcon({
      className: 'custom-clinic-pin-active',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="background-color: #D4AF37; color: #FFFFFF; border: 2px solid #FFFFFF; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); animation: pulse 2s infinite;">
            🌿
          </div>
          <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #D4AF37; margin-top: -1px;"></div>
        </div>
      `,
      iconSize: [34, 44],
      iconAnchor: [17, 44]
    });

    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="background-color: #0284c7; border: 2px solid #FFFFFF; border-radius: 50%; width: 18px; height: 18px; box-shadow: 0 0 12px #0284c7; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #FFFFFF; width: 6px; height: 6px; border-radius: 50%;"></div>
          </div>
          <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #0284c7; position: absolute; top: -3px; left: -3px; animation: ping 2s infinite; opacity: 0.5;"></div>
        </div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    // Add User marker if available
    if (userLocation) {
      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(markersGroupRef.current)
        .bindPopup("<b>You are here!</b><br/>Searching nearby centers...");
    }

    // Add Clinic markers
    clinics.forEach(c => {
      if (!c.latitude || !c.longitude) return;

      const lat = parseFloat(c.latitude as any);
      const lng = parseFloat(c.longitude as any);
      const isActive = c.id === activeClinicId;

      const marker = L.marker([lat, lng], { icon: isActive ? activeIcon : clinicIcon })
        .addTo(markersGroupRef.current)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; color: #1A1A1A; padding: 2px;">
            <b style="color: #2E7D32; font-size: 12px;">${c.name}</b><br/>
            ${c.type}<br/>
            ${c.city}<br/>
            <a href="tel:${c.phone}" style="color: #D4AF37; text-decoration: none; font-weight: bold;">📞 Call Clinic</a>
          </div>
        `);

      marker.on('click', () => {
        setActiveClinicId(c.id);
      });
    });

  }, [leafletLoaded, clinics, activeClinicId, userLocation, zoomLevel]);

  // Adjust zoom utility
  const handleZoom = (type: 'in' | 'out') => {
    if (!mapInstanceRef.current) return;
    const newZoom = type === 'in' ? Math.min(18, zoomLevel + 1) : Math.max(8, zoomLevel - 1);
    setZoomLevel(newZoom);
    mapInstanceRef.current.setZoom(newZoom);
  };

  // Register live coordinates method
  const handleRegisterLiveLocation = () => {
    if (!registrarClinicId) {
      setRegisterStatus({ type: 'error', text: 'Please select a clinic first.' });
      return;
    }

    setRegisterLoading(true);
    setRegisterStatus(null);

    if (!navigator.geolocation) {
      setRegisterStatus({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      setRegisterLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await clinicApi.updateClinicLocation(registrarClinicId, lat, lng);
          if (res.data && !res.isFallback) {
            setRegisterStatus({
              type: 'success',
              text: `Success! MySQL database location coordinates for clinic updated to [${lat.toFixed(6)}, ${lng.toFixed(6)}].`
            });
            // Refresh parent state to fetch new database entries
            await onRefresh();
            setActiveClinicId(registrarClinicId);
          } else {
            setRegisterStatus({ type: 'error', text: res.error || 'Failed to write coordinates to database.' });
          }
        } catch (err: any) {
          setRegisterStatus({ type: 'error', text: err.message || 'An error occurred during location save.' });
        } finally {
          setRegisterLoading(false);
        }
      },
      (err) => {
        setRegisterStatus({
          type: 'error',
          text: `GPS Access Failed/Denied: ${err.message}. Please use the Manual Coordinates input below to register your location.`
        });
        setRegisterLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleRegisterManualLocation = async () => {
    if (!registrarClinicId) {
      setRegisterStatus({ type: 'error', text: 'Please select a clinic first.' });
      return;
    }

    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setRegisterStatus({ type: 'error', text: 'Please enter valid numeric values for Latitude and Longitude.' });
      return;
    }

    setRegisterLoading(true);
    setRegisterStatus(null);

    try {
      const res = await clinicApi.updateClinicLocation(registrarClinicId, lat, lng);
      if (res.data && !res.isFallback) {
        setRegisterStatus({
          type: 'success',
          text: `Success! MySQL location database updated to [${lat.toFixed(6)}, ${lng.toFixed(6)}].`
        });
        await onRefresh();
        setActiveClinicId(registrarClinicId);
        setManualLat('');
        setManualLng('');
      } else {
        setRegisterStatus({ type: 'error', text: res.error || 'Failed to save manual coordinates.' });
      }
    } catch (err: any) {
      setRegisterStatus({ type: 'error', text: err.message || 'An error occurred during manual coordinates save.' });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <section className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">Geospatial Registry</span>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">Interactive Map Discovery Canvas</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Locate certified centers nearby. Click any clinic in the sidebar list to center the Leaflet coordinates and draw pin navigation details.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[10px] font-extrabold px-4 py-2 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pins</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Clinic selection list */}
        <div className="flex flex-col space-y-2 max-h-[420px] overflow-y-auto pr-2 border-r border-gray-100 text-xs font-semibold text-text-primary">
          {clinics.map((c) => {
            const isActive = c.id === activeClinicId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveClinicId(c.id)}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  isActive
                    ? 'bg-primary/5 border-primary shadow-sm'
                    : 'bg-[#FAF9F6] border-gray-150 hover:border-primary/20 hover:bg-white'
                }`}
              >
                <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-accent' : 'text-primary/60'}`} />
                <div className="space-y-1 truncate w-full">
                  <h4 className="font-bold text-primary truncate leading-snug">{c.name}</h4>
                  <div className="flex justify-between items-center text-[10px] text-text-secondary font-medium leading-relaxed">
                    <span className="truncate">{c.city}, {c.state}</span>
                    {c.distanceKm !== undefined && c.distanceKm !== null && (
                      <span className="text-accent font-black shrink-0 pl-1">📍 {c.distanceKm.toFixed(1)} km</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns - Map Canvas & Details */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Leaflet Map Canvas (3/5 width on desktop) */}
          <div className="md:col-span-3 h-80 md:h-full min-h-[340px] bg-[#E8F5E9]/30 border border-[#2E7D32]/15 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner">
            
            {/* Map Anchor container for Leaflet */}
            <div ref={mapContainerRef} className="absolute inset-0 z-10" />

            {/* Custom Styles Injection */}
            <style>{`
              .leaflet-container {
                background: #F8FFF8 !important;
              }
              @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
                70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
              }
            `}</style>

            {/* Map utility controls */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#2E7D32]/15 shadow-md flex flex-col space-y-1.5 shrink-0 text-primary z-20">
              <button 
                onClick={() => handleZoom('in')}
                className="p-1 hover:bg-[#2E7D32]/5 rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleZoom('out')}
                className="p-1 hover:bg-[#2E7D32]/5 rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Coordinates Badge */}
            <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-sm text-white text-[9px] font-bold py-1 px-3.5 rounded-full flex items-center space-x-1 z-20 shadow-md">
              <Map className="w-3.5 h-3.5 text-accent" />
              <span>
                {activeClinic?.latitude && activeClinic?.longitude 
                  ? `LatLng: ${parseFloat(activeClinic.latitude as any).toFixed(4)}, ${parseFloat(activeClinic.longitude as any).toFixed(4)}`
                  : 'Coordinates Not Synced'}
              </span>
            </div>
          </div>

          {/* Details & Nearby Info panel (2/5 width on desktop) */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-5 text-xs">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-accent uppercase tracking-widest block">Centered Location Details</span>
                <h4 className="font-serif font-black text-primary text-sm leading-tight">
                  {activeClinic ? activeClinic.name : 'Choose a clinic'}
                </h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                  {activeClinic ? activeClinic.address : ''}
                </p>
                
                {activeClinic?.distanceKm !== undefined && activeClinic.distanceKm !== null && (
                  <span className="inline-flex bg-primary/10 text-primary font-black px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider mt-1.5 border border-primary/15">
                    📍 Proximity: {activeClinic.distanceKm.toFixed(2)} km from you
                  </span>
                )}
              </div>

              {/* Clinic Registrar Tool */}
              <div className="bg-[#FAF9F6] border border-[#2E7D32]/10 p-3.5 rounded-2xl space-y-3 shadow-inner">
                <span className="text-[8.5px] uppercase font-black text-primary tracking-widest block flex items-center space-x-1">
                  <Crosshair className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Clinic Location Registrar</span>
                </span>
                
                <p className="text-[9.5px] text-text-secondary font-medium leading-relaxed">
                  Are you checking in as clinic staff? Choose your clinic below and save your current live GPS coordinates in real-time.
                </p>

                <div className="space-y-2 text-[10px]">
                  <select
                    value={registrarClinicId}
                    onChange={(e) => setRegistrarClinicId(e.target.value)}
                    className="w-full bg-white border border-gray-250 rounded-xl py-1.5 px-2 text-[11px] text-gray-800 focus:outline-none focus:border-primary font-semibold"
                  >
                    {clinics.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleRegisterLiveLocation}
                    disabled={registerLoading}
                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{registerLoading ? 'Detecting GPS...' : 'Detect & Register Live GPS'}</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowManual(!showManual)}
                      className="text-[9px] text-[#2E7D32] hover:text-primary-light underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {showManual ? 'Hide Manual Inputs' : 'Or Enter Coordinates Manually'}
                    </button>
                  </div>

                  {showManual && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] uppercase font-bold text-text-secondary">Latitude</label>
                          <input
                            type="text"
                            placeholder="e.g. 12.9716"
                            value={manualLat}
                            onChange={(e) => setManualLat(e.target.value)}
                            className="w-full bg-white border border-gray-250 rounded-xl py-1.5 px-2 text-[10px] text-gray-800 focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase font-bold text-text-secondary">Longitude</label>
                          <input
                            type="text"
                            placeholder="e.g. 77.5946"
                            value={manualLng}
                            onChange={(e) => setManualLng(e.target.value)}
                            className="w-full bg-white border border-gray-250 rounded-xl py-1.5 px-2 text-[10px] text-gray-800 focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleRegisterManualLocation}
                        disabled={registerLoading}
                        className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-2 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer"
                      >
                        <span>Save Manual Coordinates</span>
                      </button>
                    </div>
                  )}

                  {registerStatus && (
                    <div className={`p-2 rounded-xl text-[9px] font-bold border ${
                      registerStatus.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {registerStatus.text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Action button */}
            {activeClinic?.latitude && activeClinic?.longitude ? (
              <a 
                href={`https://maps.google.com/?q=${activeClinic.latitude},${activeClinic.longitude}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-[#FAF9F6] hover:bg-white hover:border-primary border border-primary/10 text-primary font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center space-x-2 text-[10px] shadow-sm cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-accent shrink-0" />
                <span>Get Driving Directions</span>
              </a>
            ) : (
              <div className="w-full bg-gray-50 border border-gray-150 text-gray-400 font-bold py-3.5 rounded-xl text-[9.5px] uppercase text-center tracking-widest cursor-not-allowed">
                Directions Unavailable (No GPS)
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicMapPreview;
