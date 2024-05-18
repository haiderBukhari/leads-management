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
    const [searchTerm, setSearchTerm] = React.useState("");
    const searchList = [
        "Customer Interested to Invest",
        "Fix Meeting",
        "Site Visit Fixed",
        "Reshedule Meeting",
        "Cancel Meeting",
        "Site Visit Rescheduled",
        "Site Visit Canceled",
        "Inbound Enquiry Received",
        "Referral Provided",
        "Sale Done",
        // "Down Payment Paid",
        // "Event Walkin Fixed",
        // "Event Walkin Confirmed",
        // "Event Walkin Rescheduled",
        // "Event Walkin Canceled",
        // "Walked in for Event",
        // "Project Pitched"
    ];

    const [paymentSelected, setPaymentSelected] = React.useState("");
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const [cancelMeeting, setCancelMeeting] = React.useState('')
    const [meetingFixedDetails, setMeetingFixedDetails] = React.useState({
        date: "",
        time: "",
        location: "",
        productPitched: "",
        meetingQuality: "",
        natureOfBooking: "",
        reason: ""
    });

    const [referalProvided, setReferalProvided] = React.useState({
        name: "",
        mobileNumber: "",
        email: "",
        notes: ""
    })

    React.useEffect(() => {
        setTempSelectedLeads(selectedLead);
    }, [selectedLead]);

    const handleSubmit = async () => { //     // console.log(employee, selectedLeads)
        let meetingDetail = tempSelectedLeads;
        if(searchTerm === "Fix Meeting"){
            meetingDetail.meetingDetails.push(meetingFixedDetails);
            meetingDetail.meetingDate = meetingFixedDetails.date;
            meetingDetail.meetingTime = meetingFixedDetails.time;
            setTempSelectedLeads(meetingDetail);
        } else if(searchTerm === "Reshedule Meeting"){
            meetingDetail.meetingRescheduled.push(meetingFixedDetails);
            setTempSelectedLeads(meetingDetail);
        } else if(searchTerm === "Cancel Meeting"){
            meetingDetail.cancelMeeting.push({reason: cancelMeeting});
            setTempSelectedLeads(meetingDetail);
        } else if(searchTerm === "Site Visit Rescheduled"){
            meetingDetail.siteVisitRescheduled.push(meetingFixedDetails);
            setTempSelectedLeads(meetingDetail);
        } else if(searchTerm === "Site Visit Canceled"){
            meetingDetail.siteVisitCanceled.push({reason: cancelMeeting});
            setTempSelectedLeads(meetingDetail);
        }
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/leads/update/${selectedLead._id}?status=${searchTerm}`, {
                lead: meetingDetail
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            }).then(() => {
                setFetchData(!fetchData)
                setOpen(!open)
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
                        (searchTerm === "Customer Interested to Invest") &&  (
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
                        (searchTerm === "Inbound Enquiry Received") &&  (
                            <>
                                <InputField field='Budget' type='number' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, budget: e.target.value}})}} value1={tempSelectedLeads?.inboundEnquryRecieved?.budget}/>
                                <InputField field='Builder' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, builder: e.target.value}})}} value1={tempSelectedLeads?.inboundEnquryRecieved?.builder}/>
                                <InputField field='Location' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, location: e.target.value}})}} value1={tempSelectedLeads?.inboundEnquryRecieved?.location}/>
                                <InputField field='Bedrooms' type='number' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, bedrooms: e.target.value}})}} value1={tempSelectedLeads?.inboundEnquryRecieved?.bedrooms}/>
                                <InputField field='Purpose of Purchase' type='text' onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, purposeOfPurchase: e.target.value}})}} value1={tempSelectedLeads?.inboundEnquryRecieved?.purposeOfPurchase}/>
                                <SelectField searchList={["Mortgage", "Cash"]} searchTerm={tempSelectedLeads?.inboundEnquryRecieved?.paymentMeans} type="Payment Means" onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, inboundEnquryRecieved: {...tempSelectedLeads.inboundEnquryRecieved, paymentMeans: e.target.value}})}} />
                            </>
                        )
                    }
                    {
                        (searchTerm === "Fix Meeting" || searchTerm === "Reshedule Meeting") &&  (
                            <>
                                <InputField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, date: e.target.value})}} field='Date' type='date' />
                                <InputField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, time: e.target.value})}} field='Time' type='time'/>
                                <InputField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, location: e.target.value})}} field='Location' type='text'/>
                                <InputField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, productPitched: e.target.value})}} field='Product Pitched' type='text'/>
                                <SelectField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, meetingQuality: e.target.value})}} searchList={["Good", "Bad"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Meeting Quality" />
                                <SelectField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, natureOfBooking: e.target.value})}} searchList={["Confirmed", "Tentative"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Nature of Booking" />
                                {
                                    (searchTerm === 'Reshedule Meeting' || searchTerm === 'Site Visit Rescheduled') && <InputField onChange={(e)=>{setMeetingFixedDetails({...meetingFixedDetails, reason: e.target.value})}} field='Reason for Reschedule' type='text'/>
                                }
                            </>
                        )
                    }
                    {
                        (searchTerm === "Site Visit Fixed") &&  (
                            <>
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, date: e.target.value}})}} field='Date' type='date' />
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, time: e.target.value}})}} field='Time' type='time'/>
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, location: e.target.value}})}} field='Location' type='text'/>
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, productPitched: e.target.value}})}} field='Product Pitched' type='text'/>
                                <SelectField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, meetingQuality: e.target.value}})}} searchList={["Good", "Bad"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Meeting Quality" />
                                <SelectField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, siteVisitFixed: {...tempSelectedLeads.siteVisitFixed, natureOfBooking: e.target.value}})}} searchList={["Confirmed", "Tentative"]} searchTerm={paymentSelected} setSearchTerm={setPaymentSelected} type="Nature of Booking" />
                            </>
                        )
                    }
                    {
                        searchTerm === 'Sale Done' && <>
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, project: e.target.value}})}} field='Project' type='text' />
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, location: e.target.value}})}} field='Location' type='text' />
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, builder: e.target.value}})}} field='Builder' type='text' />
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, price: e.target.value}})}} field='Price' type='number' />
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, dateOfClosing: e.target.value}})}} field='Date of Closing' type='date' />
                            <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, saleDone: {...tempSelectedLeads.saleDone, downPayment: e.target.value}})}} field='Downpayment' type='number' />
                        </>
                    }
                    {
                        (searchTerm === "Referral Provided") &&  (
                            <>
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, referalProvided: {...tempSelectedLeads.referalProvided, name: e.target.value}})}} field='Name' type='text' />
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, referalProvided: {...tempSelectedLeads.referalProvided, mobileNumber: e.target.value}})}}  field='Mobile Number' type='number' />
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, referalProvided: {...tempSelectedLeads.referalProvided, email: e.target.value}})}}  field='Email' type='email' />
                                <InputField onChange ={(e)=>{setTempSelectedLeads({...tempSelectedLeads, referalProvided: {...tempSelectedLeads.referalProvided, notes: e.target.value}})}}  field='Notes' type='text' />
                            </>
                        )
                    }
                    {
                        (searchTerm === "Cancel Meeting") &&  (
                            <>
                                <InputField onChange={(e)=>{setCancelMeeting(e.target.value)}} field='Reason for Meeting Cancelation' type='text' />
                            </>
                        )
                    }
                    {
                        (searchTerm === "Site Visit Canceled") &&  (
                            <>
                                <InputField onChange={(e)=>{setCancelMeeting(e.target.value)}} field='Reason for Site Visit Canceled' type='text' />
                            </>
                        )
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