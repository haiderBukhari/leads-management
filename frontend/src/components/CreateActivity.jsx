import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios"
// import { failedToast, successToast } from '../utils/ToastsNotifications';
import { useSelector } from 'react-redux';
import { Button, DialogActions } from '@mui/material';
import { failedToast, successToast } from '../utils/ToastsNotifications';
import { InputField, SelectField } from './Fields';

export default function ActivityDialog({ fetchData, setFetchData, open, setOpen, selectedLead }) {
    const [tempSelectedLeads, setTempSelectedLeads] = React.useState(selectedLead)
    const [searchTerm, setSearchTerm] = React.useState("Customer Interested to Invest");
    const searchList = [
        "Customer Interested to Invest",
        "Lead Quality",
        "Fix Meeting",
        "Reshedule Meeting",
        "Cancel Meeting",
        "Site Visit Rescheduled",
        "Site Visit Canceled",
        "Inbound Enquiry Received",
        "Referral Provided",
        "Sale Done",
        "Down Payment Paid",
        "Event Walkin Fixed",
        "Event Walkin Confirmed",
        "Event Walkin Rescheduled",
        "Event Walkin Canceled",
        "Walked in for Event",
        "Project Pitched"
    ];

    const [paymentSelected, setPaymentSelected] = React.useState("");
    const jwtToken = useSelector((state) => state.authentication.jwtToken);

    React.useEffect(() => {
        setTempSelectedLeads(selectedLead);
    }, [selectedLead]);
    const handleSubmit = async () => { //     // console.log(employee, selectedLeads)
        // setOpen(false);
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/leads/update/${selectedLead._id}?status=${searchTerm}`, {
                lead: tempSelectedLeads
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            }).then(() => {
                setFetchData(!fetchData)
            })
        } catch (error) {
            failedToast(error?.response?.data?.message)
        }
    }
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md" // Setting max width to 500px
                fullWidth // Allowing the dialog to take the full width of its container
            >
                <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                    {"Add Notable Activity"}
                </DialogTitle>
                <div className='m-4 grid grid-cols-2'>
                    <SelectField searchList={searchList} searchTerm={searchTerm} type="Activity Type" onChange={(e)=>{setSearchTerm(e.target.value)}} />
                    {
                        searchTerm === "Customer Interested to Invest" &&  (
                            <>
                                <InputField field='Budget' type='number' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, budget: e.target.value}})}} value1={tempSelectedLeads?.invest?.budget}/>
                                <InputField field='Builder' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, builder: e.target.value}})}} value1={tempSelectedLeads?.invest?.builder}/>
                                <InputField field='Location' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, location: e.target.value}})}} value1={tempSelectedLeads?.invest?.location}/>
                                <InputField field='Bedrooms' type='number' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, bedrooms: e.target.value}})}} value1={tempSelectedLeads?.invest?.bedrooms}/>
                                <InputField field='Purpose of Purchase' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, purposeOfPurchase: e.target.value}})}} value1={tempSelectedLeads?.invest?.purposeOfPurchase}/>
                                <SelectField searchList={["Mortgage", "Cash"]} searchTerm={tempSelectedLeads?.invest?.paymentMeans} type="Payment Means" onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, invest: {...tempSelectedLeads.invest, paymentMeans: e.target.value}})}} />
                            </>
                        )
                    }
                    {
                        searchTerm === "First Meeting Fixed" || searchTerm === "Second Meeting Fixed" || searchTerm === "Further Meeting Fixed" || searchTerm === "Site Visit Fixed" &&  (
                            <>
                                <InputField field='Date' type='date' />
                                <InputField field='Time' type='time'/>
                                <InputField field='Product Pitched' type='text'/>
                                <SelectField searchList={["Good", "Bad"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Meeting Quality" />
                                <SelectField searchList={["Confirmed", "Tentative"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Nature of Booking" />
                            </>
                        )
                    }
                    {

                    }
                </div>
                <DialogActions>
                    <Button onClick={() => { setOpen(false) }}>Close</Button>
                    <Button onClick={handleSubmit} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}