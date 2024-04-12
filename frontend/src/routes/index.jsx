import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/Header';
import Leads from '../pages/Leads';
import LeadsDetail from '../pages/LeadsDetail';
const index = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<Leads />} />
                <Route path="/LeadManagement/:id" element={<LeadsDetail />} />
            </Routes>
        </div>
    )
}

export default index
