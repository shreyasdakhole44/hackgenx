/**
 * Urban Pulse Configuration
 * 
 * Update 'PRODUCTION_BACKEND_URL' when you host your backend on Render/Railway.
 * Update 'LOCAL_IP' to your computer's IP (e.g., 192.168.1.5) to test on a physical Android phone.
 */

const isProd = import.meta.env.PROD;
const LOCAL_IP = '10.31.187.240'; // Updated to your current laptop IP for Android testing

// 1. URL for the hosted backend (e.g., Render, Railway)
const PRODUCTION_BACKEND_URL = 'https://urban-pulse-backend.onrender.com';

// 2. Base URL for API calls
export const API_BASE_URL = isProd
    ? '' // In production, we'll use Netlify redirects/proxies defined in netlify.toml
    : `http://${LOCAL_IP}:5003`; // local dev environment uses port 5003

// 3. URL for Socket.io (Heatmap data)
export const SOCKET_URL = isProd
    ? PRODUCTION_BACKEND_URL
    : `http://${LOCAL_IP}:5003`; // same as backend port

console.log(`🚀 System Mode: ${isProd ? 'Production' : 'Development'}`);
console.log(`🔗 API Base: ${API_BASE_URL || 'Netlify-Proxy'}`);
console.log(`🔌 Socket Path: ${SOCKET_URL}`);
