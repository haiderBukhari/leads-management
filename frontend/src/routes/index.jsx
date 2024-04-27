import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Leads from '../pages/Leads';
import LeadsDetail from '../pages/LeadsDetail';
import Login from '../components/Authentication/Login';
import Register from '../components/Authentication/Register';
import ManageUser from '../pages/ManageUser';
import { useSelector } from 'react-redux';
import ProductivityDashboard from '../pages/ProductivityDashboard';
import IncentiveDashboard from '../pages/IncentiveDashboard';
const Index = () => {
    const Location = useLocation();
    const isAuth = Location.pathname==='/login' | location.pathname==='/register';
    // const data = useSelector((state) => state?.authentication);
    return (
        <div>
            {!isAuth && <Header/>}
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/manage/users" element={<ManageUser />} />
                <Route path="/LeadManagement" element={<Leads/>} />
                <Route path="/LeadManagement/:id" element={<LeadsDetail/>} />
                <Route path="/productivty" element={<ProductivityDashboard/>} />
                <Route path="/incentive" element={<IncentiveDashboard/>} />
                {/* <Route path="/login" element={data.jwtToken ? <Login /> : <Navigate to="/LeadManagement"/>} /> */}
                {/* <Route path="/register" element={data.jwtToken ? <Register /> : <Navigate to="/LeadManagement"/>} /> */}
                {/* <Route path="/LeadManagement" element={data.jwtToken ? <Leads /> : <Navigate to="/login"/>} /> */}
                {/* <Route path="/LeadManagement/:id" element={data.jwtToken ? <LeadsDetail /> : <Navigate to="/login"/>} /> */}
            </Routes>
        </div>
    )
}

export default Index