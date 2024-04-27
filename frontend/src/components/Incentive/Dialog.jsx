import AddIcon from '@mui/icons-material/Add';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, DialogActions } from '@mui/material';
// import MultiSelect from './SelectBar';

export default function AdvanceSearchDialog({ open, setOpen, show, setShow }) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [secondarySearchTerm, setsecondarySearchTerm] = React.useState("");

    const handleSubmit = async () => {
        setOpen(false);
        setShow(true);
    }

    const searchList = [
        "Property",
        "Property Type",
        "Property Description",
        "Developer",
        "Project Name",
        "Size",
        "Tower No",
        "Floor No",
        "Unit Number",
        "BSP(PSF)",
        "DLD Amount",
        "DLD Status",
        "SPA Stage",
        "No of Parkings",
        "Purpose of Purchase",
        "SPA Stage",
        "SPA Stage",
        "SPA Stage",
    ];

    const propertyType = [
        "Apartment",
        "Townhouse",
        "Villa",
        "Shop",
        "Office",
        "Others"
    ]

    const property = [
        "Residential",
        "Commercial",
        "Land"
    ]

    const [addList, setAddList] = React.useState([]);
    const [tempSelected, setTempSelected] = React.useState({ 'type': 'Lead Activity', 'value': '', 'isPresent': 'Is' });
    const [selectedColumn, setSelectedColumn] = React.useState(null);
    const [isAnd, setIsAnd] = React.useState(true);

    React.useEffect(() => {
        console.log(addList)
    }, [addList])
    // Filter options based on search term
    // const filterResult = (search, show) => {
    //     const filtered = searchList.filter(option =>
    //         option.toLowerCase().includes(search.toLowerCase())
    //     );
    //     if (show) {
    //         setShowOptions(search !== '');
    //     }
    //     setFilteredOptions(filtered);
    // }

    // const handleSearchInputChange = (e) => {
    //     const inputValue = e.target.value;
    //     setSearchTerm(inputValue); // Show options only if input value is not empty
    //     filterResult(inputValue, true)
    // };

    // const handleOptionClick = (option) => {
    //     setSearchTerm(option);
    //     setShowOptions(false);
    //     setFilteredOptions([]);
    // }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                    {"Advance Filters"}
                </DialogTitle>
                <div className="mx-4">
                    <div className="my-2 h-[360px] w-full flex" style={{ border: "1px solid #ccc" }}>
                        <div className="w-[40%] h-full bg-slate-100 px-3 py-4" style={{ position: 'relative' }}>
                            <select className="w-[250px] outline-none mt-4 text-black text-sm px-2 h-[40px]"
                                style={{ border: "1px solid #ccc" }} onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value === 'Property Type') {
                                        setSelectedColumn(propertyType);
                                    } else if (e.target.value === 'Property') {
                                        setSelectedColumn(property);
                                    }
                                    const tempSelectedItem = { ...tempSelected };
                                    tempSelectedItem["key"] = e.target.value;
                                    setTempSelected(tempSelectedItem);
                                }}>
                                <option value='' key='' disabled selected={searchTerm === ''}>Select the Filter</option>
                                {
                                    searchList.map((Item) => {
                                        return <option value={Item} key={Item}>{Item}</option>
                                    })
                                }
                            </select>
                            {
                                <select className="w-[250px] outline-none mt-4 text-black text-sm px-2 h-[40px]"
                                    style={{ border: "1px solid #ccc" }} onChange={(e) => {
                                        setsecondarySearchTerm(e.target.value);
                                        const tempSelectedItem = { ...tempSelected };
                                        tempSelectedItem["value"] = e.target.value;
                                        setTempSelected(tempSelectedItem);
                                    }}>
                                    <option value='' key='' disabled selected={secondarySearchTerm === ''}>Select</option>
                                    {
                                        selectedColumn?.map((Item) => {
                                            return <option value={Item} key={Item}>{Item}</option>
                                        })
                                    }
                                </select>
                            }
                            <div className='mt-6'>
                                <button onClick={() => {
                                    const addList1 = [...addList];
                                    addList1.push(tempSelected);
                                    setTempSelected({ 'key': '', 'value': '' });
                                    setsecondarySearchTerm('');
                                    setSearchTerm('');
                                    setAddList(addList1);
                                }} className="w-[80px] px-3 py-1 text-sm font-semibold bg-gray-700 text-white"><AddIcon className="text-white p-1" /> Add</button>
                                <button className="w-[80px] ml-3 px-3 py-1 mt-1 text-sm font-semibold bg-transparent text-gray-800" style={{ border: "1px solid #ccc" }}>Reset</button>
                            </div>
                        </div>
                        <div className="w-[60%] overflow-y-auto h-full p-3">
                            <div className="flex">
                                <p className='text-base'>Search for Leads that match </p>
                                <div>
                                    <input onClick={() => { setIsAnd(false) }} className='ml-4' type='radio' id="any" name="1" checked={!isAnd} />
                                    <label onClick={() => { setIsAnd(false) }} id="any" name="1" className='ml-2'>Any Criteria</label>
                                    <input onClick={() => { setIsAnd(true) }} className='ml-4' type='radio' id="all" name="1" checked={isAnd} />
                                    <label onClick={() => { setIsAnd(true) }} id="all" name="1" className='ml-2' >All Criteria</label>
                                </div>
                            </div>
                            <div className='mt-4'>
                                {
                                    addList.map((Item, index) => (
                                        <div key={index} className='bg-blue-100 my-2 px-2 py-2 max-w-[95%] rounded-md flex w-full'>
                                            {
                                                index !== 0 && <button className='bg-gray-700 text-white px-3 rounded-[40px] mr-3'>{isAnd ? 'and' : 'or'}</button>
                                            }
                                            <div className='flex justify-between w-full'>
                                                <p>{Item.key} is {Item.value}</p>
                                                <DeleteIcon onClick={() => {
                                                    const addList = [...setAddList];
                                                    addList.splice(index, 1);
                                                    setAddList(addList);
                                                }} className="cursor-pointer text-gray-700 " />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {/* Additional content in the right section */}
                        </div>
                    </div>
                </div>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button onClick={handleSubmit} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

// <div>
// <div className="flex">
//     <input
//         type="text"
//         placeholder="Type to Search"
//         value={searchTerm}
//         className="w-[230px] outline-none text-black text-sm px-2 py-2"
//         style={{ border: "1px solid #ccc", borderRight: "none" }}
//         onChange={handleSearchInputChange}
//     />
//     <ArrowDropDownIcon
//         onClick={() => {
//             setShowOptions(!showOptions);
//             filterResult(searchTerm, false);
//         }}
//         style={{ border: "1px solid #ccc", borderLeft: "none", height: "40" }}
//         className="bg-white w-[20px] h-[auto] text-gray-700 cursor-pointer"
//     />
// </div>
// {showOptions && (
//     <ul
//         className="options-list absolute bg-white w-[254px] max-h-[200px] overflow-auto px-2"
//         style={{ border: "1px solid #ccc", zIndex: 1000, boxShadow: "2px 2px 6px #ccc -2px -2px 10px #ccc" }}
//     >
//         {filteredOptions.map((option) => (
//             <li
//                 key={option}
//                 className="cursor-default hover:opacity-60"
//                 onClick={() => handleOptionClick(option)}
//             >
//                 {option}
//             </li>
//         ))}
//     </ul>
// )}
// </div>
