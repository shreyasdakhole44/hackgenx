import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Thermometer, Radio, Navigation, Crosshair, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { SOCKET_URL } from '../config';

// Master Coordinate Baseline - Amravati, Maharashtra
const AMRAVATI_CENTER = [20.9320, 77.7523];

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Auto-Center Bounds Component
const FitBounds = ({ nodes }) => {
    const map = useMap();
    useEffect(() => {
        if (nodes && nodes.length > 0) {
            const bounds = L.latLngBounds(nodes
                .filter(n => n.latitude && n.longitude)
                .map(n => [Number(n.latitude), Number(n.longitude)])
            );
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [nodes, map]);
    return null;
};

// Refresh Center Component for smooth-panning
const RefreshCenter = ({ center, zoom = 14 }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

// GPS Locator Logic Component
const MapController = ({ setUserLocation, setLatestNode }) => {
    const map = useMap();

    // Function to handle location finding
    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 16 });
    };

    useEffect(() => {
        // Only set initial view if no grievances exist yet
        // If they exist, FitBounds will handle the framing

        map.on('locationfound', (e) => {
            setUserLocation([e.latitude, e.longitude]);
            setLatestNode([e.latitude, e.longitude]);
        });

        map.on('locationerror', (e) => {
            console.error("GPS Location Error:", e.message);
            alert("Could not access your location. Please check browser permissions.");
        });
    }, [map, setUserLocation, setLatestNode]);

    return (
        <div className="absolute top-24 left-6 z-999">
            <button
                onClick={handleLocate}
                className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-pmc-accent hover:bg-pmc-accent hover:text-white transition-all shadow-xl group"
                title="Locate My Position"
            >
                <Crosshair size={20} className="group-active:scale-90 transition-transform" />
            </button>
        </div>
    );
};

const CityPulseHeatmap = ({ data: initialData = [], height = "600px" }) => {
    const [grievances, setGrievances] = useState(initialData);
    const [latestNode, setLatestNode] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [connected, setConnected] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const socketRef = useRef();

    // Invalidate map size on fullscreen toggle
    const FullscreenController = () => {
        const map = useMap();
        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 300);
        }, [isFullscreen, map]);
        return null;
    };

    useEffect(() => {
        // Initialize Socket.io
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('🔗 Connected to CityPulse Heatmap Relay');
            setConnected(true);
        });

        socketRef.current.on('newGrievance', (newGrievance) => {
            console.log('🎯 New Crisis Node Detected:', newGrievance);
            setGrievances(prev => [newGrievance, ...prev]);

            // Universal Auto-Pan: Fly to the new hotspot regardless of location
            if (newGrievance.latitude && newGrievance.longitude) {
                setLatestNode([Number(newGrievance.latitude), Number(newGrievance.longitude)]);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Sync initial data if it changes & Log for debugging
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            console.log("📍 Heatmap Data Received:", initialData);
            setGrievances(initialData);
        }
    }, [initialData]);

    const getHeatStyle = (status) => {
        // User Requested Status Mapping:
        // 'Pending' -> 'red'
        // 'In-Progress' -> 'yellow'
        // 'Resolved' -> 'green'

        const s = status || 'Reported';

        // 🟢 Resolved: Resolved, Archived, Blockchain Verified
        if (['Resolved', 'Archived', 'Blockchain Verified'].includes(s)) {
            return { color: '#22c55e', size: 8, label: 'Resolved', pulse: false };
        }

        // 🟡 In-Progress: Worker Assigned, Work Under Review, In-Progress
        if (['Worker Assigned', 'Work Under Review', 'In-Progress'].includes(s)) {
            return { color: '#eab308', size: 10, label: 'In-Progress', pulse: false };
        }

        // 🔴 Pending: Reported, AI Classified, Pending Verification, Pending
        return { color: '#ef4444', size: 16, label: 'Pending', pulse: true };
    };

    return (
        <div
            className={`relative border border-slate-200 overflow-hidden shadow-2xl bg-white isolate transition-all duration-500 ease-in-out ${isFullscreen
                ? 'fixed inset-0 z-9999 rounded-0'
                : 'rounded-[2.5rem]'
                }`}
            style={{ height: isFullscreen ? '100vh' : height, width: isFullscreen ? '100vw' : '100%' }}
        >
            {/* Fullscreen Toggle Button */}
            <div className="absolute top-6 right-6 z-10000">
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-pmc-blue hover:bg-pmc-blue hover:text-white transition-all shadow-xl flex items-center gap-2 group"
                >
                    {isFullscreen ? (
                        <>
                            <Minimize2 size={18} className="group-active:scale-95 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Minimize</span>
                        </>
                    ) : (
                        <>
                            <Maximize2 size={18} className="group-active:scale-95 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Maximize</span>
                        </>
                    )}
                </button>
            </div>

            {/* Connection Status Indicator */}
            <div className="absolute top-6 left-6 z-999 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                    {connected ? 'Neural Bridge Active' : 'Connecting...'}
                </span>
            </div>

            <MapContainer
                center={AMRAVATI_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <FitBounds nodes={grievances} />
                <RefreshCenter center={latestNode} />

                <FullscreenController />
                <MapController setUserLocation={setUserLocation} setLatestNode={setLatestNode} />

                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>
                            <div className="text-[10px] font-black uppercase text-pmc-blue">Your Location</div>
                        </Popup>
                    </Marker>
                )}

                {grievances.map((node) => {
                    const lat = Number(node.latitude);
                    const lng = Number(node.longitude);

                    if (!lat || !lng) return null;
                    const style = getHeatStyle(node.status);

                    return (
                        <CircleMarker
                            key={node._id || node.grievanceId}
                            center={[lat, lng]}
                            radius={style.size}
                            pathOptions={{
                                fillColor: style.color,
                                fillOpacity: 0.8,
                                color: 'white',
                                weight: 2,
                                className: style.pulse ? 'animate-pulse' : ''
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="p-4 bg-white/95 text-slate-800 rounded-2xl border border-slate-200 shadow-2xl backdrop-blur-xl min-w-[200px]">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-slate-100`} style={{ color: style.color }}>
                                            {style.label}
                                        </span>
                                        <span className="text-[8px] text-slate-400 font-black">#{node.grievanceId}</span>
                                    </div>
                                    <h4 className="font-black text-sm mb-1 text-pmc-blue">{node.category}</h4>
                                    <p className="text-[10px] text-slate-500 mb-3 leading-relaxed font-medium">{node.description}</p>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-[8px] font-black text-pmc-accent uppercase tracking-widest">
                                            <Zap size={10} /> AI Analysis Verified
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{node.status}</div>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-8 right-8 z-999 space-y-3 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-xl max-sm:scale-75 max-sm:origin-bottom-right">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Radio size={12} className="text-pmc-blue" /> Pulse Intensity
                </h5>
                {[
                    { color: '#ef4444', label: 'Pending', desc: 'Awaiting Action' },
                    { color: '#eab308', label: 'In-Progress', desc: 'Work in Movement' },
                    { color: '#22c55e', label: 'Resolved', desc: 'Verified Resolution' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm ${item.label === 'Pending' ? 'animate-pulse' : ''}`} style={{ backgroundColor: item.color }} />
                        <div>
                            <p className="text-[9px] font-black text-slate-700 tracking-widest uppercase">{item.label}</p>
                            <p className="text-[8px] font-bold text-slate-400">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .leaflet-popup-tip {
                    background: white !important;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .leaflet-container {
                    background: #f8fafc !important;
                }
                .glass-popup .leaflet-popup-content {
                    margin: 0 !important;
                    width: auto !important;
                }
                @keyframes pulse-custom {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .animate-pulse {
                    animation: pulse-custom 2s infinite ease-in-out;
                }
            `}} />
        </div>
    );
};

export default CityPulseHeatmap;
