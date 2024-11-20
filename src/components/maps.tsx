import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dashboardData from "../data/dashboard.json";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const BranchMap = () => {
  const branches = dashboardData.branchData;

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[-7.5, 112.5]}
        zoom={7}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {branches.map((branch, index) => (
          <Marker
            key={index}
            position={[branch.latitude, branch.longitude]} // Use latitude and longitude
            title={branch.nama_cabang} // Tooltip title
          >
            <Popup>
              <b>{branch.nama_cabang}</b>
              <br />
              Latitude: {branch.latitude}
              <br />
              Longitude: {branch.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BranchMap;
