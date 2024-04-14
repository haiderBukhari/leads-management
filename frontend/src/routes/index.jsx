import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Leads from '../pages/Leads';
import LeadsDetail from '../pages/LeadsDetail';
import Login from '../components/Authentication/Login';
import Register from '../components/Authentication/Register';
import ManageUser from '../pages/ManageUser';
const Index = () => {
    const Location = useLocation();
    const isAuth = Location.pathname==='/login' | location.pathname==='/register';
    return (
        <div>
            {!isAuth && <Header/>}
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/manage/users" element={<ManageUser />} />
                <Route path="/LeadManagement" element={<Leads />} />
                <Route path="/LeadManagement/:id" element={<LeadsDetail />} />
            </Routes>
        </div>
    )
}

export default Index