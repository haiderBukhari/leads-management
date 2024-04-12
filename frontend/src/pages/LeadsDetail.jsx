import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
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

const LeadsDetail = () => {
    const [showProperties, setShowProperties] = useState(true);
    const data = [
        { "Owner": "Ashy Antony" },
        { "Lead Source": "xxxxx" },
        { "Lead Age": "140 Days" },
        { "demoSlotStartTime": "02/01/2024 08:30:00 PM" },
        { "Admission Offer Type": "Career Service Option" },
        { "Sales Booking Date": "" },
        { "Min CTC Guarantee": "" },
        { "Collections Owner": "" },
        { "Latest Admission Status": "" },
        { "Latest Payment Status": "" },
        { "Onboarding Specialist": "" },
        { "Onboarding Stage": "" },
        { "Latest Program Pitched": "" },
        { "FSD": "" },
        { "Program Interested": "Software Development" },
        { "Personalized Plan Eligibility": "" },
        { "Profile Verification Current Company": "" },
        { "Profile Verification Current CTC": "" },
        { "Profile Verification Current Role": "" },
        { "Profile Verification Working Status": "" },
    ];

    return (
        <div className="mt-10 mx-10 mb-10">
            <div>
                <h1 className="text-2xl mb-3">Leads Details</h1>
            </div>
            <hr />
            <div className='flex flex-row'>
                <div className='w-[40%]'>
                    <div className='mt-4 w-full'>
                        <div className="max-w-[370px] w-full text-white px-2 py-4 bg-[#002C47]">
                            <h1 className='ml-8 mt-2 text-xl'>Mudassir Ali</h1>
                            <h2 className='ml-8 mb-2 italic'>Cold</h2>
                            <div className='flex mt-4'>
                                <EmailIcon />
                                <p className='ml-2 text-sm'>apshaiderbukhari786@gmail.com</p>
                            </div>
                            <div className='flex mt-3'>
                                <PhoneIcon />
                                <p className='ml-2 text-sm'>+92 31-5109663</p>
                            </div>
                            <div className='flex mt-3'>
                                <LocationOnIcon />
                                <p className='ml-2 text-sm'>Islamabad, Pakistan</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='mt-10 max-w-[370px] w-full bg-white' style={{ border: "1px solid #ccc" }}>
                            <div className='flex'>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none" }}>
                                    <p className='text-center mt-3 text-lg'>320</p>
                                    <p className='text-center text-[#000] text-sm'>Lead Score</p>
                                </div>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none" }}>
                                    <p className='text-center mt-3 text-lg text-red-500'>25</p>
                                    <p className='text-center text-[#000] text-sm'>Engaged</p>
                                </div>
                                <div className='flex-1 h-[70px] text-gray-700' style={{ border: "1px solid #ccc", borderLeft: "none", borderRight: "none" }}>
                                    <p className='text-center mt-3 text-lg'>3/10</p>
                                    <p className='text-center text-[#000] text-sm'>Lead Quality</p>
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
                                    <EditIcon style={{ fontSize: "17px" }} />
                                </div>
                                {
                                    showProperties &&
                                    <div className='flex flex-col'>
                                        {
                                            data.map((item, index) => (
                                                <div className='flex' key={index}>
                                                    {Object.keys(item).map((key, index) => (
                                                        <div key={index} className='flex my-2 w-full mx-2'>
                                                            <p className='ml-2 w-[70%] text-sm'>{key}:</p>
                                                            <p className='ml-2 w-[50%] text-sm'>{item[key]}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full ml-4'>
                    <div className='w-full bg-[#002C47] flex items-center mt-4 h-[100px]'>
                        <div className='w-full flex items-center mx-6'>
                            <div className="text-white w-[100px] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <LocalActivityOutlinedIcon className="mx-2" />
                                Activity
                            </div>
                            <div className="text-white w-[100px] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <EditNoteOutlinedIcon className="mx-2" />
                                Note
                            </div>
                            <div className="text-white w-[100px] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AssignmentOutlinedIcon className="mx-2" />
                                Task
                            </div>
                            <div className="text-white w-[100px] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AttachEmailOutlinedIcon className="mx-2" />
                                Email
                            </div>
                            <div className="text-white w-[100px] mx-3" style={{ border: "1px solid #ccc", borderRadius: "7px" }}>
                                <AttachEmailOutlinedIcon className="mx-2" />
                                Call
                            </div>
                        </div>
                    </div>
                    <div className='flex h-[auto] justify-between mt-4 px-5 pt-3 cursor-pointer' style={{ border: "1px solid #ccc" }}>
                        <div className='pb-3' style={{ borderBottom: "2px solid #0000ff" }}>Activity History</div>
                        <div className='pb-3'>Leads Details</div>
                        <div className='pb-3'>Task</div>
                        <div className='pb-3'>Payment Activities</div>
                        <div className='pb-3'>User Onboarding</div>
                        <div className='pb-3'>Notes</div>
                        <div className='pb-3'>Documents</div>
                    </div>
                    <div className='bg-gray-200 w-full h-auto px-5 pt-4 mb-10 pb-10'>
                        <h1 className='text-sm text-gray-700'>Today</h1>
                        <div className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                            <div className='text-sm text-gray-700 leading-6'>
                                <p>12 Apr</p>
                                <p>07:56 pm</p>
                            </div>
                            <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                <TimelineIcon className='text-white' />
                            </div>
                            <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                <div className='flex'>
                                    <KeyboardArrowRightIcon className="text-blue-600" />
                                    <p className='text-blue-600 font-semibold'>Call Attempt Activity</p>
                                </div>
                                <p className='text-sm ml-6 mt-2'>Added by Hariharan R Son12/04/2024 07:56 PM</p>
                            </div>
                        </div>
                        {/*  */}

                        <h1 className='text-sm text-gray-700 mt-5'>Yesterday</h1>
                        <div className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                            <div className='text-sm text-gray-700 leading-6'>
                                <p>11 Apr</p>
                                <p>03:56 pm</p>
                            </div>
                            <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                <TimelineIcon className='text-white' />
                            </div>
                            <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                <div className='flex'>
                                    <KeyboardArrowRightIcon className="text-blue-600" />
                                    <p className='text-blue-600 font-semibold'>Call Attempt Activity</p>
                                </div>
                                <p className='text-sm ml-6 mt-2'>Added by Hariharan R Son12/04/2024 07:56 PM</p>
                            </div>
                        </div>
                        <div className='bg-white w-[100%] h-[100px] mt-3 pt-4 pl-7 flex'>
                            <div className='text-sm text-gray-700 leading-6'>
                                <p>11 Apr</p>
                                <p>03:56 pm</p>
                            </div>
                            <div className="bg-blue-600 flex justify-center items-center w-[35px] h-[35px] rounded-full ml-5 relative">
                                <TimelineIcon className='text-white' />
                            </div>
                            <div className='text-sm text-gray-700 leading-6 ml-5  flex flex-col'>
                                <div className='flex'>
                                    <KeyboardArrowRightIcon className="text-blue-600" />
                                    <p className='text-blue-600 font-semibold'>Call Attempt Activity</p>
                                </div>
                                <p className='text-sm ml-6 mt-2'>Added by Hariharan R Son12/04/2024 07:56 PM</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeadsDetail
