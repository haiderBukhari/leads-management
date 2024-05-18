import { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import ProductivityDialog from './Dialog';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductivityTable from '../ProductivityTable';

const Index = () => {
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const [searchList, setSearchList] = useState([]);
    const [show, setShow] = useState(true);
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
            <div className='mt-3 flex justify-between px-2'>
                <div>
                    <button onClick={() => { setChange(!change) }} className={`${change ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'} shadow-md  py-[0] px-3 h-[30px]`}>FOS</button>
                    <button onClick={() => { setChange(!change) }} className={`${change ? 'bg-gray-300 text-black' : 'bg-green-600 text-white'} shadow-sm text-black py-[0] px-3 h-[30px]`}>Leader</button>
                </div>
                <div className='flex items-end h-full py-3 px-2 justify-end'>
                    <button onClick={() => { setOpen(!open); }} className="bg-yellow-600 rounded-md text-white py-[0] px-3 h-[30px]"><AddIcon className="px-1" /> Columns</button>
                </div>
            </div>
            <div className='flex flex-col md:flex-row justify-start md:justify-between items-end'>
                <div className="w-full flex md:items-center flex-col md:flex-row flex-wrap bg-white mr-2 md:mr-0 py-3 px-2">
                    <div>
                        <p className="text-sm mb-1">Employee Name/Code</p>
                        <div className='flex items-center mr-8'>
                            <PersonIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <input type='text' placeholder='Select Employee' className="text-sm placeholder:px-1 outline-none text-gray-700 w-full md:w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} value={searchTerm} onChange={handleSearchInputChange}
                            />
                            {showOptions && (
                                <ul
                                    className="options-list absolute bg-white w-[174px] max-h-[200px] overflow-auto px-2"
                                    style={{ border: "1px solid #ccc", zIndex: 1000, boxShadow: "2px 2px 6px #ccc -2px -2px 10px #ccc", top: "45.6%" }}
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
                    <div className='md:mx-8 mr-8 mt-3 md:mt-0 '>
                        <p className="text-sm mb-1">Lead Type</p>
                        <div className='flex items-center'>
                            <LocationOnIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <select type='text' placeholder='Select Employee' className="text-sm placeholder:px-1 outline-none text-gray-700 w-full md:w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} >
                                <option selected disabled>Select Lead Type</option>
                                <option value="Hot">Hot</option>
                                <option value="Cold">Cold</option>
                                <option value="Warm">Warm</option>
                            </select>
                        </div>
                    </div>
                    <div className='mr-8 mt-2 md:mt-0'>
                        <p className="text-sm mb-1">Date</p>
                        <div className='flex items-center'>
                            <input type='date' className="text-sm placeholder:px-1 outline-none text-gray-700 w-full md:w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                            <button className="bg-gray-300 text-gray-700 px-3 py-[0.8px]">To</button>
                            <input type='date' className="text-sm placeholder:px-1 outline-none text-gray-700 w-full md:w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                        </div>
                    </div>
                    <div className='mr-8 flex-1 mt-2 md:mt-0'>
                        <p className="text-sm mb-1">Presets</p>
                        <select type='text' placeholder='Select Employee' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[100%]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} >
                            <option selected disabled>Presets</option>
                        </select>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='h-full py-3 px-2 w-full md:w-auto md:w-2'>
                    <button className="bg-blue-600 rounded-md text-white py-[0] px-3 h-[30px]">Filter</button>
                </div>
            </div>
            <ProductivityDialog open={open} setOpen={setOpen} show={show} setShow={setShow} />
            {show && <ProductivityTable />}
        </div>
    )
}

export default Index