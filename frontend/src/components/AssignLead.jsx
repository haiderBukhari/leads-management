import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios"
import { toast } from 'react-toastify';

export default function AssignLeadsDialog({ fetchData, setFetchData, open, setOpen, selectedLeads }) {
    const [employeeData, setEmployeeData] = React.useState([]);
    const [close, setClose] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");

    const handleClose = () => {
        setOpen(false);
        setClose(true);
        setEmployeeData([]);
        setSearchTerm("");
    };

    const fetchEmployees = async (selectedData) => {
        setClose(false);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/register/employee?type=${selectedData}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            setEmployeeData(response.data);
            // setData(FinalData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredEmployees = employeeData.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const assignEmployee = async (employee) => {
        // console.log(employee, selectedLeads)
        handleClose();
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/leads/assign`, {
                leads: selectedLeads,
                EmployeeID: employee._id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                toast.success('Leads Assigned!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setFetchData(!fetchData)
            })
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                    {"Choose Assignee?"}
                </DialogTitle>
                <DialogContent>
                    {
                        close ? (<>
                            <DialogContentText id="alert-dialog-description">
                                Choose from which of the following you want to assign Leads.
                            </DialogContentText>
                            <div className="container mx-auto p-6">
                                <div className="flex items-center justify-between role cursor-pointer" onClick={() => { fetchEmployees("generalManager") }}>
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold">General Manager</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-between role cursor-pointer mt-5 " onClick={() => { fetchEmployees("manager") }}>
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold">Manager</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-between role cursor-pointer mt-5" onClick={() => { fetchEmployees("employee") }}>
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold">Employee</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </>) : (<>
                            <DialogContentText id="alert-dialog-description">
                                Choose from which of the following Peoples you want to assign Leads.
                            </DialogContentText>

                            <input
                                type="text"
                                placeholder="Search by name"
                                className="border border-gray-300 rounded-lg p-2 mt-4"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="overflow-y-auto max-h-60 mt-4">
                                {filteredEmployees.map(employee => (
                                    <div onClick={() => { assignEmployee(employee) }} key={employee._id} className="border-b border-gray-300 p-2 flex flex-row justify-between cursor-pointer items-center bg-[#f4f4f4] my-2">
                                        <div>
                                            <div>Name: {employee.name}</div>
                                            <div>Email: {employee.email}</div>
                                            <div>User ID: {employee.userId}</div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        </>)
                    }
                </DialogContent>
                <div className="flex items-center justify-center w-full mt-3">
                </div>
            </Dialog>
        </React.Fragment>
    );
}