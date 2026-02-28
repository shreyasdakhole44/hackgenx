import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CityPulse from './pages/CityPulse';
import CorporationLogin from './pages/CorporationLogin';
import CorporationPortal from './pages/CorporationPortal';
import UrbanSeva from './pages/UrbanSeva';

// Seva Detail Pages
import Hospitals from './pages/seva/Hospitals';
import GrievanceRedressal from './pages/seva/GrievanceRedressal';
import GarbageCollection from './pages/seva/GarbageCollection';
import TheaterArt from './pages/seva/TheaterArt';
import Crematoriums from './pages/seva/Crematoriums';
import TransparencyPortal from './pages/TransparencyPortal';
import PropertyTax from './pages/seva/PropertyTax';
import PublicTransport from './pages/seva/PublicTransport';
import Recruitment from './pages/seva/Recruitment';
import Gardens from './pages/seva/Gardens';
import HelpContact from './pages/HelpContact';
import EmergencyPortal from './pages/EmergencyPortal';
import WorkerPortal from './pages/WorkerPortal';
import RewardRedemption from './pages/RewardRedemption';

import Navbar from './components/Navbar';
import FloatingAnnouncement from './components/FloatingAnnouncement';
import axios from 'axios';
import { API_BASE_URL } from './config';

// Set the global API URL
axios.defaults.baseURL = API_BASE_URL;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/city-pulse" element={<CityPulse />} />
          <Route path="/corp-login" element={<CorporationLogin />} />
          <Route path="/corp-portal" element={<CorporationPortal />} />
          <Route path="/urban-seva" element={<UrbanSeva />} />
          <Route path="/urban-seva/hospitals" element={<Hospitals />} />
          <Route path="/urban-seva/grievance" element={<GrievanceRedressal />} />
          <Route path="/urban-seva/garbage" element={<GarbageCollection />} />
          <Route path="/urban-seva/theater-art" element={<TheaterArt />} />
          <Route path="/urban-seva/crematoriums" element={<Crematoriums />} />
          <Route path="/transparency-portal" element={<TransparencyPortal />} />
          <Route path="/urban-seva/property-tax" element={<PropertyTax />} />
          <Route path="/urban-seva/transport" element={<PublicTransport />} />
          <Route path="/urban-seva/recruitment" element={<Recruitment />} />
          <Route path="/urban-seva/gardens" element={<Gardens />} />
          <Route path="/help-contact" element={<HelpContact />} />
          <Route path="/emergency-portal" element={<EmergencyPortal />} />
          <Route path="/worker-portal" element={<WorkerPortal />} />
          <Route path="/reward-redemption/:id" element={<RewardRedemption />} />
        </Routes>
        <FloatingAnnouncement />
      </div>
    </Router>

  );
}


export default App;
