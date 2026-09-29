import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Report from '@/pages/Report';
import Confirm from '@/pages/Confirm';
import Status from '@/pages/Status';
import OfficeDashboard from '@/pages/OfficeDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/status/:complaintId" element={<Status />} />
        <Route path="/office" element={<OfficeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
