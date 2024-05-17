import { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductivityTable from '../ProductivityTable';
import PerformanceTable from './PerformanceTable';

const Index = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const [searchList, setSearchList] = useState([]);
    const [change, setChange] = useState(true);
    const [show, setShow] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/register/employee/name?name=${searchTerm || ""}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                }).then((response) => {
                    const res = response.data.map(Item => Item.name)
                    setSearchList(res)
                })
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [searchTerm])
    const filterResult = (search, show) => {
        console.log(searchList);
        const filtered = searchList && searchList?.filter(option =>
            option.toLowerCase().includes(search.toLowerCase())
        )
        if (show) {
            setShowOptions(search !== '');
        }
        setFilteredOptions(filtered || []);
    }

    const handleSearchInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue); // Show options only if input value is not empty
        filterResult(inputValue, true)
    };

    const handleOptionClick = (option) => {
        setSearchTerm(option);
        setShowOptions(false);
        setFilteredOptions([]);
    }

    return (
        <div className="w-full bg-white pb-5 px-2" style={{ borderTop: "2px solid blue" }}>
            <div className='flex flex-col md:flex-row justify-between items-end'>
                <div className="w-full flex flex-wrap flex-col md:flex-row justify-start md:justify-between md:items-center bg-center py-3 px-2 mx-8">
                    <div className='mt-4'>
                        <button className={`shadow-md py-[0] px-3 h-[30px]`} style={{ border: '1px solid #ccc' }}>Exit</button>
                        <button onClick={() => { setChange(!change) }} className={`${change ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'} shadow-md  py-[0] px-3 h-[30px]`}>Yes</button>
                        <button onClick={() => { setChange(!change) }} className={`${change ? 'bg-gray-300 text-black' : 'bg-green-600 text-white'} shadow-sm text-black py-[0] px-3 h-[30px]`}>No</button>
                    </div>
                    <div>
                        <p className="text-sm mb-1">Employee Name/Code</p>
                        <div className='flex justify-center relative h-full w-full'>
                            <PersonIcon className="px-2 py-1 bg-gray-300 text-gray-700 h-[90px]" style={{ border: "1px solid #ccc", height: "35px", width: "35px" }} />
                            <input type='text' placeholder='Select Employee' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[300px] h-[35px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} value={searchTerm} onChange={handleSearchInputChange} />
                            {showOptions && (
                                <ul
                                    className="options-list absolute bg-white w-[335px] max-h-[200px] overflow-auto px-2"
                                    style={{ border: "1px solid #ccc", zIndex: 1000, boxShadow: "2px 2px 6px #ccc -2px -2px 10px #ccc", top: "34px" }}
                                >
                                    {filteredOptions.map((option) => (
                                        <li
                                            key={option}
                                            className="cursor-default hover:opacity-60"
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className='mx-8'>
                        <p className="text-sm mb-1">STS ID</p>
                        <input type='text' disabled className="text-sm placeholder:px-1 outline-none text-gray-700 w-[300px] h-[35px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                    </div>

                    {/* <div className='mx-8'>
                        <p className="text-sm mb-1">Date</p>
                        <div className='flex items-center'>
                            <input type='date' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[200px] h-[35px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                            <button className="bg-gray-300 text-gray-700 px-3 py-[0.8px] h-[35px]">To</button>
                            <input type='date' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[200px] h-[35px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                        </div>
                    </div> */}
                    <div>
                    </div>
                </div>
                <div className='flex items-end h-full py-3 px-2'>
                    <button onClick={() => { setShow(!show) }} className="bg-blue-600 rounded-md text-white py-[0] px-3 h-[30px]">Filter</button>
                </div>
            </div>
            {show && <PerformanceTable />}
        </div>
    )
}

export default Index