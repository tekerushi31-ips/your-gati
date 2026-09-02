import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS, DOMAINS } from '../../data/mockData';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Ranchi': [23.3441, 85.3096],
  'Dhanbad': [23.7957, 86.4304],
  'Bokaro': [23.6693, 86.1511],
  'Jamshedpur/East Singhbhum': [22.8046, 86.2029],
  'Palamu': [24.0326, 84.0706],
  'Hazaribagh': [23.9925, 85.3637],
  'Deoghar': [24.4826, 86.6967],
  'Giridih': [24.1895, 86.3039],
  'Dumka': [24.2676, 87.2489],
  'West Singhbhum': [22.5694, 85.8118],
  'Ramgarh': [23.6300, 85.5100],
  'Garhwa': [24.1500, 83.8000]
};

export const JharkhandMap: React.FC = () => {
  const { challenges, setSelectedChallenge, setActivePage } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [mapError, setMapError] = useState<boolean>(false);
  const [activeChallenge, setActiveChallenge] = useState<any | null>(null);

  const filteredChallenges = challenges.filter(c => {
    const matchesDistrict = selectedDistrict === 'ALL' || c.district === selectedDistrict;
    const matchesDomain = selectedDomain === 'ALL' || c.domain === selectedDomain;
    const matchesSeverity = selectedSeverity === 'ALL' || c.urgency === selectedSeverity;
    return matchesDistrict && matchesDomain && matchesSeverity;
  });

  const initMap = () => {
    if (!mapContainerRef.current) return;

    try {
      setMapError(false);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [23.6102, 85.2799],
        zoom: 8,
        scrollWheelZoom: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      renderMarkers(map);

    } catch (err) {
      console.error('Leaflet map initialization error:', err);
      setMapError(true);
    }
  };

  const renderMarkers = (map: L.Map) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    filteredChallenges.forEach((ch, idx) => {
      const coords = DISTRICT_COORDINATES[ch.district] || [23.6102 + (idx * 0.05), 85.2799 + (idx * 0.05)];

      const isCritical = ch.urgency === 'CRITICAL';
      const isHigh = ch.urgency === 'HIGH';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${isCritical ? '#DC2626' : isHigh ? '#F59E0B' : '#009E73'};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 11px;
            font-family: 'Poppins', sans-serif;
          ">
            G
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Poppins', sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; color: #009E73; text-transform: uppercase;">${ch.challengeCode} • ${ch.district}</div>
          <div style="font-size: 13px; font-weight: 600; color: #111827; margin-top: 2px;">${ch.title}</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Domain: <b>${ch.domain}</b></div>
          <div style="font-size: 11px; color: #64748B;">Severity: <b style="color: ${isCritical ? '#DC2626' : isHigh ? '#D97706' : '#059669'};">${ch.urgency}</b></div>
          <div style="margin-top: 6px; padding: 2px 6px; background: #ECFDF5; border-radius: 4px; font-size: 10px; font-weight: 600; color: #065F46; text-transform: uppercase; display: inline-block;">
            ${ch.status}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveChallenge(ch);
      });
    });
  };

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      renderMarkers(mapInstanceRef.current);
    }
  }, [selectedDistrict, selectedDomain, selectedSeverity]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto font-sans">
      
      {/* Header Title Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-md uppercase tracking-wider">
              GIS Telemetry Map
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Jharkhand State Innovation Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            Jharkhand Innovation Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geospatial tracking of public challenges, university projects, and corporate CSR deployments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Districts</option>
            {JHARKHAND_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Domains</option>
            {DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* MAP CONTAINER CARD */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        {mapError ? (
          <div className="map-container bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Map could not be loaded</h3>
              <p className="text-xs text-slate-500 mt-1">Please check your network connection or tile provider availability.</p>
            </div>
            <button
              onClick={initMap}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading Map</span>
            </button>
          </div>
        ) : (
          <div className="map-container rounded-lg border border-slate-200 overflow-hidden shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-10" />
          </div>
        )}

        {/* SELECTED CHALLENGE POPUP SUMMARY */}
        {activeChallenge && (
          <div className="p-4 bg-emerald-50/90 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">{activeChallenge.challengeCode}</span>
                <span className="text-xs font-semibold text-emerald-800">{activeChallenge.district} District</span>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-semibold rounded">
                  {activeChallenge.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{activeChallenge.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Domain: <strong>{activeChallenge.domain}</strong> | Urgency: <strong>{activeChallenge.urgency}</strong></p>
            </div>

            <button
              onClick={() => {
                setSelectedChallenge(activeChallenge);
                setActivePage('citizen-track');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-xs shrink-0 flex items-center gap-1.5 transition-all"
            >
              <span>View Challenge Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
