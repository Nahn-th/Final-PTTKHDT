import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. LOGIN ---
import Login from './pages/Login/Login.jsx';

// --- 2. SINH VIÊN (Student) ---
import SVMain from './pages/SinhVien/SV_main.jsx';
import DKMonTH from './pages/SinhVien/DK_monTH.jsx';
import LichTH from './pages/SinhVien/LichTH.jsx';

// --- 3. GIẢNG VIÊN (Instructor) ---
import CBGD_main from './pages/CanBoGiangDay/CBGD_main.jsx';
import DiemDanhSV from './pages/CanBoGiangDay/DiemDanhSV.jsx';
import XemLichTH from './pages/CanBoGiangDay/XemLichTH.jsx';

// --- 4. CÁN BỘ PHỤ TRÁCH (Lab Assistant) ---
import CBPT_main from './pages/CanBoPhuTrach/CBPT_main.jsx';
import BoTriViTriNgoi from './pages/CanBoPhuTrach/BoTriViTriNgoi.jsx';
import CapNhatCamThi from './pages/CanBoPhuTrach/CapNhatCamThi.jsx';
import XemLichThucHanh from './pages/CanBoPhuTrach/XemLichThucHanh.jsx';

// --- 5. GIÁO VỤ (Academic Affairs) ---
import GV_main from './pages/GiaoVu/GV_main.jsx';
import BaoCaoCK from './pages/GiaoVu/BaoCaoCuoiKy.jsx';
import CongBoLichTH from './pages/GiaoVu/CongBoLichTH.jsx';
import PhanChiaCB from './pages/GiaoVu/PhanChiaCanBo.jsx';
import PhanNhomTH from './pages/GiaoVu/PhanNhomTH.jsx';
import XemLichNhomTH from './pages/GiaoVu/XemLichNhomTH.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === MÀN HÌNH ĐĂNG NHẬP (Mặc định) === */}
        <Route path="/" element={<Login />} />

        {/* === ROUTE CHO SINH VIÊN === */}
        <Route path="/student" element={<SVMain />} />
        <Route path="/student/schedule" element={<LichTH />} />
        <Route path="/student/register" element={<DKMonTH />} />

        {/* === ROUTE CHO GIẢNG VIÊN === */}
        <Route path="/instructor" element={<CBGD_main />} />
        <Route path="/instructor/schedule" element={<XemLichTH />} />
        <Route path="/instructor/attendance" element={<DiemDanhSV />} />

        {/* === ROUTE CHO CÁN BỘ PHÒNG MÁY === */}
        <Route path="/lab-assistant" element={<CBPT_main />} />
        <Route path="/lab-assistant/schedule" element={<XemLichThucHanh />} />
        <Route path="/lab-assistant/assign-seats" element={<BoTriViTriNgoi />} />
        <Route path="/lab-assistant/exam-ban" element={<CapNhatCamThi />} />
        <Route path="/lab-assistant/attendance" element={<DiemDanhSV />} /> {/* Tái sử dụng màn hình điểm danh */}

        {/* === ROUTE CHO GIÁO VỤ === */}
        <Route path="/academic-affairs" element={<GV_main />} />
        <Route path="/academic-affairs/report" element={<BaoCaoCK />} />
        <Route path="/academic-affairs/publish-schedule" element={<CongBoLichTH />} />
        <Route path="/academic-affairs/assign-instructor" element={<PhanChiaCB />} />
        <Route path="/academic-affairs/group-assign" element={<PhanNhomTH />} />
        <Route path="/academic-affairs/view-schedule" element={<XemLichNhomTH />} />

        {/* Nếu người dùng nhập sai link, tự động quay về trang Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
