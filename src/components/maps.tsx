import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Branch {
  nama_cabang: string;
  latitude: number;
  longitude: number;
}

interface BranchMapProps {
  data: Branch[];
  isDark: boolean;
}

export const BranchMap: React.FC<BranchMapProps> = ({ data, isDark }) => {
  useEffect(() => {
    // Force a resize event after component mounts to ensure map renders correctly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[-7.5575, 112.127521]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        className={`${isDark ? 'map-dark' : ''} z-0`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        {data.map((branch, index) => (
          <Marker
            key={index}
            position={[branch.latitude, branch.longitude]}
          >
            <Popup>
              <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {branch.nama_cabang}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};