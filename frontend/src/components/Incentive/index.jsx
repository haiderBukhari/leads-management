import { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import IncentiveFilterationDialog from './Dialog';
import { useSelector } from 'react-redux';
import axios from 'axios';
import IncentiveTable from '../IncentiveTable';

const Index = () => {
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const [searchList, setSearchList] = useState([]);
    const [show, setShow] = useState(false);
    const [filteration, setFilteration] = useState({
        name: "",
        segment: '',
        closureDate: null,
        channel: '',
        saleType: '',
    })
    const [fetchData, setFetchData] = useState(false);
    useEffect(()=>{
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
            <div className='mt-3 flex justify-start px-2'>
                <div className='flex items-end h-full py-3 px-2 justify-end'>
                    <button onClick={() => { setOpen(!open); }} className="bg-yellow-600 rounded-md text-white py-[0] px-3 h-[30px]"><AddIcon className="px-1" /> Advance Filters</button>
                </div>
            </div>
            <div className='flex justify-between items-end'>
                <div className="w-full flex items-center bg-white py-3 px-2">
                    <div>
                        <p className="text-sm mb-1">Lead Name/ID</p>
                        <div className='flex items-center'>
                            <PersonIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <input type='text' placeholder='Select Lead' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} value={searchTerm} onChange={handleSearchInputChange}
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
                    <div className='ml-8 flex-1'>
                        <p className="text-sm mb-1">Segment</p>
                        <div className='flex items-center'>
                            <LocationOnIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <select onChange={(e)=>{setFilteration({...filteration, segment: e.target.value})}} type='text' placeholder='Select Segment' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} >
                                <option value='' selected disabled>Select Segment</option>
                                <option value="Primary">Primary</option>
                                <option value="Secondary">Secondary</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <p className="text-sm mb-1">Deal Closure Date</p>
                        <div className='flex items-center'>
                            <input onChange={(e)=>{setFilteration({...filteration, closureDate: e.target.value})}} type='date' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <p className="text-sm mb-1">Channel</p>
                        <div className='flex items-center'>
                            <LocationOnIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <select onChange={(e)=>{setFilteration({...filteration, channel: e.target.value})}} type='text' placeholder='Select Channel' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} >
                                <option value="" selected disabled>Select Channel</option>
                                <option value="Direct">Direct</option>
                                <option value="Other Brokerage">Other Brokerage</option>
                                <option value="Referral">Referral</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <p className="text-sm mb-1">Sale Type</p>
                        <div className='flex items-center'>
                            <LocationOnIcon className="px-1 py-1 bg-gray-300 text-gray-700" style={{ border: "1px solid #ccc" }} />
                            <select onChange={(e)=>{setFilteration({...filteration, saleType: e.target.value})}} type='text' placeholder='Select Sale Type' className="text-sm placeholder:px-1 outline-none text-gray-700 w-[150px]" style={{ border: "1px solid #ccc", padding: "1px 5px" }} >
                                <option value="" selected disabled>Select Sale Type</option>
                                <option value="Self">Self</option>
                                <option value="Assisted By Leader">Assisted By Leader</option>
                            </select>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='flex items-end h-full py-3 px-2'>
                    <button onClick={()=>{
                        if(show){
                            setFetchData(!fetchData)
                        }else{
                            setShow(!show); 
                        }
                    }} className="bg-blue-600 rounded-md text-white py-[0] px-3 h-[30px]">Filter</button>
                </div>
            </div>
            <IncentiveFilterationDialog open={open} setOpen={setOpen} show={show} setShow={setShow} />
            { show && <IncentiveTable filteration={filteration} fetchData={fetchData} setFetchData={setFetchData}/> }
        </div>
    )
}

export default Index