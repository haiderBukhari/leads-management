import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios"
// import { failedToast, successToast } from '../utils/ToastsNotifications';
import { useSelector } from 'react-redux';
import { Button, DialogActions } from '@mui/material';
import { failedToast, successToast } from '../../utils/ToastsNotifications';

export default function NoteDialog({ fetchData, setFetchData, open, setOpen, selectedLead }) {
    const [message, setMessage] = React.useState("");

    const jwtToken = useSelector((state) => state.authentication.jwtToken);

    const handleSubmit = async () => { //     // console.log(employee, selectedLeads)
        setOpen(false);
        setMessage('');
        if (!message.length) {
            return successToast("Message can't be empty");
        }
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/leads/update/notes?leadId=${selectedLead._id}`, {
                message: message
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
                onClose={()=>setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm" // Setting max width to 500px
                fullWidth // Allowing the dialog to take the full width of its container
            >
                <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                    {"Write a Note"}
                </DialogTitle>
                <div className='m-4' style={{ border: "1px solid #ccc" }}>
                    <textarea
                        onChange={(event) => { setMessage(event.target.value) }}
                        value={message}
                        className='p-2'
                        style={{ width: "100%" }}
                        rows="10"
                        placeholder='Write Here..'>
                    </textarea>
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