import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, DialogActions } from '@mui/material';

export default function AdvanceSearchDialog({ open, setOpen, searchData, setSearchData, isAnd, setIsAnd }) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [secondarySearchTerm, setsecondarySearchTerm] = React.useState("");

    const handleSubmit = async () => {
        setOpen(false);
    }

    const [selectedItems, setSelectedItems] = React.useState([]);

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
    ];

    const propertyType = [
        "Apartment",
        "Townhouse",
        "Villa",
        "Shop",
        "Office",
        "Others"
    ];

    const property = [
        "Residential",
        "Commercial",
        "Land"
    ];

    const purposeOfPurchase = [
        "End Use",
        "Investment"
    ];

    const dldStatus = [
        "Paid",
        "Not Paid"
    ];

    const spaStage = [
        "Signed",
        "Not Signed"
    ];

    const [addList, setAddList] = React.useState([]);
    const [tempSelected, setTempSelected] = React.useState({ 'type': 'Lead Activity', 'value': '', 'isPresent': 'Is' });
    const [selectedColumn, setSelectedColumn] = React.useState(null);
    const [tempselectedString, setTempSelectedString] = React.useState("");


    const handleChange = (key, value) => {
        setSearchData(prevData => ({
            ...prevData,
            [key]: value
        }));
        console.log({ ...searchData, [key]: value })
    };

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
                                        setTempSelectedString("Property Type");
                                    } else if (e.target.value === 'Property') {
                                        setSelectedColumn(property);
                                        setTempSelectedString("Property");
                                    } else if (e.target.value === 'Purpose of Purchase') {
                                        setSelectedColumn(purposeOfPurchase);
                                        setTempSelectedString("Purpose of Purchase");
                                    } else if (e.target.value === 'DLD Status') {
                                        setSelectedColumn(dldStatus);
                                        setTempSelectedString("DLD Status");
                                    } else if (e.target.value === 'SPA Stage') {
                                        setSelectedColumn(spaStage);
                                        setTempSelectedString("SPA Stage");
                                    } else {
                                        setTempSelectedString(e.target.value);
                                    }
                                    const tempSelectedItem = { ...tempSelected };
                                    tempSelectedItem["key"] = e.target.value;
                                    setTempSelected(tempSelectedItem);
                                }}>
                                <option value='' key='' disabled selected={searchTerm === ''}>Select the Filter</option>
                                {searchList.map((Item) => (
                                    !selectedItems.includes(Item) && (
                                        <option value={Item} key={Item}>{Item}</option>
                                    )
                                ))}

                            </select>
                            {
                                (tempselectedString === 'Property Type' || tempselectedString === 'Property' || tempselectedString === 'Purpose of Purchase' || tempselectedString === 'DLD Status' || tempselectedString === 'SPA Stage') ?
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
                                    </select> : <input type="text" onChange={(e) => {
                                        setsecondarySearchTerm(e.target.value);
                                        const tempSelectedItem = { ...tempSelected };
                                        tempSelectedItem["value"] = e.target.value;
                                        setTempSelected(tempSelectedItem);
                                    }} placeholder={tempselectedString} className="w-[250px] outline-none mt-4 text-black text-sm px-2 h-[40px]" style={{ border: "1px solid #ccc" }} cols='30' rows='10' />
                            }
                            <div className='mt-6'>
                                <button onClick={() => {
                                    if (!tempSelected?.key || !tempSelected?.value) { alert("Please select the filter and its value"); return; }
                                    const addList1 = [...addList];
                                    addList1.push(tempSelected);
                                    handleChange(tempSelected.key, tempSelected.value); // Update searchData
                                    setTempSelected({ 'key': '', 'value': '' });
                                    setsecondarySearchTerm('');
                                    setSearchTerm('');
                                    setAddList(addList1);
                                    setSelectedItems([...selectedItems, tempSelected.key]);
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
                                                    const newList = [...addList];
                                                    newList.splice(index, 1);
                                                    setAddList(newList);
                                                    const selectedItems1 = selectedItems.filter((item) => item !== Item.key); // Use Item.key to filter out the selected item
                                                    setSelectedItems(selectedItems1);
                                                }} className="cursor-pointer text-gray-700 " />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
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
