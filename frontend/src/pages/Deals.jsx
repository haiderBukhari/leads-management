import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { successToast } from "../utils/ToastsNotifications"

const CreateDeal = () => {
    const [openProperty, setOpenProperty] = useState(false)
    const [clientDetails, setCLientDetails] = useState(false)
    const [paymentDetails, setPayemntDetails] = useState(false)
    const [saleDetails, setSaleDetails] = useState(false)
    const [dealAttributionDetails, setDealAtributionDetails] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const [searchList, setSearchList] = useState([]);
    const [selectedLead, setSelectedLead] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        leadId: null,
        contactNumber: '',
        email: '',
        segment: '',
        dealClosureDate: null,
        channel: '',
        saleType: '',
        propertyDetails: {
            property: '',
            propertyType: '',
            propertyDescription: '',
            developer: '',
            projectName: '',
            size: '',
            towerNo: '',
            floorNo: '',
            unitNo: '',
            bspPSF: 0,
            bspTotal: 0,
            paymentPlan: '',
            DLDAmount: 0,
            DLDStatus: '',
            noOfParking: 0,
            SPAStage: '',
            purposeOfPurchase: ''
        },
        permanentAddress: {
            country: '',
            state: '',
            city: '',
            address: '',
            zipCode: ''
        },
        correspondenceAddress: {
            country: '',
            state: '',
            city: '',
            address: '',
            zipCode: ''
        },
        emirates: '',
        passportNo: '',
        dateOfBirth: null,
        mortgage: '',
        leadSource: '',
        paymentDetails: {
            bookingAmount: 0,
            amountMode: '',
            commissionSlabNotes: '',
            baseCommissionAmount: 0,
            loyaltyDiscount: 0,
            netRevenue: 0,
            specialRemarks: ''
        },
        dealAttribution: {
            employeeName: '',
            employeeId: null,
            sharePercentage: 0
        }
    });

    const createDeals = async () => {
        const formDatas = { ...formData, propertyDetails: { ...formData.propertyDetails, bspTotal: formData.propertyDetails.bspPSF * formData.propertyDetails.size }, paymentDetails: {...formData.paymentDetails, netRevenue: formData.paymentDetails.baseCommissionAmount - formData.paymentDetails.loyaltyDiscount} };
        console.log(formData);

        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/deal`, formDatas, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
        .then(() => {
            successToast('Deal Created!')
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads/search?name=${searchTerm || ""}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                }).then((response) => {
                    const res = response.data;
                    setSearchList(res)
                })
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [searchTerm])

    const filterResult = (search, show) => {
        const filtered = searchList && searchList?.filter(option =>
            option.name.toLowerCase().includes(search.toLowerCase())
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
        setSearchTerm(option.name);
        setSelectedLead(option)
        setShowOptions(false);
        setFilteredOptions([]);
        const filteredResult = {
            ...formData,
            leadId: option._id,
            name: option.name,
            contactNumber: option.phone,
            email: option.email
        }
        setFormData(filteredResult);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNestedInputChange = (parent, key, value) => {
        setFormData({
            ...formData,
            [parent]: {
                ...formData[parent],
                [key]: value
            }
        });
        console.log({
            ...formData,
            [parent]: {
                ...formData[parent],
                [key]: value
            }
        })
    };

    return (
        <div className="pt-16">
            <h1 className="text-2xl font-semibold pl-8 pb-6">Deal Closure Form</h1>
            <div>
                <div className="bg-white w-[95%] mx-auto py-10" style={{ borderTop: "3px solid #F39C12" }}>
                    <div className="pb-10 w-[95%] mx-auto">
                        <h1 className="text-xl font-semibold">Customer Details</h1>
                        <div className="mt-5 flex flex-wrap">
                            <div className="flex flex-col mr-7 relative">
                                <label className="text-sm font-medium mb-1">Lead Name*</label>
                                <input type='text' placeholder="Lead Name" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} value={searchTerm} onChange={handleSearchInputChange} />
                                {showOptions && (
                                    <ul className="options-list absolute bg-white w-[250px] max-h-[200px] overflow-auto px-2" style={{ border: "1px solid #ccc", zIndex: 1000, boxShadow: "2px 2px 6px #ccc -2px -2px 10px #ccc", top: "63px" }}
                                    >
                                        {filteredOptions.map((option) => (
                                            <li
                                                key={option.name}
                                                className="cursor-default hover:opacity-60"
                                                onClick={() => handleOptionClick(option)}
                                            >
                                                {option.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex flex-col mr-7">
                                <label className="text-sm font-medium mb-1">Lead ID*</label>
                                <input type='text' placeholder="Lead ID" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={selectedLead._id} />
                            </div>
                            <div className="flex flex-col mr-7">
                                <label className="text-sm font-medium mb-1">Customer Contact Number</label>
                                <input type='text' placeholder="Contact Number" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={selectedLead.phone} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Customer Email</label>
                                <input type='text' placeholder="Email" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={selectedLead.email} />
                            </div>
                        </div>
                    </div>

                    <div className="w-[97%] mt-3 mx-auto">
                        <div onClick={() => { setSaleDetails(!saleDetails) }} className="bg-[#3C8DBC] py-4 px-5 rounded-sm cursor-pointer">
                            <p className="text-white text-sm">Sale Details</p>
                        </div>
                        {
                            saleDetails && <div className="pb-10 rounded-md mt-[-10px]" style={{ border: "1px solid #3C8DBC" }}>
                                <div className="px-5">
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Segment</label>
                                            <select onChange={(e) => { setFormData({ ...formData, segment: e.target.value }) }} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                                <option value='' key='' disabled selected>Segment</option>
                                                <option value='Primary'>Primary</option>
                                                <option value='Secondary'>Secondary</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Deal Closure Date</label>
                                            <input onChange={handleInputChange} name="dealClosureDate" type='date' placeholder="Booking " className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Channel</label>
                                            <select onChange={(e) => { setFormData({ ...formData, channel: e.target.value }) }} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                                <option value='' key='' disabled selected>Channel</option>
                                                <option value='Direct'>Direct</option>
                                                <option value='Other Brokerage'>Other Brokerage</option>
                                                <option value='Referral'>Referral</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Sale Type</label>
                                            <select onChange={(e) => { setFormData({ ...formData, saleType: e.target.value }) }} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                                <option value='' key='' disabled selected>Sale Type</option>
                                                <option value='Self'>Self</option>
                                                <option value='Assisted By Leader'>Assisted By Leader</option>
                                            </select>                                    </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="w-[97%] mx-auto mt-3">
                        <div onClick={() => { setOpenProperty(!openProperty) }} className="bg-[#3C8DBC] py-4 px-5 rounded-sm cursor-pointer">
                            <p className="text-white text-sm">Property Details</p>
                        </div>
                        {
                            openProperty && <div className="pb-10 rounded-md mt-[-10px]" style={{ border: "1px solid #3C8DBC" }}>
                                <div className="mt-10 px-5 flex flex-wrap">
                                    <div className="flex flex-col flex-1 mr-7">
                                        <label className="text-sm font-medium mb-1">Property</label>
                                        <select onChange={(event) => handleNestedInputChange('propertyDetails', 'property', event.target.value)} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                            <option value='' key='' disabled selected>Property</option>
                                            <option value='Residential'>Residential</option>
                                            <option value='Commercial'>Commercial</option>
                                            <option value='Land'>Land</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Property Type</label>
                                        <select onChange={(event) => handleNestedInputChange('propertyDetails', 'propertyType', event.target.value)} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                            <option value='' key='' disabled selected>Property Type</option>
                                            <option value='Residential'>Apartment</option>
                                            <option value='Commercial'>Townhouse</option>
                                            <option value='Land'>Villa</option>
                                            <option value='Land'>Shop</option>
                                            <option value='Land'>Office</option>
                                            <option value='Land'>Others</option>
                                        </select>
                                    </div>
                                    {/* <textarea cols="30" rows="10"></textarea> */}
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col flex-1  mr-7">
                                        <label className="text-sm font-medium mb-1">Property Description</label>
                                        <textarea onChange={(event) => handleNestedInputChange('propertyDetails', 'propertyDescription', event.target.value)} cols='30' rows='10' placeholder="Property Description" className="w-[full] outline-none text-black text-sm h-[auto] placeholder:text-black py-2 px-3" style={{ border: "1px solid #D2D6DE" }} > </textarea>
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Developer</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'developer', event.target.value)} type='text' placeholder="Developer" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Project Name</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'projectName', event.target.value)} type='text' placeholder="Project Name" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Size</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'size', event.target.value)} type='text' placeholder="Size (sq feet)" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Tower No</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'towerNo', event.target.value)} type='text' placeholder="Tower No" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Floor No</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'floorNo', event.target.value)} type='text' placeholder="Floor No" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Unit Number</label>
                                        <input onChange={(event) => handleNestedInputChange('propertyDetails', 'unitNo', event.target.value)} type='text' placeholder="Unit Number" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">BSP(PSF)</label>
                                        <div className="flex w-full">
                                            <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                            <input onChange={(event) => handleNestedInputChange('propertyDetails', 'bspPSF', event.target.value)} type='number' placeholder="BSP(PSF)" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-row mt-4 px-5">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">BSP(Total)</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input type='number' placeholder="BSP PSF x Sq.ft" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} value={formData.propertyDetails.bspPSF * formData.propertyDetails.size} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Payment Plan</label>
                                            <input onChange={(event) => handleNestedInputChange('propertyDetails', 'paymentPlan', event.target.value)} type='text' placeholder="Payment Plan" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-row mt-4 px-5">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">DLD Amount</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input onChange={(event) => handleNestedInputChange('propertyDetails', 'DLDAmount', event.target.value)} type='number' placeholder="DLD Amount" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 mr-7">
                                            <label className="text-sm font-medium mb-1">DLD Status</label>
                                            <select onChange={(event) => handleNestedInputChange('propertyDetails', 'DLDStatus', event.target.value)} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                                <option value='' key='' disabled selected>DLD Status</option>
                                                <option value='Paid'>Paid</option>
                                                <option value='Not Paid'>Not Paid</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">No of Parkings</label>
                                        <div className="flex w-full">
                                            <input onChange={(event) => handleNestedInputChange('propertyDetails', 'noOfParking', event.target.value)} type='text' placeholder="No of Parkings" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 mr-7">
                                        <label className="text-sm font-medium mb-1">SPA Stage</label>
                                        <select onChange={(event) => handleNestedInputChange('propertyDetails', 'SPAStage', event.target.value)} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                            <option value='' key='' disabled selected>SPA Stage</option>
                                            <option value='Paid'>Signed</option>
                                            <option value='Not Paid'>Not Signed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 mr-7 mt-4 px-5">
                                    <label onChange={(event) => handleNestedInputChange('propertyDetails', 'purposeOfPurchase', event.target.value)} className="text-sm font-medium mb-1">Purpose of Purchase</label>
                                    <select style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                        <option value='' key='' disabled selected>Purpose of Purchase</option>
                                        <option value='Paid'>End Use</option>
                                        <option value='Not Paid'>Investment</option>
                                    </select>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="w-[97%] mt-3 mx-auto">
                        <div onClick={() => { setCLientDetails(!clientDetails) }} className="bg-[#3C8DBC] py-4 px-5 rounded-sm cursor-pointer">
                            <p className="text-white text-sm">Client & Lead Details</p>
                        </div>
                        {
                            clientDetails && <div className="pb-10 rounded-md mt-[-10px]" style={{ border: "1px solid #3C8DBC" }}>
                                <div className="px-5">
                                    <div className="mt-5 flex flex-wrap">
                                        <div className="flex flex-col mr-7">
                                            <label className="text-sm font-medium mb-1">CRM Lead ID</label>
                                            <input type='text' placeholder="CRM Lead ID" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} value={selectedLead._id} />
                                        </div>
                                        <div className="flex flex-col mr-7">
                                            <label className="text-sm font-medium mb-1">Client Mobile Number*</label>
                                            <input type='text' placeholder="Client Mobile Number" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={selectedLead.phone} />
                                        </div>
                                        <div className="flex flex-col mr-7">
                                            <label className="text-sm font-medium mb-1">Primary Applicant</label>
                                            <input type='text' placeholder="Primary Applicant" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium mb-1">Client Email</label>
                                            <input type='text' placeholder="Email" className="w-[250px] outline-none text-black text-sm px-2 h-[40px] bg-[#f4f4f4] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={selectedLead.email} />
                                        </div>
                                    </div>
                                    <div className="mt-4 py-4 px-4" style={{ border: "1px solid #3C8DBC" }}>
                                        <h1 className="text-sm font-semibold">Permanent Address</h1>
                                        <div className="flex flex-row mt-4">
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">Country</label>
                                                <input onChange={(event) => handleNestedInputChange('permanentAddress', 'country', event.target.value)} value={formData.permanentAddress.country} type='text' placeholder="Country" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">State</label>
                                                <input onChange={(event) => handleNestedInputChange('permanentAddress', 'state', event.target.value)} value={formData.permanentAddress.state} type='text' placeholder="State" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-4">
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">City</label>
                                                <input onChange={(event) => handleNestedInputChange('permanentAddress', 'city', event.target.value)} value={formData.permanentAddress.city} type='text' placeholder="City" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">Address</label>
                                                <input onChange={(event) => handleNestedInputChange('permanentAddress', 'address', event.target.value)} value={formData.permanentAddress.address} type='text' placeholder="Address" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1 mt-4">
                                            <label className="text-sm font-medium mb-1">Zip/Pin Code*</label>
                                            <input onChange={(event) => handleNestedInputChange('permanentAddress', 'zipCode', event.target.value)} value={formData.permanentAddress.zipCode} type='text' placeholder="0000" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                    <div className="mt-4 py-4 px-4" style={{ border: "1px solid #3C8DBC" }}>
                                        <div className="flex items-center">
                                            <h1 className="text-sm mr-5 font-semibold">Correspondence Address</h1>
                                            <div className="flex items-center">
                                                <input onClick={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, correspondenceAddress: formData.permanentAddress })
                                                    } else {
                                                        setFormData({ ...formData, correspondenceAddress: { ...formData.correspondenceAddress, country: "", state: "", city: "", address: "", zipCode: "" } })
                                                    }
                                                }} type='checkbox' className="mr-2" />
                                                <label className="text-sm font-light mb-1"> Same as Permanent Address</label>
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-4">
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">Country</label>
                                                <input onChange={(event) => handleNestedInputChange('correspondenceAddress', 'country', event.target.value)} value={formData.correspondenceAddress.country} type='text' placeholder="Country" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">State</label>
                                                <input onChange={(event) => handleNestedInputChange('correspondenceAddress', 'state', event.target.value)} value={formData.correspondenceAddress.state} type='text' placeholder="State" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-4">
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">City</label>
                                                <input onChange={(event) => handleNestedInputChange('correspondenceAddress', 'city', event.target.value)} value={formData.correspondenceAddress.city} type='text' placeholder="City" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                            <div className="flex flex-col mr-7 flex-1">
                                                <label className="text-sm font-medium mb-1">Address</label>
                                                <input onChange={(event) => handleNestedInputChange('correspondenceAddress', 'address', event.target.value)} value={formData.correspondenceAddress.address} type='text' placeholder="Address" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1 mt-4">
                                            <label className="text-sm font-medium mb-1">Zip/Pin Code*</label>
                                            <input onChange={(event) => handleNestedInputChange('correspondenceAddress', 'zipCode', event.target.value)} value={formData.correspondenceAddress.zipCode} type='text' placeholder="0000" className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Emirates ID No</label>
                                        <div className="flex w-full">
                                            <input onChange={handleInputChange} name="emirates" type='text' placeholder="ID No" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Passport No</label>
                                        <div className="flex w-full">
                                            <input onChange={handleInputChange} name="passportNo" type='text' placeholder="Passport No" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row mt-4 px-5">
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Date of Birth</label>
                                        <div className="flex w-full">
                                            <input onChange={handleInputChange} name="dateOfBirth" type='date' placeholder="Date of Birth" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col mr-7 flex-1">
                                        <label className="text-sm font-medium mb-1">Mortgage Required</label>
                                        <select onChange={handleInputChange} name="mortage" style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                            <option value='' key='' disabled selected>Mortgage Required</option>
                                            <option value='Yes'>Yes</option>
                                            <option value='No'>No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col mr-7 flex-1 px-5 mt-3">
                                    <label className="text-sm font-medium mb-1">Lead Source</label>
                                    <select onChange={handleInputChange} name="leadSource" style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                        <option value='' key='' disabled selected>Lead Source</option>
                                        <option value='Self'>Self</option>
                                        <option value='CRM'>CRM</option>
                                        <option value='Channel Partner'>Channel Partner</option>
                                    </select>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="w-[97%] mt-3 mx-auto">
                        <div onClick={() => { setPayemntDetails(!paymentDetails) }} className="bg-[#3C8DBC] py-4 px-5 rounded-sm cursor-pointer">
                            <p className="text-white text-sm">Payment & Commission Details</p>
                        </div>
                        {
                            paymentDetails && <div className="pb-10 rounded-md mt-[-10px]" style={{ border: "1px solid #3C8DBC" }}>
                                <div className="px-5">
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Booking Amount</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input onChange={(event) => handleNestedInputChange('paymentDetails', 'bookingAmount', event.target.value)} type='number' placeholder="Booking Amount" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>                                    </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Booking Amount Mode</label>
                                            <select onChange={(event) => handleNestedInputChange('paymentDetails', 'amountMode', event.target.value)} style={{ border: "1px solid #D2D6DE" }} className="w-[full] outline-none text-black text-sm px-2 h-[40px] placeholder:text-black rounded-sm">
                                                <option value='' key='' disabled selected>Booking Amount Mode</option>
                                                <option value='Residential'>Cheque</option>
                                                <option value='Commercial'>Bank Transfer</option>
                                                <option value='Land'>Card</option>
                                                <option value='Land'>Cash</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col flex-1  mr-7">
                                            <label className="text-sm font-medium mb-1">Commission Slab Notes</label>
                                            <textarea onChange={(event) => handleNestedInputChange('paymentDetails', 'commissonSlabNotes', event.target.value)} cols='30' rows='10' placeholder="Commission Slab Notes" className="w-[full] outline-none text-black text-sm h-[auto] placeholder:text-black py-2 px-3" style={{ border: "1px solid #D2D6DE" }} > </textarea>
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Base Commission Amount</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input onChange={(event) => handleNestedInputChange('paymentDetails', 'baseCommissionAmount', event.target.value)} value={formData.paymentDetails.baseCommissionAmount} type='number' placeholder="Amount" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>                                      </div>
                                    </div>
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col flex-1  mr-7">
                                            <label className="text-sm font-medium mb-1">Client Loyalty Discount</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input onChange={(event) => handleNestedInputChange('paymentDetails', 'loyaltyDiscount', event.target.value)} value={formData.paymentDetails.loyaltyDiscount} type='number' placeholder="Discount Amount" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                            </div>                                                                          </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Net Revenue</label>
                                            <div className="flex w-full">
                                                <div className="h-[40px] w-[50px] bg-[#00A65A] text-white flex justify-center items-center">AED</div>
                                                <input type='number' placeholder="Net Revenue" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} disabled value={formData.paymentDetails.baseCommissionAmount - formData.paymentDetails.loyaltyDiscount} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1  mr-7 mt-5">
                                        <label className="text-sm font-medium mb-1">Special Remarks</label>
                                        <input onChange={(event) => handleNestedInputChange('paymentDetails', 'specialRemarks', event.target.value)} type='text' placeholder="Remarks" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="w-[97%] mt-3 mx-auto">
                        <div onClick={() => { setDealAtributionDetails(!dealAttributionDetails) }} className="bg-[#3C8DBC] py-4 px-5 rounded-sm cursor-pointer">
                            <p className="text-white text-sm">Deal Attribution</p>
                        </div>
                        {
                            dealAttributionDetails && <div className="pb-10 rounded-md mt-[-10px]" style={{ border: "1px solid #3C8DBC" }}>
                                <div className="px-5">
                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Name of Employee</label>
                                            <input onChange={(event) => handleNestedInputChange('dealAttribution', 'employeeName', event.target.value)} type='text' placeholder="Employee" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                        <div className="flex flex-col mr-7 flex-1">
                                            <label className="text-sm font-medium mb-1">Share %</label>
                                            <input onChange={(event) => handleNestedInputChange('dealAttribution', 'sharePercentage', event.target.value)} type='text' placeholder="Share" className="w-full outline-none text-black text-sm px-2 h-[40px] placeholder:text-black" style={{ border: "1px solid #D2D6DE" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="flex justify-end px-5">
                        <button onClick={createDeals} className="bg-[#F39C12] py-2 px-7 rounded-sm mt-5 text-white"> Create Deal</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateDeal