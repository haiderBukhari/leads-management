import { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AttachEmailOutlinedIcon from '@mui/icons-material/AttachEmailOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useParams } from "react-router-dom"
import NotesIcon from '@mui/icons-material/Notes';
import axios from 'axios';
import NoteDialog from '../components/LeadsDetails/NotesDialog';
import { useSelector } from 'react-redux';
import { failedToast, successToast } from '../utils/ToastsNotifications';
import ActivityDialog from '../components/CreateActivity';

const LeadsDetail = () => {
    const [showProperties, setShowProperties] = useState(true);
    const [leadsData, setLeadData] = useState({});
    const [selectedData, setSelectedData] = useState(0);
    const [addNote, setAddNote] = useState(false);
    const [addActivity, setAddActivity] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [editMode, setEditMode] = useState(false);
    let { id } = useParams();
    const [data, setData] = useState([]);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const uploadedFile = event.target.files[0];

        const formData = new FormData();
        formData.append('file', uploadedFile);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/leads/update/document/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(() => {
                successToast('Document Uploaded!')
                setFetchData(!fetchData)
            })
        } catch (error) {
            failedToast(error?.response?.data?.message)
        }
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads/get/${id}`)
            .then(response => {
                const dataFromBackend = response.data;
                console.log(dataFromBackend)
                setLeadData(dataFromBackend)
                setData([
                    { "Name": dataFromBackend.name },
                    { "Owner": dataFromBackend.employeeName ? dataFromBackend.employeeName : dataFromBackend.managerName ? dataFromBackend.managerName : dataFromBackend.generalManagerName },
                    { "Email": dataFromBackend.email },
                    { "Phone number": dataFromBackend.phone },
                    { "Project Interested In": dataFromBackend.interestedProjects },
                    { "Budget": dataFromBackend.bugdet },
                    { "Address": dataFromBackend.address },
                    { "Meeting Date": dataFromBackend.meetingDate },
                    { "Meeting Time": dataFromBackend.meetingTime },
                    { "Lead Score": dataFromBackend.leadScore },
                    { "Lead Source": dataFromBackend.source },
                ])
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [fetchData]);


    const updatedData = async () => {
        console.log(data)
        await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/leads/update/${id}`, {
            name: data[0]['Name'],
            email: data[2]["Email"],
            phone: data[3]["Phone number"],
            interestedProjects: data[4]["Project Interested In"],
            bugdet: data[5]["Budget"],
            address: data[6]["Address"],
            meetingDate: data[7]["Meeting Date"],
            meetingTime: data[8]["Meeting Time"],
            source: data[10]["Lead Source"]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            }
        })
            .then(response => {
                console.log(response.data);
                setFetchData(!fetchData)
                setEditMode(false)
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    }
    return (
        <div className="mt-10 mx-10 mb-10">
            <div>
                <h1 className="text-2xl mb-3">Leads Details</h1>
            </div>
            <hr />
            <div className='flex flex-row'>
                <div className='w-[40%]'>
                    <div className='mt-4 w-full'>
                        <div className="max-w-[370px] w-full px-2 text-black py-4 bg-[#f4f4f4]" style={{ border: "1px solid #ccc" }}>
                            <h1 className='ml-8 mt-2 text-xl'>{leadsData.name}</h1>
                            <h2 className='ml-8 mb-2 italic'>Cold</h2>
                            <div className='flex mt-4'>
                                <EmailIcon />
                                <p className='ml-2 text-sm'>{leadsData.email || '-'}</p>
                            </div>
                            <div className='flex mt-3'>
                                <PhoneIcon />
                                <p className='ml-2 text-sm'>{leadsData.phone}</p>
                            </div>
                            <div className='flex mt-3'>
                                <LocationOnIcon />
                                <p className='ml-2 text-sm'>{leadsData.address}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='mt-10 max-w-[370px] w-full bg-white' style={{ border: "1px solid #ccc" }}>
                            <div className='flex'>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none" }}>
                                    <p className='text-center mt-3 text-lg'>{leadsData.leadScore}</p>
                                    <p className='text-center text-[#000] text-sm'>Lead Score</p>
                                </div>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none" }}>
                                    <p className='text-center mt-3 text-lg text-red-500'>{leadsData.source}</p>
                                    <p className='text-center text-[#000] text-sm'>Lead Source</p>
                                </div>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none", borderRight: "none" }}>
                                    <p className='text-center mt-3 text-lg'>{leadsData.bugdet || '-'}</p>
                                    <p className='text-center text-[#000] text-sm'>Bugdet</p>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between mt-2 mb-3 px-2 items-center'>
                                    <div className='flex'>
                                        {
                                            showProperties ? <KeyboardArrowUpIcon onClick={() => { setShowProperties(!showProperties) }} className='cursor-pointer' /> : <KeyboardArrowDownIcon onClick={() => { setShowProperties(!showProperties) }} className='cursor-pointer' />
                                        }
                                        <p className='text-black text-sm font-semibold'>Lead Properties</p>
                                    </div>
                                    <EditIcon onClick={() => { setEditMode(!editMode) }} style={{ fontSize: "17px" }} className='cursor-pointer' />
                                </div>
                                {
                                    showProperties &&
                                    <div className='flex flex-col'>
                                        {
                                            data.map((item, index) => (
                                                <div className='flex' key={item.key ?? index}>
                                                    {Object.keys(item).map((key, idx) => (
                                                        <div key={idx} className='flex my-2 w-full mx-2'>
                                                            <p className='ml-2 w-[70%] text-sm'>{key}:</p>
                                                            {editMode ? (
                                                                <input
                                                                    onChange={(e) => {
                                                                        const newData = [...data];
                                                                        newData[index][key] = e.target.value;
                                                                        setData(newData);
                                                                        (e.target.value);
                                                                    }}
                                                                    type='text'
                                                                    className='ml-2 w-[50%] text-sm outline-none'
                                                                    style={{ border: "1px solid #ccc", padding: "0 5px", outline: "none", borderRadius: "3px" }}
                                                                    placeholder={item[key]}
                                                                    value={item[key]}
                                                                    disabled={key === 'Lead Score' || key === 'Owner'}
                                                                />
                                                            ) : (
                                                                <p className='ml-2 w-[50%] text-sm text-center' style={{ wordWrap: 'break-word' }}>{item[key]}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        }

                                        {
                                            editMode && <div className='flex justify-center mb-4'>
                                                <button className='bg-red-500 text-white rounded-lg py-1 px-7 mx-2 mt-3' onClick={() => {
                                                    setEditMode(!editMode)
                                                    setFetchData(!fetchData)
                                                }}>Cancel</button>
                                                <button className='bg-blue-500 text-white rounded-lg py-1 px-7 mx-2 mt-3' onClick={updatedData}>Save</button>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full ml-4'>
                    <div className='w-full bg-[#f4f4f4] text-black flex items-center mt-4 h-[100px]' style={{ border: "1px solid #ccc" }}>
                        <div className='w-full flex items-center mx-6'>
                            <div onClick={()=>{setAddActivity(!addActivity)}} className="flex items-center p-3 w-[auto] mx-3 text-black hover:opacity-50 cursor-pointer" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <LocalActivityOutlinedIcon className="mx-2" />
                                Activity
                            </div>
                            <div onClick={() => { setAddNote(!addNote) }} className="text-black flex items-center p-3 w-[auto] mx-3 cursor-pointer hover:opacity-50" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <EditNoteOutlinedIcon className="mx-2" />
                                Note
                            </div>
                            <div className="text-black flex items-center p-3 w-[auto] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AssignmentOutlinedIcon className="mx-2" />
                                Task
                            </div>
                            <div className="text-black flex items-center p-3 w-[auto] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AttachEmailOutlinedIcon className="mx-2" />
                                Email
                            </div>
                            <div className="text-black flex items-center p-3 w-[auto] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AttachEmailOutlinedIcon className="mx-2" />
                                Call
                            </div>
                        </div>
                    </div>
                    <div className='flex h-[auto] justify-between mt-4 px-5 pt-3 cursor-pointer'>
                        <div onClick={() => { setSelectedData(0) }} className={`pb-3 ${selectedData === 0 && 'border-b-2 border-[#0000ff] border-solid'}`}>Activity History</div>
                        {/* <div onClick={() => { setSelectedData(1) }} className={`pb-3 ${selectedData === 1 && 'border-b-2 border-[#0000ff] border-solid'}`}>Leads Details</div> */}
                        <div onClick={() => { setSelectedData(1) }} className={`pb-3 ${selectedData === 1 && 'border-b-2 border-[#0000ff] border-solid'}`}>Task</div>
                        <div onClick={() => { setSelectedData(2) }} className={`pb-3 ${selectedData === 2 && 'border-b-2 border-[#0000ff] border-solid'}`}>Payment Activities</div>
                        {/* <div onClick={() => { setSelectedData(4) }} className={`pb-3 ${selectedData === 4 && 'border-b-2 border-[#0000ff] border-solid'}`}>User Onboarding</div> */}
                        <div onClick={() => { setSelectedData(3) }} className={`pb-3 ${selectedData === 3 && 'border-b-2 border-[#0000ff] border-solid'}`}>Notes</div>
                        <div onClick={() => { setSelectedData(4) }} className={`pb-3 ${selectedData === 4 && 'border-b-2 border-[#0000ff] border-solid'}`}>Documents</div>
                    </div>
                    <div className='bg-gray-200 w-full h-auto px-5 pt-4 mb-10 pb-10'>
                        {selectedData === 0 &&
                            leadsData?.leadStatus?.map((Item) => {
                                const itemDate = new Date(Item.date);
                                const today = new Date();
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);

                                let dateString;
                                if (itemDate.toDateString() === today.toDateString()) {
                                    dateString = 'Today';
                                } else if (itemDate.toDateString() === yesterday.toDateString()) {
                                    dateString = 'Yesterday';
                                } else {
                                    dateString = itemDate.toLocaleDateString();
                                }

                                return (
                                    <div key={Item.date} className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                                        <div className='text-sm text-gray-700 leading-6'>
                                            <p>{dateString}</p>
                                            <p>{Item.date.slice(11, 16)}</p>
                                        </div>
                                        <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                            <TimelineIcon className='text-white' />
                                        </div>
                                        <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                            <div className='flex'>
                                                <KeyboardArrowRightIcon className="text-blue-600" />
                                                <p className='text-blue-600 font-semibold'>{Item.message}</p>
                                            </div>
                                            <p className='text-sm ml-6 mt-2'>Added by System on {Item.date.slice(11, 16)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            selectedData === 3 &&
                            leadsData?.notes?.map((Item) => {
                                const itemDate = new Date(Item.date);
                                const today = new Date();
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);

                                let dateString;
                                if (itemDate.toDateString() === today.toDateString()) {
                                    dateString = 'Today';
                                } else if (itemDate.toDateString() === yesterday.toDateString()) {
                                    dateString = 'Yesterday';
                                } else {
                                    dateString = itemDate.toLocaleDateString();
                                }
                                return (
                                    <div key={Item.date} className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                                        <div className='text-sm text-gray-700 leading-6'>
                                            <p>{dateString}</p>
                                            <p>{Item.date.slice(11, 16)}</p>
                                        </div>
                                        <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                            <NotesIcon className='text-white' />
                                        </div>
                                        <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                            <div className='flex'>
                                                <KeyboardArrowRightIcon className="text-blue-600" />
                                                <p className='text-blue-600 font-semibold'>{Item.message}</p>
                                            </div>
                                            <p className='text-sm ml-6 mt-2'>Added by System on {Item.date.slice(11, 16)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            selectedData === 4 && <div>
                                <div onChange={handleSubmit} className="flex items-center p-3 w-[240px] mx-auto bg-blue-400 text-white" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                    <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                                        <FileUploadIcon className="mr-3" />
                                        <input type="file" id="fileInput" style={{ display: "none" }} />
                                        Upload New Document
                                    </label>
                                </div>
                                {
                                    leadsData?.documents?.map((Item) => {
                                        const itemDate = new Date(Item.date);
                                        const today = new Date();
                                        const yesterday = new Date(today);
                                        yesterday.setDate(yesterday.getDate() - 1);

                                        let dateString;
                                        if (itemDate.toDateString() === today.toDateString()) {
                                            dateString = 'Today';
                                        } else if (itemDate.toDateString() === yesterday.toDateString()) {
                                            dateString = 'Yesterday';
                                        } else {
                                            dateString = itemDate.toLocaleDateString();
                                        }
                                        return (
                                            <div key={Item.date} className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                                                <div className='text-sm text-gray-700 leading-6'>
                                                    <p>{dateString}</p>
                                                    <p>{Item.date.slice(11, 16)}</p>
                                                </div>
                                                <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                                    <NotesIcon className='text-white' />
                                                </div>
                                                <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                                    <div className='flex'>
                                                        <KeyboardArrowRightIcon className="text-blue-600" />
                                                        <a style = {{ color: "red", textDecoration: "underline", textDecorationThickness: "1px", cursor: "pointer" }} className = 'text-red-800' href = {`${import.meta.env.VITE_BACKEND_URL}/${Item.message}`} target = '_blank'
>Download</a>
                                                    </div>
                                                    <p className='text-sm ml-6 mt-2'>Added by System on {Item.date.slice(11, 16)}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <NoteDialog fetchData={fetchData} setFetchData={setFetchData} open={addNote} setOpen={setAddNote} selectedLead={leadsData} />
            <ActivityDialog
             fetchData={fetchData} setFetchData={setFetchData} open={addActivity} setOpen={setAddActivity} selectedLead={leadsData} />
        </div>
    )
}

export default LeadsDetail