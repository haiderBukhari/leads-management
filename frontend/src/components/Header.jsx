import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/features/AuthenticationSlice';

const Header = () => {
    const Navigate = useNavigate();
    const disptch = useDispatch();
    const userDetails = useSelector((state) => state.authentication);
    const data = useSelector((state) => state.authentication);
    return (
        <div className="h-[60px] w-full bg-gray-800 flex justify-between items-center">
            <div className="px-4 py-2 w-full flex justify-between items-center relative">
                <img className="h-[40px] mr-4" src='/assets/logo.png' alt="Logo" />
                <div className="relative flex w-full justify-end">
                    <Link to="/incentive" className='text-white mr-3'>Incentive Dashboard</Link>
                    <Link to="/productivty" className='text-white mr-3'>Productivity Dashboard</Link>
                    <Link to="/LeadManagement" className='text-white mr-3'>Leads Dashboard</Link>
                    <div style={{borderRight: "1px solid #ccc"}} className='mx-4'></div>
                    <div className="group">
                        <PersonOutlineOutlinedIcon className="h-8 w-8 rounded-full cursor-pointer text-white" style={{ borderRadius: "50%", border: "1px solid #ccc", padding: "1px" }} />
                        <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-white shadow-md rounded-md py-2 z-10">
                            <div className="px-4 py-2">
                                <p className="text-gray-700">Name: {userDetails.name}</p>
                                <p className="text-gray-700">Status: Active</p>
                            </div>
                            <hr className="my-1" />
                            {
                                !data.isEmployee && <Link to="/manage/users" className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none">
                                Manage User
                            </Link>
                            }
                            <div onClick={()=>{
                                disptch(logoutUser());
                                Navigate('/')
                            }} className="cursor-pointer block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none">
                                Logout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
//<p className="text-gray-700">Email: {userDetails.email}</p>
